import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import { Note, SortOption } from '../types';
import { State, Action, ActionTypes } from './types';

const initialState: State = {
  isLoggedIn: false,
  notes: [],
  username: '',
  password: '',
  isSyncing: false,
  syncMessage: null,
  dateRange: { startDate: '', endDate: '' },
  sortOption: { field: 'ctime', direction: 'desc' },
  editingNote: null,
  addingNote: false,
  syncDays: 7,
  toasts: []
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
    case ActionTypes.LOGIN:
      return { ...state, isLoggedIn: true };
    case ActionTypes.LOGOUT:
      return { ...state, isLoggedIn: false, notes: [] };
    case ActionTypes.SET_USERNAME:
      return { ...state, username: action.payload };
    case ActionTypes.SET_PASSWORD:
      return { ...state, password: action.payload };
    case ActionTypes.SET_NOTES:
      return { ...state, notes: action.payload };
    case ActionTypes.SET_SYNCING:
      return { ...state, isSyncing: action.payload };
    case ActionTypes.SET_SYNC_MESSAGE:
      return { ...state, syncMessage: action.payload };
    case ActionTypes.SET_DATE_RANGE:
      return { ...state, dateRange: action.payload };
    case ActionTypes.SET_SORT_OPTION:
      return { ...state, sortOption: action.payload };
    case ActionTypes.SET_EDITING_NOTE:
      return { ...state, editingNote: action.payload };
    case ActionTypes.SET_ADDING_NOTE:
      return { ...state, addingNote: action.payload };
    case ActionTypes.SET_SYNC_DAYS:
      return { ...state, syncDays: action.payload };
    case ActionTypes.ADD_TOAST:
      return { ...state, toasts: [...state.toasts, action.payload] };
    case ActionTypes.REMOVE_TOAST:
      return { ...state, toasts: state.toasts.filter(toast => toast.id !== action.payload) };
    default:
      return state;
  }
};