import React from 'react';
import { Github, Heart, Brain, Mail, Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gradient-to-b from-purple-900 to-black mt-auto relative overflow-hidden">
      {/* Decorative top border */}
      <div className="h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full blur-3xl opacity-20"
            style={{
              background: `radial-gradient(circle, rgba(147,51,234,0.3) 0%, transparent 70%)`,
              width: `${Math.random() * 300 + 100}px`,
              height: `${Math.random() * 300 + 100}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 5 + 5}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand Section */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-purple-400" />
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Quiz Forge
              </span>
            </div>
            <p className="text-purple-300/80 text-sm text-center md:text-left">
              Challenge yourself with our interactive quizzes and expand your knowledge.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <h3 className="text-lg font-semibold text-purple-300">Quick Links</h3>
            <div className="flex flex-col items-center md:items-start space-y-2">
              <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors duration-200">About Us</a>
              <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors duration-200">Contact</a>
              <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors duration-200">Privacy Policy</a>
              <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors duration-200">Terms of Service</a>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <h3 className="text-lg font-semibold text-purple-300">Connect With Me</h3>
            <div className="flex flex-col space-y-4">
              <a 
                href="https://github.com/ViditGupta0401" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group flex items-center space-x-3 bg-gradient-to-r from-purple-800/50 to-purple-700/50 hover:from-purple-700/60 hover:to-purple-600/60 px-4 py-3 rounded-lg transition-all duration-300 border border-purple-600/30 hover:border-purple-500/50"
              >
                <div className="bg-purple-800/50 p-2 rounded-lg transform group-hover:scale-110 transition duration-300">
                  <Github className="h-6 w-6 text-purple-200" />
                </div>
                <span className="text-purple-200 font-medium">Follow me on GitHub</span>
                <div className="flex-grow" />
                <div className="transform group-hover:translate-x-1 transition-transform duration-300">
                  →
                </div>
              </a>
              <div className="flex space-x-4">
                <a href="#" className="group">
                  <div className="bg-purple-800/30 p-2 rounded-lg transform group-hover:scale-110 transition duration-300">
                    <Mail className="h-5 w-5 text-purple-300" />
                  </div>
                </a>
                <a 
                  href="https://x.com/Vidit0401" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <div className="bg-purple-800/30 p-2 rounded-lg transform group-hover:scale-110 transition duration-300">
                    <Twitter className="h-5 w-5 text-purple-300" />
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-purple-800/30">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <span className="text-purple-300/80">Made by</span>
              <a
                href="https://github.com/ViditGupta0401"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 transition-colors duration-200"
              >
                Vidit Gupta
              </a>
            </div>
            
            <div className="text-sm text-purple-300/60">
              © {new Date().getFullYear()} Quiz Forge. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
