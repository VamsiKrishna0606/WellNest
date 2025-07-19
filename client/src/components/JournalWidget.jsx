import { useState, useEffect } from "react";
import { Calendar, Edit3, Save } from "lucide-react";
import { Textarea } from "./ui/textarea";

const JournalWidget = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [journals, setJournals] = useState({});
  const [currentEntry, setCurrentEntry] = useState("");
  const [currentMoodRating, setCurrentMoodRating] = useState(3);
  const [isEditing, setIsEditing] = useState(false);
  const [isRatingMood, setIsRatingMood] = useState(false);

  useEffect(() => {
    const savedJournals = localStorage.getItem("wellnest-journals");
    if (savedJournals) {
      setJournals(JSON.parse(savedJournals));
    }
  }, []);

  useEffect(() => {
    const journalData = journals[selectedDate];
    if (journalData && typeof journalData === "object") {
      setCurrentEntry(journalData.entry || "");
      setCurrentMoodRating(journalData.moodRating || 3);
    } else {
      setCurrentEntry(journalData || "");
      setCurrentMoodRating(3);
    }
    setIsEditing(false);
    setIsRatingMood(false);
  }, [selectedDate, journals]);

  useEffect(() => {
    localStorage.setItem("wellnest-journals", JSON.stringify(journals));
  }, [journals]);

  const saveEntry = () => {
    if (!isRatingMood) {
      setIsRatingMood(true);
    } else {
      setJournals((prev) => ({
        ...prev,
        [selectedDate]: {
          entry: currentEntry,
          moodRating: currentMoodRating,
          timestamp: new Date().toISOString(),
        },
      }));
      setIsEditing(false);
      setIsRatingMood(false);
    }
  };

  return (
    <div className="glass-card hover:shadow-indigo-500/20 transition-smooth slide-in p-4 sm:p-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-white gradient-text-light flex items-center">
          <Edit3 className="w-5 h-5 mr-2 text-indigo-400" />
          Journal Entry
        </h2>

        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-indigo-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-smooth backdrop-blur-sm"
          />
        </div>
      </div>

      <div className="space-y-4 flex-1 flex flex-col min-h-0">
        {!isEditing && currentEntry ? (
          <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-400">Mood Rating:</span>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <div
                    key={rating}
                    className={`w-3 h-3 rounded-full ${
                      rating <= currentMoodRating
                        ? "bg-indigo-400"
                        : "bg-slate-600"
                    }`}
                  />
                ))}
                <span className="ml-2 text-indigo-400 text-sm">
                  {currentMoodRating}/5
                </span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
              <p className="text-slate-200 whitespace-pre-wrap leading-relaxed break-words">
                {currentEntry}
              </p>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="mt-3 flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 transition-colors text-sm self-start flex-shrink-0"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Entry</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3 flex-1 flex flex-col min-h-0">
            {isRatingMood && (
              <div className="space-y-2">
                <label className="text-sm text-slate-300 font-medium">
                  How did today feel for you?
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setCurrentMoodRating(rating)}
                      className={`w-8 h-8 rounded-full transition-smooth ${
                        rating <= currentMoodRating
                          ? "bg-indigo-500 hover:bg-indigo-400"
                          : "bg-slate-600 hover:bg-slate-500"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-slate-300 text-sm">
                    {currentMoodRating}/5
                  </span>
                </div>
              </div>
            )}

            {!isRatingMood && (
              <div className="flex-1 flex flex-col">
                <Textarea
                  value={currentEntry}
                  onChange={(e) => setCurrentEntry(e.target.value)}
                  placeholder="Write your thoughts, reflections, or summary of your day here..."
                  className="flex-1 min-h-[200px] bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:border-indigo-500 focus:ring-indigo-500/30 backdrop-blur-sm resize-none text-base leading-relaxed"
                  style={{ minHeight: "200px" }}
                />
              </div>
            )}

            <div className="flex space-x-3 flex-shrink-0">
              {!isRatingMood ? (
                <button
                  onClick={saveEntry}
                  disabled={!currentEntry.trim()}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-bounce shadow-lg shadow-indigo-500/30 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Write Your Day</span>
                </button>
              ) : (
                <button
                  onClick={saveEntry}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-bounce shadow-lg shadow-green-500/30 text-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Entry</span>
                </button>
              )}

              {(isEditing || isRatingMood) && (
                <button
                  onClick={() => {
                    const journalData = journals[selectedDate];
                    if (journalData && typeof journalData === "object") {
                      setCurrentEntry(journalData.entry || "");
                      setCurrentMoodRating(journalData.moodRating || 3);
                    } else {
                      setCurrentEntry(journalData || "");
                      setCurrentMoodRating(3);
                    }
                    setIsEditing(false);
                    setIsRatingMood(false);
                  }}
                  className="px-4 py-2 bg-white/10 text-slate-300 rounded-lg hover:bg-white/20 transition-smooth backdrop-blur-sm border border-white/20 text-sm"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        )}

        {!currentEntry && !isEditing && (
          <div className="text-center flex-1 flex flex-col justify-center">
            <p className="text-slate-400">No journal entry for this date</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalWidget;
