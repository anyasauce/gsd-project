import db from '../config/db.js';

export const getAllRequests = (callback) => {
    db.query('SELECT * FROM service_requests ORDER BY created_at DESC', (err, results) => {
        callback(err, results);
    });
};

export const createRequest = (data, callback) => {
    const sql = `
        INSERT INTO service_requests
        (title, description, category, priority, building, room, location, department, requestedBy, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
        data.title,
        data.description,
        data.category,
        data.priority,
        data.building,
        data.room,
        data.location,
        data.department,
        data.requestedBy,
        data.status || 'ongoing'
    ];
    db.query(sql, params, (err, result) => {
        if (err) return callback(err);
        getAllRequests(callback);
    });
};

// Update request (status only)
export const updateRequestById = (id, status, callback) => {
    const sql = `
        UPDATE service_requests 
        SET status=? 
        WHERE id=?
    `;
    const params = [status, id];

    db.query(sql, params, (err) => {
        if (err) return callback(err);
        getAllRequests(callback); // refresh the list after update
    });
};

// Delete request
export const deleteRequestById = (id, callback) => {
    const sql = "DELETE FROM service_requests WHERE id=?";
    db.query(sql, [id], (err) => {
        if (err) return callback(err);
        getAllRequests(callback);
    });
};