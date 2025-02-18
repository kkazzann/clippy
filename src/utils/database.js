import Database from "better-sqlite3";
import { logError, logInfo } from "./logger.js";

const db = new Database("database.db");

db.exec(`
    CREATE TABLE IF NOT EXISTS threads
    (
        id
        INTEGER
        PRIMARY
        KEY
        AUTOINCREMENT,
        thread_id
        TEXT
        UNIQUE,
        game_id
        TEXT
        UNIQUE,
        game_name
        TEXT
        UNIQUE
    );

    CREATE TABLE IF NOT EXISTS clips
    (
        id
        INTEGER
        PRIMARY
        KEY
        AUTOINCREMENT,
        clip_id
        TEXT
        UNIQUE,
        game_id
        TEXT,
        clip_url
        TEXT
        NOT
        NULL,
        view_count
        INTEGER
        DEFAULT
        0,
        duration
        REAL
        DEFAULT
        0,
        created_at
        TEXT
        DEFAULT
        CURRENT_TIMESTAMP,
        FOREIGN
        KEY
    (
        game_id
    ) REFERENCES threads
    (
        game_id
    ) ON DELETE CASCADE
        );
`);

export function saveGameThreadInDb(threadId, gameId, gameName) {
  try {
    const stmt = db.prepare(`
        INSERT INTO threads (thread_id, game_id, game_name)
        VALUES (?, ?, ?) ON CONFLICT(thread_id) DO
        UPDATE SET
            game_name = excluded.game_name
    `);
    stmt.run(threadId, gameId, gameName);
    logInfo(`Saved thread ${threadId} for game ${gameId}`);
  } catch (error) {
    logError(`Error saving thread ${threadId}: ${error.message}`);
  }
}

export function clipExistsInDb(clipId) {
  const stmt = db.prepare("SELECT 1 FROM clips WHERE clip_id = ?");
  const row = stmt.get(clipId);
  return row !== undefined;
}

export function saveClipToDb(
  clipId,
  gameId,
  clipUrl,
  viewCount,
  duration,
  createdAt
) {
  try {
    const stmt = db.prepare(`
        INSERT INTO clips (clip_id, game_id, clip_url, view_count, duration, created_at)
        VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(clip_id) DO
        UPDATE SET
            game_id = excluded.game_id,
            clip_url = excluded.clip_url,
            view_count = excluded.view_count,
            duration = excluded.duration,
            created_at = excluded.created_at
    `);
    stmt.run(clipId, gameId, clipUrl, viewCount, duration, createdAt);
    logInfo(`Saved clip ${clipId} for game ${gameId}`);
  } catch (error) {
    logError(`Error saving clip ${clipId}: ${error.message}`);
  }
}
