
import { Button } from "@/components/ui/button";
import { User } from "@/types";
import { useState } from "react";
import { Loader, MapPin, UserPlus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

interface UserProfileHeaderProps {
  user: User;
}

const UserProfileHeader = ({ user }: UserProfileHeaderProps) => {
  const { user: currentUser } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const isOwnProfile = currentUser?._id === user._id;
  
  const handleFollowToggle = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setIsFollowing(!isFollowing);
    setIsLoading(false);
  };
  
  return (
    <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
      <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-muted">
        <img
          src={user.avatar || "/placeholder.svg"}
          alt={user.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="flex-1 text-center md:text-left">
        <h1 className="text-2xl font-bold mb-1">{user.name}</h1>
        
        <p className="text-muted-foreground text-sm mb-3">@{user.username}</p>
        
        {user.location && (
          <div className="flex items-center justify-center md:justify-start gap-1 text-sm text-muted-foreground mb-3">
            <MapPin className="h-4 w-4" />
            <span>{user.location}</span>
          </div>
        )}
        
        {user.bio && (
          <p className="text-sm mb-4 max-w-md">{user.bio}</p>
        )}
        
        {isOwnProfile ? (
          <Link to="/settings">
            <Button variant="outline" className="border-social-600">
              Edit Profile
            </Button>
          </Link>
        ) : (
          <Button
            className={isFollowing ? "border-social-600 bg-transparent text-white" : "bg-social-700 hover:bg-social-800"}
            variant={isFollowing ? "outline" : "default"}
            disabled={isLoading}
            onClick={handleFollowToggle}
          >
            {isLoading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : isFollowing ? (
              "Following"
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                Follow
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default UserProfileHeader;
