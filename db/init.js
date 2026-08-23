import db from './connections.js';

function initDb() {
    db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      done INTEGER NOT NULL DEFAULT 0
    )
  `);

    const count = db
        .prepare('SELECT COUNT(*) AS count FROM tasks')
        .get().count;

    if (count === 0) {
        const insert = db.prepare(
            'INSERT INTO tasks (title, done) VALUES (?, ?)'
        );

        insert.run('Buy milk', 0);
        insert.run('Walk the dog', 0);
        insert.run('Finish assignment', 1);
    }
}

export default initDb;