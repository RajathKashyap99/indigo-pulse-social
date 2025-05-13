
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Post, User } from "@/types";
import { Loader, Grid, User as UserIcon } from "lucide-react";
import UserProfileHeader from "@/components/user/UserProfileHeader";
import UserStats from "@/components/user/UserStats";
import PostCard from "@/components/feed/PostCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!username) return;
      
      setIsLoading(true);
      try {
        const userData = await api.users.getUserProfile(username);
        setUser(userData);
        
        // For demo purposes, we'll use the sample posts from the API
        const postsData = await api.posts.getPosts();
        setPosts(postsData);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [username]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">User not found</h2>
        <p className="text-muted-foreground mt-2">The user you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <UserProfileHeader user={user} />
      
      <UserStats user={user} />
      
      <Tabs defaultValue="posts" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-full mb-8">
          <TabsTrigger value="posts" className="flex items-center gap-2">
            <Grid className="h-4 w-4" />
            <span>Posts</span>
          </TabsTrigger>
          <TabsTrigger value="about" className="flex items-center gap-2">
            <UserIcon className="h-4 w-4" />
            <span>About</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="posts" className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </TabsContent>
        
        <TabsContent value="about" className="space-y-4">
          <div className="rounded-xl bg-card p-4">
            <h3 className="text-lg font-medium mb-3">About me</h3>
            <p>{user.bio || "No bio provided yet."}</p>
          </div>
          
          <div className="rounded-xl bg-card p-4">
            <h3 className="text-lg font-medium mb-3">Location</h3>
            <p>{user.location || "No location provided yet."}</p>
          </div>
          
          <div className="rounded-xl bg-card p-4">
            <h3 className="text-lg font-medium mb-3">Joined</h3>
            <p>{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
