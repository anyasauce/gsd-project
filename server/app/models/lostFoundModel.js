import db from '../config/db.js';

export const getAllItems = (callback) => {
    db.query('SELECT * FROM lost_and_found ORDER BY dateReported DESC', (err, results) => {
        if (err) return callback(err, null);
        callback(null, results);
    });
};

export const createItem = (item, callback) => {
    const { title, description, category, location, status, reportedBy, image } = item;
    db.query(
        'INSERT INTO lost_and_found (title, description, category, location, status, reportedBy, image) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [title, description, category, location, status, reportedBy, image],
        (err, results) => {
            if (err) return callback(err, null);
            callback(null, { id: results.insertId, ...item });
        }
    );
};

export const updateItemStatus = (id, status, callback) => {
    db.query(
        'UPDATE lost_and_found SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [status, id],
        (err, results) => {
            if (err) return callback(err, null);
            if (results.affectedRows === 0) return callback(new Error('Item not found'), null);
            callback(null, { id, status });
        }
    );
};

export const deleteItem = (id, callback) => {
    db.query(
        'DELETE FROM lost_and_found WHERE id = ?',
        [id],
        (error, results) => {
            if (error) return callback(error, null);
            if (results.affectedRows === 0) return callback(new Error('Item not found'), null);
            callback(null, { message: 'Item deleted successfully' });
        }
    )
}

