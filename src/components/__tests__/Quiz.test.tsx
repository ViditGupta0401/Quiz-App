import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Quiz } from '../Quiz';
import { QuizProvider } from '@/contexts/QuizContext';
import { MemoryRouter } from 'react-router-dom';

// Mock fetch globally
global.fetch = jest.fn();

describe('Quiz Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  const renderQuiz = () => {
    return render(
      <MemoryRouter>
        <QuizProvider>
          <Quiz />
        </QuizProvider>
      </MemoryRouter>
    );
  };

  test('shows loading state initially', () => {
    renderQuiz();
    expect(screen.getByText(/Loading questions/i)).toBeInTheDocument();
  });

  test('handles offline scenario', () => {
    // Mock offline status
    Object.defineProperty(navigator, 'onLine', { value: false });
    renderQuiz();
    expect(screen.getByText(/No internet connection/i)).toBeInTheDocument();
  });

  test('prevents progression without selection', async () => {
    renderQuiz();
    const nextButton = await screen.findByText(/Next/i);
    fireEvent.click(nextButton);
    expect(screen.getByText(/Please select an answer/i)).toBeInTheDocument();
  });

  test('shows timer and updates it', async () => {
    renderQuiz();
    await waitFor(() => {
      expect(screen.getByText(/30/)).toBeInTheDocument();
    });
    // Wait for timer to update
    await waitFor(() => {
      expect(screen.getByText(/29/)).toBeInTheDocument();
    }, { timeout: 1100 });
  });

  test('maintains high score in localStorage', async () => {
    localStorage.setItem('quiz-high-score', '5');
    renderQuiz();
    expect(await screen.findByText(/High Score: 5/i)).toBeInTheDocument();
  });

  test('handles answer selection', async () => {
    renderQuiz();
    const answers = await screen.findAllByRole('button');
    const firstAnswer = answers[0];
    fireEvent.click(firstAnswer);
    expect(firstAnswer).toHaveClass('selected');
  });

  test('shows results after completing quiz', async () => {
    renderQuiz();
    // Complete the quiz by answering all questions
    for (let i = 0; i < 10; i++) {
      const answers = await screen.findAllByRole('button');
      fireEvent.click(answers[0]);
      const nextButton = screen.getByText(/Next/i);
      fireEvent.click(nextButton);
    }
    expect(screen.getByText(/Quiz Results/i)).toBeInTheDocument();
  });
});
