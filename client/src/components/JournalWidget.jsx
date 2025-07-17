import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Calendar, X } from "lucide-react";

const JournalWidget = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [newEntry, setNewEntry] = useState("");

  const { data: journals, refetch, isLoading } = useQuery({
    queryKey: ["journals"],
    queryFn: () =>
      fetch("http://localhost:5000/api/journals").then((res) => res.json()),
  });

  const addJournalMutation = useMutation({
    mutationFn: (journalData) =>
      fetch("http://localhost:5000/api/journals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(journalData),
      }),
    onSuccess: () => refetch(),
  });

  const deleteJournalMutation = useMutation({
    mutationFn: (id) =>
      fetch(`http://localhost:5000/api/journals/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => refetch(),
  });

  const currentJournals =
    journals?.filter((j) => j.date === selectedDate) || [];
  const isCurrentDate = selectedDate === new Date().toISOString().split("T")[0];

  const addJournal = () => {
    if (!newEntry.trim()) return;
    addJournalMutation.mutate({
      title: "Daily Note",
      content: newEntry,
      date: selectedDate,
    });
    setNewEntry("");
  };

  const deleteJournal = (id) => {
    deleteJournalMutation.mutate(id);
  };

  return (
    <div className="glass-card hover:shadow-indigo-500/20 transition-smooth slide-in p-4 sm:p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white gradient-text-light">
          Journal
        </h2>
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

      <div className="flex flex-col gap-3 mb-4">
        <textarea
          value={newEntry}
          onChange={(e) => setNewEntry(e.target.value)}
          placeholder="Write something for today..."
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white resize-none"
          rows="4"
        />
        <button
          onClick={addJournal}
          disabled={!isCurrentDate}
          className="py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg"
        >
          {isCurrentDate ? "Add Entry" : "Can only add on current date"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {isLoading ? (
          <p className="text-slate-400">Loading...</p>
        ) : currentJournals.length === 0 ? (
          <div className="text-center text-slate-400">
            No entries for {selectedDate}
          </div>
        ) : (
          currentJournals.map((j) => (
            <div
              key={j._id}
              className="bg-white/5 rounded-lg border border-white/10 p-3 flex justify-between items-start"
            >
              <p className="text-slate-200">{j.content}</p>
              <button
                onClick={() => deleteJournal(j._id)}
                className="ml-2 p-1 rounded-lg text-red-400 hover:text-red-300"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default JournalWidget;
