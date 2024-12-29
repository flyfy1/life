import React, { useEffect, useRef, useState } from 'react';
import { Note, SyncRequest } from './types';
import { ApiService } from './services/api';
import { DatabaseService } from './services/db';
import { formatDateTime, formatRelativeTime } from './utils/dateFormat';
import ReactMarkdown from 'react-markdown';
import { Toolbar } from './components/Toolbar';
import './styles/index.css';
import { generateUUID } from './utils/uuid';
import { sortNotes } from './utils/note';
import { useTranslation } from 'react-i18next';
import { useNoteContext } from './context/NoteContext';
import ToastBox from './components/ToastBox';
import AddNote from './components/AddNote';
import Login from './components/Login';

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

  const loadLocalNotes = async () => {
    const localNotes = await DatabaseService.getAllNotes();
    const sortedNotes = sortNotes(state.sortOption, localNotes);
    dispatch({ type: 'SET_NOTES', payload: sortedNotes });

    const today = new Date().toISOString().split('T')[0];
    if (sortedNotes.length > 0) {
      const dates = sortedNotes.map(note => note.ctime.split('T')[0]);
      dispatch({ type: 'SET_DATE_RANGE', payload: {
        startDate: dates[dates.length - 1],
        endDate: today
      }});
    } else {
      dispatch({ type: 'SET_DATE_RANGE', payload: {
        startDate: today,
        endDate: today
      }});
    }
  };

  const handleManualSync = async () => {
    dispatch({ type: 'SET_SYNCING', payload: true });
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
      if (response.error) {
        // TODO: better error-code for token being invalid
        if (response.code === 401) {
          localStorage.removeItem('token');
          dispatch({ type: 'LOGOUT' });
          return;
        }

        dispatch({ type: 'ADD_TOAST', payload: { id: Date.now(), message: response.error, color: "red" } });
      } else {
        const server_newer = response.server_newer || [];
        const only_on_server = response.only_on_server || [];

        for (const note of [...server_newer, ...only_on_server]) {
          await DatabaseService.saveNote(note);
        }

        await loadLocalNotes();
        dispatch({ type: 'ADD_TOAST', payload: { id: Date.now(), message: t('sync.success'), color: "green" } });
      }
    } catch (error) {
      dispatch({ type: 'ADD_TOAST', payload: { id: Date.now(), message: t('sync.failed'), color: "yellow" } });
      console.error('同步失败:', error);
    } finally {
      dispatch({ type: 'SET_SYNCING', payload: false });
    }
  };

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
        onSync={handleManualSync}
      />

      <ToastBox />

      {!state.isLoggedIn ?
        <Login successCallback={async () => {
          await initializeApp();

          // 登录后自动同步最近7天的笔记
          // TODO: 这个同步目前还有点问题：没能把本地的笔记发出去 -- 应该是因为 state还没更新的原因
          await handleManualSync();
        }} /> :
        <div className="notes-container">
          <div className="flex justify-between items-center">
            <h1 className='site-title'>{t('my_notes')}</h1>
          </div>
          <AddNote refreshNotes={loadLocalNotes}/>

          {state.notes.map(note => (
            <article key={note.uuid} className="note-article">
              <header className="note-header">
                <h1>{formatDateTime(note.ctime)}</h1>
                <div className="note-meta flex justify-between items-center">
                  <span>{t("note.updated_at", {time: formatRelativeTime(note.mtime, t)})}</span>
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
                    {t('action.save')}
                  </button>
                  <button 
                    onClick={handleCancelEdit} 
                    className="cancel-button"
                  >
                    {t('action.cancel')}
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
                    {t('action.edit')}
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      }
    </div>
  );
}

export default App;
