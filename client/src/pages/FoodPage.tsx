
import { useState } from "react";
import Navigation from "../components/Navigation";
import ChatAssistant from "../components/ChatAssistant";
import VoiceAssistant from "../components/VoiceAssistant";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface Meal {
  id: number;
  name: string;
  calories: number;
  type: "Breakfast" | "Lunch" | "Dinner" | "Snacks";
}

const FoodPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [meals, setMeals] = useState<Meal[]>([
    { id: 1, name: "Banana", calories: 105, type: "Breakfast" },
    { id: 2, name: "Oatmeal with berries", calories: 250, type: "Breakfast" },
    { id: 3, name: "Grilled Chicken Salad", calories: 320, type: "Lunch" },
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMeal, setNewMeal] = useState({ name: "", calories: "", type: "Breakfast" as const });

  const getMealsForType = (type: string) => {
    return meals.filter(meal => meal.type === type);
  };

  const getTotalCalories = () => {
    return meals.reduce((total, meal) => total + meal.calories, 0);
  };

  const addMeal = () => {
    if (newMeal.name.trim() && newMeal.calories) {
      setMeals([...meals, {
        id: Date.now(),
        name: newMeal.name,
        calories: parseInt(newMeal.calories),
        type: newMeal.type
      }]);
      setNewMeal({ name: "", calories: "", type: "Breakfast" });
      setShowAddForm(false);
    }
  };

  const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snacks"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      <Navigation />
      
      {/* Floating Voice Assistant - Global */}
      <div className="fixed top-20 right-6 z-40">
        <VoiceAssistant />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-2">Food Tracker</h1>
          <p className="text-slate-400 text-sm sm:text-base">Monitor your nutrition and meals</p>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          <div className="xl:col-span-2">
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
            </div>

            {/* Meals */}
            <div className="glass-card p-4 sm:p-6 shadow-2xl">
              <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6">
                Meals for {format(selectedDate, "MMMM d, yyyy")}
              </h2>
              
              <div className="space-y-4 sm:space-y-6">
                {mealTypes.map((mealType) => (
                  <div key={mealType} className="bg-white/5 rounded-xl p-3 sm:p-4 border border-white/10 backdrop-blur-sm">
                    <h3 className="text-base sm:text-lg font-medium text-indigo-400 mb-2 sm:mb-3">{mealType}</h3>
                    <div className="space-y-2">
                      {getMealsForType(mealType).map((meal) => (
                        <div key={meal.id} className="flex justify-between items-center text-slate-200 text-sm sm:text-base">
                          <span>{meal.name}</span>
                          <span className="text-slate-300">{meal.calories} cal</span>
                        </div>
                      ))}
                      {getMealsForType(mealType).length === 0 && (
                        <div className="text-slate-400 text-sm italic">No meals logged</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Meal Button */}
              {!showAddForm ? (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="w-full mt-6 py-3 border-2 border-dashed border-white/30 rounded-xl text-slate-300 hover:text-white hover:border-white/50 transition-all duration-200 flex items-center justify-center space-x-2 bg-white/5 backdrop-blur-sm"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
                  </svg>
                  <span>Add Meal</span>
                </button>
              ) : (
                <div className="mt-6 space-y-4 fade-in-delayed">
                  <input
                    type="text"
                    value={newMeal.name}
                    onChange={(e) => setNewMeal({...newMeal, name: e.target.value})}
                    placeholder="Meal name..."
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-smooth backdrop-blur-sm"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="number"
                      value={newMeal.calories}
                      onChange={(e) => setNewMeal({...newMeal, calories: e.target.value})}
                      placeholder="Calories..."
                      className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-smooth backdrop-blur-sm"
                    />
                    <select
                      value={newMeal.type}
                      onChange={(e) => setNewMeal({...newMeal, type: e.target.value as any})}
                      className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-smooth backdrop-blur-sm"
                    >
                      {mealTypes.map(type => (
                        <option key={type} value={type} className="bg-slate-800">{type}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={addMeal}
                      className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-xl hover:from-indigo-600 hover:to-blue-600 transition-bounce shadow-lg shadow-indigo-500/30 neon-glow font-medium"
                    >
                      Add Meal
                    </button>
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-smooth backdrop-blur-sm font-medium shadow-sm border border-white/20"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Daily Summary */}
          <div className="space-y-4 sm:space-y-6">
            <div className="glass-card p-4 sm:p-6 shadow-2xl">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Daily Summary</h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between text-slate-200 text-sm sm:text-base">
                  <span>Calories</span>
                  <span className="text-indigo-400 font-semibold">{getTotalCalories()} / 2000</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 backdrop-blur-sm">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-blue-500 h-2 rounded-full shadow-lg shadow-indigo-500/30" 
                    style={{width: `${Math.min((getTotalCalories() / 2000) * 100, 100)}%`}}
                  ></div>
                </div>
                
                <div className="flex justify-between text-slate-200 text-sm sm:text-base">
                  <span>Meals</span>
                  <span className="text-slate-300">{meals.length} logged</span>
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

export default FoodPage;
