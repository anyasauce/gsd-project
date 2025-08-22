import { findUserByEmail } from '../models/userModel.js';
import bcrypt from 'bcrypt';

export const login = (req, res) => {
    const { email, password } = req.body;

    findUserByEmail(email, (err, user) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (!user) return res.status(401).json({ error: 'Invalid email or password' });

        bcrypt.compare(password, user.password, (err, result) => {
            if (err) return res.status(500).json({ error: 'Error checking password' });
            if (!result) return res.status(401).json({ error: 'Invalid email or password' });

            req.session.user = {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            };

            res.json({ 
                message: 'Login successful',
                user: req.session.user
            });
        });
    });
};


// Logout
export const logout = (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ error: 'Logout failed' });
        res.clearCookie('connect.sid');
        res.json({ message: 'Logged out successfully' });
    });
};

// Check session
export const getUser = (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    res.json({ user: req.session.user });
};
