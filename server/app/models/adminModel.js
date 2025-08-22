import db from '../config/db.js';

export const getAllItems = (callback) => {
    db.query('SELECT * FROM lost_and_found ORDER BY dateReported DESC', (err, results) => {
        if (err) return callback(err, null);
        callback(null, results);
    });
};