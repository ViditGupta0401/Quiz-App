// UI components for notifications and tooltips
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";

// API handling setup
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Routing stuff
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import { Quiz } from "./components/Quiz";
import { Layout } from "./components/layout/Layout";
import { Results } from "./components/Results";
import NotFound from "./pages/NotFound";
import { DifficultySelection } from "./components/DifficultySelection";

// Setup React Query for API calls
const queryClient = new QueryClient();

// Main app component with routing and providers
const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark">
      <TooltipProvider>
      {/* Toast notifications for user feedback */}
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Redirect root to quiz page */}
          <Route
            path="/"
            element={
              <Layout>
                <Navigate to="/quiz" replace />
              </Layout>
            }
          />
          {/* Quiz flow: difficulty selection -> quiz */}
          <Route
            path="/quiz"
            element={
              <Layout>
                <Index />
              </Layout>
            }
          />
          <Route
            path="/quiz/:difficulty"
            element={
              <Layout>
                <Quiz />
              </Layout>
            }
          />
          {/* Catch any unknown routes */}
          <Route
            path="*"
            element={
              <Layout>
                <NotFound />
              </Layout>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
