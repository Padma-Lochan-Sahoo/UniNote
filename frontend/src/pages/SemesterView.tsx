import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronDown, BookOpen, ArrowRight, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import { useNoteStore } from "@/store/useNoteStore";
import { getCourse, getSubjectsForSemester } from "@/lib/courseConfig";
import { cn } from "@/lib/utils";

export default function SemesterView() {
  const { course, semester } = useParams<{ course: string; semester: string }>();
  const navigate = useNavigate();

  const meta = getCourse(course ?? "");

  // Canonical subject list — always from config (never empty if configured)
  const configSubjects = getSubjectsForSemester(course ?? "", Number(semester));

  // DB subjects tell us which subjects already have notes uploaded
  const { subjects: dbSubjects, fetchSubjects, clearSubjects, loadingSubjects } = useNoteStore();

  // Set of subject names (lowercase) that have at least one note in the DB
  const subjectsWithNotes = new Set(dbSubjects.map((s) => s.toLowerCase()));

  // If no config subjects defined, fall back to whatever the DB returns
  const subjectList = configSubjects.length > 0 ? configSubjects : dbSubjects;

  const [selectedSubject, setSelectedSubject] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    setSelectedSubject("");
    setDropdownOpen(false);
    if (course && semester) fetchSubjects(course, Number(semester));
    return () => clearSubjects();
  }, [course, semester]);

  const handleNavigate = (subject: string) => {
    if (!subject) return;
    navigate(`/dashboard/${course}/${semester}/${encodeURIComponent(subject)}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="page-container section-padding">
        <PageHeader
          title={`Semester ${semester}`}
          subtitle={`${meta.name} · choose a subject`}
          crumbs={[
            { label: "dashboard", to: "/dashboard" },
            { label: meta.name, to: `/dashboard/${course}` },
            { label: `sem ${semester}` },
          ]}
        />

        {subjectList.length === 0 && !loadingSubjects ? (
          <EmptyState
            icon={BookOpen}
            title="No subjects configured"
            description="Add subjects for this semester in courseConfig.ts."
          />
        ) : (
          <div className="space-y-8">

            {/* ── Dropdown selector ───────────────────────────────────────── */}
            <div className="max-w-lg">
              <p className="label-mono text-[11px] mb-2">SELECT SUBJECT</p>

              <div className="relative">
                {/* Trigger button */}
                <button
                  type="button"
                  onClick={() => setDropdownOpen((o) => !o)}
                  className={cn(
                    "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl",
                    "bg-card border text-sm font-medium transition-all duration-150",
                    "hover:border-primary/50 focus:outline-none",
                    dropdownOpen
                      ? "border-primary shadow-lg shadow-primary/10"
                      : "border-border"
                  )}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <BookOpen className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className={cn("truncate", selectedSubject ? "text-foreground" : "text-muted-foreground font-normal")}>
                      {selectedSubject || "Choose a subject…"}
                    </span>
                  </div>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200",
                      dropdownOpen && "rotate-180"
                    )}
                  />
                </button>

                {/* Dropdown panel */}
                {dropdownOpen && (
                  <div className="absolute z-50 mt-1.5 w-full bg-card border border-border rounded-xl shadow-xl shadow-black/30 overflow-hidden">
                    <div className="max-h-64 overflow-y-auto py-1">
                      {loadingSubjects ? (
                        <div className="flex items-center justify-center gap-2 py-6 text-muted-foreground">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-xs font-mono">Loading…</span>
                        </div>
                      ) : (
                        subjectList.map((subject) => {
                          const hasNotes = subjectsWithNotes.has(subject.toLowerCase());
                          const isSelected = selectedSubject === subject;
                          return (
                            <button
                              key={subject}
                              type="button"
                              onClick={() => {
                                setSelectedSubject(subject);
                                setDropdownOpen(false);
                              }}
                              className={cn(
                                "w-full flex items-center justify-between gap-3 px-4 py-2.5 text-sm text-left transition-colors",
                                "hover:bg-muted",
                                isSelected && "bg-primary/10 text-primary"
                              )}
                            >
                              <span className="capitalize truncate">{subject}</span>
                              {hasNotes && (
                                <span className="label-mono text-[9px] px-1.5 py-0.5 rounded bg-accent/10 text-accent border border-accent/20 shrink-0">
                                  notes
                                </span>
                              )}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* View Notes button */}
              <button
                onClick={() => handleNavigate(selectedSubject)}
                disabled={!selectedSubject}
                className={cn(
                  "mt-3 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl",
                  "text-sm font-semibold transition-all duration-150",
                  selectedSubject
                    ? "bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
              >
                View Notes <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* ── Subject cards grid ──────────────────────────────────────── */}
            {subjectList.length > 0 && (
              <div>
                <p className="label-mono text-[11px] mb-4">OR CLICK DIRECTLY</p>

                {/*
                  Responsive grid:
                  - mobile  : 1 col
                  - sm      : 2 cols
                  - lg      : 3 cols
                  - xl+     : 4 cols   ← fills the full desktop width
                */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {subjectList.map((subject, i) => {
                    const hasNotes = subjectsWithNotes.has(subject.toLowerCase());
                    return (
                      <button
                        key={subject}
                        onClick={() => handleNavigate(subject)}
                        className={cn(
                          "animate-fade-up text-left px-4 py-3.5 bg-card border border-border rounded-xl",
                          "hover:border-accent/40 hover:bg-muted/50 transition-all duration-150",
                          "group flex items-center gap-3 w-full"
                        )}
                        style={{ animationDelay: `${i * 30}ms` }}
                      >
                        {/* Icon */}
                        <div className="w-8 h-8 bg-accent/10 border border-accent/20 rounded-md flex items-center justify-center shrink-0">
                          <BookOpen className="w-3.5 h-3.5 text-accent" />
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground capitalize truncate leading-snug">
                            {subject}
                          </p>
                          {hasNotes ? (
                            <span className="label-mono text-[9px] text-accent">has notes</span>
                          ) : (
                            <span className="label-mono text-[9px] text-muted-foreground">no notes yet</span>
                          )}
                        </div>

                        {/* Arrow */}
                        <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-accent transition-colors shrink-0" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}