import Habit from '../models/Habit.js';

export const getAllHabits = async (req, res) => {
  try {
    const habits = await Habit.find();
    res.status(200).json(habits);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch habits', error });
  }
};

export const createHabit = async (req, res) => {
  try {
    const { name, frequency, icon, date } = req.body;  // ✅ include date here
    const newHabit = new Habit({ name, frequency, icon, date });
    await newHabit.save();
    res.status(201).json(newHabit);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create habit', error });
  }
};


export const deleteHabit = async (req, res) => {
  try {
    const { id } = req.params;
    await Habit.findByIdAndDelete(id);
    res.status(200).json({ message: 'Habit deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete habit', error });
  }
};
