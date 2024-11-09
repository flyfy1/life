import React, { useEffect, useState } from 'react';
import { Note } from './types';
import { ApiService } from './services/api';
import { DatabaseService } from './services/db';
import { formatDateTime, formatRelativeTime } from './utils/dateFormat';
import ReactMarkdown from 'react-markdown';
import { Toolbar } from './components/Toolbar';
import './styles/notes.css';
import './styles/toolbar.css';
import './styles/login.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      initializeApp();
    }
  }, []);

  const initializeApp = async () => {
    await DatabaseService.init();
    await loadLocalNotes();
  };

  const loadLocalNotes = async () => {
    const localNotes = await DatabaseService.getAllNotes();
    setNotes(localNotes);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setNotes([]);
  };

  const handleManualSync = async () => {
    await syncNotes();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await ApiService.login({ username, password });
      localStorage.setItem('token', response.token);
      setIsLoggedIn(true);
      await initializeApp();
    } catch (error) {
      console.error('登录失败:', error);
    }
  };

  const syncNotes = async () => {
    const lastSync = await DatabaseService.getLastSync();
    const localNotes = await DatabaseService.getAllNotes();
    
    const syncResponse = await ApiService.syncNotes({
      from_timestamp: lastSync?.timestamp || new Date(0).toISOString(),
      to_timestamp: new Date().toISOString(),
      notes: localNotes,
    });

    // 处理同步响应
    const server_newer = syncResponse.server_newer || [];
    const only_on_server = syncResponse.only_on_server || [];
    for (const note of [...server_newer, ...only_on_server]) {
      await DatabaseService.saveNote(note);
    }

    await DatabaseService.setLastSync(syncResponse.to_timestamp);
    const updatedNotes = await DatabaseService.getAllNotes();
    setNotes(updatedNotes);
  };

  const startPeriodicSync = () => {
    setInterval(syncNotes, 5 * 60 * 1000); // 每5分钟同步一次
  };

  return (
    <div>
      <Toolbar 
        isLoggedIn={isLoggedIn}
        onSync={handleManualSync}
        onLogout={handleLogout}
      />
      
      {!isLoggedIn ? (
        <div className="login-container">
          <div className="login-box">
            <h2>登录到笔记</h2>
            <form className="login-form" onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit">登录</button>
            </form>
          </div>
        </div>
      ) : (
        <div className="notes-container">
          <h1>笔记列表</h1>
          {notes.map(note => (
            <article key={note.uuid} className="note-article">
              <header className="note-header">
                <h1>{formatDateTime(note.ctime)}</h1>
                <div className="note-meta">
                  <span>更新于: {formatRelativeTime(note.mtime)}</span>
                </div>
              </header>
              
              <section className="note-markdown-content">
                <ReactMarkdown>{note.content}</ReactMarkdown>
              </section>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
