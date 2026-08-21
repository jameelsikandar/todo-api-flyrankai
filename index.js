import express from 'express'


const app = express();
const PORT = 8000;
app.use(express.json())

let tasks = [
    { id: 1, title: "Buy milk", done: false },
    { id: 2, title: "Walk the dog", done: false },
    { id: 3, title: "Finish assignment", done: true }
];

let nextId = 4;




// get apis

app.get("/", (req, res) => {
    res.json({
        name: "Tasks API",
        version: "1.0.0.0",
        endpoints: ["/tasks"]
    })
})


app.get("/health", (req, res) => {
    res.json({
        status: "ok"
    })
})

app.get("/tasks", (req, res) => {
    res.json(tasks)
})

app.get("/task/:id", (req, res) => {
    const id = Number(req.params.id);

    const task = tasks.find(t => t.id === id);

    if (!task) {
        return res.status(404).json({ "error": `Task ${id} not found` })
    }


    res.json(task)
})



// post apis

app.post('/tasks', (req, res) => {
    const { title } = req.body;

    if (!title || title.trim() === '') {
        return res.status(400).json({
            error: "title is required and cannot be empty"
        });
    }

    const newTask = {
        id: nextId,
        title,
        done: false
    };

    nextId++;
    tasks.push(newTask);

    res.status(201).json(newTask);
});











app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
