import express from 'express';
import { login, logout, getUser } from '../controllers/adminController.js';

const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/get-user', getUser);

export default router;
