// UI components for notifications and tooltips
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

// API handling setup
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Routing stuff
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import { Quiz } from "./components/Quiz";
import { Results } from "./components/Results";
import NotFound from "./pages/NotFound";
import { DifficultySelection } from "./components/DifficultySelection";

// Setup React Query for API calls
const queryClient = new QueryClient();

// Main app component with routing and providers
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {/* Toast notifications for user feedback */}
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Redirect root to quiz page */}
          <Route path="/" element={<Navigate to="/quiz" replace />} />
          {/* Quiz flow: difficulty selection -> quiz -> results */}
          <Route path="/quiz" element={<DifficultySelection />} />
          <Route path="/quiz/:difficulty" element={<Quiz />} />
          <Route path="/results" element={<Results />} />
          {/* Catch any unknown routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
