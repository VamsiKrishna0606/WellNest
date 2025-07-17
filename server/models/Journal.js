import mongoose from 'mongoose';

const journalSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    content: { type: String, required: true },
});

export default mongoose.model('Journal', journalSchema);
