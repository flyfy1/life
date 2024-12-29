export interface Note {
  id: number;
  uuid: string;
  ctime: string;
  mtime: string;
  content: string;
  deleted_at?: string;
}

export interface ErrorResponse {
  code?: number;  // 通用的状态码
  error?: string; // 通用的错误信息
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse extends ErrorResponse {
  token: string;
}

export interface SyncRequest {
  from_timestamp: string;
  to_timestamp: string;
  notes: Note[];
}

export interface SyncResponse extends ErrorResponse {
  from_timestamp: string;
  to_timestamp: string;
  server_newer: Note[];
  only_on_server: Note[];
}

export type SortField = 'ctime' | 'mtime';
export type SortDirection = 'asc' | 'desc';

export interface SortOption {
  field: SortField;
  direction: SortDirection;
} 