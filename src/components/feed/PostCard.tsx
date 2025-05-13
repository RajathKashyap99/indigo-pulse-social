
import { Post } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle, MoreHorizontal, Share2, Bookmark, ChevronRight, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Link } from "react-router-dom";

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const [isLiked, setIsLiked] = useState(post.hasLiked || false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  const handleLike = () => {
    if (isLiked) {
      setLikeCount((prev) => prev - 1);
    } else {
      setLikeCount((prev) => prev + 1);
    }
    setIsLiked(!isLiked);
  };
  
  const handleNextImage = () => {
    if (post.images && currentImageIndex < post.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };
  
  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };
  
  return (
    <div className="rounded-xl bg-card overflow-hidden mb-6 animate-fade-in">
      <div className="p-4 flex items-center justify-between">
        <Link to={`/profile/${post.author.username}`} className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div>
            <h3 className="font-medium text-sm">
              {post.author.name}
            </h3>
            <p className="text-xs text-muted-foreground">
              @{post.author.username}
            </p>
          </div>
        </Link>
        
        <Button variant="ghost" size="icon" className="rounded-full">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>
      
      {post.images && post.images.length > 0 && (
        <div className="relative">
          <div className="aspect-video md:aspect-[4/3] bg-muted w-full overflow-hidden">
            <img
              src={post.images[currentImageIndex]}
              alt={`Post by ${post.author.name}`}
              className="h-full w-full object-cover"
            />
          </div>
          
          {post.images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-background/20 backdrop-blur-md",
                  currentImageIndex === 0 && "opacity-0 pointer-events-none"
                )}
                onClick={handlePrevImage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-background/20 backdrop-blur-md",
                  currentImageIndex === post.images.length - 1 && "opacity-0 pointer-events-none"
                )}
                onClick={handleNextImage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1">
                {post.images.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "h-1.5 w-1.5 rounded-full transition-all",
                      index === currentImageIndex ? "bg-white" : "bg-white/50"
                    )}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
      
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-full hover:text-red-500 transition-colors",
                isLiked && "text-red-500"
              )}
              onClick={handleLike}
            >
              <Heart className={cn("h-6 w-6", isLiked && "fill-current")} />
            </Button>
            
            <Button variant="ghost" size="icon" className="rounded-full">
              <MessageCircle className="h-6 w-6" />
            </Button>
            
            <Button variant="ghost" size="icon" className="rounded-full">
              <Share2 className="h-6 w-6" />
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "rounded-full",
              isBookmarked && "text-social-400"
            )}
            onClick={() => setIsBookmarked(!isBookmarked)}
          >
            <Bookmark
              className={cn("h-6 w-6", isBookmarked && "fill-current")}
            />
          </Button>
        </div>
        
        <div>
          <p className="font-medium text-sm">{likeCount.toLocaleString()} likes</p>
          
          <div className="mt-1">
            <p className="text-sm">
              <span className="font-medium">{post.author.username}</span>{" "}
              {post.content}
            </p>
          </div>
          
          {post.tags && post.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/tags/${tag}`}
                  className="text-xs text-social-400 hover:underline"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </div>
        
        <div>
          <Button
            variant="link"
            className="px-0 h-auto text-muted-foreground text-xs"
          >
            View all {post.comments} comments
          </Button>
          
          <p className="text-xs text-muted-foreground mt-1">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
