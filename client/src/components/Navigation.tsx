
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  
  const getCurrentTab = () => {
    const path = location.pathname;
    if (path === "/dashboard") return "dashboard";
    if (path === "/habit") return "habit";
    if (path === "/food") return "food";
    if (path === "/analytics") return "analytics";
    return "dashboard";
  };

  const currentTab = getCurrentTab();

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", path: "/dashboard" },
    { id: "habit", label: "Habits", path: "/habit" },
    { id: "food", label: "Food", path: "/food" },
    { id: "analytics", label: "Analytics", path: "/analytics" },
  ];

  return (
    <nav className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/30 sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
              </svg>
            </div>
            <span className="text-2xl font-bold text-slate-100">WellNest</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  currentTab === item.id
                    ? "text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 shadow-lg shadow-indigo-500/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                {item.label}
              </button>
            ))}
            
            <button 
              onClick={handleLogout}
              className="text-slate-400 hover:text-slate-200 transition-colors px-4 py-2"
            >
              Log Out
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-slate-200 p-2 rounded-lg hover:bg-slate-800/50 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-700/30">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={`block w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                  currentTab === item.id
                    ? "text-indigo-400 bg-indigo-500/10"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                {item.label}
              </button>
            ))}
            <button 
              onClick={handleLogout}
              className="block w-full text-left px-4 py-3 text-slate-400 hover:text-slate-200 transition-colors"
            >
              Log Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
