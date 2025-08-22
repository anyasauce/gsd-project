import express from 'express';
import { getInventory, addInventoryItem, updateInventoryItem, deleteInventoryItem } from '../controllers/inventoryController.js';

const router = express.Router();

router.get('/inventory', getInventory);
router.post('/add-inventory', addInventoryItem);
router.put('/update/:id', updateInventoryItem);
router.delete('/delete/:id', deleteInventoryItem);

export default router;
