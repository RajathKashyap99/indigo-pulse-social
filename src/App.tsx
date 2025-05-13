
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Layouts
import MainLayout from "@/components/layout/MainLayout";

// Pages
import FeedPage from "@/pages/FeedPage";
import SignInPage from "@/pages/SignInPage";
import SignUpPage from "@/pages/SignUpPage";
import ProfilePage from "@/pages/ProfilePage";
import ExplorePage from "@/pages/ExplorePage";
import CreatePostPage from "@/pages/CreatePostPage";
import SettingsPage from "@/pages/SettingsPage";
import NotFoundPage from "@/pages/NotFoundPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            
            {/* Protected routes */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<FeedPage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/create" element={<CreatePostPage />} />
              <Route path="/profile/:username" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
            
            {/* Catch all */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
