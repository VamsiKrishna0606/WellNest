import Journal from '../models/Journal.js';

export const getAllJournals = async (req, res) => {
  try {
    const journals = await Journal.find();
    res.status(200).json(journals);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch journals', error });
  }
};

export const createJournal = async (req, res) => {
  try {
    const { title, content, date } = req.body;
    const newJournal = new Journal({ title, content, date });
    await newJournal.save();
    res.status(201).json(newJournal);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create journal', error });
  }
};

export const deleteJournal = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Journal.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Journal not found' });
    }
    res.status(200).json({ message: 'Journal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete journal', error });
  }
};
