import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { Loader2 } from "lucide-react";

interface Props { children: React.ReactNode; allowedRoles: string[]; }

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const { authUser, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="label-mono text-xs">Loading...</span>
        </div>
      </div>
    );
  }
  if (!authUser) return <Navigate to="/auth" replace />;
  if (!allowedRoles.includes(authUser.role))
    return <Navigate to={authUser.role === "admin" ? "/admin" : "/dashboard"} replace />;
  return <>{children}</>;
}
