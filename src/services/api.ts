import { LoginRequest, LoginResponse, SyncRequest, SyncResponse, Note } from '../types';

// TODO: make it configurable
const API_BASE = 'https://api2.todopeer.com';
// const API_BASE = 'http://localhost:8080';

export class ApiService {
  static async login(request: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    return response.json();
  }

  static async syncNotes(request: SyncRequest): Promise<SyncResponse> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/api/notes/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    });
    return response.json();
  }

  static async getNotes(): Promise<Note[]> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/api/notes`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data.notes;
  }
} 