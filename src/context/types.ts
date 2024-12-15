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
}


export type Action =
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
  | { type: 'SET_ADDING_NOTE'; payload: boolean }
  | { type: 'SET_SYNC_DAYS'; payload: number };