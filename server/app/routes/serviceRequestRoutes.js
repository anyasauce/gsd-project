import express from 'express';
import { fetchRequests, addRequest, updateRequest, deleteRequest  } from '../controllers/serviceRequestController.js';

const router = express.Router();

router.get('/requests', fetchRequests);
router.post('/requests', addRequest);
router.put('/requests/:id', updateRequest);
router.delete('/requests/:id', deleteRequest);
export default router;