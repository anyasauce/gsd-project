import express from 'express';
import { fetchItems, addItem, updateStatus, deleteItem  } from '../controllers/lostFoundController.js';

const router = express.Router();

router.get('/lost-found-items', fetchItems);
router.post('/add-lost-found-item', addItem);
router.put('/update-status/:id', updateStatus);
router.delete('/delete-item/:id', deleteItem);

export default router;
