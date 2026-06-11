import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronRight, BookOpen, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import { useNoteStore } from "@/store/useNoteStore";
import { getCourse } from "@/lib/courseConfig";
import { cn } from "@/lib/utils";

export default function SemesterView() {
  const { course, semester } = useParams<{ course: string; semester: string }>();
  const navigate = useNavigate();
  const { subjects, fetchSubjects, isLoading } = useNoteStore();
  const meta = getCourse(course ?? "");

  useEffect(() => {
    if (course && semester) fetchSubjects(course, Number(semester));
  }, [course, semester]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="page-container section-padding">
        <PageHeader
          title={`Semester ${semester}`}
          subtitle={`${meta.name} · select a subject to view notes`}
          crumbs={[
            { label: "dashboard", to: "/dashboard" },
            { label: meta.name, to: `/dashboard/${course}` },
            { label: `sem ${semester}` },
          ]}
        />

        {isLoading ? (
          <div className="flex justify-center py-24"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : subjects.length === 0 ? (
          <EmptyState icon={BookOpen} title="No subjects found" description="No notes uploaded for this semester yet." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {subjects.map((subject, i) => (
              <button
                key={subject}
                onClick={() => navigate(`/dashboard/${course}/${semester}/${encodeURIComponent(subject)}`)}
                className={cn(
                  "animate-fade-up text-left p-4 bg-card border border-border rounded-xl",
                  "hover:border-accent/40 hover:shadow-md hover:shadow-accent/5 hover:-translate-y-0.5 active:translate-y-0",
                  "transition-all duration-200 flex items-center gap-3 group"
                )}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="w-8 h-8 bg-accent/10 border border-accent/20 rounded-md flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm capitalize truncate">{subject}</p>
                  <p className="label-mono text-[10px] mt-0.5">view notes</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors shrink-0" />
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
