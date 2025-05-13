
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import { Image, Loader, Send, X } from "lucide-react";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const NewPostForm = () => {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  
  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() && !selectedImage) {
      toast({
        variant: "destructive",
        title: "Empty post",
        description: "Please add some content or an image to your post",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await api.posts.createPost(content, selectedImage || undefined);
      toast({
        title: "Post created",
        description: "Your post has been published successfully!",
      });
      navigate("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create post. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!user) return null;
  
  return (
    <Card className="animate-fade-in">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-4">
            <Avatar>
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-muted-foreground">@{user.username}</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px] resize-none"
            />
          </div>
          
          {imagePreview && (
            <div className="relative rounded-md overflow-hidden bg-muted">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full object-contain max-h-[300px]"
              />
              <Button
                type="button"
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2 h-8 w-8 rounded-full"
                onClick={removeImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <Label
                htmlFor="image-upload"
                className="flex items-center gap-2 cursor-pointer hover:text-social-400 transition-colors"
              >
                <Image className="h-5 w-5" />
                <span>Add image</span>
              </Label>
            </div>
            
            <Button
              type="submit"
              className="bg-social-700 hover:bg-social-800"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Post
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default NewPostForm;
