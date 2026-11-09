import * as SQLite from 'expo-sqlite';

export type SavedPost = {
  id: number;
  title: string;
  body: string;
  isRead: 0 | 1;
  image: string;
  date: string;
  link: string;
  savedAt: number;
};

type PostInput = Pick<SavedPost, 'id' | 'title' | 'body'> & Partial<Pick<SavedPost, 'image' | 'date' | 'link'>>;

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

      // Upgrade existing installations without replacing their saved articles or read states.
      const columns = await db.getAllAsync<{ name: string }>('PRAGMA table_info(favorites)');
      const additions = {
        image: "TEXT NOT NULL DEFAULT ''", date: "TEXT NOT NULL DEFAULT ''",
        link: "TEXT NOT NULL DEFAULT ''", savedAt: 'INTEGER NOT NULL DEFAULT 0',
      };
      for (const [name, definition] of Object.entries(additions)) {
        if (!columns.some(column => column.name === name)) {
          await db.execAsync(`ALTER TABLE favorites ADD COLUMN ${name} ${definition}`);
        }
      }

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
    `INSERT INTO favorites (id, title, body, image, date, link, savedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO NOTHING`,
    post.id,
    post.title,
    post.body, post.image ?? '', post.date ?? '', post.link ?? '', Date.now()
  );

  return result.changes;
}

// READ — сақталған жаңалықтарды оқу.
export async function getSavedPosts(): Promise<SavedPost[]> {
  const db = await getDatabase();

  return db.getAllAsync<SavedPost>(
    `SELECT id, title, body, isRead, image, date, link, savedAt
     FROM favorites
     ORDER BY savedAt DESC, id DESC`
  );
}

export async function getSavedPost(id: number): Promise<SavedPost | null> {
  const db = await getDatabase();
  return db.getFirstAsync<SavedPost>('SELECT * FROM favorites WHERE id = ?', id);
}

export async function markPostRead(id: number) {
  const db = await getDatabase();
  await db.runAsync('UPDATE favorites SET isRead = 1 WHERE id = ?', id);
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
