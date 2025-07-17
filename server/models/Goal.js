import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    goalType: { type: String, required: true },
    goalName: { type: String, required: true },
    target: { type: Number, required: true },
    unit: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    status: { type: String, default: 'active' },
});

export default mongoose.model('Goal', goalSchema);
