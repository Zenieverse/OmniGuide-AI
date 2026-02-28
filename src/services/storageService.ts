import Database from 'better-sqlite3';
import { SessionContext, AppMode } from '../types';

const db = new Database('omniguide.db');

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    mode TEXT,
    history TEXT,
    last_detected_objects TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export const storageService = {
  saveSession: (session: SessionContext) => {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO sessions (id, mode, history, last_detected_objects, updated_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
    `);
    stmt.run(
      session.id,
      session.mode,
      JSON.stringify(session.history),
      JSON.stringify(session.lastDetectedObjects || [])
    );
  },

  getSession: (id: string): SessionContext | null => {
    const stmt = db.prepare('SELECT * FROM sessions WHERE id = ?');
    const row = stmt.get(id) as any;
    if (!row) return null;
    return {
      id: row.id,
      mode: row.mode as AppMode,
      history: JSON.parse(row.history),
      lastDetectedObjects: JSON.parse(row.last_detected_objects)
    };
  }
};
