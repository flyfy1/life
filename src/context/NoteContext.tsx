import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import { Note, SortOption } from '../types';
import { State, Action } from './types';

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

// Middleware function
const loggerMiddleware = (dispatch: React.Dispatch<Action>) => (action: Action) => {
  console.log('Dispatching action:', action);
  return dispatch(action);
};

export const NoteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(noteReducer, initialState);

  // Wrap dispatch with middleware
  const enhancedDispatch = loggerMiddleware(dispatch);

  return (
    <NoteContext.Provider value={{ state, dispatch: enhancedDispatch }}>
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

const noteReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, isLoggedIn: true };
    case 'LOGOUT':
      return { ...state, isLoggedIn: false, notes: [] };
    case 'SET_USERNAME':
      return { ...state, username: action.payload };
    case 'SET_PASSWORD':
      return { ...state, password: action.payload };

      // general info
    case 'SET_ERROR_MESSAGE':
      return { ...state, errorMessage: action.payload };

    case 'SET_NOTES':
      return { ...state, notes: action.payload };
    case 'SET_SYNCING':
      return { ...state, isSyncing: action.payload };
    case 'SET_SYNC_MESSAGE':
      return { ...state, syncMessage: action.payload };
    case 'SET_DATE_RANGE':
      return { ...state, dateRange: action.payload };
    case 'SET_SORT_OPTION':
      return { ...state, sortOption: action.payload };

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