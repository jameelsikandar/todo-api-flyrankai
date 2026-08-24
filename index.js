import dotenv from 'dotenv';
import express from 'express';
import initDb from './db/init.js';
import taskService from './services/takeService.js';
import swaggerUi from 'swagger-ui-express';
import openapiSpec from './openapi.json' with { type: 'json' };
import supabase from './db/supabaseClient.js';
import { requireAuth } from './middlewares/auth.js';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Swagger Documentation
app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(openapiSpec)
);

// Basic routes
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

// Auth routes
app.post('/auth/signup', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            error: 'email and password are required'
        });
    }

    const { data, error } = await supabase.auth.signUp({
        email,
        password
    });

    if (error) {
        return res.status(400).json({
            error: error.message
        });
    }

    res.status(201).json({
        user: data.user
    });
});

app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            error: 'email and password are required'
        });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        return res.status(401).json({
            error: 'Invalid login credentials'
        });
    }

    res.status(200).json({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token
    });
});

app.post('/auth/logout', requireAuth, async (req, res) => {
    const { error } = await supabase.auth.signOut();

    if (error) {
        return res.status(400).json({
            error: error.message
        });
    }

    res.status(204).send();
});

// Public route
app.get('/public/info', (req, res) => {
    res.status(200).json({
        message: 'Welcome stranger! This info is public.'
    });
});

// Protected routes (Using requireAuth middleware)
app.get('/protected/profile', requireAuth, (req, res) => {
    res.status(200).json({
        id: req.user.id,
        email: req.user.email,
        created_at: req.user.created_at
    });
});

app.get('/protected/dashboard', requireAuth, (req, res) => {
    res.status(200).json({
        message: `Welcome to your dashboard, ${req.user.email}!`
    });
});

// Task routes
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

// initDb();

app.listen(PORT, () => {
    console.log(
        `Server running on http://localhost:${PORT} and connected to supabase`
    );
});