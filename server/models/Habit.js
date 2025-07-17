import mongoose from 'mongoose';

const habitSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    habitName: { type: String, required: true },
    date: { type: Date, required: true },
    status: { type: Boolean, default: false },
});

export default mongoose.model('Habit', habitSchema);
