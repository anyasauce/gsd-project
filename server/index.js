import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import path from 'path';

import authRoutes from './app/routes/authRoutes.js';
import lostFoundRoutes from './app/routes/lostFoundRoutes.js';
import serviceRequestRoutes from './app/routes/serviceRequestRoutes.js';
import inventoryRoutes from './app/routes/inventoryRoutes.js';
import todoRoutes from './app/routes/todoRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// CORS
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'supersecretkey',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true }
}));

app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/lostfound', lostFoundRoutes);
app.use('/api/servicerequest', serviceRequestRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/todos', todoRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
