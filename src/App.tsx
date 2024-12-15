import React, { useEffect, useRef, useState } from 'react';
import { Note, SyncRequest, SortOption } from './types';
import { ApiService } from './services/api';
import { DatabaseService } from './services/db';
import { formatDateTime, formatRelativeTime } from './utils/dateFormat';
import ReactMarkdown from 'react-markdown';
import { Toolbar } from './components/Toolbar';
import './styles/homepage.css';
import './styles/notes.css';
import './styles/toolbar.css';
import { generateUUID } from './utils/uuid';
import { sortNotes } from './utils/note';
import { useTranslation } from 'react-i18next';
import i18n from './i18n';
import { useNoteContext } from './context/NoteContext';
import { nodeModuleNameResolver } from 'typescript';

function App() {
  const { t } = useTranslation();
  const { state, dispatch } = useNoteContext();
  const newNoteInputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch({ type: 'LOGIN' });
      initializeApp();
    }
  }, []);

  const initializeApp = async () => {
    await DatabaseService.init();
    await loadLocalNotes();
  };

  const sortDirection = state.sortOption.direction
  const sortField = state.sortOption.field

  const loadLocalNotes = async () => {
    const localNotes = await DatabaseService.getAllNotes();
    const sortedNotes = sortNotes(sortField, sortDirection, localNotes);
    dispatch({ type: 'SET_NOTES', payload: sortedNotes });

    if (sortedNotes.length > 0) {
      const dates = sortedNotes.map(note => note.ctime.split('T')[0]);
      dispatch({ type: 'SET_DATE_RANGE', payload: {
        startDate: dates[dates.length - 1],
        endDate: dates[0]
      }});
    } else {
      const today = new Date().toISOString().split('T')[0];
      dispatch({ type: 'SET_DATE_RANGE', payload: {
        startDate: today,
        endDate: today
      }});
    }
  };

  const handleSortChange = (newSortOption: SortOption) => {
    dispatch({ type: 'SET_SORT_OPTION', payload: newSortOption });
    dispatch({ type: 'SET_NOTES', payload: sortNotes(sortField, sortDirection, state.notes) });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };

  const handleDateRangeChange = (newRange: { startDate: string; endDate: string }) => {
    dispatch({ type: 'SET_DATE_RANGE', payload: newRange });
    filterNotesByDateRange(newRange);
  };

  const filterNotesByDateRange = async (range: { startDate: string; endDate: string }) => {
    const allNotes = await DatabaseService.getAllNotes();
    const filteredNotes = allNotes.filter(note => {
      const noteDate = note.ctime.split('T')[0];
      return noteDate >= range.startDate && noteDate <= range.endDate;
    });
    dispatch({ type: 'SET_NOTES', payload: sortNotes(sortField, sortDirection, filteredNotes) });
  };

  const handleManualSync = async () => {
    dispatch({ type: 'SET_SYNCING', payload: true });
    dispatch({ type: 'SET_SYNC_MESSAGE', payload: null });
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - state.syncDays);

      const syncRequest: SyncRequest = {
        from_timestamp: `${startDate.toISOString().split('T')[0]}T00:00:00Z`,
        to_timestamp: `${endDate.toISOString().split('T')[0]}T23:59:59Z`,
        notes: state.notes
      };
      const response = await ApiService.syncNotes(syncRequest);

      const server_newer = response.server_newer || [];
      const only_on_server = response.only_on_server || [];

      for (const note of [...server_newer, ...only_on_server]) {
        await DatabaseService.saveNote(note);
      }

      await loadLocalNotes();
      dispatch({ type: 'SET_SYNC_MESSAGE', payload: t('sync.success') });
    } catch (error) {
      dispatch({ type: 'SET_SYNC_MESSAGE', payload: t('sync.failed') });
      console.error('同步失败:', error);
    } finally {
      dispatch({ type: 'SET_SYNCING', payload: false });
      // TODO: clear toast的逻辑，应该单独放
      setTimeout(() => dispatch({ type: 'SET_SYNC_MESSAGE', payload: null }), 3000);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await ApiService.login({ username: state.username, password: state.password });
      localStorage.setItem('token', response.token);
      dispatch({ type: 'LOGIN' });
      await initializeApp();
      dispatch({ type: 'SET_ERROR_MESSAGE', payload: null });
    } catch (error) {
      console.error('登录失败:', error);
      dispatch({ type: 'SET_ERROR_MESSAGE', payload: '登录失败，请检查您的用户名和密码。' });
    }
  };

  const cancelAddNote = async () => {
    dispatch({ type: 'SET_ADDING_NOTE', payload: false });
  }

  const handleAddNote = async () => {
    if (newNoteContent.trim()) {
      const newNote: Note = {
        id: Date.now(),
        uuid: generateUUID(),
        ctime: new Date().toISOString(),
        mtime: new Date().toISOString(),
        content: newNoteContent,
      };
      await DatabaseService.saveNote(newNote);
      dispatch({ type: 'SET_ADDING_NOTE', payload: false });
      setNewNoteContent("")

      await loadLocalNotes();
    }
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handleSyncDaysChange = (days: number) => {
    dispatch({ type: 'SET_SYNC_DAYS', payload: days });
  };

  const [newNoteContent, setNewNoteContent] = useState('');

  const editingNote = state.editingNote;
  const setEditingNote = (note: Note|null) => {
    dispatch({type: 'SET_EDITING_NOTE', payload: note})
  };
  const handleCancelEdit = () => {
    setEditingNote(null)
  };
  const handleEditNote = async (note: Note) => {
    setEditingNote(note)
  }
  const handleSaveNote = async (updatedNote: Note) => {
    updatedNote.mtime = new Date().toISOString(); // 更新修改时间
    await DatabaseService.saveNote(updatedNote);
    setEditingNote(null);
    await loadLocalNotes(); // 重新加载笔记
  };

  return (
    <div>
      <Toolbar 
        isLoggedIn={state.isLoggedIn}
        onSync={handleManualSync}
        onLogout={handleLogout}
        isSyncing={state.isSyncing}
        syncMessage={state.syncMessage}
        dateRange={state.dateRange}
        onDateRangeChange={handleDateRangeChange}
        sortOption={state.sortOption}
        onSortChange={handleSortChange}
        changeLang={changeLanguage}
        t={t}
        syncDays={state.syncDays}
        onSyncDaysChange={handleSyncDaysChange}
      />
      
      {state.errorMessage && <div className="toast">{state.errorMessage}</div>}

      {!state.isLoggedIn ? (
        // TODO: 把 Login状态单独拿出来处理
        <div className="flex flex-col items-center justify-center min-h-screen p-5 bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-center text-gray-800 text-2xl mb-5">{t('login')}到笔记</h2>
            <form className="flex flex-col gap-4" onSubmit={handleLogin}>
              <input
                type="text"
                placeholder={t('username')}
                value={state.username}
                onChange={(e) => dispatch({ type: 'SET_USERNAME', payload: e.target.value })}
                required
                className="p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
              <input
                type="password"
                placeholder={t('password')}
                value={state.password}
                onChange={(e) => dispatch({ type: 'SET_PASSWORD', payload: e.target.value })}
                required
                className="p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="p-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                {t('login')}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="notes-container">
          <div className="flex justify-between items-center">
            <h1 className='site-title'>{t('my_notes')}</h1>
          </div>

            {state.addingNote ? // 在返回的 JSX 中添加输入框和按钮
              <div className="add-note-container">
                <textarea
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  placeholder={t('add_note')}
                  className="note-editor"
                />
                <div>
                  <button
                    onClick={handleAddNote}
                    className="edit-button"
                  >
                    {t('add_note')}
                  </button>
                  <button
                    onClick={cancelAddNote}
                    className="cancel-button"
                  >
                    {t('cancel')}
                  </button>
                </div>
              </div> : ""}

          {state.notes.map(note => (
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
                    className='note-editor'
                    value={editingNote.content}
                    onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                  />
                  <button 
                    onClick={() => handleSaveNote(editingNote)} 
                    className="edit-button"
                  >
                    {t('save')}
                  </button>
                  <button 
                    onClick={handleCancelEdit} 
                    className="cancel-button"
                  >
                    {t('cancel')}
                  </button>
                </div>
              ) : (
                <div>
                <section className="note-markdown-content">
                  <ReactMarkdown>{note.content}</ReactMarkdown>
                </section>
                  <button 
                    onClick={() => handleEditNote(note)} 
                    className="edit-button"
                  >
                    {t('edit')}
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
