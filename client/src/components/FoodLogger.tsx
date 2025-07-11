
import { useState } from "react";
import { Plus, X, Utensils } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FoodLogger = () => {
  const [meals, setMeals] = useState([
    { name: "Breakfast", items: ["Banana - 105 cal", "Oatmeal - 250 cal"] },
    { name: "Lunch", items: ["Grilled Chicken - 220 cal"] },
  ]);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMeal, setNewMeal] = useState({
    mealType: "Breakfast",
    foodItem: "",
    calories: ""
  });
  
  const { toast } = useToast();

  const handleAddMeal = () => {
    if (!newMeal.foodItem || !newMeal.calories) {
      toast({
        title: "Missing Information",
        description: "Please fill in both food item and calories.",
        variant: "destructive",
      });
      return;
    }

    const newItem = `${newMeal.foodItem} - ${newMeal.calories} cal`;
    const existingMealIndex = meals.findIndex(meal => meal.name === newMeal.mealType);
    
    if (existingMealIndex >= 0) {
      const updatedMeals = [...meals];
      updatedMeals[existingMealIndex].items.push(newItem);
      setMeals(updatedMeals);
    } else {
      setMeals([...meals, { name: newMeal.mealType, items: [newItem] }]);
    }

    setNewMeal({ mealType: "Breakfast", foodItem: "", calories: "" });
    setShowAddForm(false);
    
    toast({
      title: "Meal Added!",
      description: `Added ${newMeal.foodItem} to ${newMeal.mealType}`,
    });
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setNewMeal({ mealType: "Breakfast", foodItem: "", calories: "" });
  };

  return (
    <div className="glass-card hover:shadow-indigo-500/20 transition-smooth p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-white gradient-text-light flex items-center gap-2">
          <Utensils className="w-5 h-5 sm:w-6 sm:h-6" />
          Food Logger
        </h2>
        <div className="text-sm text-slate-400">
          Total: {meals.reduce((total, meal) => 
            total + meal.items.reduce((mealTotal, item) => {
              const calories = parseInt(item.match(/(\d+)\s*cal/)?.[1] || "0");
              return mealTotal + calories;
            }, 0), 0
          )} cal
        </div>
      </div>
      
      <div className="space-y-4 mb-6">
        {meals.map((meal, index) => (
          <div key={index} className="bg-white/5 rounded-xl p-3 sm:p-4 border border-white/10 shadow-sm backdrop-blur-sm">
            <h3 className="text-base sm:text-lg font-medium text-indigo-400 mb-2">{meal.name}</h3>
            <div className="space-y-1">
              {meal.items.map((item, itemIndex) => (
                <div key={itemIndex} className="text-slate-200 text-sm">{item}</div>
              ))}
            </div>
          </div>
        ))}
        
        {showAddForm ? (
          <div className="bg-white/10 rounded-xl p-4 border border-indigo-400/30 shadow-lg backdrop-blur-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium text-white">Add New Meal</h4>
              <button
                onClick={handleCancel}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Meal Type</label>
                <Select value={newMeal.mealType} onValueChange={(value) => setNewMeal({ ...newMeal, mealType: value })}>
                  <SelectTrigger className="w-full bg-slate-900/50 border-indigo-500/30 text-white rounded-xl backdrop-blur-sm hover:border-indigo-400/50 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all duration-200 shadow-lg shadow-indigo-500/10">
                    <SelectValue placeholder="Select meal type" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700/50 rounded-xl shadow-2xl shadow-black/50 backdrop-blur-xl z-50">
                    <SelectItem value="Breakfast" className="text-white hover:bg-indigo-600 hover:text-white focus:bg-indigo-600 focus:text-white rounded-lg transition-all duration-200 data-[highlighted]:bg-indigo-600 data-[highlighted]:text-white">
                      Breakfast
                    </SelectItem>
                    <SelectItem value="Lunch" className="text-white hover:bg-indigo-600 hover:text-white focus:bg-indigo-600 focus:text-white rounded-lg transition-all duration-200 data-[highlighted]:bg-indigo-600 data-[highlighted]:text-white">
                      Lunch
                    </SelectItem>
                    <SelectItem value="Dinner" className="text-white hover:bg-indigo-600 hover:text-white focus:bg-indigo-600 focus:text-white rounded-lg transition-all duration-200 data-[highlighted]:bg-indigo-600 data-[highlighted]:text-white">
                      Dinner
                    </SelectItem>
                    <SelectItem value="Snack" className="text-white hover:bg-indigo-600 hover:text-white focus:bg-indigo-600 focus:text-white rounded-lg transition-all duration-200 data-[highlighted]:bg-indigo-600 data-[highlighted]:text-white">
                      Snack
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Food Item</label>
                <input
                  type="text"
                  value={newMeal.foodItem}
                  onChange={(e) => setNewMeal({ ...newMeal, foodItem: e.target.value })}
                  placeholder="e.g., Apple"
                  className="w-full p-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Calories</label>
                <input
                  type="number"
                  value={newMeal.calories}
                  onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })}
                  placeholder="95"
                  className="w-full p-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 focus:outline-none"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleAddMeal}
                className="flex-1 bg-gradient-to-r from-indigo-500 to-blue-500 text-white py-2 px-4 rounded-lg hover:from-indigo-600 hover:to-blue-600 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Meal
              </button>
              <button
                onClick={handleCancel}
                className="sm:w-auto px-4 py-2 border border-white/30 text-slate-300 rounded-lg hover:bg-white/10 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full py-3 border-2 border-dashed border-white/30 rounded-xl text-slate-300 hover:text-white hover:border-white/50 transition-all duration-200 flex items-center justify-center space-x-2 bg-white/5 backdrop-blur-sm"
          >
            <Plus className="w-5 h-5" />
            <span>Add Meal</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default FoodLogger;
