import express from 'express';
import { getAllGoals, createGoal, deleteGoal } from '../controllers/goalController.js';

const router = express.Router();

router.get('/', getAllGoals);
router.post('/', createGoal);
router.delete('/:id', deleteGoal);

export default router;
