import React, { useState } from 'react';
import { Note } from '../types';
import { useNoteContext } from '../context/NoteContext';
import { DatabaseService } from '../services/db';
import { generateUUID } from '../utils/uuid';
import { useTranslation } from 'react-i18next';

const AddNote: React.FC<{ refreshNotes: () => void }> = ({refreshNotes}) => {
    const { state, dispatch } = useNoteContext();
    const { t } = useTranslation();

    // local state
    const [newNoteContent, setNewNoteContent] = useState('');

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
            setNewNoteContent('');
            refreshNotes()
        }
    };

    const cancelAddNote = () => {
        dispatch({ type: 'SET_ADDING_NOTE', payload: false });
    };

    return state.addingNote ? // 在返回的 JSX 中添加输入框和按钮
        <div className="add-note-container">
            <textarea
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                placeholder={t('add_note')}
                className="note-editor"
            />
            <div>
                <button onClick={handleAddNote} className="edit-button">
                    {t('add_note')}
                </button>
                <button onClick={cancelAddNote} className="cancel-button">
                    {t('cancel')}
                </button>
            </div>
        </div>
        : null;
};

export default AddNote; 