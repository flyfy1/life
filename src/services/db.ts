import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Note } from '../types';

interface NotesDB extends DBSchema {
  notes: {
    key: string;
    value: Note;
    indexes: { 'by-updated': string, 'by-created': string };
  };
  sync: {
    key: 'lastSync';
    value: {
      timestamp: string;
    };
  };
}

export class DatabaseService {
  private static dbName = 'notes-db';
  private static db: IDBPDatabase<NotesDB>;

  static async init() {
    this.db = await openDB<NotesDB>(this.dbName, 1, {
      upgrade(db) {
        const notesStore = db.createObjectStore('notes', { keyPath: 'uuid' });
        notesStore.createIndex('by-updated', 'updated_at');
        notesStore.createIndex('by-created', 'created_at');
        db.createObjectStore('sync');
      },
    });
  }

  static async saveNote(note: Note) {
    return this.db.put('notes', note);
  }

  static async getAllNotes(): Promise<Note[]> {
    return this.db.getAll('notes');
  }

  static async getLastSync() {
    return this.db.get('sync', 'lastSync');
  }

  static async setLastSync(timestamp: string) {
    return this.db.put('sync', { timestamp }, 'lastSync');
  }
} 