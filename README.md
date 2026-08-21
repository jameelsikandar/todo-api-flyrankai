# Task API

A simple CRUD API for managing a to-do list, built with Node.js and Express.

## How to run

1. Clone this repo
2. Run `npm install`
3. Run `npm start`
4. Server runs at [http://localhost:8000](http://localhost:8000)

## Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/tasks` | List all tasks |
| GET | `/tasks/:id` | Get one task |
| POST | `/tasks` | Create a task |
| PUT | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |

## Example request

```bash
curl -i -X POST http://localhost:8000/tasks \
-H "Content-Type: application/json" \
-d '{"title":"Buy milk"}'


## Example response
HTTP/1.1 201 Created
Content-Type: application/json


{
  "id": 4,
  "title": "Buy milk",
  "done": false
}
Swagger UI

Visit http://localhost:8000/docs for interactive API documentation.

![alt text](ui-image.png)