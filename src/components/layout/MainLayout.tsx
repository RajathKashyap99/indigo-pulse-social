
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import { Navigate, Outlet } from "react-router-dom";
import { Loader } from "lucide-react";

const MainLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Show loading spinner while checking auth status
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }
  
  // Redirect to sign in if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }
  
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 max-w-full">
        <div className="container h-full max-w-6xl px-4 py-6 md:px-6">
          <Outlet />
        </div>
      </main>
      
      <MobileNav />
    </div>
  );
};

export default MainLayout;
