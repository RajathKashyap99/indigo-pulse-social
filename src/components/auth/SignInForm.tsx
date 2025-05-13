
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6 p-8 rounded-xl glass-morphism animate-fade-in">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gradient">Welcome Back</h1>
        <p className="text-sm text-muted-foreground">Enter your credentials to sign in</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email"
            type="email"
            placeholder="your@email.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-background/50"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Button variant="link" size="sm" className="px-0 h-auto text-xs text-muted-foreground">
              Forgot password?
            </Button>
          </div>
          <Input 
            id="password"
            type="password"
            placeholder="••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-background/50"
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-social-700 hover:bg-social-800" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </Button>
      </form>
      
      <div className="text-center text-sm">
        <p className="text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/signup" className="font-medium text-social-400 hover:text-social-300 transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignInForm;
