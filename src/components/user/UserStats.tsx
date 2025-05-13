
import { User } from "@/types";

interface UserStatsProps {
  user: User;
}

const UserStats = ({ user }: UserStatsProps) => {
  return (
    <div className="flex justify-center items-center gap-8 py-4 border-t border-b border-border my-6">
      <div className="text-center">
        <p className="font-bold text-xl">{user.posts}</p>
        <p className="text-sm text-muted-foreground">Posts</p>
      </div>
      
      <div className="text-center">
        <p className="font-bold text-xl">{user.followers.toLocaleString()}</p>
        <p className="text-sm text-muted-foreground">Followers</p>
      </div>
      
      <div className="text-center">
        <p className="font-bold text-xl">{user.following.toLocaleString()}</p>
        <p className="text-sm text-muted-foreground">Following</p>
      </div>
    </div>
  );
};

export default UserStats;
