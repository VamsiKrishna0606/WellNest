import mongoose from 'mongoose';

const foodLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    foodName: { type: String, required: true },
    calories: { type: Number, required: true },
    mealType: { type: String, required: true },
    date: { type: Date, required: true },
});

export default mongoose.model('FoodLog', foodLogSchema);
