import db from '../db/connections.js';

const taskRepository = {
    getAll() {
        return db.prepare('SELECT * FROM tasks').all();
    },

    getById(id) {
        return db
            .prepare('SELECT * FROM tasks WHERE id = ?')
            .get(id) || null;
    },

    create(title) {
        const insert = db.prepare(
            'INSERT INTO tasks (title, done) VALUES (?, ?)'
        );

        const result = insert.run(title, 0);

        return db
            .prepare('SELECT * FROM tasks WHERE id = ?')
            .get(result.lastInsertRowid);
    },

    update(id, fields) {
        const existing = this.getById(id);

        if (!existing) {
            return null;
        }

        const newTitle =
            fields.title !== undefined
                ? fields.title
                : existing.title;

        const newDone =
            fields.done !== undefined
                ? (fields.done ? 1 : 0)
                : existing.done;

        db.prepare(
            'UPDATE tasks SET title = ?, done = ? WHERE id = ?'
        ).run(newTitle, newDone, id);

        return this.getById(id);
    },

    remove(id) {
        const result = db
            .prepare('DELETE FROM tasks WHERE id = ?')
            .run(id);

        return result.changes > 0;
    }
};

export default taskRepository;