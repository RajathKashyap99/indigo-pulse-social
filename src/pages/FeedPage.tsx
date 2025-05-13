
import { useEffect, useState } from "react";
import StoriesBar from "@/components/feed/StoriesBar";
import PostCard from "@/components/feed/PostCard";
import SuggestedUsers from "@/components/user/SuggestedUsers";
import FriendRequests from "@/components/user/FriendRequests";
import { api } from "@/services/api";
import { Post } from "@/types";
import { Loader } from "lucide-react";

const FeedPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const postsData = await api.posts.getPosts();
        setPosts(postsData);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPosts();
  }, []);
  
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 max-w-full lg:max-w-2xl">
        <StoriesBar />
        
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <div>
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
      
      <div className="w-full lg:w-80 space-y-6">
        <FriendRequests />
        <SuggestedUsers />
      </div>
    </div>
  );
};

export default FeedPage;
