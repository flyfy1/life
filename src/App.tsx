import React, { useEffect, useState } from 'react';
import { Note, SyncRequest, SortOption } from './types';
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
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{ startDate: string; endDate: string }>({
    startDate: '', // 初始为空，等待笔记加载后更新
    endDate: ''
  });
  const [sortOption, setSortOption] = useState<SortOption>({
    field: 'ctime',
    direction: 'desc'
  });

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
    const sortedNotes = sortNotes(localNotes);
    setNotes(sortedNotes);
    
    if (sortedNotes.length > 0) {
      const dates = sortedNotes.map(note => note.ctime.split('T')[0]);
      setDateRange({
        startDate: dates[dates.length - 1],
        endDate: dates[0]
      });
    } else {
      const today = new Date().toISOString().split('T')[0];
      setDateRange({
        startDate: today,
        endDate: today
      });
    }
  };

  const sortNotes = (notesToSort: Note[]) => {
    return [...notesToSort].sort((a, b) => {
      const timeA = new Date(a[sortOption.field]).getTime();
      const timeB = new Date(b[sortOption.field]).getTime();
      return sortOption.direction === 'desc' ? timeB - timeA : timeA - timeB;
    });
  };

  const handleSortChange = (newSortOption: SortOption) => {
    setSortOption(newSortOption);
    setNotes(sortNotes(notes));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setNotes([]);
  };

  const handleDateRangeChange = (newRange: { startDate: string; endDate: string }) => {
    setDateRange(newRange);
    filterNotesByDateRange(newRange);
  };

  const filterNotesByDateRange = async (range: { startDate: string; endDate: string }) => {
    const allNotes = await DatabaseService.getAllNotes();
    const filteredNotes = allNotes.filter(note => {
      const noteDate = note.ctime.split('T')[0];
      return noteDate >= range.startDate && noteDate <= range.endDate;
    });
    setNotes(sortNotes(filteredNotes));
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    setSyncMessage(null);
    try {
      const syncRequest: SyncRequest = {
        from_timestamp: `${dateRange.startDate}T00:00:00Z`,
        to_timestamp: `${dateRange.endDate}T23:59:59Z`,
        notes: notes
      };
      const response = await ApiService.syncNotes(syncRequest);
      
      // 保存服务器上较新的笔记
      const server_newer = response.server_newer || [];
      const only_on_server = response.only_on_server || [];
      
      // 将两种笔记都保存到 IndexedDB
      for (const note of [...server_newer, ...only_on_server]) {
        await DatabaseService.saveNote(note);
      }
      
      // 重新加载本地笔记
      await loadLocalNotes();
      
      setSyncMessage('同步成功');
    } catch (error) {
      setSyncMessage('同步失败，请稍后重试');
      console.error('同步失败:', error);
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncMessage(null), 3000);
    }
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
        isSyncing={isSyncing}
        syncMessage={syncMessage}
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
        sortOption={sortOption}
        onSortChange={handleSortChange}
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
