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
import { generateUUID } from './utils/uuid'; // 导入 generateUUID 函数

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const [newNoteContent, setNewNoteContent] = useState('');
  const [addingNote, setAddingNote] = useState(false);

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
      setErrorMessage(null);
    } catch (error) {
      console.error('登录失败:', error);
      setErrorMessage('登录失败，请检查您的用户名和密码。');
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

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
  };

  const handleSaveNote = async (updatedNote: Note) => {
    updatedNote.mtime = new Date().toISOString(); // 更新修改时间
    await DatabaseService.saveNote(updatedNote);
    setEditingNote(null);
    await loadLocalNotes(); // 重新加载笔记
  };

  const handleCancelAdd = async () => {
    setAddingNote(false);
  }
  const handleAddNote = async () => {
    setAddingNote(true);
  };
  const handleConfirmAdd = async () => {
    if (newNoteContent.trim()) {
      const newNote: Note = {
        id: Date.now(), // 或者使用其他唯一标识符
        uuid: generateUUID(), // 使用 generateUUID 生成 UUID
        ctime: new Date().toISOString(),
        mtime: new Date().toISOString(),
        content: newNoteContent,
      };
      await DatabaseService.saveNote(newNote);
      setNewNoteContent(''); // 清空输入框
      setAddingNote(false);
      await loadLocalNotes(); // 重新加载笔记
    }
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
      
      {errorMessage && <div className="toast">{errorMessage}</div>}

      {!isLoggedIn ? (
        <div className="flex flex-col items-center justify-center min-h-screen p-5 bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-center text-gray-800 text-2xl mb-5">登录到笔记</h2>
            <form className="flex flex-col gap-4" onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
              <input
                type="password"
                placeholder="密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="p-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                登录
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="notes-container">
          <div className="flex justify-between items-center">
            <h1>我的笔记</h1>
            <button 
              onClick={handleAddNote} // 点击时清空输入框
              className="edit-button" // 使用 edit-button 类
            >
              添加笔记
            </button>
          </div>

          {addingNote && (
            <div>
              <div>
              <textarea
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                placeholder="输入新笔记内容..."
              />
              </div>
              <button 
                onClick={handleConfirmAdd} 
                className="edit-button"
              >
                保存笔记
              </button>
              <button 
                onClick={handleCancelAdd} 
                className="cancel-button"
              >
                取消
              </button>
            </div>
          )}

          {notes.map(note => (
            <article key={note.uuid} className="note-article">
              <header className="note-header">
                <h1>{formatDateTime(note.ctime)}</h1>
                <div className="note-meta flex justify-between items-center">
                  <span>更新于: {formatRelativeTime(note.mtime)}</span>
                </div>
              </header>
              
              {editingNote?.uuid === note.uuid ? (
                <div>
                  <textarea
                    value={editingNote.content}
                    onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                  />
                  <button 
                    onClick={() => handleSaveNote(editingNote)} 
                    className="edit-button"
                  >
                    保存
                  </button>
                  <button 
                    onClick={handleCancelEdit} 
                    className="edit-button"
                  >
                    取消
                  </button>
                </div>
              ) : (
                <section className="note-markdown-content">
                  <ReactMarkdown>{note.content}</ReactMarkdown>
                  <button 
                    onClick={() => handleEditNote(note)} 
                    className="edit-button"
                  >
                    编辑
                  </button>
                </section>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
