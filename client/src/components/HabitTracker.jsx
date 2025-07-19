import { useState, useEffect } from "react";
import { Calendar, X, Clock, Bell, BellOff, Upload, Image } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar as CalendarComponent } from "./ui/calendar";
import { Button } from "./ui/button";

const emojis = ["🧘", "💧", "🏃", "🍎", "📖", "💪", "🚴", "🎯", "⚡", "🌟"];
const units = [
  "Minutes",
  "Hours",
  "Litres",
  "Glasses",
  "Pages",
  "Times",
  "Steps",
  "Reps",
  "Grams",
  "Kilometers",
];
const frequencies = ["Daily", "Weekly", "Monthly"];
const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const HabitTracker = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [habits, setHabits] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: "",
    emoji: "🧘",
    customEmoji: "",
    frequency: "Daily",
    selectedDays: [],
    value: 1,
    unit: "Minutes",
    time: "",
    reminders: false,
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
  });

  // Load habits from localStorage on component mount
  useEffect(() => {
    const savedHabits = localStorage.getItem("wellnest-habits");
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }
  }, []);

  // Save habits to localStorage whenever habits change
  useEffect(() => {
    localStorage.setItem("wellnest-habits", JSON.stringify(habits));
  }, [habits]);

  const getHabitsForDate = (date) => {
    return habits[date] || [];
  };

  const toggleHabit = (habitId) => {
    setHabits((prev) => ({
      ...prev,
      [selectedDate]: (prev[selectedDate] || []).map((habit) =>
        habit.id === habitId ? { ...habit, completed: !habit.completed } : habit
      ),
    }));
  };

  const handleDayToggle = (day) => {
    setNewHabit((prev) => {
      const updatedDays = prev.selectedDays.includes(day)
        ? prev.selectedDays.filter((d) => d !== day)
        : [...prev.selectedDays, day];

      // If all days selected, change frequency to Daily
      if (updatedDays.length === 7) {
        return { ...prev, frequency: "Daily", selectedDays: [] };
      }

      return { ...prev, selectedDays: updatedDays };
    });
  };

  const resetForm = () => {
    setNewHabit({
      name: "",
      emoji: "🧘",
      customEmoji: "",
      frequency: "Daily",
      selectedDays: [],
      value: 1,
      unit: "Minutes",
      time: "",
      reminders: false,
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
    });
  };

  const addHabit = () => {
    if (newHabit.name.trim()) {
      const newHabitObj = {
        id: Date.now(),
        name: newHabit.name,
        emoji: newHabit.customEmoji || newHabit.emoji,
        frequency: newHabit.frequency,
        selectedDays: newHabit.selectedDays,
        value: newHabit.value,
        unit: newHabit.unit,
        time: newHabit.time,
        reminders: newHabit.reminders,
        startDate: newHabit.startDate,
        endDate: newHabit.endDate,
        completed: false,
        createdDate: selectedDate,
      };

      setHabits((prev) => ({
        ...prev,
        [selectedDate]: [...(prev[selectedDate] || []), newHabitObj],
      }));

      resetForm();
      setShowAddForm(false);
    }
  };

  const deleteHabit = (habitId) => {
    setHabits((prev) => ({
      ...prev,
      [selectedDate]: (prev[selectedDate] || []).filter(
        (habit) => habit.id !== habitId
      ),
    }));
  };

  const currentHabits = getHabitsForDate(selectedDate);
  const completedCount = currentHabits.filter((h) => h.completed).length;
  const isCurrentDate = selectedDate === new Date().toISOString().split("T")[0];

  return (
    <div className="glass-card hover:shadow-indigo-500/20 transition-smooth slide-in p-4 sm:p-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-white gradient-text-light">
          Habit Tracker
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

      {/* Progress Summary */}
      {currentHabits.length > 0 && (
        <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-300">Progress</span>
            <span className="text-indigo-400 font-medium">
              {completedCount}/{currentHabits.length} completed
            </span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2 mt-2">
            <div
              className="bg-gradient-to-r from-indigo-500 to-blue-500 h-2 rounded-full transition-all duration-500 progress-bar"
              style={{
                width: `${
                  currentHabits.length > 0
                    ? (completedCount / currentHabits.length) * 100
                    : 0
                }%`,
              }}
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
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4 text-white animate-bounce"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              )}
            </button>

            <span
              className="text-lg sm:text-xl mr-2 sm:mr-3 floating-element"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {habit.emoji}
            </span>

            <span
              className={`flex-1 font-medium transition-smooth text-sm sm:text-base ${
                habit.completed
                  ? "text-slate-300 line-through opacity-75"
                  : "text-slate-200"
              }`}
            >
              {habit.name}
            </span>

            <div
              className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium transition-smooth ${
                habit.completed
                  ? "bg-gradient-to-r from-indigo-500/20 to-blue-500/20 text-indigo-300 border border-indigo-400/30"
                  : "bg-white/10 text-slate-400 border border-white/20"
              }`}
            >
              {habit.completed ? "Done" : "Pending"}
            </div>

            <button
              onClick={() => deleteHabit(habit.id)}
              className="ml-2 p-1 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-smooth opacity-70 hover:opacity-100"
              title="Delete habit"
            >
              <X className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
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
            {isCurrentDate
              ? "+ Add New Habit"
              : "Add habits on current date only"}
          </button>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6 max-h-[70vh] overflow-y-auto backdrop-blur-sm animate-scale-in">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                Create New Habit
              </h3>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  resetForm();
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-smooth"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 1. Habit Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Habit Name
              </label>
              <input
                type="text"
                value={newHabit.name}
                onChange={(e) =>
                  setNewHabit({ ...newHabit, name: e.target.value })
                }
                placeholder="e.g., Drink Water, Read Books, Exercise..."
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-smooth backdrop-blur-sm"
              />
            </div>

            {/* 2. Icon/Emoji Picker */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-300">
                Choose Icon
              </label>

              {/* Pre-defined Emojis */}
              <div className="flex flex-wrap gap-2">
                {emojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() =>
                      setNewHabit({ ...newHabit, emoji, customEmoji: "" })
                    }
                    className={`p-3 rounded-xl text-xl transition-all ${
                      newHabit.emoji === emoji && !newHabit.customEmoji
                        ? "bg-indigo-500/30 border-2 border-indigo-400 shadow-lg scale-110"
                        : "bg-white/10 border border-white/20 hover:bg-white/20 hover:scale-105"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              {/* Custom Emoji Input */}
              <div className="space-y-2">
                <label className="text-xs text-slate-400 flex items-center gap-2">
                  <Image className="w-3 h-3" />
                  Or enter custom emoji/text (max 3 characters)
                </label>
                <input
                  type="text"
                  maxLength="3"
                  value={newHabit.customEmoji}
                  onChange={(e) =>
                    setNewHabit({ ...newHabit, customEmoji: e.target.value })
                  }
                  placeholder="🎨 or ABC"
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-smooth text-center text-lg"
                />
                {newHabit.customEmoji && (
                  <div className="flex items-center justify-center">
                    <div className="p-2 bg-indigo-500/20 border border-indigo-400/50 rounded-lg">
                      <span className="text-xl">{newHabit.customEmoji}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 3. Repeat Frequency */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-300">
                Repeat Frequency
              </label>
              <Select
                value={newHabit.frequency}
                onValueChange={(value) =>
                  setNewHabit({
                    ...newHabit,
                    frequency: value,
                    selectedDays: [],
                  })
                }
              >
                <SelectTrigger className="w-full bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                  {frequencies.map((freq) => (
                    <SelectItem
                      key={freq}
                      value={freq}
                      className="hover:bg-slate-700"
                    >
                      {freq}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Weekly Day Selector */}
              {newHabit.frequency === "Weekly" && (
                <div className="space-y-2">
                  <label className="text-xs text-slate-400">Select Days</label>
                  <div className="flex flex-wrap gap-2">
                    {weekDays.map((day) => (
                      <button
                        key={day}
                        onClick={() => handleDayToggle(day)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          newHabit.selectedDays.includes(day)
                            ? "bg-indigo-500/30 border border-indigo-400 text-indigo-300"
                            : "bg-white/10 border border-white/20 text-slate-300 hover:bg-white/20"
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 4. Value + Units */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Target & Unit
              </label>
              <div className="flex space-x-3">
                <input
                  type="number"
                  min="1"
                  value={newHabit.value}
                  onChange={(e) =>
                    setNewHabit({
                      ...newHabit,
                      value: parseInt(e.target.value) || 1,
                    })
                  }
                  className="w-24 px-3 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-smooth"
                />
                <Select
                  value={newHabit.unit}
                  onValueChange={(value) =>
                    setNewHabit({ ...newHabit, unit: value })
                  }
                >
                  <SelectTrigger className="flex-1 bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-white">
                    {units.map((unit) => (
                      <SelectItem
                        key={unit}
                        value={unit}
                        className="hover:bg-slate-700"
                      >
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <p className="text-xs text-slate-400">
                Target: {newHabit.value} {newHabit.unit} / Day
              </p>
            </div>

            {/* 5. Set Time (Optional) */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Reminder Time (Optional)
              </label>
              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-indigo-400" />
                <input
                  type="time"
                  value={newHabit.time}
                  onChange={(e) =>
                    setNewHabit({ ...newHabit, time: e.target.value })
                  }
                  className="flex-1 px-3 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-smooth"
                />
              </div>
            </div>

            {/* 6. Reminder Toggle */}
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center space-x-3">
                {newHabit.reminders ? (
                  <Bell className="w-4 h-4 text-indigo-400" />
                ) : (
                  <BellOff className="w-4 h-4 text-slate-400" />
                )}
                <div>
                  <p className="text-sm font-medium text-white">
                    Enable Reminders
                  </p>
                  <p className="text-xs text-slate-400">
                    Get notified at your set time
                  </p>
                </div>
              </div>
              <Switch
                checked={newHabit.reminders}
                onCheckedChange={(checked) =>
                  setNewHabit({ ...newHabit, reminders: checked })
                }
              />
            </div>

            {/* 7. Habit Term (Start & End Date) */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-300">
                Habit Duration
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">Start Date</label>
                  <input
                    type="date"
                    value={newHabit.startDate}
                    onChange={(e) =>
                      setNewHabit({ ...newHabit, startDate: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-smooth"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">
                    End Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={newHabit.endDate}
                    onChange={(e) =>
                      setNewHabit({ ...newHabit, endDate: e.target.value })
                    }
                    min={newHabit.startDate}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-smooth"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4 border-t border-white/10">
              <button
                onClick={addHabit}
                disabled={!newHabit.name.trim()}
                className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Create Habit
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  resetForm();
                }}
                className="flex-1 py-3 bg-white/10 text-slate-300 rounded-xl hover:bg-white/20 transition-smooth backdrop-blur-sm border border-white/20 font-medium"
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
