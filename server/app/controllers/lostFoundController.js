import { getAllItems, createItem, updateItemStatus, deleteItem as deleteItemModel } from '../models/lostFoundModel.js';

export const fetchItems = (req, res) => {
    getAllItems((err, items) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ items });
    });
};

export const addItem = (req, res) => {
    const item = req.body;
    if (req.session.user) item.reportedBy = req.session.user.name;

    createItem(item, (err, newItem) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.status(201).json({ item: newItem });
    });
};

export const updateStatus = (req, res) => {
    const id = parseInt(req.params.id);
    const { status } = req.body;

    if (!['lost', 'found', 'returned'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    updateItemStatus(id, status, (err, updatedItem) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(updatedItem);
    });
};

export const deleteItem = (req, res) => {
    const id = parseInt(req.params.id, 10); // use ID from params

    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid item id' });
    }

    deleteItemModel(id, (err, deletedItem) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(deletedItem); // { message: "Item deleted successfully" }
    });
};