
import { useState } from "react";
import Navigation from "../components/Navigation";
import ChatAssistant from "../components/ChatAssistant";
import VoiceAssistant from "../components/VoiceAssistant";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

const HabitPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [habits, setHabits] = useState([
    { id: 1, name: "Drink Water", completed: true, icon: "💧" },
    { id: 2, name: "Exercise", completed: true, icon: "🏃" },
    { id: 3, name: "Sleep 8 Hours", completed: false, icon: "😴" },
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHabitName, setNewHabitName] = useState("");

  const isToday = selectedDate.toDateString() === new Date().toDateString();
  const isPastDate = selectedDate < new Date(new Date().setHours(0, 0, 0, 0));

  const toggleHabit = (id: number) => {
    if (!isToday) return; // Only allow editing for today
    
    setHabits(habits.map(habit => 
      habit.id === id ? { ...habit, completed: !habit.completed } : habit
    ));
  };

  const addHabit = () => {
    if (newHabitName.trim()) {
      setHabits([...habits, {
        id: Date.now(),
        name: newHabitName,
        completed: false,
        icon: "✨"
      }]);
      setNewHabitName("");
      setShowAddForm(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      <Navigation />
      
      {/* Floating Voice Assistant - Global */}
      <div className="fixed top-20 right-6 z-40">
        <VoiceAssistant />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-2">Habit Tracker</h1>
          <p className="text-slate-400 text-sm sm:text-base">Build consistent daily habits</p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Date Selector */}
          <div className="glass-card p-4 sm:p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Select Date</h3>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto justify-start text-left font-normal bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            
            {isPastDate && (
              <p className="text-sm text-slate-400 mt-2">
                📖 Viewing past habits (read-only)
              </p>
            )}
            {isToday && (
              <p className="text-sm text-indigo-400 mt-2">
                ✨ Today's habits (editable)
              </p>
            )}
          </div>

          {/* Habits List */}
          <div className="glass-card hover:shadow-indigo-500/20 transition-smooth slide-in p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6 gradient-text-light">
              Habits for {format(selectedDate, "MMMM d, yyyy")}
            </h2>
            
            <div className="space-y-3 sm:space-y-4">
              {habits.map((habit, index) => (
                <div 
                  key={habit.id} 
                  className="habit-item flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10 shadow-sm backdrop-blur-sm"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <button
                    onClick={() => toggleHabit(habit.id)}
                    disabled={!isToday}
                    className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg border-2 flex items-center justify-center transition-bounce floating-element ${
                      habit.completed
                        ? "bg-gradient-to-r from-indigo-500 to-blue-500 border-indigo-400 shadow-lg shadow-indigo-500/40 neon-glow"
                        : "border-slate-400 bg-white/10 hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-400/30 backdrop-blur-sm"
                    } ${!isToday ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    {habit.completed && (
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white animate-bounce" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    )}
                  </button>
                  
                  <span className="text-lg sm:text-xl mr-2 sm:mr-3 floating-element" style={{ animationDelay: `${index * 0.2}s` }}>
                    {habit.icon}
                  </span>
                  
                  <span className={`flex-1 font-medium transition-smooth text-sm sm:text-base ${
                    habit.completed ? "text-slate-300 line-through opacity-70" : "text-white"
                  }`}>
                    {habit.name}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Add Habit Form - Only show for today */}
            {isToday && (
              <>
                {showAddForm ? (
                  <div className="mt-4 sm:mt-6 space-y-3 fade-in-delayed">
                    <input
                      type="text"
                      value={newHabitName}
                      onChange={(e) => setNewHabitName(e.target.value)}
                      placeholder="Enter new habit..."
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-smooth backdrop-blur-sm text-sm sm:text-base shadow-sm"
                      onKeyPress={(e) => e.key === "Enter" && addHabit()}
                    />
                    <div className="flex space-x-3">
                      <button
                        onClick={addHabit}
                        className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-xl hover:from-indigo-600 hover:to-blue-600 transition-bounce shadow-lg shadow-indigo-500/30 neon-glow font-medium text-sm sm:text-base"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => setShowAddForm(false)}
                        className="px-4 sm:px-6 py-2 sm:py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-smooth backdrop-blur-sm font-medium text-sm sm:text-base shadow-sm border border-white/20"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="mt-4 sm:mt-6 text-indigo-400 hover:text-indigo-300 font-medium transition-bounce flex items-center space-x-2 group text-sm sm:text-base"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-90 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
                    </svg>
                    <span>Add Habit</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      
      <ChatAssistant />
    </div>
  );
};

export default HabitPage;
