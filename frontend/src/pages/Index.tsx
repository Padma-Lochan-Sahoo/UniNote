import { Link } from "react-router-dom";
import { BookOpen, Upload, Search, Star, ArrowRight, CheckCircle2, Zap, Shield, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

const features = [
  { icon: Search, title: "Drill-down browse", desc: "Course → Semester → Subject. Zero friction to find what you need." },
  { icon: Upload, title: "Cloudinary storage", desc: "PDF, DOCX, PPT uploads via Cloudinary. Fast, reliable, persistent." },
  { icon: Star, title: "Community ratings", desc: "Star notes to surface the best material. Ratings persist per user." },
  { icon: Shield, title: "OTP secured", desc: "Email OTP registration with bcrypt hashing. JWT httpOnly cookies." },
];

const stats = [
  { value: "2,400+", label: "students" },
  { value: "800+",   label: "notes" },
  { value: "15K+",   label: "downloads" },
  { value: "4.8★",   label: "avg rating" },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative page-container pt-20 pb-24 sm:pt-28 sm:pb-32 overflow-hidden">
        {/* Background grid texture */}
        <div className="absolute inset-0 grid-texture opacity-30 pointer-events-none" />

        {/* Glow blobs */}
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-32 right-1/4 w-48 h-48 bg-accent/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative text-center max-w-3xl mx-auto">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-accent/10 border border-accent/20 mb-8">
            <Zap className="w-3.5 h-3.5 text-accent" />
            <span className="label-mono text-accent">your academic companion</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] tracking-tight mb-6">
            Study notes,{" "}
            <span className="gradient-text">organised perfectly</span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed font-light">
            Access semester-wise notes uploaded by your faculty.
            Browse by course, semester, and subject — all in one place.
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <Button size="lg" asChild className="gap-2 bg-primary hover:bg-primary/90 primary-glow h-11 px-6">
              <Link to="/auth">Get Started <ArrowRight className="w-4 h-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-border hover:border-primary/50 h-11 px-6">
              <Link to="/auth">Sign In</Link>
            </Button>
          </div>

          {/* Trust tags */}
          <div className="mt-12 flex flex-wrap justify-center gap-4 sm:gap-6">
            {["Free to use", "No ads", "OTP secured", "Verified content"].map((t) => (
              <span key={t} className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-accent" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats bar ─────────────────────────────────────── */}
      <section className="border-y border-border bg-card/50">
        <div className="page-container py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-0 sm:divide-x divide-border">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center py-2">
                <div className="text-2xl sm:text-3xl font-bold text-foreground font-mono">{value}</div>
                <div className="label-mono mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────── */}
      <section className="page-container section-padding">
        <div className="text-center mb-10 sm:mb-14">
          <p className="label-mono text-accent mb-3">what you get</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Everything to ace your exams
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={title}
              className={`animate-fade-up delay-${i * 100} p-5 bg-card border border-border rounded-xl hover:border-primary/40 transition-colors`}
            >
              <div className="w-9 h-9 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center mb-4">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground text-sm mb-2">{title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-mono">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────── */}
      <section className="page-container pb-20 sm:pb-28">
        <div className="bg-card border border-border rounded-2xl p-6 sm:p-10 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative">
            <p className="label-mono text-accent mb-3">how it works</p>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-8 tracking-tight">Three steps to your notes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { step: "01", title: "Create account", desc: "Sign up with your email. OTP verified in seconds." },
                { step: "02", title: "Browse your course", desc: "Pick your course → semester → subject to find notes." },
                { step: "03", title: "Download & learn", desc: "One-click download. Rate notes to help others." },
              ].map(({ step, title, desc }) => (
                <div key={step} className="flex gap-4">
                  <div className="w-9 h-9 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <span className="font-mono text-xs font-bold text-primary">{step}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm mb-1">{title}</h3>
                    <p className="text-xs text-muted-foreground font-mono leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="page-container pb-24">
        <div className="relative overflow-hidden rounded-2xl bg-primary p-8 sm:p-12 text-center">
          <div className="absolute inset-0 grid-texture opacity-10 pointer-events-none" />
          <div className="relative">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 tracking-tight">
              Ready to start?
            </h2>
            <p className="text-white/70 mb-8 font-mono text-sm max-w-md mx-auto">
              Join thousands of students who save time with UniNote.
            </p>
            <Button size="lg" asChild className="bg-accent text-background hover:bg-accent/90 font-semibold h-11 px-8 accent-glow">
              <Link to="/auth">Create Free Account <ArrowRight className="w-4 h-4 ml-1" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="border-t border-border py-6">
        <div className="page-container flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
              <BookOpen className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold text-sm text-foreground">Uni<span className="text-primary">Note</span></span>
          </div>
          <p className="label-mono text-[11px]">© {new Date().getFullYear()} UniNote — made for students</p>
        </div>
      </footer>
    </div>
  );
}
