
import { Button } from "@/components/ui/button";
import { api } from "@/services/api";
import { User } from "@/types";
import { useEffect, useState } from "react";
import { Loader, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Link } from "react-router-dom";

interface SuggestedUserItemProps {
  user: User;
}

const SuggestedUserItem = ({ user }: SuggestedUserItemProps) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleFollow = async () => {
    setIsLoading(true);
    
    try {
      if (isFollowing) {
        await api.users.unfollowUser(user._id);
      } else {
        await api.users.followUser(user._id);
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Error following user:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex items-center justify-between py-2">
      <Link to={`/profile/${user.username}`} className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        
        <div>
          <h3 className="font-medium text-sm">{user.name}</h3>
          <p className="text-xs text-muted-foreground">
            {user.location}
          </p>
        </div>
      </Link>
      
      <Button
        variant={isFollowing ? "outline" : "default"}
        size="sm"
        className={isFollowing ? "border-social-600 text-social-400" : "bg-social-700 hover:bg-social-800"}
        onClick={handleFollow}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : isFollowing ? (
          "Following"
        ) : (
          <>
            <UserPlus className="h-4 w-4 mr-1" />
            Follow
          </>
        )}
      </Button>
    </div>
  );
};

const SuggestedUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      setIsLoading(true);
      try {
        const result = await api.users.getSuggestedUsers();
        setUsers(result);
      } catch (error) {
        console.error("Error fetching suggested users:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSuggestedUsers();
  }, []);
  
  if (isLoading) {
    return (
      <div className="p-4 rounded-xl bg-card animate-pulse">
        <h2 className="text-lg font-medium mb-4">Suggestions for you</h2>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-muted"></div>
              <div className="space-y-2">
                <div className="h-4 w-24 bg-muted rounded"></div>
                <div className="h-3 w-20 bg-muted rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-4 rounded-xl bg-card">
      <h2 className="text-lg font-medium mb-4">Suggestions for you</h2>
      
      <div className="space-y-2">
        {users.map((user) => (
          <SuggestedUserItem key={user._id} user={user} />
        ))}
      </div>
      
      <div className="mt-4">
        <Link to="/explore" className="text-sm text-social-400 hover:text-social-300 transition-colors">
          View more suggestions
        </Link>
      </div>
    </div>
  );
};

export default SuggestedUsers;
