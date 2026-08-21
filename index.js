import express from 'express'


const app = express();
const PORT = 8000;

let tasks = [
    { id: 1, title: "Buy milk", done: false },
    { id: 2, title: "Walk the dog", done: false },
    { id: 3, title: "Finish assignment", done: true }
];

let nextId = 4;


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



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
