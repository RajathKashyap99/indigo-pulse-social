
import { cn } from "@/lib/utils";

interface StoryCircleProps {
  image: string;
  username: string;
  isActive?: boolean;
  hasNewStory?: boolean;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
}

const StoryCircle = ({
  image,
  username,
  isActive = false,
  hasNewStory = false,
  onClick,
  size = "md",
}: StoryCircleProps) => {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-20 h-20",
  };
  
  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={onClick}
        className={cn(
          "rounded-full overflow-hidden relative",
          hasNewStory ? "story-ring" : "p-[2px] border border-border",
          isActive && "ring-2 ring-social-500"
        )}
      >
        <div className={cn("rounded-full overflow-hidden bg-muted", sizeClasses[size])}>
          <img
            src={image}
            alt={username}
            className="h-full w-full object-cover"
          />
        </div>
      </button>
      <span className="text-xs truncate w-16 text-center">{username}</span>
    </div>
  );
};

export default StoryCircle;
