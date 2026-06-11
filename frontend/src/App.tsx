import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { useThemeStore } from "@/store/useThemeStore";
import { Loader2 } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CourseView from "./pages/CourseView";
import SemesterView from "./pages/SemesterView";
import SubjectView from "./pages/SubjectView";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 1 } } });

export default function App() {
  const { checkAuth, isCheckingAuth, authUser } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    // UniNote defaults to dark. Apply saved preference.
    const isDark = theme === "dark";
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.classList.toggle("light", !isDark);
    checkAuth();
  }, []);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
          </div>
          <span className="label-mono">Loading UniNote...</span>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: "'Inter', sans-serif",
            borderRadius: "8px",
            background: "#1A1A1A",
            color: "#FAFAF8",
            border: "1px solid #2C2C2C",
            fontSize: "14px",
          },
          success: { iconTheme: { primary: "#00FF9C", secondary: "#0A0A0A" } },
          error: { iconTheme: { primary: "#FF4444", secondary: "#0A0A0A" } },
        }}
      />
      <Routes>
        <Route
          path="/"
          element={authUser ? <Navigate to={authUser.role === "admin" ? "/admin" : "/dashboard"} replace /> : <Index />}
        />
        <Route
          path="/auth"
          element={authUser ? <Navigate to={authUser.role === "admin" ? "/admin" : "/dashboard"} replace /> : <Login />}
        />
        <Route path="/dashboard" element={<ProtectedRoute allowedRoles={["user", "admin"]}><Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard/:course" element={<ProtectedRoute allowedRoles={["user", "admin"]}><CourseView /></ProtectedRoute>} />
        <Route path="/dashboard/:course/:semester" element={<ProtectedRoute allowedRoles={["user", "admin"]}><SemesterView /></ProtectedRoute>} />
        <Route path="/dashboard/:course/:semester/:subject" element={<ProtectedRoute allowedRoles={["user", "admin"]}><SubjectView /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminPanel /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </QueryClientProvider>
  );
}
