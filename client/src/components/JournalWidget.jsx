
import { useState, useEffect } from "react";
import { Calendar, Edit3, Save } from "lucide-react";

const JournalWidget = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [journals, setJournals] = useState({});
  const [currentEntry, setCurrentEntry] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Load journals from localStorage on component mount
  useEffect(() => {
    const savedJournals = localStorage.getItem('wellnest-journals');
    if (savedJournals) {
      setJournals(JSON.parse(savedJournals));
    }
  }, []);

  // Load entry for selected date
  useEffect(() => {
    setCurrentEntry(journals[selectedDate] || "");
    setIsEditing(false);
  }, [selectedDate, journals]);

  // Save journals to localStorage whenever journals change
  useEffect(() => {
    localStorage.setItem('wellnest-journals', JSON.stringify(journals));
  }, [journals]);

  const saveEntry = () => {
    setJournals(prev => ({
      ...prev,
      [selectedDate]: currentEntry
    }));
    setIsEditing(false);
  };

  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  return (
    <div className="glass-card hover:shadow-indigo-500/20 transition-smooth slide-in p-4 sm:p-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-white gradient-text-light flex items-center">
          <Edit3 className="w-5 h-5 mr-2 text-indigo-400" />
          {isToday ? "Today's Journal" : "Journal Entry"}
        </h2>
        
        {/* Date Picker */}
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
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
              <p className="text-slate-200 whitespace-pre-wrap leading-relaxed break-words">{currentEntry}</p>
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
            <textarea
              value={currentEntry}
              onChange={(e) => setCurrentEntry(e.target.value)}
              placeholder={`Write your thoughts for ${new Date(selectedDate).toLocaleDateString()}...`}
              className="w-full flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-smooth backdrop-blur-sm resize-none scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent"
            />
            
            <div className="flex space-x-3 flex-shrink-0">
              <button
                onClick={saveEntry}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-bounce shadow-lg shadow-indigo-500/30 text-sm"
              >
                <Save className="w-4 h-4" />
                <span>Save Entry</span>
              </button>
              
              {isEditing && (
                <button
                  onClick={() => {
                    setCurrentEntry(journals[selectedDate] || "");
                    setIsEditing(false);
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
            <p className="text-slate-400 mb-4">No journal entry for this date</p>
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-bounce shadow-lg shadow-indigo-500/30 text-sm mx-auto"
            >
              <Edit3 className="w-4 h-4" />
              <span>Write Your Day</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalWidget;
