import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { BookOpen, Eye, EyeOff, Loader2, Mail, Lock, User, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useAuthStore } from "@/store/useAuthStore";
import { useThemeStore } from "@/store/useThemeStore";
import { Moon, Sun } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Minimum 6 characters"),
});
const signupSchema = z.object({
  fullName: z.string().min(2, "Name too short"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Minimum 6 characters"),
});
type LoginForm = z.infer<typeof loginSchema>;
type SignupForm = z.infer<typeof signupSchema>;

export default function Login() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [showPass, setShowPass] = useState(false);
  const [otp, setOtp] = useState("");
  const { login, signup, verifyOtp, isLoggingIn, isSigningUp, isVerifyingOtp, otpStep, signupEmail } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  const loginForm = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });
  const signupForm = useForm<SignupForm>({ resolver: zodResolver(signupSchema) });

  const handleLogin = async (data: LoginForm) => {
    const ok = await login(data);
    if (ok) {
      const user = useAuthStore.getState().authUser;
      navigate(user?.role === "admin" ? "/admin" : "/dashboard");
    }
  };

  const handleSignup = async (data: SignupForm) => { await signup(data); };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return;
    const ok = await verifyOtp(signupEmail!, otp);
    if (ok) navigate("/dashboard");
  };

  const inputClass = "bg-muted border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus-visible:ring-0 focus-visible:ring-offset-0 h-10 text-sm font-mono";

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-2/5 bg-card border-r border-border flex-col justify-between p-10 relative overflow-hidden">
        <div className="absolute inset-0 grid-texture opacity-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />

        <Link to="/" className="relative flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg text-foreground">Uni<span className="text-primary">Note</span></span>
        </Link>

        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-accent/10 border border-accent/20 mb-6">
            <Zap className="w-3.5 h-3.5 text-accent" />
            <span className="label-mono text-accent">smart note access</span>
          </div>
          <h2 className="text-3xl font-bold text-foreground leading-tight mb-4 tracking-tight">
            Your notes,<br />organised perfectly.
          </h2>
          <p className="text-muted-foreground text-sm font-mono leading-relaxed mb-8">
            Semester-wise study material curated by faculty, accessible anywhere.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { n: "2400+", l: "students" },
              { n: "800+",  l: "notes" },
              { n: "15K+",  l: "downloads" },
              { n: "4.8★",  l: "avg rating" },
            ].map(({ n, l }) => (
              <div key={l} className="bg-background/50 border border-border rounded-lg p-3">
                <div className="text-xl font-bold text-foreground font-mono">{n}</div>
                <div className="label-mono mt-0.5">{l}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative label-mono text-[11px]">© {new Date().getFullYear()} UniNote</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 relative">
        <div className="absolute inset-0 grid-texture opacity-10 pointer-events-none" />

        {/* Theme + mobile logo */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2">
          <Link to="/" className="flex items-center gap-1.5 lg:hidden mr-2">
            <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
              <BookOpen className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold text-sm text-foreground">Uni<span className="text-primary">Note</span></span>
          </Link>
          <button onClick={toggleTheme} className="w-8 h-8 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors">
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        <div className="relative w-full max-w-sm">
          {/* OTP screen */}
          {otpStep ? (
            <div className="bg-card border border-border rounded-xl p-6 sm:p-8">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-1 tracking-tight">Check your email</h2>
                <p className="text-xs text-muted-foreground font-mono">
                  6-digit OTP sent to{" "}
                  <span className="text-accent">{signupEmail}</span>
                </p>
              </div>
              <div className="flex justify-center mb-6">
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    {[0,1,2,3,4,5].map(i => (
                      <InputOTPSlot key={i} index={i} className="bg-muted border-border text-foreground font-mono" />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <Button
                onClick={handleVerifyOtp}
                disabled={otp.length !== 6 || isVerifyingOtp}
                className="w-full bg-primary hover:bg-primary/90 h-10"
              >
                {isVerifyingOtp && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Verify OTP
              </Button>
              <p className="text-center text-xs text-muted-foreground font-mono mt-4">
                Valid for 10 minutes ·{" "}
                <button onClick={() => signupForm.handleSubmit(handleSignup)()} className="text-primary hover:underline">
                  Resend
                </button>
              </p>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl p-6 sm:p-8">
              {/* Tab switcher */}
              <div className="flex bg-muted rounded-lg p-1 mb-6 border border-border">
                {(["login","signup"] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md capitalize transition-all font-mono ${
                      tab === t
                        ? "bg-background text-foreground shadow border border-border"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t === "login" ? "sign in" : "create account"}
                  </button>
                ))}
              </div>

              {/* Login */}
              {tab === "login" && (
                <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                  <div>
                    <Label className="text-xs text-muted-foreground font-mono">EMAIL</Label>
                    <div className="relative mt-1.5">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                      <Input placeholder="you@example.com" className={`pl-8 ${inputClass}`} {...loginForm.register("email")} />
                    </div>
                    {loginForm.formState.errors.email && (
                      <p className="text-[11px] text-destructive mt-1 font-mono">{loginForm.formState.errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground font-mono">PASSWORD</Label>
                    <div className="relative mt-1.5">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                      <Input type={showPass ? "text" : "password"} placeholder="••••••••" className={`pl-8 pr-9 ${inputClass}`} {...loginForm.register("password")} />
                      <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    {loginForm.formState.errors.password && (
                      <p className="text-[11px] text-destructive mt-1 font-mono">{loginForm.formState.errors.password.message}</p>
                    )}
                  </div>
                  <Button type="submit" className="w-full h-10 bg-primary hover:bg-primary/90" disabled={isLoggingIn}>
                    {isLoggingIn && <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />}
                    Sign In
                  </Button>
                  <p className="text-center text-xs text-muted-foreground font-mono">
                    No account?{" "}
                    <button type="button" onClick={() => setTab("signup")} className="text-primary hover:underline">
                      Create one
                    </button>
                  </p>
                </form>
              )}

              {/* Signup */}
              {tab === "signup" && (
                <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                  <div>
                    <Label className="text-xs text-muted-foreground font-mono">FULL NAME</Label>
                    <div className="relative mt-1.5">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                      <Input placeholder="Your name" className={`pl-8 ${inputClass}`} {...signupForm.register("fullName")} />
                    </div>
                    {signupForm.formState.errors.fullName && (
                      <p className="text-[11px] text-destructive mt-1 font-mono">{signupForm.formState.errors.fullName.message}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground font-mono">EMAIL</Label>
                    <div className="relative mt-1.5">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                      <Input placeholder="you@example.com" className={`pl-8 ${inputClass}`} {...signupForm.register("email")} />
                    </div>
                    {signupForm.formState.errors.email && (
                      <p className="text-[11px] text-destructive mt-1 font-mono">{signupForm.formState.errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground font-mono">PASSWORD</Label>
                    <div className="relative mt-1.5">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                      <Input type={showPass ? "text" : "password"} placeholder="••••••••" className={`pl-8 pr-9 ${inputClass}`} {...signupForm.register("password")} />
                      <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    {signupForm.formState.errors.password && (
                      <p className="text-[11px] text-destructive mt-1 font-mono">{signupForm.formState.errors.password.message}</p>
                    )}
                  </div>
                  <Button type="submit" className="w-full h-10 bg-primary hover:bg-primary/90" disabled={isSigningUp}>
                    {isSigningUp && <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />}
                    Create Account
                  </Button>
                  <p className="text-center text-xs text-muted-foreground font-mono">
                    Already have an account?{" "}
                    <button type="button" onClick={() => setTab("login")} className="text-primary hover:underline">
                      Sign in
                    </button>
                  </p>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
