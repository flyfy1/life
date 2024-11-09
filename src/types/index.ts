export interface Note {
  id: number;
  uuid: string;
  ctime: string;
  mtime: string;
  content: string;
  deleted_at?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface SyncRequest {
  from_timestamp: string;
  to_timestamp: string;
  notes: Note[];
}

export interface SyncResponse {
  from_timestamp: string;
  to_timestamp: string;
  server_newer: Note[];
  only_on_server: Note[];
} 