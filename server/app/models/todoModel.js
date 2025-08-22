import db from '../config/db.js';

export const getAllTodos = (callback) => {
    db.query('SELECT * FROM todos ORDER BY created_at DESC', (err, results) => {
        if (err) return callback(err, null);
        callback(null, results);
    });
};

export const getTodoById = (id, callback) => {
    db.query('SELECT * FROM todos WHERE id = ?', [id], (err, results) => {
        if (err) return callback(err, null);
        if (results.length === 0) return callback(new Error('Todo not found'), null);
        callback(null, results[0]);
    });
};

export const createTodo = (todo, callback) => {
    const { title, description, location, building, room, priority, status, assigned_to, due_date, category } = todo;
    db.query(
        `INSERT INTO todos 
        (title, description, location, building, room, priority, status, assigned_to, due_date, category) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [title, description, `${building} ${room}`, building, room, priority, status || 'ongoing', assigned_to, due_date, category],
        (err, results) => {
            if (err) return callback(err, null);
            callback(null, { id: results.insertId, ...todo });
        }
    );
};

export const updateTodo = (id, todo, callback) => {
    const fields = Object.keys(todo).map(key => `${key} = ?`).join(', ');
    const values = Object.values(todo);
    db.query(`UPDATE todos SET ${fields} WHERE id = ?`, [...values, id], (err, results) => {
        if (err) return callback(err, null);
        if (results.affectedRows === 0) return callback(new Error('Todo not found'), null);
        callback(null, { id, ...todo });
    });
};

export const deleteTodo = (id, callback) => {
    db.query('DELETE FROM todos WHERE id = ?', [id], (err, results) => {
        if (err) return callback(err, null);
        if (results.affectedRows === 0) return callback(new Error('Todo not found'), null);
        callback(null, { message: 'Todo deleted successfully' });
    });
};
