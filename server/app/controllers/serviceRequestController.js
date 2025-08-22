import { getAllRequests, createRequest, updateRequestById, deleteRequestById } from '../models/serviceRequestModel.js';

export const fetchRequests = (req, res) => {
    getAllRequests((err, requests) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ requests });
    });
};

export const addRequest = (req, res) => {
    const data = req.body;
    if (!data.requestedBy && req.session.user) {
        data.requestedBy = req.session.user.name;
    }

    createRequest(data, (err, updatedRequests) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.status(201).json({ requests: updatedRequests });
    });
};

export const updateRequest = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ error: 'Status is required' });
    }

    updateRequestById(id, status, (err, updatedRequests) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ requests: updatedRequests });
    });
};

export const deleteRequest = (req, res) => {
    const { id } = req.params;

    deleteRequestById(id, (err, updatedRequests) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ requests: updatedRequests });
    });
};