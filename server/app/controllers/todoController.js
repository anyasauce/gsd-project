import * as TodoModel from '../models/todoModel.js';

export const getTodos = (req, res) => {
    TodoModel.getAllTodos((err, todos) => {
        if (err) return res.status(500).json({ error: 'Failed to fetch todos' });
        res.json(todos);
    });
};

export const addTodo = (req, res) => {
    const todo = req.body;
    TodoModel.createTodo(todo, (err, newTodo) => {
        if (err) return res.status(500).json({ error: 'Failed to create todo' });
        res.status(201).json(newTodo);
    });
};

export const updateTodo = (req, res) => {
    const id = parseInt(req.params.id);
    const updates = req.body;
    TodoModel.updateTodo(id, updates, (err, updatedTodo) => {
        if (err) return res.status(500).json({ error: err.message || 'Failed to update todo' });
        res.json(updatedTodo);
    });
};

export const deleteTodo = (req, res) => {
    const id = parseInt(req.params.id);
    TodoModel.deleteTodo(id, (err, result) => {
        if (err) return res.status(500).json({ error: err.message || 'Failed to delete todo' });
        res.json(result);
    });
};