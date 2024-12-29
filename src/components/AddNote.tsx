import React, { useState, useRef, useEffect } from 'react';
import { Note } from '../types';
import { useNoteContext } from '../context/NoteContext';
import { DatabaseService } from '../services/db';
import { generateUUID } from '../utils/uuid';
import { useTranslation } from 'react-i18next';
import { editorShortcutListener } from '../utils/editor';

const AddNote: React.FC<{ refreshNotes: () => void }> = ({refreshNotes}) => {
    const { state, dispatch } = useNoteContext();
    const { t } = useTranslation();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // local state
    const [newNoteContent, setNewNoteContent] = useState('');

    const saveNote = async () => {
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

    const handleKeyDown =  editorShortcutListener({save: saveNote, cancel: cancelAddNote})


    useEffect(() => {
        if (state.addingNote && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [state.addingNote]);

    return state.addingNote ? // 在返回的 JSX 中添加输入框和按钮
        <div className="add-note-container">
            <textarea
                ref={textareaRef}
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                placeholder={t('action.add_note')}
                className="note-editor"
                onKeyDown={handleKeyDown}
            />
            <div>
                <button onClick={saveNote} className="edit-button">
                    {t('action.save')}
                </button>
                <button onClick={cancelAddNote} className="cancel-button">
                    {t('action.cancel')}
                </button>
            </div>
        </div>
        : null;
};

export default AddNote; 