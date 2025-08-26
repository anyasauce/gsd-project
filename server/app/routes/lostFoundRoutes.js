import express from 'express';
import { fetchItems, addItem, updateStatus, deleteItem  } from '../controllers/lostFoundController.js';
import upload from "../middleware/upload.js";

const router = express.Router();

router.get('/lost-found-items', fetchItems);
router.post('/add-lost-found-item', upload.single("image"), addItem);
router.put('/update-status/:id', updateStatus);
router.delete('/delete-item/:id', deleteItem);

export default router;
