import express from 'express'
import swaggerUi from 'swagger-ui-express'
import openapiSpec from './openapi.json' with { type: 'json' };
import Database from 'better-sqlite3';

const app = express();
const PORT = 8000;
app.use(express.json())

// stated assignment 2. connecting to databse
const db = new Database('tasks.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    done INTEGER NOT NULL DEFAULT 0
  )
`);


const count = db.prepare('SELECT COUNT(*) AS count FROM tasks').get().count;

if (count === 0) {
    const insert = db.prepare(
        'INSERT INTO tasks (title, done) VALUES (?, ?)'
    );

    insert.run('Buy milk', 0);
    insert.run('Walk the dog', 0);
    insert.run('Finish assignment', 1);
}

// let tasks = [
//     { id: 1, title: "Buy milk", done: false },
//     { id: 2, title: "Walk the dog", done: false },
//     { id: 3, title: "Finish assignment", done: true }
// ];

// let nextId = 4;

// swagger- ui

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));


// get apis

// app.get("/", (req, res) => {
//     res.json({
//         name: "Tasks API",
//         version: "1.0.0.0",
//         endpoints: ["/tasks"]
//     })
// })

app.get('/tasks', (req, res) => {
    const tasks = db.prepare('SELECT * FROM tasks').all();

    res.json(tasks);
});


app.get("/health", (req, res) => {
    res.json({
        status: "ok"
    })
})

app.get("/tasks", (req, res) => {
    res.json(tasks)
})

// app.get("/task/:id", (req, res) => {
//     const id = Number(req.params.id);

//     const task = tasks.find(t => t.id === id);

//     if (!task) {
//         return res.status(404).json({ "error": `Task ${id} not found` })
//     }


//     res.json(task)
// })

app.get('/tasks/:id', (req, res) => {
    const id = Number(req.params.id);

    const task = db
        .prepare('SELECT * FROM tasks WHERE id = ?')
        .get(id);

    if (!task) {
        return res.status(404).json({
            error: `Task ${id} not found`
        });
    }

    res.json(task);
});



// post apis

// app.post('/tasks', (req, res) => {
//     const { title } = req.body;

//     if (!title || title.trim() === '') {
//         return res.status(400).json({
//             error: "title is required and cannot be empty"
//         });
//     }

//     const newTask = {
//         id: nextId,
//         title,
//         done: false
//     };

//     nextId++;
//     tasks.push(newTask);

//     res.status(201).json(newTask);
// });

app.post('/tasks', (req, res) => {
    const { title } = req.body;

    if (!title || title.trim() === '') {
        return res.status(400).json({
            error: "title is required and cannot be empty"
        });
    }

    const insert = db.prepare(
        'INSERT INTO tasks (title, done) VALUES (?, ?)'
    );

    const result = insert.run(title, 0);

    const newTask = db
        .prepare('SELECT * FROM tasks WHERE id = ?')
        .get(result.lastInsertRowid);

    res.status(201).json(newTask);
});




// put api

// app.put('/tasks/:id', (req, res) => {
//     const id = Number(req.params.id);
//     const task = tasks.find(t => t.id === id);

//     if (!task) {
//         return res.status(404).json({
//             error: `Task ${id} not found`
//         });
//     }

//     const { title, done } = req.body;

//     if (title !== undefined && title.trim() === '') {
//         return res.status(400).json({
//             error: "title cannot be empty"
//         });
//     }

//     if (title !== undefined) task.title = title;
//     if (done !== undefined) task.done = done;

//     res.json(task);
// });

app.put('/tasks/:id', (req, res) => {
    const id = Number(req.params.id);

    const existing = db
        .prepare('SELECT * FROM tasks WHERE id = ?')
        .get(id);

    if (!existing) {
        return res.status(404).json({
            error: `Task ${id} not found`
        });
    }

    const { title, done } = req.body;

    if (title !== undefined && title.trim() === '') {
        return res.status(400).json({
            error: "title cannot be empty"
        });
    }

    const newTitle = title !== undefined ? title : existing.title;
    const newDone = done !== undefined ? (done ? 1 : 0) : existing.done;

    db.prepare(
        'UPDATE tasks SET title = ?, done = ? WHERE id = ?'
    ).run(newTitle, newDone, id);

    const updated = db
        .prepare('SELECT * FROM tasks WHERE id = ?')
        .get(id);

    res.json(updated);
});


// delete api

// app.delete('/tasks/:id', (req, res) => {
//     const id = Number(req.params.id);
//     const index = tasks.findIndex(t => t.id === id);

//     if (index === -1) {
//         return res.status(404).json({
//             error: `Task ${id} not found`
//         });
//     }

//     tasks.splice(index, 1);

//     res.status(204).send();
// });

app.delete('/tasks/:id', (req, res) => {
    const id = Number(req.params.id);

    const result = db
        .prepare('DELETE FROM tasks WHERE id = ?')
        .run(id);

    if (result.changes === 0) {
        return res.status(404).json({
            error: `Task ${id} not found`
        });
    }

    res.status(204).send();
});





app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
