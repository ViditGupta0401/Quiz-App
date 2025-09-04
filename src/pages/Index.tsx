import { useNavigate } from 'react-router-dom';
import { DifficultySelection } from '@/components/DifficultySelection';
import type { Difficulty } from '@/components/Quiz';

const Index = () => {
  const navigate = useNavigate();

  const handleDifficultySelect = (difficulty: Difficulty) => {
    console.log("Starting quiz with difficulty:", difficulty);
    localStorage.setItem('selected-difficulty', difficulty);
    // Force navigation to the quiz route with the selected difficulty
    window.location.href = `/quiz/${difficulty}`;
  };

  return (
    <DifficultySelection
      onSelect={handleDifficultySelect}
      loading={false}
      error={null}
      highScore={Number(localStorage.getItem('quiz-high-score') || '0')}
    />
  );
};

export default Index;
