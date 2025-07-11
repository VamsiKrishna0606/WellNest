
const GoalAnalytics = () => {
  const goals = [
    { name: "Drink Water", progress: 100, color: "from-blue-500 to-indigo-500", shadowColor: "shadow-blue-500/40" },
    { name: "Exercise", progress: 80, color: "from-indigo-500 to-blue-500", shadowColor: "shadow-indigo-500/40" },
    { name: "Eat Less Sugar", progress: 50, color: "from-slate-500 to-slate-400", shadowColor: "shadow-slate-500/40" },
  ];

  return (
    <div className="glass-card hover:shadow-indigo-500/20 transition-smooth slide-in p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6 gradient-text-light">Goal Analytics</h2>
      
      <div className="space-y-4 sm:space-y-6">
        {goals.map((goal, index) => (
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
      
      <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/20">
        <div className="flex justify-between text-xs sm:text-sm">
          {[0, 20, 40, 60, 80, 100].map((value, index) => (
            <span 
              key={value}
              className="text-slate-300 transition-all duration-300 hover:text-indigo-400 floating-element"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {value}%
            </span>
          ))}
        </div>
      </div>

      <style>
        {`
          @keyframes progressSlide-100 {
            from { width: 0%; opacity: 0.5; }
            to { width: 100%; opacity: 1; }
          }
          @keyframes progressSlide-80 {
            from { width: 0%; opacity: 0.5; }
            to { width: 80%; opacity: 1; }
          }
          @keyframes progressSlide-50 {
            from { width: 0%; opacity: 0.5; }
            to { width: 50%; opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default GoalAnalytics;
