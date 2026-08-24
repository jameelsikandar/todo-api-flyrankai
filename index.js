import dotenv from 'dotenv';
import express from 'express';
import initDb from './db/init.js';
import taskService from './services/takeService.js';
import swaggerUi from 'swagger-ui-express';
import openapiSpec from './openapi.json' with { type: 'json' };
import supabase from './db/supabaseClient.js';

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

// auth routes
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



// stage 2 
// public route
app.get('/public/info', (req, res) => {
    res.status(200).json({
        message: 'Welcome stranger! This info is public.'
    });
});

// protected route (unverified check for presence of token)
app.get('/protected/profile', (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            error: 'Access token required'
        });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            error: 'Access token required'
        });
    }

    // Stage 3 will handle actual verification with Supabase
    res.status(200).json({
        message: 'Token present (unverified)'
    });
});



// initDb();

app.listen(PORT, () => {
    console.log(
        `Server running on http://localhost:${PORT} and connected to supabase`
    );
});