
import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Post } from "@/types";
import { Loader, Search } from "lucide-react";
import PostCard from "@/components/feed/PostCard";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ExplorePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
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
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Explore</h1>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search for users, posts, or tags..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <Tabs defaultValue="trending">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="latest">Latest</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
        </TabsList>
        
        <TabsContent value="trending" className="space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            posts.map((post) => <PostCard key={post._id} post={post} />)
          )}
        </TabsContent>
        
        <TabsContent value="latest" className="space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            [...posts].reverse().map((post) => <PostCard key={post._id} post={post} />)
          )}
        </TabsContent>
        
        <TabsContent value="following" className="space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : posts.length > 0 ? (
            posts.slice(0, 1).map((post) => <PostCard key={post._id} post={post} />)
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold">No posts yet</h2>
              <p className="text-muted-foreground mt-2">Start following users to see their posts here</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExplorePage;
