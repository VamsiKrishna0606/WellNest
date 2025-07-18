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
    const { name, frequency, icon, date } = req.body;
    const existingHabit = await Habit.findOne({ name, date });

    if (existingHabit) {
      return res.status(400).json({ message: 'Habit already exists for this date' });
    }

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

export const updateHabitCompletion = async (req, res) => {
  try {
    const { id } = req.params;
    const habit = await Habit.findById(id);
    if (!habit) return res.status(404).json({ message: "Habit not found" });

    habit.completed = !habit.completed;
    await habit.save();
    res.status(200).json(habit);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update habit', error });
  }
};

