
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Link } from "react-router-dom";

// Sample friend requests data
const friendRequests = [
  {
    id: "1",
    name: "Lauralee Quintero",
    username: "lauralee",
    avatar: "/placeholder.svg",
  },
  {
    id: "2",
    name: "Brittni Landoma",
    username: "brittni",
    avatar: "/placeholder.svg",
  },
];

interface FriendRequestItemProps {
  id: string;
  name: string;
  username: string;
  avatar?: string;
}

const FriendRequestItem = ({
  id,
  name,
  username,
  avatar,
}: FriendRequestItemProps) => {
  return (
    <div className="flex items-center gap-3 py-3">
      <Link to={`/profile/${username}`}>
        <Avatar>
          <AvatarImage src={avatar || "/placeholder.svg"} alt={name} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
      </Link>
      
      <div className="flex-1">
        <Link to={`/profile/${username}`} className="block">
          <h3 className="font-medium text-sm">
            {name}
          </h3>
        </Link>
        <p className="text-xs text-muted-foreground">
          wants to add you to friends
        </p>
        
        <div className="flex items-center gap-2 mt-2">
          <Button
            variant="default"
            size="sm"
            className="bg-social-700 hover:bg-social-800 w-20"
          >
            Accept
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="border-social-600 text-social-400 hover:text-social-300 hover:border-social-500 w-20"
          >
            Decline
          </Button>
        </div>
      </div>
    </div>
  );
};

const FriendRequests = () => {
  if (friendRequests.length === 0) {
    return null;
  }
  
  return (
    <div className="p-4 rounded-xl bg-card mb-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-medium">
          Requests <span className="text-sm text-muted-foreground">{friendRequests.length}</span>
        </h2>
      </div>
      
      <div className="divide-y divide-border">
        {friendRequests.map((request) => (
          <FriendRequestItem
            key={request.id}
            id={request.id}
            name={request.name}
            username={request.username}
            avatar={request.avatar}
          />
        ))}
      </div>
    </div>
  );
};

export default FriendRequests;
