import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { FileText, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import NoteCard from "@/components/NoteCard";
import EmptyState from "@/components/EmptyState";
import { useNoteStore } from "@/store/useNoteStore";
import { getCourse } from "@/lib/courseConfig";

export default function SubjectView() {
  const { course, semester, subject } = useParams<{
    course: string;
    semester: string;
    subject: string;
  }>();

  const { notes, fetchNotesBySubject, clearNotes, loadingNotes } = useNoteStore();
  const meta = getCourse(course ?? "");
  const decodedSubject = subject ? decodeURIComponent(subject) : "";

  useEffect(() => {
    if (course && semester && subject)
      fetchNotesBySubject(course, Number(semester), decodedSubject);

    // ★ Clear on unmount so the next SubjectView never flashes stale notes
    return () => clearNotes();
  }, [course, semester, subject]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="page-container section-padding">
        <PageHeader
          title={decodedSubject}
          subtitle={`${meta.name} · Semester ${semester}`}
          crumbs={[
            { label: "dashboard", to: "/dashboard" },
            { label: meta.name, to: `/dashboard/${course}` },
            { label: `sem ${semester}`, to: `/dashboard/${course}/${semester}` },
            { label: decodedSubject },
          ]}
        />

        {loadingNotes ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-7 h-7 animate-spin text-primary" />
          </div>
        ) : notes.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No notes yet"
            description="Notes for this subject haven't been uploaded yet."
          />
        ) : (
          <>
            <p className="label-mono mb-5 text-[11px]">
              {notes.length} note{notes.length !== 1 ? "s" : ""} found
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {notes.map((note, i) => (
                <div
                  key={note._id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <NoteCard note={note} />
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}