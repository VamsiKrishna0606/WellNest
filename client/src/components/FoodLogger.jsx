
import { useState, useEffect } from "react";
import { Calendar, Plus, X } from "lucide-react";

const FoodLogger = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [foods, setFoods] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFood, setNewFood] = useState({ name: "", calories: "", category: "Breakfast", protein: "", carbs: "", fats: "" });

  // Load foods from localStorage on component mount
  useEffect(() => {
    const savedFoods = localStorage.getItem('wellnest-foods');
    if (savedFoods) {
      setFoods(JSON.parse(savedFoods));
    }
  }, []);

  // Save foods to localStorage whenever foods change
  useEffect(() => {
    localStorage.setItem('wellnest-foods', JSON.stringify(foods));
  }, [foods]);

  const getFoodsForDate = (date) => {
    return foods[date] || [];
  };

  const addFood = () => {
    if (newFood.name.trim() && newFood.calories) {
      const now = new Date();
      const newFoodObj = {
        id: Date.now(),
        name: newFood.name,
        calories: parseInt(newFood.calories),
        time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        category: newFood.category,
        date: selectedDate,
        macros: {
          protein: newFood.protein ? parseFloat(newFood.protein) : null,
          carbs: newFood.carbs ? parseFloat(newFood.carbs) : null,
          fats: newFood.fats ? parseFloat(newFood.fats) : null
        }
      };

      setFoods(prev => ({
        ...prev,
        [selectedDate]: [...(prev[selectedDate] || []), newFoodObj]
      }));

      setNewFood({ name: "", calories: "", category: "Breakfast", protein: "", carbs: "", fats: "" });
      setShowAddForm(false);
    }
  };

  const deleteFood = (foodId) => {
    setFoods(prev => ({
      ...prev,
      [selectedDate]: (prev[selectedDate] || []).filter(food => food.id !== foodId)
    }));
  };

  const currentFoods = getFoodsForDate(selectedDate);
  const totalCalories = currentFoods.reduce((sum, food) => sum + food.calories, 0);
  const isCurrentDate = selectedDate === new Date().toISOString().split('T')[0];

  const getCategoryColor = (category) => {
    // Using neutral, consistent colors for all meal types
    return "from-slate-600 to-slate-700";
  };

  const groupedFoods = currentFoods.reduce((acc, food) => {
    if (!acc[food.category]) acc[food.category] = [];
    acc[food.category].push(food);
    return acc;
  }, {});

  return (
    <div className="glass-card hover:shadow-indigo-500/20 transition-smooth slide-in p-4 sm:p-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-white gradient-text-light">Food Logger</h2>
          <div className="text-right">
            <div className="text-2xl sm:text-3xl font-bold text-indigo-400 animate-pulse">{totalCalories}</div>
            <div className="text-slate-300 text-xs sm:text-sm">Total Calories</div>
          </div>
        </div>
        
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

      {/* Add New Food Form */}
      <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
        {!showAddForm ? (
          <button
            onClick={() => isCurrentDate && setShowAddForm(true)}
            disabled={!isCurrentDate}
            className={`flex items-center justify-center w-full py-3 border-2 border-dashed rounded-xl transition-smooth backdrop-blur-sm ${
              isCurrentDate
                ? "border-slate-600 text-slate-400 hover:border-indigo-500 hover:text-indigo-400 hover:bg-white/5"
                : "border-slate-700 text-slate-600 cursor-not-allowed opacity-50"
            }`}
          >
            <Plus className="w-4 h-4 mr-2" />
            {isCurrentDate ? "Log Food" : "Log food on current date only"}
          </button>
        ) : (
          <div className="space-y-3">
            <input
              type="text"
              value={newFood.name}
              onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
              placeholder="Food name..."
              disabled={!isCurrentDate}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-smooth backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <div className="flex space-x-3">
              <input
                type="number"
                value={newFood.calories}
                onChange={(e) => setNewFood({ ...newFood, calories: e.target.value })}
                placeholder="Calories"
                disabled={!isCurrentDate}
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-smooth backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <select
                value={newFood.category}
                onChange={(e) => setNewFood({ ...newFood, category: e.target.value })}
                disabled={!isCurrentDate}
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-smooth backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:text-slate-400"
                style={{ color: '#1e293b' }}
              >
                <option value="Breakfast" style={{ color: '#1e293b', backgroundColor: '#f8fafc' }}>Breakfast</option>
                <option value="Lunch" style={{ color: '#1e293b', backgroundColor: '#f8fafc' }}>Lunch</option>
                <option value="Dinner" style={{ color: '#1e293b', backgroundColor: '#f8fafc' }}>Dinner</option>
                <option value="Snack" style={{ color: '#1e293b', backgroundColor: '#f8fafc' }}>Snack</option>
              </select>
            </div>
            {/* Macros section */}
            <div className="space-y-2">
              <label className="text-sm text-slate-300 font-medium">Macros (optional)</label>
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="number"
                  step="0.1"
                  value={newFood.protein}
                  onChange={(e) => setNewFood({ ...newFood, protein: e.target.value })}
                  placeholder="Protein (g)"
                  disabled={!isCurrentDate}
                  className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-smooth backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                />
                <input
                  type="number"
                  step="0.1"
                  value={newFood.carbs}
                  onChange={(e) => setNewFood({ ...newFood, carbs: e.target.value })}
                  placeholder="Carbs (g)"
                  disabled={!isCurrentDate}
                  className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-smooth backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                />
                <input
                  type="number"
                  step="0.1"
                  value={newFood.fats}
                  onChange={(e) => setNewFood({ ...newFood, fats: e.target.value })}
                  placeholder="Fats (g)"
                  disabled={!isCurrentDate}
                  className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-smooth backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                />
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={addFood}
                className="flex-1 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-bounce shadow-lg shadow-indigo-500/30"
              >
                Add Food
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewFood({ name: "", calories: "", category: "Breakfast", protein: "", carbs: "", fats: "" });
                }}
                className="flex-1 py-2 bg-white/10 text-slate-300 rounded-lg hover:bg-white/20 transition-smooth backdrop-blur-sm border border-white/20"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Food Table grouped by meal type */}
      <div className="space-y-4 flex-1 overflow-y-auto">
        {Object.keys(groupedFoods).length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            No food logged for {selectedDate}
          </div>
        ) : (
          Object.entries(groupedFoods).map(([category, categoryFoods]) => (
            <div key={category} className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
              <div className={`p-3 bg-gradient-to-r ${getCategoryColor(category)} bg-opacity-20`}>
                <h3 className="font-semibold text-white text-lg">{category}</h3>
                <p className="text-sm text-slate-200">
                  {categoryFoods.reduce((sum, food) => sum + food.calories, 0)} calories
                </p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left p-3 text-slate-300 text-sm font-medium">Food</th>
                      <th className="text-right p-3 text-slate-300 text-sm font-medium">Calories</th>
                      <th className="text-right p-3 text-slate-300 text-sm font-medium">Macros</th>
                      <th className="text-right p-3 text-slate-300 text-sm font-medium">Time</th>
                      <th className="text-right p-3 text-slate-300 text-sm font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoryFoods.map((food, index) => (
                      <tr key={food.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="p-3 text-slate-200">{food.name}</td>
                        <td className="p-3 text-right text-indigo-400 font-medium">{food.calories}</td>
                        <td className="p-3 text-right text-slate-400 text-xs">
                          {food.macros && (food.macros.protein || food.macros.carbs || food.macros.fats) ? (
                            <div className="space-y-1">
                              {food.macros.protein && <div>P: {food.macros.protein}g</div>}
                              {food.macros.carbs && <div>C: {food.macros.carbs}g</div>}
                              {food.macros.fats && <div>F: {food.macros.fats}g</div>}
                            </div>
                          ) : (
                            <span className="text-slate-600">-</span>
                          )}
                        </td>
                        <td className="p-3 text-right text-slate-400 text-sm">{food.time}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => deleteFood(food.id)}
                            className="p-1 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-smooth opacity-70 hover:opacity-100"
                            title="Delete food entry"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FoodLogger;
