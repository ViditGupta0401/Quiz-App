import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Github, Home, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="nav-link group flex flex-col items-center"
    >
      <div className="bg-purple-800/50 p-2 rounded-lg transform group-hover:scale-110 transition duration-300">
        {theme === "light" ? (
          <Moon className="h-5 w-5 text-purple-200" />
        ) : (
          <Sun className="h-5 w-5 text-purple-200" />
        )}
      </div>
      <span className="text-xs text-purple-200 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {theme === "light" ? "Dark Mode" : "Light Mode"}
      </span>
    </button>
  );
};

export const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-gradient-to-r from-purple-900 via-violet-900 to-purple-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full blur-md opacity-75 group-hover:opacity-100 transition duration-500"></div>
                <Brain className="h-10 w-10 text-white relative transform group-hover:scale-110 transition duration-300" />
              </div>
              <div>
                <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300 group-hover:from-pink-200 group-hover:to-purple-200 transition duration-300">
                  Quiz Forge
                </span>
                <div className="text-xs text-purple-300/80">Test Your Knowledge</div>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link 
              to="/"
              className="nav-link group flex flex-col items-center"
            >
              <div className="bg-purple-800/50 p-2 rounded-lg transform group-hover:scale-110 transition duration-300">
                <Home className="h-5 w-5 text-purple-200" />
              </div>
              <span className="text-xs text-purple-200 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Home</span>
            </Link>

            <a 
              href="https://github.com/ViditGupta0401/Quiz-App" 
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link group flex flex-col items-center"
            >
              <div className="bg-purple-800/50 p-2 rounded-lg transform group-hover:scale-110 transition duration-300">
                <Github className="h-5 w-5 text-purple-200" />
              </div>
              <span className="text-xs text-purple-200 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">GitHub</span>
            </a>

            <ThemeToggle />
          </div>
        </div>
      </div>
      
      {/* Decorative bottom border */}
      <div className="h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
    </nav>
  );
};
