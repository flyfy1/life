import { Note, SortOption } from '../types';

export interface State {
  notes: Note[];
  username: string;
  password: string;

  // 状态相关
  isLoggedIn: boolean;
  isSyncing: boolean;
  syncMessage: string | null;
  editingNote: Note | null;
  addingNote: boolean;

  // filter related
  dateRange: { startDate: string; endDate: string };
  sortOption: SortOption;

  // 全局的error message
  errorMessage: string | null;

  // TODO: remove
  syncDays: number;

  toasts: Toast[];
}

export type Toast = { id: number; message: string ; color?: "default" | "green" | "yellow" | "red" }

export const ActionTypes = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  SET_USERNAME: 'SET_USERNAME',
  SET_PASSWORD: 'SET_PASSWORD',
  SET_ERROR_MESSAGE: 'SET_ERROR_MESSAGE',
  SET_NOTES: 'SET_NOTES',
  SET_SYNCING: 'SET_SYNCING',
  SET_SYNC_MESSAGE: 'SET_SYNC_MESSAGE',
  SET_DATE_RANGE: 'SET_DATE_RANGE',
  SET_SORT_OPTION: 'SET_SORT_OPTION',
  SET_EDITING_NOTE: 'SET_EDITING_NOTE',
  SET_ADDING_NOTE: 'SET_ADDING_NOTE',
  SET_SYNC_DAYS: 'SET_SYNC_DAYS',
  ADD_TOAST: 'ADD_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
} as const;

export type Action = 
  | { type: typeof ActionTypes.LOGIN }
  | { type: typeof ActionTypes.LOGOUT }
  | { type: typeof ActionTypes.SET_NOTES; payload: Note[] }
  | { type: typeof ActionTypes.SET_USERNAME; payload: string }
  | { type: typeof ActionTypes.SET_PASSWORD; payload: string }
  | { type: typeof ActionTypes.SET_SYNCING; payload: boolean }
  | { type: typeof ActionTypes.SET_SYNC_MESSAGE; payload: string | null }
  | { type: typeof ActionTypes.SET_DATE_RANGE; payload: { startDate: string; endDate: string } }
  | { type: typeof ActionTypes.SET_SORT_OPTION; payload: SortOption }
  | { type: typeof ActionTypes.SET_ERROR_MESSAGE; payload: string | null }
  | { type: typeof ActionTypes.SET_EDITING_NOTE; payload: Note | null }
  | { type: typeof ActionTypes.SET_ADDING_NOTE; payload: boolean }
  | { type: typeof ActionTypes.SET_SYNC_DAYS; payload: number }
  | { type: typeof ActionTypes.ADD_TOAST; payload: Toast }
  | { type: typeof ActionTypes.REMOVE_TOAST; payload: number };