
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={toggleListening}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-bounce neon-glow floating-element ${
              isListening
                ? "bg-gradient-to-r from-indigo-600 to-blue-600 shadow-2xl shadow-indigo-500/50 animate-pulse scale-110"
                : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-2xl shadow-indigo-500/40"
            }`}
            style={{
              animation: isListening ? 'pulse 1.5s infinite, float 3s ease-in-out infinite' : 'float 4s ease-in-out infinite'
            }}
          >
            <svg 
              className={`w-8 h-8 text-white transition-transform duration-300 ${isListening ? 'scale-110' : ''}`} 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
            </svg>
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Hey Buddy!</p>
        </TooltipContent>
      </Tooltip>
      
      {isListening && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 flex justify-center space-x-1">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-1 h-4 bg-gradient-to-t from-indigo-500 to-blue-400 rounded-full animate-pulse"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>
      )}
    </TooltipProvider>
  );
};

export default VoiceAssistant;
