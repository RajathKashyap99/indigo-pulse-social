
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Bell, Home, LogOut, MessageCircle, Plus, Search, Settings, User, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { icon: Home, label: "Feed", path: "/" },
  { icon: Search, label: "Explore", path: "/explore" },
  { icon: Users, label: "My favorites", path: "/favorites" },
  { icon: MessageCircle, label: "Direct", path: "/direct" },
  { icon: Bell, label: "Notifications", path: "/notifications" },
  { icon: Settings, label: "Settings", path: "/settings" }
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  if (!user) return null;
  
  return (
    <aside className="w-64 border-r border-border h-screen sticky top-0 hidden md:flex flex-col">
      <div className="p-4">
        <h1 className="text-xl font-bold text-gradient-primary">Social Media</h1>
      </div>
      
      <div className="mt-8 p-2 flex-1">
        <div className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                location.pathname === item.path
                  ? "bg-social-900 text-social-100"
                  : "text-muted-foreground hover:bg-social-900/20 hover:text-social-100"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
        
        <div className="mt-6">
          <Link
            to="/create"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-social-700 py-2 text-sm font-medium text-white hover:bg-social-800 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Create new post</span>
          </Link>
        </div>
      </div>
      
      <div className="border-t border-border p-4">
        <div className="flex items-center justify-between">
          <Link to={`/profile/${user.username}`} className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-muted overflow-hidden">
              <img
                src={user.avatar || "/placeholder.svg"}
                alt={user.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">@{user.username}</p>
            </div>
          </Link>
          <button
            onClick={logout}
            className="text-muted-foreground hover:text-white transition-colors"
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
