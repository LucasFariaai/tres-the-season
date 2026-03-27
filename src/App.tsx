import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SeasonProvider } from "@/lib/seasonContext";
import Index from "./pages/Index.tsx";
import Reserve from "./pages/Reserve.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SeasonProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/reserve" element={<Reserve />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SeasonProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
