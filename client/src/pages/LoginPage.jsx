
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    // For now, just log them in after signup
    await login(email, password);
  };

  const handleGoogleSignIn = () => {
    // Simulate Google OAuth - in a real app, this would integrate with Google OAuth
    console.log("Google Sign-In clicked - would integrate with Google OAuth");
    // For demo purposes, we'll just log them in
    login("google-user@example.com", "google-oauth");
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
        
        {/* Floating Geometric Shapes */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`shape-${i}`}
            className={`absolute opacity-10 ${
              i % 3 === 0 
                ? 'w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full' 
                : i % 3 === 1 
                ? 'w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rotate-45'
                : 'w-8 h-8 bg-gradient-to-br from-indigo-400 to-blue-400 rounded-sm rotate-12'
            }`}
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              animation: `float ${4 + Math.random() * 4}s ease-in-out infinite ${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md relative z-10">
        <div className="glass-card p-8 shadow-2xl shadow-indigo-500/20 border border-white/20 backdrop-blur-xl">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-indigo-500/40 floating-element">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
              </svg>
            </div>
            <h1 className="text-4xl font-bold gradient-text-light mb-2">WellNest</h1>
            <p className="text-slate-400 text-lg">Your wellness journey starts here</p>
          </div>

          {/* Login/Signup Form */}
          {!isSignUp ? (
            /* Login Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-smooth backdrop-blur-sm"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-smooth backdrop-blur-sm"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-bounce shadow-2xl shadow-indigo-500/40 neon-glow"
              >
                Sign In to WellNest
              </button>

              {/* Divider */}
              <div className="relative flex items-center justify-center my-6">
                <div className="border-t border-white/20 w-full"></div>
                <span className="bg-slate-950 px-4 text-slate-400 text-sm">or</span>
                <div className="border-t border-white/20 w-full"></div>
              </div>

              {/* Google Sign-In Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full py-3 px-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl border border-gray-300 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Sign in with Google</span>
              </button>

              {/* Additional Options */}
              <div className="flex items-center justify-between text-sm mt-6">
                <a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">
                  Forgot password?
                </a>
                <button
                  type="button"
                  onClick={toggleForm}
                  className="text-slate-400 hover:text-indigo-400 transition-colors"
                >
                  Create account
                </button>
              </div>
            </form>
          ) : (
            /* Signup Form */
            <form onSubmit={handleSignUpSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-smooth backdrop-blur-sm"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-smooth backdrop-blur-sm"
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-smooth backdrop-blur-sm"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-bounce shadow-2xl shadow-indigo-500/40 neon-glow"
              >
                Sign Up to WellNest
              </button>

              {/* Sign In Link */}
              <div className="text-center text-sm mt-6">
                <span className="text-slate-400">Already have an account? </span>
                <button
                  type="button"
                  onClick={toggleForm}
                  className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
                >
                  Sign In
                </button>
              </div>
            </form>
          )}

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
            <p className="text-slate-300 text-sm text-center mb-2">Demo Credentials:</p>
            <p className="text-slate-400 text-xs text-center">
              Use any email and password, or click Google Sign-In
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-gradient-to-br from-indigo-500/30 to-blue-500/30 rounded-full blur-xl"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-full blur-2xl"></div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(5deg); }
          50% { transform: translateY(-20px) rotate(0deg); }
          75% { transform: translateY(-10px) rotate(-5deg); }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
