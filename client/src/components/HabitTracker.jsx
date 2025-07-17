
import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";

const emojis = ['🧘', '💧', '🏃', '🍎', '📖', '💪', '🚴', '🎯', '⚡', '🌟'];

const HabitTracker = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [habits, setHabits] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHabit, setNewHabit] = useState({ name: "", emoji: "🧘" });

  // Load habits from localStorage on component mount
  useEffect(() => {
    const savedHabits = localStorage.getItem('wellnest-habits');
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }
  }, []);

  // Save habits to localStorage whenever habits change
  useEffect(() => {
    localStorage.setItem('wellnest-habits', JSON.stringify(habits));
  }, [habits]);

  const getHabitsForDate = (date) => {
    return habits[date] || [];
  };

  const toggleHabit = (habitId) => {
    setHabits(prev => ({
      ...prev,
      [selectedDate]: (prev[selectedDate] || []).map(habit =>
        habit.id === habitId ? { ...habit, completed: !habit.completed } : habit
      )
    }));
  };

  const addHabit = () => {
    if (newHabit.name.trim()) {
      const newHabitObj = {
        id: Date.now(),
        name: newHabit.name,
        emoji: newHabit.emoji,
        completed: false,
        createdDate: selectedDate
      };

      setHabits(prev => ({
        ...prev,
        [selectedDate]: [...(prev[selectedDate] || []), newHabitObj]
      }));

      setNewHabit({ name: "", emoji: "🧘" });
      setShowAddForm(false);
    }
  };

  const currentHabits = getHabitsForDate(selectedDate);
  const completedCount = currentHabits.filter(h => h.completed).length;
  const isCurrentDate = selectedDate === new Date().toISOString().split('T')[0];

  return (
    <div className="glass-card hover:shadow-indigo-500/20 transition-smooth slide-in p-4 sm:p-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-white gradient-text-light">Habit Tracker</h2>
        
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

      {/* Progress Summary */}
      {currentHabits.length > 0 && (
        <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-300">Progress</span>
            <span className="text-indigo-400 font-medium">{completedCount}/{currentHabits.length} completed</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2 mt-2">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-blue-500 h-2 rounded-full transition-all duration-500 progress-bar"
              style={{ width: `${currentHabits.length > 0 ? (completedCount / currentHabits.length) * 100 : 0}%` }}
            ></div>
          </div>
        </div>
      )}
      
      <div className="space-y-3 sm:space-y-4 flex-1 overflow-y-auto">
        {currentHabits.map((habit, index) => (
          <div 
            key={habit.id} 
            className="habit-item flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10 shadow-sm backdrop-blur-sm"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <button
              onClick={() => isCurrentDate && toggleHabit(habit.id)}
              disabled={!isCurrentDate}
              className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg border-2 flex items-center justify-center transition-bounce floating-element ${
                habit.completed
                  ? "bg-gradient-to-r from-indigo-500 to-blue-500 border-indigo-400 shadow-lg shadow-indigo-500/40 neon-glow"
                  : !isCurrentDate
                  ? "border-slate-600 bg-white/5 cursor-not-allowed opacity-50"
                  : "border-slate-400 bg-white/10 hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-400/30 backdrop-blur-sm"
              }`}
            >
              {habit.completed && (
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white animate-bounce" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              )}
            </button>
            
            <span className="text-lg sm:text-xl mr-2 sm:mr-3 floating-element" style={{ animationDelay: `${index * 0.2}s` }}>
              {habit.emoji}
            </span>
            
            <span className={`flex-1 font-medium transition-smooth text-sm sm:text-base ${
              habit.completed 
                ? "text-slate-300 line-through opacity-75" 
                : "text-slate-200"
            }`}>
              {habit.name}
            </span>
            
            <div className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium transition-smooth ${
              habit.completed 
                ? "bg-gradient-to-r from-indigo-500/20 to-blue-500/20 text-indigo-300 border border-indigo-400/30" 
                : "bg-white/10 text-slate-400 border border-white/20"
            }`}>
              {habit.completed ? "Done" : "Pending"}
            </div>
          </div>
        ))}
      </div>

      {/* Add New Habit */}
      <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/20">
        {!showAddForm ? (
          <button
            onClick={() => isCurrentDate && setShowAddForm(true)}
            disabled={!isCurrentDate}
            className={`w-full py-3 border-2 border-dashed rounded-xl transition-smooth backdrop-blur-sm ${
              isCurrentDate
                ? "border-slate-600 text-slate-400 hover:border-indigo-500 hover:text-indigo-400 hover:bg-white/5"
                : "border-slate-700 text-slate-600 cursor-not-allowed opacity-50"
            }`}
          >
            {isCurrentDate ? "+ Add New Habit" : "Add habits on current date only"}
          </button>
        ) : (
          <div className="space-y-3">
            <input
              type="text"
              value={newHabit.name}
              onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
              placeholder="Enter habit name..."
              disabled={!isCurrentDate}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-smooth backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
              onKeyPress={(e) => e.key === "Enter" && isCurrentDate && addHabit()}
            />
            
            {/* Emoji Selector */}
            <div className="flex flex-wrap gap-2">
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setNewHabit({ ...newHabit, emoji })}
                  className={`p-2 rounded-lg text-xl transition-bounce ${
                    newHabit.emoji === emoji
                      ? "bg-indigo-500/30 border-2 border-indigo-400 shadow-lg"
                      : "bg-white/10 border border-white/20 hover:bg-white/20"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={addHabit}
                className="flex-1 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-bounce shadow-lg shadow-indigo-500/30"
              >
                Add Habit
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewHabit({ name: "", emoji: "🧘" });
                }}
                className="flex-1 py-2 bg-white/10 text-slate-300 rounded-lg hover:bg-white/20 transition-smooth backdrop-blur-sm border border-white/20"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HabitTracker;
