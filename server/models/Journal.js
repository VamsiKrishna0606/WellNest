import mongoose from "mongoose";

const JournalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
});

const Journal = mongoose.model("Journal", JournalSchema);
export default Journal;
