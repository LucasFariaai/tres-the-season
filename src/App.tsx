import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SeasonProvider } from "@/lib/seasonContext";
import Index from "./pages/Index.tsx";
import Admin from "./pages/Admin.tsx";
import LegacyMenu from "./pages/LegacyMenu.tsx";
import Reserve from "./pages/Reserve.tsx";
import WineList from "./pages/WineList.tsx";
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
            <Route path="/admin" element={<Admin />} />
            <Route path="/menu-legacy" element={<LegacyMenu />} />
            <Route path="/reserve" element={<Reserve />} />
            <Route path="/wine-list" element={<WineList />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SeasonProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
