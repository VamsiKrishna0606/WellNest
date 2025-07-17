import express from 'express';
import { getAllJournals, createJournal, deleteJournal } from '../controllers/journalController.js';

const router = express.Router();

router.get('/', getAllJournals);
router.post('/', createJournal);
router.delete('/:id', deleteJournal);

export default router;
