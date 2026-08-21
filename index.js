import express from 'express'

const PORT = 8000;

const app = express();


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
