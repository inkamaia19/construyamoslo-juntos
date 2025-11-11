import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Materials from "./pages/Materials";
import Evaluation from "./pages/Evaluation";
import Space from "./pages/Space";
import Interest from "./pages/Interest";
import Results from "./pages/Results";
import NotFound from "./pages/NotFound";
import Activity from "./pages/Activity";
import Child from "./pages/Child";
import Intro from "./pages/Intro";
import Parent from "./pages/Parent";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Intro />} />
          <Route path="/parent" element={<Parent />} />
          <Route path="/child" element={<Child />} />
          <Route path="/materials" element={<Materials />} />
          <Route path="/evaluation" element={<Evaluation />} />
          <Route path="/space" element={<Space />} />
          <Route path="/interest" element={<Interest />} />
          <Route path="/results" element={<Results />} />
          <Route path="/activity/:id" element={<Activity />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;