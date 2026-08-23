import dotenv from 'dotenv';
import express from 'express';
import initDb from './db/init.js';
import taskService from './services/takeService.js';
import swaggerUi from 'swagger-ui-express';
import openapiSpec from './openapi.json' with { type: 'json' };

dotenv.config();

const app = express();

const PORT = 3000;

app.use(express.json());

app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(openapiSpec)
);

app.get('/', (req, res) => {
    res.json({
        name: 'Task API',
        version: '1.0',
        endpoints: ['/tasks']
    });
});

app.get('/health', (req, res) => {
    res.json({
        status: 'ok'
    });
});

app.get('/tasks', (req, res) => {
    res.json(taskService.listTasks());
});

app.get('/tasks/:id', (req, res) => {
    const task = taskService.getTask(
        Number(req.params.id)
    );

    if (!task) {
        return res.status(404).json({
            error: `Task ${req.params.id} not found`
        });
    }

    res.json(task);
});

app.post('/tasks', (req, res) => {
    try {
        const task = taskService.createTask(req.body.title);

        res.status(201).json(task);
    } catch (err) {
        res.status(err.status || 500).json({
            error: err.message
        });
    }
});

app.put('/tasks/:id', (req, res) => {
    try {
        const task = taskService.updateTask(
            Number(req.params.id),
            req.body
        );

        res.json(task);
    } catch (err) {
        res.status(err.status || 500).json({
            error: err.message
        });
    }
});

app.delete('/tasks/:id', (req, res) => {
    try {
        taskService.deleteTask(
            Number(req.params.id)
        );

        res.status(204).send();
    } catch (err) {
        res.status(err.status || 500).json({
            error: err.message
        });
    }
});

initDb();

app.listen(PORT, () => {
    console.log(
        `Server running on http://localhost:${PORT}`
    );
});