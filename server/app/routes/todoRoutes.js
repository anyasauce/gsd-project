import express from 'express';
import { getTodos, addTodo, updateTodo, deleteTodo } from '../controllers/todoController.js';

const router = express.Router();

router.get('/', getTodos);
router.post('/add', addTodo);
router.put('/update/:id', updateTodo);
router.delete('/delete/:id', deleteTodo);

export default router;