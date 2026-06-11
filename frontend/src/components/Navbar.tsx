import { Link, useNavigate, useLocation } from "react-router-dom";
import { BookOpen, Moon, Sun, LogOut, LayoutDashboard, ShieldCheck, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuthStore } from "@/store/useAuthStore";
import { useThemeStore } from "@/store/useThemeStore";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function Navbar() {
  const { authUser, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    const ok = await logout();
    if (ok) navigate("/");
  };

  const initials = authUser?.fullName
    ?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) ?? "?";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-md">
      <nav className="page-container flex h-14 items-center justify-between">
        {/* Logo */}
        <Link
          to={authUser ? (authUser.role === "admin" ? "/admin" : "/dashboard") : "/"}
          className="flex items-center gap-2 group"
        >
          <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center group-hover:shadow-lg group-hover:shadow-primary/30 transition-shadow">
            <BookOpen className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-base tracking-tight text-foreground">
            Uni<span className="text-primary">Note</span>
          </span>
        </Link>

        {/* Desktop right */}
        <div className="hidden sm:flex items-center gap-2">
          <Button
            variant="ghost" size="icon"
            onClick={toggleTheme}
            className="rounded-md w-8 h-8 text-muted-foreground hover:text-foreground"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>

          {authUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 rounded-full p-0 ring-1 ring-border hover:ring-primary/50 transition-all">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold font-mono">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-card border-border" align="end">
                <DropdownMenuLabel className="pb-2">
                  <p className="text-sm font-medium text-foreground">{authUser.fullName}</p>
                  <p className="text-xs text-muted-foreground font-mono truncate">{authUser.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border" />
                {authUser.role === "admin" ? (
                  <DropdownMenuItem onClick={() => navigate("/admin")} className="text-foreground cursor-pointer">
                    <ShieldCheck className="mr-2 h-4 w-4 text-accent" /> Admin Panel
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => navigate("/dashboard")} className="text-foreground cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4 text-primary" /> Dashboard
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground h-8 text-sm">
                <Link to="/auth">Sign In</Link>
              </Button>
              <Button size="sm" asChild className="h-8 text-sm bg-primary hover:bg-primary/90">
                <Link to="/auth">Get Started</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <div className="flex sm:hidden items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="w-8 h-8 text-muted-foreground">
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground">
                <Menu className="w-4 h-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 bg-card border-border p-0">
              <div className="flex flex-col h-full">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
                      <BookOpen className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="font-bold text-base">Uni<span className="text-primary">Note</span></span>
                  </div>
                </div>
                {authUser && (
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-primary text-sm font-bold font-mono">{initials}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{authUser.fullName}</p>
                        <p className="text-xs text-muted-foreground font-mono truncate">{authUser.email}</p>
                      </div>
                    </div>
                  </div>
                )}
                <nav className="flex-1 p-4 space-y-1">
                  {authUser ? (
                    <>
                      {authUser.role === "admin" ? (
                        <button
                          onClick={() => { navigate("/admin"); setMobileOpen(false); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-foreground hover:bg-muted transition-colors"
                        >
                          <ShieldCheck className="w-4 h-4 text-accent" /> Admin Panel
                        </button>
                      ) : (
                        <button
                          onClick={() => { navigate("/dashboard"); setMobileOpen(false); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-foreground hover:bg-muted transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-primary" /> Dashboard
                        </button>
                      )}
                      <button
                        onClick={() => { handleLogout(); setMobileOpen(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/auth"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/auth"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-md text-sm bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
                      >
                        Get Started
                      </Link>
                    </>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
