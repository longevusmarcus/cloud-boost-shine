import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MobileOnly from "@/components/MobileOnly";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useSessionSecurity } from "@/hooks/use-session-security";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Tracking from "./pages/Tracking";
import Analytics from "./pages/Analytics";
import Content from "./pages/Content";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

// Wrapper component to use session security hook
const AppContent = () => {
  useSessionSecurity();
  
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/tracking" element={<Tracking />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/content" element={<Content />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <MobileOnly>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </MobileOnly>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
