import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { SessionProvider } from "@/hooks/SessionContext";

// Importa todas tus páginas
import Intro from "./pages/Intro";
import Parent from "./pages/Parent";
import Child from "./pages/Child";
import Materials from "./pages/Materials";
import Evaluation from "./pages/Evaluation";
import Space from "./pages/Space";
import Interest from "./pages/Interest";
import Results from "./pages/Results";
import Activity from "./pages/Activity";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SessionProvider>
          <Routes>
            {/* La ruta raíz ahora es la bienvenida. El splash screen se maneja en el Provider. */}
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
        </SessionProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;