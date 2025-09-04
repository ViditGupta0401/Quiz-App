import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background animate-gradient"></div>
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      
      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full blur-xl opacity-20"
          style={{
            background: `radial-gradient(circle, hsl(var(--destructive)) 0%, transparent 70%)`,
            width: `${Math.random() * 200 + 50}px`,
            height: `${Math.random() * 200 + 50}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${Math.random() * 5 + 5}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`
          }}
        />
      ))}

      <div className="relative text-center">
        <h1 className="text-[150px] font-bold text-gradient animate-in zoom-in mb-4">404</h1>
        <div className="quiz-card p-8 backdrop-blur-lg animate-in fade-in-50">
          <p className="text-2xl text-foreground mb-6">Oops! This page seems to be lost in space</p>
          <div className="flex justify-center">
            <a 
              href="/" 
              className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-primary-glow text-primary-foreground hover:scale-105 transition-transform duration-300 glow"
            >
              <svg 
                className="w-5 h-5 mr-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Return to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
