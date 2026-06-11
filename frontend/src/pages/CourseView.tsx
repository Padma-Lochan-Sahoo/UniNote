import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronRight, BookMarked, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import { useNoteStore } from "@/store/useNoteStore";
import { getCourse } from "@/lib/courseConfig";
import { cn } from "@/lib/utils";

export default function CourseView() {
  const { course } = useParams<{ course: string }>();
  const navigate = useNavigate();
  const { semesters, fetchSemesters, isLoading } = useNoteStore();
  const meta = getCourse(course ?? "");

  useEffect(() => { if (course) fetchSemesters(course); }, [course]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="page-container section-padding">
        <PageHeader
          title={`${meta.name}`}
          subtitle={`${meta.semesters} semesters · select one to view subjects`}
          badge={meta.name}
          crumbs={[
            { label: "dashboard", to: "/dashboard" },
            { label: meta.name },
          ]}
        />

        {isLoading ? (
          <div className="flex justify-center py-24"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : semesters.length === 0 ? (
          <EmptyState icon={BookMarked} title="No semesters found" description="No notes uploaded for this course yet." />
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
                style={{ animationDelay: `${i * 60}ms` }}
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
