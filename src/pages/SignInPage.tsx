
import SignInForm from "@/components/auth/SignInForm";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const SignInPage = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Redirect to home if already authenticated
  if (isAuthenticated && !isLoading) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-social-900 bg-gradient-to-tr from-social-900 to-black">
      <div className="w-full max-w-md mx-auto">
        <SignInForm />
        
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            By signing in, you agree to our{" "}
            <a href="#" className="underline hover:text-social-400 transition-colors">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline hover:text-social-400 transition-colors">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
