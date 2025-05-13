
import { NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Home, PlusSquare, Search, Settings, User } from "lucide-react";

const MobileNav = () => {
  const { user } = useAuth();
  
  // Only show on mobile
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border md:hidden z-50">
      <nav className="flex justify-around items-center h-16">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 p-2 ${
              isActive ? "text-primary" : "text-muted-foreground"
            }`
          }
        >
          <Home size={20} />
          <span className="text-xs">Home</span>
        </NavLink>
        
        <NavLink
          to="/explore"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 p-2 ${
              isActive ? "text-primary" : "text-muted-foreground"
            }`
          }
        >
          <Search size={20} />
          <span className="text-xs">Explore</span>
        </NavLink>
        
        <NavLink
          to="/create"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 p-2 ${
              isActive ? "text-primary" : "text-muted-foreground"
            }`
          }
        >
          <PlusSquare size={20} />
          <span className="text-xs">Create</span>
        </NavLink>
        
        <NavLink
          to={`/profile/${user?.username}`}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 p-2 ${
              isActive ? "text-primary" : "text-muted-foreground"
            }`
          }
        >
          <User size={20} />
          <span className="text-xs">Profile</span>
        </NavLink>
        
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 p-2 ${
              isActive ? "text-primary" : "text-muted-foreground"
            }`
          }
        >
          <Settings size={20} />
          <span className="text-xs">Settings</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default MobileNav;
