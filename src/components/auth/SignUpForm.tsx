
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignUpForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const validatePassword = () => {
    if (password !== confirmPassword) {
      setPasswordError("Passwords don't match");
      return false;
    }
    
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return false;
    }
    
    setPasswordError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await register(username, email, password);
      navigate("/");
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6 p-8 rounded-xl glass-morphism animate-fade-in">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gradient">Create Account</h1>
        <p className="text-sm text-muted-foreground">Enter your information to sign up</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input 
            id="username"
            type="text"
            placeholder="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-background/50"
          />
        </div>
        
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
          <Label htmlFor="password">Password</Label>
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
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input 
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="bg-background/50"
          />
          {passwordError && (
            <p className="text-xs text-destructive mt-1">{passwordError}</p>
          )}
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-social-700 hover:bg-social-800" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating account..." : "Sign Up"}
        </Button>
      </form>
      
      <div className="text-center text-sm">
        <p className="text-muted-foreground">
          Already have an account?{" "}
          <Link to="/signin" className="font-medium text-social-400 hover:text-social-300 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;
