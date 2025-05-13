
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Bell, Home, Plus, Search, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Search, label: "Search", path: "/explore" },
  { icon: Plus, label: "Create", path: "/create" },
  { icon: Bell, label: "Notifications", path: "/notifications" },
];

const MobileNav = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  if (!user) return null;
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-background/80 backdrop-blur-md z-50">
      <nav className="flex items-center justify-around p-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center gap-1 px-3 py-2 text-xs",
              location.pathname === item.path
                ? "text-social-400"
                : "text-muted-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        ))}
        
        <Link
          to={`/profile/${user.username}`}
          className={cn(
            "flex flex-col items-center justify-center gap-1 px-3 py-2 text-xs",
            location.pathname.includes(`/profile/${user.username}`)
              ? "text-social-400"
              : "text-muted-foreground"
          )}
        >
          <div className="h-5 w-5 rounded-full overflow-hidden">
            <img 
              src={user.avatar || "/placeholder.svg"}
              alt={user.name}
              className="h-full w-full object-cover"
            />
          </div>
          <span>Profile</span>
        </Link>
      </nav>
    </div>
  );
};

export default MobileNav;
