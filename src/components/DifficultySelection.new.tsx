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
    console.log("Selected difficulty:", difficulty);
    onSelect(difficulty);
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary via-primary/50 to-primary/10 flex items-center justify-center">
                <Trophy className="w-14 h-14 text-primary-foreground" />
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-gradient mb-4">Quiz Forge</h1>
          <p className="text-xl text-muted-foreground mb-2">
            Challenge yourself with questions across different difficulty levels
          </p>
          
          {highScore > 0 && (
            <div className="quiz-card inline-block mt-4">
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-1">Your High Score</div>
                <div className="text-2xl font-bold text-primary">{highScore}/10</div>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="quiz-card mb-8">
            <div className="text-center text-destructive">
              <p className="font-medium mb-2">⚠️ Something went wrong</p>
              <p className="text-sm">{error}</p>
              <p className="text-xs mt-2 text-muted-foreground">
                Don't worry, we'll use backup questions!
              </p>
            </div>
          </div>
        )}

        {/* Difficulty Options */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {difficultyOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <Button
                key={option.level}
                variant="ghost"
                className="quiz-card p-8 text-left h-auto relative"
                onClick={() => handleDifficultyClick(option.level)}
                disabled={loading}
              >
                <div className="text-center w-full">
                  <div className="flex justify-center mb-4">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${option.gradient} flex items-center justify-center`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {option.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {option.description}
                  </p>
                  <div className="text-xs text-muted-foreground">
                    10 questions • 30s each
                  </div>
                </div>
              </Button>
            );
          })}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center">
            <div className="quiz-card inline-block">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span className="text-muted-foreground">Loading questions...</span>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="text-center">
          <div className="quiz-card max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-foreground mb-3">How to Play</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>• Answer 10 multiple-choice questions</div>
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
