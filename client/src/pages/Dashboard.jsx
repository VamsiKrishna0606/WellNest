
import Navigation from "../components/Navigation";
import HabitTracker from "../components/HabitTracker";
import FoodLogger from "../components/FoodLogger";

import JournalWidget from "../components/JournalWidget";
import ChatAssistant from "../components/ChatAssistant";
import VoiceAssistant from "../components/VoiceAssistant";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      <Navigation />
      
      {/* Floating Voice Assistant - Aligned with Chat Assistant */}
      <div className="fixed bottom-6 right-28 z-40">
        <VoiceAssistant />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-100 mb-2 bg-gradient-to-r from-indigo-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Welcome to WellNest
          </h1>
          <p className="text-lg sm:text-xl text-slate-400">A smarter way to build a healthier you</p>
        </div>
        
        {/* 2x2 Grid Layout */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Left: Habit Tracker */}
            <div className="min-h-fit">
              <HabitTracker />
            </div>
            
            {/* Top Right: Food Logger */}
            <div className="min-h-fit">
              <FoodLogger />
            </div>
            
            {/* Bottom Left: Journal - Fixed Height */}
            <div className="h-96">
              <JournalWidget />
            </div>
            
            {/* Bottom Right: Quick Stats - Fixed Height */}
            <div className="h-96">
              <div className="glass-card hover:shadow-indigo-500/20 transition-all duration-300 p-4 sm:p-6 h-full flex flex-col">
                <h2 className="text-xl sm:text-2xl font-semibold text-white mb-6 gradient-text-light">Quick Stats</h2>
                <div className="grid grid-cols-2 gap-4 flex-1 content-center">
                  <div className="flex flex-col justify-center items-center p-4 bg-white/5 rounded-xl border border-white/10 h-full">
                    <div className="text-2xl sm:text-3xl font-bold text-indigo-400 mb-2">7</div>
                    <div className="text-slate-300 text-sm text-center">Day Streak</div>
                  </div>
                  <div className="flex flex-col justify-center items-center p-4 bg-white/5 rounded-xl border border-white/10 h-full">
                    <div className="text-2xl sm:text-3xl font-bold text-indigo-400 mb-2">85%</div>
                    <div className="text-slate-300 text-sm text-center">Weekly Goal</div>
                  </div>
                  <div className="flex flex-col justify-center items-center p-4 bg-white/5 rounded-xl border border-white/10 h-full">
                    <div className="text-2xl sm:text-3xl font-bold text-slate-300 mb-2">1,250</div>
                    <div className="text-slate-300 text-sm text-center">Calories Today</div>
                  </div>
                  <div className="flex flex-col justify-center items-center p-4 bg-white/5 rounded-xl border border-white/10 h-full">
                    <div className="text-2xl sm:text-3xl font-bold text-slate-300 mb-2">3</div>
                    <div className="text-slate-300 text-sm text-center">Active Goals</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <ChatAssistant />
    </div>
  );
};

export default Dashboard;
