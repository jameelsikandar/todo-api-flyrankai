import taskRepository from '../repositories/takeRepository.js';

const taskService = {
    listTasks() {
        return taskRepository.getAll();
    },

    getTask(id) {
        return taskRepository.getById(id);
    },

    createTask(title) {
        if (!title || title.trim() === '') {
            const err = new Error(
                'title is required and cannot be empty'
            );

            err.status = 400;
            throw err;
        }

        return taskRepository.create(title);
    },

    updateTask(id, fields) {
        if (
            fields.title !== undefined &&
            fields.title.trim() === ''
        ) {
            const err = new Error('title cannot be empty');

            err.status = 400;
            throw err;
        }

        const updated = taskRepository.update(id, fields);

        if (!updated) {
            const err = new Error(`Task ${id} not found`);

            err.status = 404;
            throw err;
        }

        return updated;
    },

    deleteTask(id) {
        const deleted = taskRepository.remove(id);

        if (!deleted) {
            const err = new Error(`Task ${id} not found`);

            err.status = 404;
            throw err;
        }
    }
};

export default taskService;