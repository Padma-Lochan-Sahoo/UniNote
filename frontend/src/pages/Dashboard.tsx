import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import { useAuthStore } from "@/store/useAuthStore";
import { getAllCourses } from "@/lib/courseConfig";
import { cn } from "@/lib/utils";

// Courses are always driven from the config file — no DB fetch needed here.
// The DB is only queried when a student drills into a specific subject.
const ALL_COURSES = getAllCourses();

export default function Dashboard() {
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const firstName = authUser?.fullName?.split(" ")[0] ?? "Student";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="page-container section-padding">
        <PageHeader
          title={`Welcome back, ${firstName}`}
          subtitle="choose your course to browse notes"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ALL_COURSES.map((course, i) => (
            <button
              key={course.key}
              onClick={() => navigate(`/dashboard/${course.key}`)}
              className={cn(
                "animate-fade-up text-left p-5 bg-card border rounded-xl transition-all duration-200",
                "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 active:translate-y-0",
                "border-border",
                course.accentClass
              )}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">{course.emoji}</span>
                <div className="flex items-center gap-1 label-mono text-muted-foreground">
                  <span>{course.semesters} sem</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
              <h3 className="font-bold text-foreground text-lg tracking-tight">{course.name}</h3>
              <p className="label-mono mt-1">{course.description}</p>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}