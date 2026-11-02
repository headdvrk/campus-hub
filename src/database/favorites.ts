import * as SQLite from 'expo-sqlite';

export type SavedPost = {
  id: number;
  title: string;
  body: string;
  isRead: 0 | 1;
};

type PostInput = Pick<SavedPost, 'id' | 'title' | 'body'>;

let database: Promise<SQLite.SQLiteDatabase> | null = null;

// Базаны ашып, кестені дайындаймыз.
function getDatabase() {
  if (!database) {
    database = (async () => {
      const db = await SQLite.openDatabaseAsync('campus_favorites.db');

      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS favorites (
          id INTEGER PRIMARY KEY,
          title TEXT NOT NULL,
          body TEXT NOT NULL,
          isRead INTEGER NOT NULL DEFAULT 0
            CHECK (isRead IN (0, 1))
        );
      `);

      return db;
    })().catch(error => {
      database = null;
      throw error;
    });
  }

  return database;
}

// CREATE — жаңалықты сақтау.
export async function savePost(post: PostInput) {
  const db = await getDatabase();

  const result = await db.runAsync(
    `INSERT INTO favorites (id, title, body)
     VALUES (?, ?, ?)
     ON CONFLICT(id) DO NOTHING`,
    post.id,
    post.title,
    post.body
  );

  return result.changes;
}

// READ — сақталған жаңалықтарды оқу.
export async function getSavedPosts(): Promise<SavedPost[]> {
  const db = await getDatabase();

  return db.getAllAsync<SavedPost>(
    `SELECT id, title, body, isRead
     FROM favorites
     ORDER BY isRead ASC, id DESC`
  );
}

// UPDATE — оқылды / оқылмаған күйін ауыстыру.
export async function toggleRead(id: number) {
  const db = await getDatabase();

  await db.runAsync(
    'UPDATE favorites SET isRead = 1 - isRead WHERE id = ?',
    id
  );
}

// DELETE — тек таңдалған офлайн көшірмені жою.
export async function removeSaved(id: number) {
  const db = await getDatabase();

  await db.runAsync(
    'DELETE FROM favorites WHERE id = ?',
    id
  );
}