import React from 'react';
import { Button } from '@/components/ui/button';
import { Brain, Zap, Flame, Trophy } from 'lucide-react';

type Difficulty = 'easy' | 'medium' | 'hard';

interface DifficultySelectionProps {
  onSelect: (difficulty: Difficulty) => void;
  loading: boolean;
  error: string | null;
  highScore: number;
}

const difficultyOptions = [
  {
    level: 'easy' as Difficulty,
    title: 'Easy',
    description: 'Perfect for beginners',
    icon: Brain,
    color: 'success',
    gradient: 'from-green-400 to-emerald-500'
  },
  {
    level: 'medium' as Difficulty,
    title: 'Medium',
    description: 'Test your knowledge',
    icon: Zap,
    color: 'primary',
    gradient: 'from-blue-400 to-purple-500'
  },
  {
    level: 'hard' as Difficulty,
    title: 'Hard',
    description: 'For the brave souls',
    icon: Flame,
    color: 'destructive',
    gradient: 'from-red-400 to-pink-500'
  }
];

export const DifficultySelection: React.FC<DifficultySelectionProps> = ({
  onSelect,
  loading,
  error,
  highScore,
}) => {
  const handleDifficultyClick = (difficulty: Difficulty) => {
    console.log('Starting quiz with difficulty:', difficulty);
    // Call the parent's onSelect handler to start the quiz and prevent any race conditions
    setTimeout(() => {
      onSelect(difficulty);
    }, 0);
  };
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center py-8 px-4">
      {/* Animated background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background animate-gradient"></div>
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      
      {/* Floating orbs background effect */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full blur-3xl opacity-30"
            style={{
              background: `radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)`,
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
      
      <div className="max-w-4xl w-full relative">
        {/* Header */}
        <div className="text-center mb-12 fade-in">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-primary/10 blur-2xl rounded-full animate-pulse"></div>
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary via-primary/50 to-primary/10 flex items-center justify-center transform hover:scale-110 transition-transform duration-300 cursor-pointer backdrop-blur-lg relative">
                <Trophy className="w-14 h-14 text-primary-foreground results-icon" />
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-6 animate-in zoom-in py-2">Quiz Forge</h1>
          <div className="relative max-w-2xl mx-auto">
            <p className="text-lg md:text-xl text-muted-foreground mb-4 animate-in fade-in-50 leading-relaxed">
              Challenge yourself with questions across different difficulty levels
            </p>
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 blur opacity-0 group-hover:opacity-100 animate-shine"></div>
          </div>
          
          {highScore > 0 && (
            <div className="quiz-card inline-block mt-4">
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-1">Your High Score</div>
                <div className="text-2xl font-bold text-primary">{highScore}/5</div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Error Message */}
        {error && (
          <div className="quiz-card mb-8 slide-up" role="alert" aria-live="polite">
            <div className="text-center text-destructive">
              <div className="flex items-center justify-center mb-3">
                <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center mr-3">
                  <span className="text-destructive text-lg">⚠️</span>
                </div>
                <p className="font-medium text-lg">Connection Issue</p>
              </div>
              <p className="text-sm mb-3">{error}</p>
              <div className="bg-muted/20 rounded-lg p-3 mb-3">
                <p className="text-xs text-muted-foreground mb-2">
                  <strong>What we're doing:</strong>
                </p>
                <ul className="text-xs text-muted-foreground space-y-1 text-left">
                  <li>• Using backup questions to keep the quiz running</li>
                  <li>• Your progress will be saved normally</li>
                  <li>• Try refreshing if issues persist</li>
                </ul>
              </div>
              <button 
                onClick={() => window.location.reload()}
                className="text-xs text-primary hover:text-primary/80 underline transition-colors"
                aria-label="Refresh page to retry connection"
              >
                Refresh page to retry
              </button>
            </div>
          </div>
        )}

        {/* Difficulty Options */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="relative p-6 rounded-xl bg-[#22c55e]/10 backdrop-blur-sm">
            <div className="mb-4 flex justify-center">
              <div className="w-16 h-16 rounded-full bg-[#22c55e] flex items-center justify-center">
                <Brain className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-[#22c55e] text-center mb-2">Easy</h3>
            <p className="text-center text-gray-400 mb-4">Perfect for beginners</p>
            <div className="text-center text-sm text-gray-400 mb-4">5 questions • 30s each</div>
            <button 
              onClick={() => handleDifficultyClick('easy')}
              disabled={loading}
              className="w-full py-2 px-4 rounded-lg bg-[#111827] text-[#22c55e] hover:bg-[#22c55e]/20 transition-colors flex items-center justify-center gap-2"
            >
              Start Quiz
              <span>→</span>
            </button>
          </div>

          <div className="relative p-6 rounded-xl bg-[#6366f1]/10 backdrop-blur-sm">
            <div className="mb-4 flex justify-center">
              <div className="w-16 h-16 rounded-full bg-[#6366f1] flex items-center justify-center">
                <Zap className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-[#6366f1] text-center mb-2">Medium</h3>
            <p className="text-center text-gray-400 mb-4">Test your knowledge</p>
            <div className="text-center text-sm text-gray-400 mb-4">5 questions • 30s each</div>
            <button 
              onClick={() => handleDifficultyClick('medium')}
              disabled={loading}
              className="w-full py-2 px-4 rounded-lg bg-[#111827] text-[#6366f1] hover:bg-[#6366f1]/20 transition-colors flex items-center justify-center gap-2"
            >
              Start Quiz
              <span>→</span>
            </button>
          </div>

          <div className="relative p-6 rounded-xl bg-[#ef4444]/10 backdrop-blur-sm">
            <div className="mb-4 flex justify-center">
              <div className="w-16 h-16 rounded-full bg-[#ef4444] flex items-center justify-center">
                <Flame className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-[#ef4444] text-center mb-2">Hard</h3>
            <p className="text-center text-gray-400 mb-4">For the brave souls</p>
            <div className="text-center text-sm text-gray-400 mb-4">5 questions • 30s each</div>
            <button 
              onClick={() => handleDifficultyClick('hard')}
              disabled={loading}
              className="w-full py-2 px-4 rounded-lg bg-[#111827] text-[#ef4444] hover:bg-[#ef4444]/20 transition-colors flex items-center justify-center gap-2"
            >
              Start Quiz
              <span>→</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center slide-up">
            <div className="quiz-card inline-block">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span className="text-muted-foreground">Loading questions...</span>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="text-center slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="quiz-card max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-foreground mb-3">How to Play</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>• Answer 5 multiple-choice questions</div>
              <div>• Each question has a 30-second timer</div>
              <div>• Navigate back to change answers</div>
              <div>• Skip questions if needed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};