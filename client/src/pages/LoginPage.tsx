import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Trigger mic permission on mount (optional)
    navigator.mediaDevices?.getUserMedia({ audio: true }).catch((err) => {
      console.warn("Mic permission denied or blocked", err);
    });
  }, []);

  const handleLogin = async () => {
    try {
      await login('user@example.com', 'password');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-bl from-[#0a0a23] to-[#081e40] relative overflow-hidden">
      {/* Background snowfall particles */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {[...Array(50)].map((_, i) => {
          const size = Math.random() * 12 + 8;
          const initialX = Math.random() * 100;
          const drift = (Math.random() - 0.5) * 200;
          const duration = Math.random() * 8 + 12;
          const delay = Math.random() * 20;
          
          return (
            <div
              key={i}
              className="absolute rounded-full bg-blue-300 blur-sm floating-particle"
              style={{
                top: '-10vh',
                left: `${initialX}%`,
                width: `${size}px`,
                height: `${size}px`,
                '--drift': `${drift}px`,
                '--duration': `${duration}s`,
                animationDelay: `${delay}s`,
              } as React.CSSProperties}
            />
          );
        })}
      </div>

      {/* Login Card */}
      <div className="relative z-10 flex flex-col items-center px-6 py-10 w-full max-w-md bg-white/5 backdrop-blur-lg rounded-xl shadow-2xl border border-white/10 text-white space-y-6">
        {/* Title + Logo */}
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white/90 tracking-wide">
            Welcome back to
          </h2>
          <img
            src="/lovable-uploads/43a003c2-6604-48a3-a47f-55bed5f141a8.png"
            alt="WellNest"
            className="w-48 mx-auto mt-4 drop-shadow-md"
          />
        </div>

        {/* Login form */}
        <div className="w-full space-y-4">
          <div>
            <label className="block text-sm text-white/70">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 rounded-md bg-white/10 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-white/70">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full p-3 pr-10 rounded-md bg-white/10 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-500 py-3 rounded-md text-lg font-semibold hover:brightness-110 transition"
          >
            Sign In
          </button>

          {/* Google Sign-in */}
          <button className="w-full flex items-center justify-center gap-2 border border-white/20 bg-white/5 py-2 rounded-md hover:bg-white/10 transition">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            <span className="text-white/90 text-sm">Sign in with Google</span>
          </button>
        </div>

        {/* Footer */}
        <div className="text-sm text-white/60 pt-2">
          <p className="inline-block mr-3 hover:underline cursor-pointer">
            Forgot password?
          </p>
          <p className="inline-block hover:underline cursor-pointer">
            New here? <span className="text-blue-400">Sign up</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;