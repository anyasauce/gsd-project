import db from '../config/db.js';

export const getAllItems = (callback) => {
    db.query('SELECT * FROM inventory ORDER BY last_updated DESC', callback);
};

export const getItemById = (id, callback) => {
    db.query('SELECT * FROM inventory WHERE id = ?', [id], callback);
};

export const createItem = (item, callback) => {
    const { name, category, quantity, minStock, location, supplier, status } = item;
    const lastUpdated = new Date();
    db.query(
        'INSERT INTO inventory (name, category, quantity, min_stock, location, supplier, last_updated, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [name, category, quantity, minStock, location, supplier, lastUpdated, status],
        (err, results) => {
            if (err) return callback(err);
            callback(null, { id: results.insertId, ...item, lastUpdated });
        }
    );
};

export const updateItem = (id, item, callback) => {
    const { name, category, quantity, minStock, location, supplier, status } = item;
    const lastUpdated = new Date();
    db.query(
        'UPDATE inventory SET name=?, category=?, quantity=?, min_stock=?, location=?, supplier=?, status=?, last_updated=? WHERE id=?',
        [name, category, quantity, minStock, location, supplier, status, lastUpdated, id],
        callback
    );
};

export const deleteItem = (id, callback) => {
    db.query('DELETE FROM inventory WHERE id=?', [id], callback);
};