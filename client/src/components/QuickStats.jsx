import { useQuery } from "@tanstack/react-query";

const QuickStats = () => {
  const { data: habits } = useQuery({
    queryKey: ["habits"],
    queryFn: () =>
      fetch("http://localhost:5000/api/habits").then((res) => res.json()),
  });

  // Get unique habit dates
  const habitDates =
    habits?.map((h) => h.date).filter((value, index, self) => self.indexOf(value) === index) || [];

  // Sort dates descending
  const sortedDates = habitDates.sort((a, b) => new Date(b) - new Date(a));

  // Calculate streak
  let streak = 0;
  let today = new Date();
  for (let i = 0; i < sortedDates.length; i++) {
    const date = new Date(sortedDates[i]);
    if (
      date.toDateString() === today.toDateString()
    ) {
      streak++;
      today.setDate(today.getDate() - 1);
    } else {
      break;
    }
  }

  return (
    <div className="glass-card hover:shadow-indigo-500/20 transition-all duration-300 p-4 sm:p-6 h-full flex flex-col">
      <h2 className="text-xl sm:text-2xl font-semibold text-white mb-6 gradient-text-light">
        Quick Stats
      </h2>
      <div className="grid grid-cols-2 gap-4 flex-1 content-center">
        <div className="flex flex-col justify-center items-center p-4 bg-white/5 rounded-xl border border-white/10 h-full">
          <div className="text-2xl sm:text-3xl font-bold text-indigo-400 mb-2">{streak}</div>
          <div className="text-slate-300 text-sm text-center">Day Streak</div>
        </div>
        <div className="flex flex-col justify-center items-center p-4 bg-white/5 rounded-xl border border-white/10 h-full">
          <div className="text-2xl sm:text-3xl font-bold text-indigo-400 mb-2">50%</div>
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
  );
};

export default QuickStats;
