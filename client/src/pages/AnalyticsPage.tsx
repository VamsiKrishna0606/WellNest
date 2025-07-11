
import { useState } from "react";
import Navigation from "../components/Navigation";
import ChatAssistant from "../components/ChatAssistant";
import VoiceAssistant from "../components/VoiceAssistant";

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("week");

  const timeRanges = [
    { key: "week" as const, label: "Week" },
    { key: "month" as const, label: "Month" },
    { key: "year" as const, label: "Year" }
  ];

  const getProgressData = () => {
    switch (timeRange) {
      case "week":
        return [
          { name: "Drink Water", progress: 95, color: "from-indigo-500 to-blue-500", shadowColor: "shadow-indigo-500/40" },
          { name: "Exercise", progress: 80, color: "from-indigo-500 to-blue-500", shadowColor: "shadow-indigo-500/40" },
          { name: "Sleep 8 Hours", progress: 70, color: "from-slate-500 to-slate-400", shadowColor: "shadow-slate-500/40" },
        ];
      case "month":
        return [
          { name: "Drink Water", progress: 88, color: "from-indigo-500 to-blue-500", shadowColor: "shadow-indigo-500/40" },
          { name: "Exercise", progress: 75, color: "from-indigo-500 to-blue-500", shadowColor: "shadow-indigo-500/40" },
          { name: "Sleep 8 Hours", progress: 65, color: "from-slate-500 to-slate-400", shadowColor: "shadow-slate-500/40" },
        ];
      case "year":
        return [
          { name: "Drink Water", progress: 82, color: "from-indigo-500 to-blue-500", shadowColor: "shadow-indigo-500/40" },
          { name: "Exercise", progress: 70, color: "from-indigo-500 to-blue-500", shadowColor: "shadow-indigo-500/40" },
          { name: "Sleep 8 Hours", progress: 68, color: "from-slate-500 to-slate-400", shadowColor: "shadow-slate-500/40" },
        ];
    }
  };

  const progressData = getProgressData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      <Navigation />
      
      {/* Floating Voice Assistant - Global */}
      <div className="fixed top-20 right-6 z-40">
        <VoiceAssistant />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-2">Analytics</h1>
          <p className="text-slate-400 text-sm sm:text-base">Track your progress over time</p>
        </div>

        {/* Time Range Selector */}
        <div className="flex justify-center mb-8">
          <div className="glass-card p-2 inline-flex rounded-xl">
            {timeRanges.map((range) => (
              <button
                key={range.key}
                onClick={() => setTimeRange(range.key)}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                  timeRange === range.key
                    ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg shadow-indigo-500/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Progress Chart */}
          <div className="glass-card p-4 sm:p-6 shadow-2xl">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6">
              {timeRange === "week" ? "Weekly" : timeRange === "month" ? "Monthly" : "Yearly"} Progress
            </h2>
            <div className="space-y-4 sm:space-y-6">
              {progressData.map((goal, index) => (
                <div 
                  key={index} 
                  className="space-y-2 sm:space-y-3 fade-in-delayed"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-slate-200 font-medium floating-element text-sm sm:text-base" style={{ animationDelay: `${index * 0.1}s` }}>
                      {goal.name}
                    </span>
                    <span className="text-indigo-400 font-bold text-base sm:text-lg animate-pulse">
                      {goal.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3 sm:h-4 overflow-hidden backdrop-blur-sm border border-white/20 shadow-inner">
                    <div
                      className={`bg-gradient-to-r ${goal.color} h-3 sm:h-4 rounded-full shadow-lg ${goal.shadowColor} progress-bar transition-all duration-2000 ease-out`}
                      style={{ 
                        width: `${goal.progress}%`,
                        animation: `progressSlide-${goal.progress} 2s ease-out ${index * 0.3}s both`
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Trends Chart */}
          <div className="glass-card p-4 sm:p-6 shadow-2xl">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6">Trends</h2>
            <div className="h-32 sm:h-48 flex items-end justify-between space-x-1 sm:space-x-2">
              {[65, 70, 75, 80, 85, 90, 95].map((height, index) => (
                <div 
                  key={index} 
                  className="flex-1 bg-gradient-to-t from-indigo-500 to-blue-500 rounded-t shadow-lg shadow-indigo-500/30 transition-all duration-1000 ease-out" 
                  style={{
                    height: `${height}%`,
                    animationDelay: `${index * 0.1}s`
                  }}
                ></div>
              ))}
            </div>
            <div className="flex justify-between text-slate-300 text-xs sm:text-sm mt-2">
              {timeRange === "week" ? (
                <>
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                </>
              ) : timeRange === "month" ? (
                <>
                  <span>Week 1</span><span>Week 2</span><span>Week 3</span><span>Week 4</span>
                </>
              ) : (
                <>
                  <span>Q1</span><span>Q2</span><span>Q3</span><span>Q4</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Achievement Streaks */}
        <div className="glass-card p-4 sm:p-6 shadow-2xl mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6">Achievement Streaks</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-indigo-400 mb-2">12</div>
              <div className="text-slate-300 text-sm sm:text-base">Days Water Goal</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-indigo-400 mb-2">8</div>
              <div className="text-slate-300 text-sm sm:text-base">Days Exercise</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-slate-300 mb-2">5</div>
              <div className="text-slate-300 text-sm sm:text-base">Days Good Sleep</div>
            </div>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="glass-card p-4 sm:p-6 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-indigo-400 mb-2">85%</div>
            <div className="text-slate-300 text-sm sm:text-base">Average Completion</div>
          </div>
          <div className="glass-card p-4 sm:p-6 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-indigo-400 mb-2">127</div>
            <div className="text-slate-300 text-sm sm:text-base">Total Habits</div>
          </div>
          <div className="glass-card p-4 sm:p-6 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-slate-300 mb-2">1,850</div>
            <div className="text-slate-300 text-sm sm:text-base">Avg Daily Calories</div>
          </div>
          <div className="glass-card p-4 sm:p-6 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-slate-300 mb-2">28</div>
            <div className="text-slate-300 text-sm sm:text-base">Active Days</div>
          </div>
        </div>
      </div>
      
      <ChatAssistant />
    </div>
  );
};

export default AnalyticsPage;
