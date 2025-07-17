import express from 'express';
import { getAllFoodLogs, createFoodLog, deleteFoodLog } from '../controllers/foodController.js';

const router = express.Router();

router.get('/', getAllFoodLogs);
router.post('/', createFoodLog);
router.delete('/:id', deleteFoodLog);

export default router;
