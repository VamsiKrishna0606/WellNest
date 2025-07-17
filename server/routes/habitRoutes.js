import express from 'express';
import { getAllHabits, createHabit, deleteHabit } from '../controllers/habitController.js';

const router = express.Router();

router.get('/', getAllHabits);
router.post('/', createHabit);
router.delete('/:id', deleteHabit);

export default router;
