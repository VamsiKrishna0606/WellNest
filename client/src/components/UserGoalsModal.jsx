import { useState, useEffect } from "react";
import { X, Target, TrendingUp, Heart, Moon, Droplets, Activity } from "lucide-react";

const UserGoalsModal = ({ isOpen, onClose }) => {
  const [goals, setGoals] = useState({
    dailySteps: "",
    dailyCalories: "",
    weeklyWorkouts: "",
    weightGoal: "",
    sleepHours: "",
    hydrationLiters: "",
    customGoals: ""
  });

  // Load existing goals from localStorage
  useEffect(() => {
    const savedGoals = localStorage.getItem('wellnest-user-goals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
  }, []);

  const handleInputChange = (field, value) => {
    setGoals(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save goals to localStorage
    localStorage.setItem('wellnest-user-goals', JSON.stringify(goals));
    
    // Show success message (you could use a toast here)
    alert('Goals saved successfully!');
    onClose();
  };

  const handleReset = () => {
    setGoals({
      dailySteps: "",
      dailyCalories: "",
      weeklyWorkouts: "",
      weightGoal: "",
      sleepHours: "",
      hydrationLiters: "",
      customGoals: ""
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center min-h-screen p-4 animate-fade-in">
      <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/30 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in mx-auto my-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/30">
          <div className="flex items-center space-x-3">
            <Target className="w-6 h-6 text-indigo-400" />
            <h2 className="text-2xl font-bold text-white">Set Your Health Goals</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-800/50 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Daily Steps Goal */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-slate-300">
                <Activity className="w-4 h-4 text-indigo-400" />
                <span>Daily Step Goal</span>
              </label>
              <input
                type="number"
                value={goals.dailySteps}
                onChange={(e) => handleInputChange('dailySteps', e.target.value)}
                placeholder="e.g., 10000"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-smooth"
              />
              <span className="text-xs text-slate-400">steps per day</span>
            </div>

            {/* Daily Calorie Goal */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-slate-300">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                <span>Daily Calorie Intake Goal</span>
              </label>
              <input
                type="number"
                value={goals.dailyCalories}
                onChange={(e) => handleInputChange('dailyCalories', e.target.value)}
                placeholder="e.g., 2000"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-smooth"
              />
              <span className="text-xs text-slate-400">calories per day</span>
            </div>

            {/* Weekly Workouts */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-slate-300">
                <Activity className="w-4 h-4 text-indigo-400" />
                <span>Weekly Workout Days</span>
              </label>
              <input
                type="number"
                min="1"
                max="7"
                value={goals.weeklyWorkouts}
                onChange={(e) => handleInputChange('weeklyWorkouts', e.target.value)}
                placeholder="e.g., 5"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-smooth"
              />
              <span className="text-xs text-slate-400">days per week</span>
            </div>

            {/* Weight Goal */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-slate-300">
                <Target className="w-4 h-4 text-indigo-400" />
                <span>Weight Goal</span>
              </label>
              <input
                type="number"
                step="0.1"
                value={goals.weightGoal}
                onChange={(e) => handleInputChange('weightGoal', e.target.value)}
                placeholder="e.g., 70.5"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-smooth"
              />
              <span className="text-xs text-slate-400">kg or lbs</span>
            </div>

            {/* Sleep Goal */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-slate-300">
                <Moon className="w-4 h-4 text-indigo-400" />
                <span>Sleep Goal</span>
              </label>
              <input
                type="number"
                step="0.5"
                min="1"
                max="24"
                value={goals.sleepHours}
                onChange={(e) => handleInputChange('sleepHours', e.target.value)}
                placeholder="e.g., 8"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-smooth"
              />
              <span className="text-xs text-slate-400">hours per night</span>
            </div>

            {/* Hydration Goal */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-slate-300">
                <Droplets className="w-4 h-4 text-indigo-400" />
                <span>Hydration Goal</span>
              </label>
              <input
                type="number"
                step="0.1"
                value={goals.hydrationLiters}
                onChange={(e) => handleInputChange('hydrationLiters', e.target.value)}
                placeholder="e.g., 2.5"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-smooth"
              />
              <span className="text-xs text-slate-400">liters per day</span>
            </div>
          </div>

          {/* Custom Goals */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-slate-300">
              <Heart className="w-4 h-4 text-indigo-400" />
              <span>Custom Personal Goals</span>
            </label>
            <textarea
              value={goals.customGoals}
              onChange={(e) => handleInputChange('customGoals', e.target.value)}
              placeholder="Add any other personal health goals or notes here..."
              rows={4}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-smooth resize-none"
            />
            <span className="text-xs text-slate-400">Optional: Any additional goals you'd like to track</span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-700/30">
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-3 bg-slate-700/50 text-slate-300 rounded-xl hover:bg-slate-700 transition-smooth border border-slate-600/30"
            >
              Reset to Default
            </button>
            
            <div className="flex gap-3 sm:ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-white/10 text-slate-300 rounded-xl hover:bg-white/20 transition-smooth border border-white/20"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-smooth shadow-lg shadow-indigo-500/30 font-medium"
              >
                Save Goals
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserGoalsModal;