import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import { Note, SortOption } from '../types';

interface State {
  isLoggedIn: boolean;
  notes: Note[];
  username: string;
  password: string;
  isSyncing: boolean;
  syncMessage: string | null;
  dateRange: { startDate: string; endDate: string };
  sortOption: SortOption;
  errorMessage: string | null;
  editingNote: Note | null;
  newNoteContent: string;
  addingNote: boolean;
  syncDays: number;
}

type Action =
  | { type: 'LOGIN' }
  | { type: 'LOGOUT' }
  | { type: 'SET_NOTES'; payload: Note[] }
  | { type: 'SET_USERNAME'; payload: string }
  | { type: 'SET_PASSWORD'; payload: string }
  | { type: 'SET_SYNCING'; payload: boolean }
  | { type: 'SET_SYNC_MESSAGE'; payload: string | null }
  | { type: 'SET_DATE_RANGE'; payload: { startDate: string; endDate: string } }
  | { type: 'SET_SORT_OPTION'; payload: SortOption }
  | { type: 'SET_ERROR_MESSAGE'; payload: string | null }
  | { type: 'SET_EDITING_NOTE'; payload: Note | null }
  | { type: 'SET_NEW_NOTE_CONTENT'; payload: string }
  | { type: 'SET_ADDING_NOTE'; payload: boolean }
  | { type: 'SET_SYNC_DAYS'; payload: number };

const initialState: State = {
  isLoggedIn: false,
  notes: [],
  username: '',
  password: '',
  isSyncing: false,
  syncMessage: null,
  dateRange: { startDate: '', endDate: '' },
  sortOption: { field: 'ctime', direction: 'desc' },
  errorMessage: null,
  editingNote: null,
  newNoteContent: '',
  addingNote: false,
  syncDays: 7,
};

const NoteContext = createContext<{ state: State; dispatch: React.Dispatch<Action> } | undefined>(undefined);

const noteReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, isLoggedIn: true };
    case 'LOGOUT':
      return { ...state, isLoggedIn: false, notes: [] };
    case 'SET_NOTES':
      return { ...state, notes: action.payload };
    case 'SET_USERNAME':
      return { ...state, username: action.payload };
    case 'SET_PASSWORD':
      return { ...state, password: action.payload };
    case 'SET_SYNCING':
      return { ...state, isSyncing: action.payload };
    case 'SET_SYNC_MESSAGE':
      return { ...state, syncMessage: action.payload };
    case 'SET_DATE_RANGE':
      return { ...state, dateRange: action.payload };
    case 'SET_SORT_OPTION':
      return { ...state, sortOption: action.payload };
    case 'SET_ERROR_MESSAGE':
      return { ...state, errorMessage: action.payload };
    case 'SET_EDITING_NOTE':
      return { ...state, editingNote: action.payload };
    case 'SET_NEW_NOTE_CONTENT':
      return { ...state, newNoteContent: action.payload };
    case 'SET_ADDING_NOTE':
      return { ...state, addingNote: action.payload };
    case 'SET_SYNC_DAYS':
      return { ...state, syncDays: action.payload };
    default:
      return state;
  }
};

export const NoteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(noteReducer, initialState);

  return (
    <NoteContext.Provider value={{ state, dispatch }}>
      {children}
    </NoteContext.Provider>
  );
};

export const useNoteContext = () => {
  const context = useContext(NoteContext);
  if (context === undefined) {
    throw new Error('useNoteContext must be used within a NoteProvider');
  }
  return context;
}; 