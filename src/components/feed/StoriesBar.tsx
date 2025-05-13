
import StoryCircle from "./StoryCircle";
import { Plus } from "lucide-react";
import { useState } from "react";

// Sample data for stories
const stories = [
  { id: "1", username: "christina", image: "/placeholder.svg", hasNewStory: true },
  { id: "2", username: "david", image: "/placeholder.svg", hasNewStory: true },
  { id: "3", username: "sophia", image: "/placeholder.svg", hasNewStory: true },
  { id: "4", username: "jacob", image: "/placeholder.svg", hasNewStory: false },
  { id: "5", username: "olivia", image: "/placeholder.svg", hasNewStory: true },
  { id: "6", username: "william", image: "/placeholder.svg", hasNewStory: true },
  { id: "7", username: "emma", image: "/placeholder.svg", hasNewStory: false },
  { id: "8", username: "james", image: "/placeholder.svg", hasNewStory: true },
];

const StoriesBar = () => {
  const [activeStory, setActiveStory] = useState<string | null>(null);
  
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Stories</h2>
        <button className="text-sm text-social-400 hover:text-social-300 transition-colors">
          Watch all
        </button>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-none">
        <div className="flex flex-col items-center gap-1">
          <button className="w-16 h-16 rounded-full border border-border border-dashed flex items-center justify-center hover:bg-social-900/20 transition-colors">
            <Plus className="h-6 w-6 text-social-400" />
          </button>
          <span className="text-xs truncate w-16 text-center">Add story</span>
        </div>
        
        {stories.map((story) => (
          <StoryCircle
            key={story.id}
            username={story.username}
            image={story.image}
            hasNewStory={story.hasNewStory}
            isActive={activeStory === story.id}
            onClick={() => setActiveStory(story.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default StoriesBar;
