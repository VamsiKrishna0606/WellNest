
import { useState, useEffect } from "react";
import { Calendar, BarChart3, PieChart, TrendingUp, ArrowLeft } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart as RechartsPieChart, Cell, LineChart, Line } from "recharts";
import { useQuery } from "@tanstack/react-query";
import axios from "../axios";

const GoalAnalytics = () => {
  const [activeTab, setActiveTab] = useState("daily");
  const [habits, setHabits] = useState({});
  const [foods, setFoods] = useState({});
  const [selectedAnalyticsDate, setSelectedAnalyticsDate] = useState(new Date().toISOString().split('T')[0]);
  const [showSpecificDateView, setShowSpecificDateView] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    const savedHabits = localStorage.getItem('wellnest-habits');
    const savedFoods = localStorage.getItem('wellnest-foods');
    
    if (savedHabits) setHabits(JSON.parse(savedHabits));
    if (savedFoods) setFoods(JSON.parse(savedFoods));
  }, []);

  const tabs = [
    { id: "daily", label: "Daily", icon: Calendar },
    { id: "monthly", label: "Monthly", icon: BarChart3 },
    { id: "yearly", label: "Yearly", icon: TrendingUp }
  ];

  const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981'];

  // Get data for specific date
  const getDataForDate = (date) => {
    const dateHabits = habits[date] || [];
    const dateFoods = foods[date] || [];
    
    return {
      habits: dateHabits,
      foods: dateFoods,
      totalCalories: dateFoods.reduce((sum, food) => sum + food.calories, 0),
      completedHabits: dateHabits.filter(h => h.completed).length,
      totalHabits: dateHabits.length
    };
  };

  // Generate chart data based on active tab
  const getChartData = () => {
    const today = new Date();
    
    if (activeTab === "daily") {
      const data = getDataForDate(selectedAnalyticsDate);
      return {
        habitData: [{
          name: "Today",
          completed: data.completedHabits,
          total: data.totalHabits
        }],
        calorieData: data.foods.reduce((acc, food) => {
          const existing = acc.find(item => item.category === food.category);
          if (existing) {
            existing.calories += food.calories;
          } else {
            acc.push({ category: food.category, calories: food.calories });
          }
          return acc;
        }, [])
      };
    } else if (activeTab === "monthly") {
      const monthData = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const data = getDataForDate(dateStr);
        
        monthData.push({
          date: date.getDate(),
          habits: data.totalHabits > 0 ? (data.completedHabits / data.totalHabits) * 100 : 0,
          calories: data.totalCalories
        });
      }
      return { habitData: monthData, calorieData: monthData };
    } else {
      const yearData = [];
      for (let i = 11; i >= 0; i--) {
        const date = new Date(today);
        date.setMonth(date.getMonth() - i);
        const monthName = date.toLocaleString('default', { month: 'short' });
        
        // Calculate average for the month (simplified)
        yearData.push({
          month: monthName,
          habits: Math.random() * 100, // Placeholder data
          calories: 1500 + Math.random() * 1000
        });
      }
      return { habitData: yearData, calorieData: yearData };
    }
  };

  const chartData = getChartData();

  if (showSpecificDateView) {
    const specificData = getDataForDate(selectedAnalyticsDate);
    
    return (
      <div className="glass-card hover:shadow-indigo-500/20 transition-smooth slide-in p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setShowSpecificDateView(false)}
            className="flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Analytics</span>
          </button>
          
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <input
              type="date"
              value={selectedAnalyticsDate}
              onChange={(e) => setSelectedAnalyticsDate(e.target.value)}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-smooth backdrop-blur-sm"
            />
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-white mb-6 gradient-text-light">
          Daily Summary - {new Date(selectedAnalyticsDate).toLocaleDateString()}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Habits Section */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <span className="mr-2">✅</span> Habits Status
            </h3>
            
            {specificData.habits.length === 0 ? (
              <p className="text-slate-400 text-center py-4">No habits logged for this date</p>
            ) : (
              <div className="space-y-3">
                {specificData.habits.map((habit) => (
                  <div key={habit.id} className="flex items-center space-x-3 p-2 rounded-lg bg-white/5">
                    <span className="text-xl">{habit.emoji}</span>
                    <span className={`flex-1 ${habit.completed ? 'text-green-400 line-through' : 'text-slate-300'}`}>
                      {habit.name}
                    </span>
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      habit.completed 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-slate-500/20 text-slate-400'
                    }`}>
                      {habit.completed ? '✓ Done' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Food Log Section */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <span className="mr-2">🍽️</span> Food Log
            </h3>
            
            {specificData.foods.length === 0 ? (
              <p className="text-slate-400 text-center py-4">No food logged for this date</p>
            ) : (
              <div className="space-y-3">
                <div className="text-center mb-4">
                  <div className="text-2xl font-bold text-indigo-400">{specificData.totalCalories}</div>
                  <div className="text-sm text-slate-400">Total Calories</div>
                </div>
                
                {specificData.foods.map((food) => (
                  <div key={food.id} className="flex justify-between items-center p-2 rounded-lg bg-white/5">
                    <div>
                      <div className="text-slate-200">{food.name}</div>
                      <div className="text-xs text-slate-400">{food.category} • {food.time}</div>
                    </div>
                    <div className="text-indigo-400 font-medium">{food.calories} cal</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
            <div className="text-2xl font-bold text-indigo-400">
              {specificData.totalHabits > 0 ? Math.round((specificData.completedHabits / specificData.totalHabits) * 100) : 0}%
            </div>
            <div className="text-sm text-slate-400">Habits Completed</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
            <div className="text-2xl font-bold text-indigo-400">{specificData.totalCalories}</div>
            <div className="text-sm text-slate-400">Calories Consumed</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card hover:shadow-indigo-500/20 transition-smooth slide-in p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-white gradient-text-light">Analytics</h2>
        
        <button
          onClick={() => setShowSpecificDateView(true)}
          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-bounce shadow-lg shadow-indigo-500/30 text-sm"
        >
          View Specific Date
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 mb-6 bg-white/5 p-1 rounded-xl border border-white/10">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg transition-smooth text-sm ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/10"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Habit Consistency Chart */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-indigo-400" />
            Habit Consistency
          </h3>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.habitData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey={activeTab === "yearly" ? "month" : activeTab === "monthly" ? "date" : "name"}
                  stroke="rgba(255,255,255,0.5)"
                  fontSize={12}
                />
                <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
                <Bar 
                  dataKey={activeTab === "daily" ? "completed" : "habits"}
                  fill="url(#habitGradient)" 
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="habitGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Food Trends Chart */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <PieChart className="w-5 h-5 mr-2 text-indigo-400" />
            {activeTab === "daily" ? "Calorie Distribution" : "Food Trends"}
          </h3>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              {activeTab === "daily" && chartData.calorieData.length > 0 ? (
                <RechartsPieChart>
                  <RechartsPieChart
                    data={chartData.calorieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="calories"
                  >
                    {chartData.calorieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </RechartsPieChart>
                </RechartsPieChart>
              ) : (
                <LineChart data={chartData.calorieData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey={activeTab === "yearly" ? "month" : "date"}
                    stroke="rgba(255,255,255,0.5)"
                    fontSize={12}
                  />
                  <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
                  <Line 
                    type="monotone" 
                    dataKey="calories" 
                    stroke="#06b6d4" 
                    strokeWidth={3}
                    dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
          <div className="text-2xl font-bold text-indigo-400">
            {Object.keys(habits).reduce((total, date) => total + habits[date].filter(h => h.completed).length, 0)}
          </div>
          <div className="text-sm text-slate-400">Total Completed</div>
        </div>
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
          <div className="text-2xl font-bold text-indigo-400">
            {Object.keys(foods).reduce((total, date) => total + foods[date].reduce((sum, f) => sum + f.calories, 0), 0)}
          </div>
          <div className="text-sm text-slate-400">Total Calories</div>
        </div>
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
          <div className="text-2xl font-bold text-indigo-400">{Object.keys(habits).length}</div>
          <div className="text-sm text-slate-400">Active Days</div>
        </div>
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
          <div className="text-2xl font-bold text-indigo-400">
            {Math.round((Object.keys(habits).reduce((total, date) => {
              const dayHabits = habits[date];
              return total + (dayHabits.length > 0 ? dayHabits.filter(h => h.completed).length / dayHabits.length : 0);
            }, 0) / Math.max(Object.keys(habits).length, 1)) * 100)}%
          </div>
          <div className="text-sm text-slate-400">Avg Completion</div>
        </div>
      </div>
    </div>
  );
};

export default GoalAnalytics;
