
import Navigation from "../components/Navigation";
import HabitTracker from "../components/HabitTracker";
import FoodLogger from "../components/FoodLogger";
import GoalAnalytics from "../components/GoalAnalytics";
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
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 max-w-7xl mx-auto">
          <HabitTracker />
          <FoodLogger />
          <GoalAnalytics />
          <div className="glass-card hover:shadow-indigo-500/20 transition-all duration-300 p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 gradient-text-light">Quick Stats</h2>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-indigo-400 mb-1">7</div>
                <div className="text-slate-300 text-xs sm:text-sm">Day Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-indigo-400 mb-1">85%</div>
                <div className="text-slate-300 text-xs sm:text-sm">Weekly Goal</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-slate-300 mb-1">1,250</div>
                <div className="text-slate-300 text-xs sm:text-sm">Calories Today</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-slate-300 mb-1">3</div>
                <div className="text-slate-300 text-xs sm:text-sm">Active Goals</div>
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
