import { Link } from "react-router-dom";
import { BookOpen, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 grid-texture opacity-20 pointer-events-none" />
      <div className="relative">
        <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center mx-auto mb-6">
          <BookOpen className="w-8 h-8 text-primary" />
        </div>
        <p className="label-mono text-primary mb-2">error 404</p>
        <h1 className="text-5xl font-bold text-foreground font-mono mb-3">Not Found</h1>
        <p className="text-muted-foreground mb-8 max-w-sm font-mono text-sm">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild className="gap-2 bg-primary hover:bg-primary/90">
          <Link to="/"><Home className="w-4 h-4" /> Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}
