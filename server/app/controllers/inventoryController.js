import * as Inventory from '../models/inventoryModel.js';

export const getInventory = (req, res) => {
    Inventory.getAllItems((err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

export const addInventoryItem = (req, res) => {
    const item = req.body;

    if (item.quantity === 0) item.status = 'out-of-stock';
    else if (item.quantity <= item.minStock) item.status = 'low-stock';
    else item.status = 'in-stock';

    Inventory.createItem(item, (err, newItem) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json(newItem);
    });
};

export const updateInventoryItem = (req, res) => {
    const id = req.params.id;
    const item = req.body;

    if (item.quantity === 0) item.status = 'out-of-stock';
    else if (item.quantity <= item.minStock) item.status = 'low-stock';
    else item.status = 'in-stock';

    Inventory.updateItem(id, item, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Item updated successfully' });
    });
};

export const deleteInventoryItem = (req, res) => {
    const id = req.params.id;
    Inventory.deleteItem(id, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Item deleted successfully' });
    });
};
