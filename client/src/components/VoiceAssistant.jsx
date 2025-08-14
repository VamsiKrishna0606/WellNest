// ✅ Updated VoiceAssistant.jsx
import { useEffect, useRef, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

const VoiceAssistant = ({ onTextCaptured }) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onTextCaptured(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onnomatch = () => {
      console.warn("Speech not recognized.");
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, [onTextCaptured]);

  useEffect(() => {
    if (isListening) {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      recognitionRef.current?.start();
    } else {
      recognitionRef.current?.stop();
    }
  }, [isListening]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => setIsListening((prev) => !prev)}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-bounce neon-glow floating-element ${
              isListening
                ? "bg-gradient-to-r from-indigo-600 to-blue-600 animate-pulse scale-110"
                : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
            }`}
          >
            <svg
              className={`w-8 h-8 text-white transition-transform duration-300 ${
                isListening ? "scale-110" : ""
              }`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
            </svg>
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Hey Buddy! Speak Now</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default VoiceAssistant;