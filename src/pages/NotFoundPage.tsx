
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      <h1 className="text-6xl font-bold text-social-400">404</h1>
      <h2 className="text-2xl font-medium mt-4">Page not found</h2>
      <p className="text-muted-foreground mt-2 max-w-md">
        The page you're looking for doesn't exist or has been removed.
      </p>
      
      <div className="mt-8">
        <Button asChild className="bg-social-700 hover:bg-social-800">
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
