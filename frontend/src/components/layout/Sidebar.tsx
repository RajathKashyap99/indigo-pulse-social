
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import {
  LogOut,
  Home,
  PlusSquare,
  Search,
  Settings,
  User,
} from "lucide-react";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if mobile on resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);
  
  // Hide on mobile as we use bottom nav instead
  if (isMobile) return null;
  
  return (
    <div className="w-20 md:w-64 h-screen sticky top-0 border-r border-border flex flex-col justify-between">
      {/* Logo */}
      <div className="p-4 flex justify-center md:justify-start">
        <NavLink to="/" className="text-xl font-bold text-gradient">
          <span className="hidden md:block">Social App</span>
          <span className="md:hidden">S</span>
        </NavLink>
      </div>
      
      {/* Navigation */}
      <nav className="flex flex-col gap-2 p-4 flex-1">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-md transition-colors ${
              isActive
                ? "bg-primary/10 text-primary hover:bg-primary/20"
                : "hover:bg-muted"
            }`
          }
        >
          <Home size={20} />
          <span className="hidden md:block">Home</span>
        </NavLink>
        
        <NavLink
          to="/explore"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-md transition-colors ${
              isActive
                ? "bg-primary/10 text-primary hover:bg-primary/20"
                : "hover:bg-muted"
            }`
          }
        >
          <Search size={20} />
          <span className="hidden md:block">Explore</span>
        </NavLink>
        
        <NavLink
          to="/create"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-md transition-colors ${
              isActive
                ? "bg-primary/10 text-primary hover:bg-primary/20"
                : "hover:bg-muted"
            }`
          }
        >
          <PlusSquare size={20} />
          <span className="hidden md:block">Create</span>
        </NavLink>
        
        <NavLink
          to={`/profile/${user?.username}`}
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-md transition-colors ${
              isActive
                ? "bg-primary/10 text-primary hover:bg-primary/20"
                : "hover:bg-muted"
            }`
          }
        >
          <User size={20} />
          <span className="hidden md:block">Profile</span>
        </NavLink>
        
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-md transition-colors ${
              isActive
                ? "bg-primary/10 text-primary hover:bg-primary/20"
                : "hover:bg-muted"
            }`
          }
        >
          <Settings size={20} />
          <span className="hidden md:block">Settings</span>
        </NavLink>
      </nav>
      
      {/* User & Logout */}
      <div className="border-t border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>
                {user?.name?.charAt(0) || user?.username?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:block">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">@{user?.username}</p>
            </div>
          </div>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="text-muted-foreground hover:text-destructive"
              >
                <LogOut size={18} />
                <span className="sr-only">Log out</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Log out</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
