import db from '../config/db.js';

export const findUserByEmail = (email, callback) => {
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) return callback(err, null);
        callback(null, results[0]);
    });
};