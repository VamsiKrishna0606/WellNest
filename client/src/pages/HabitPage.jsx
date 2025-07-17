import { useQuery } from "@tanstack/react-query";
import Navigation from "../components/Navigation";
import ChatAssistant from "../components/ChatAssistant";
import VoiceAssistant from "../components/VoiceAssistant";
import HabitTracker from "../components/HabitTracker";

const HabitPage = () => {
  const { data: habits, isLoading } = useQuery({
    queryKey: ["habits"],
    queryFn: () =>
      fetch("http://localhost:5000/api/habits").then((res) => res.json()),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      <Navigation />
      <div className="fixed bottom-6 right-28 z-40">
        <VoiceAssistant />
      </div>
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-100 mb-6">Habits</h1>

        {isLoading ? (
          <p className="text-white">Loading habits...</p>
        ) : (
          <HabitTracker apiHabits={habits} />
        )}
      </div>
      <ChatAssistant />
    </div>
  );
};

export default HabitPage;
