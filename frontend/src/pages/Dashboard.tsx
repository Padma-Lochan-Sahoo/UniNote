import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, BookOpen, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import { useNoteStore } from "@/store/useNoteStore";
import { useAuthStore } from "@/store/useAuthStore";
import { getCourse } from "@/lib/courseConfig";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const { courses, fetchCourses, isLoading } = useNoteStore();

  useEffect(() => { fetchCourses(); }, []);

  const firstName = authUser?.fullName?.split(" ")[0] ?? "Student";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="page-container section-padding">
        <PageHeader
          title={`Welcome back, ${firstName}`}
          subtitle="choose your course to browse notes"
        />

        {isLoading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : courses.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No courses available yet"
            description="Notes haven't been uploaded yet. Check back soon."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course, i) => {
              const meta = getCourse(course);
              return (
                <button
                  key={course}
                  onClick={() => navigate(`/dashboard/${course}`)}
                  className={cn(
                    "animate-fade-up text-left p-5 bg-card border rounded-xl transition-all duration-200",
                    "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 active:translate-y-0",
                    "border-border",
                    meta.accentClass
                  )}
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl">{meta.emoji}</span>
                    <div className="flex items-center gap-1 label-mono text-muted-foreground">
                      <span>{meta.semesters} sem</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <h3 className="font-bold text-foreground text-lg tracking-tight">{meta.name}</h3>
                  <p className="label-mono mt-1">{meta.description}</p>
                </button>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
