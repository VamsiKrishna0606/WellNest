import Goal from '../models/Goal.js';

export const getAllGoals = async (req, res) => {
  try {
    const goals = await Goal.find();
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch goals', error });
  }
};

export const createGoal = async (req, res) => {
  try {
    const { title, target, progress, date } = req.body;
    const newGoal = new Goal({ title, target, progress, date });
    await newGoal.save();
    res.status(201).json(newGoal);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create goal', error });
  }
};

export const deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Goal.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    res.status(200).json({ message: 'Goal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete goal', error });
  }
};
