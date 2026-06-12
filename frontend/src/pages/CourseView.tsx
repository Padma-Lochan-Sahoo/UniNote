import { useParams, useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import { BookMarked } from "lucide-react";
import { getCourse, getSemestersForCourse } from "@/lib/courseConfig";
import { cn } from "@/lib/utils";

// Semesters are driven from the config file — no DB fetch needed.
// Students can always see all semesters; the notes grid inside SubjectView
// is the only place where a DB query determines what actually exists.
export default function CourseView() {
  const { course } = useParams<{ course: string }>();
  const navigate = useNavigate();

  const meta = getCourse(course ?? "");
  const semesters = getSemestersForCourse(course ?? "");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="page-container section-padding">
        <PageHeader
          title={meta.name}
          subtitle={`${meta.semesters} semesters · select one to view subjects`}
          badge={meta.name}
          crumbs={[
            { label: "dashboard", to: "/dashboard" },
            { label: meta.name },
          ]}
        />

        {semesters.length === 0 ? (
          <EmptyState
            icon={BookMarked}
            title="Course not configured"
            description="This course has no semesters defined in courseConfig.ts."
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {semesters.map((sem, i) => (
              <button
                key={sem}
                onClick={() => navigate(`/dashboard/${course}/${sem}`)}
                className={cn(
                  "animate-fade-up p-5 bg-card border border-border rounded-xl text-center",
                  "hover:border-primary/50 hover:shadow-md hover:shadow-primary/5 hover:-translate-y-0.5 active:translate-y-0",
                  "transition-all duration-200"
                )}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="font-mono text-base font-bold text-primary">{sem}</span>
                </div>
                <p className="text-xs font-semibold text-foreground">Semester {sem}</p>
                <p className="label-mono mt-0.5 text-[10px] flex items-center justify-center gap-0.5">
                  view <ChevronRight className="w-3 h-3" />
                </p>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}