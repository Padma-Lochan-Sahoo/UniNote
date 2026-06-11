import { useEffect, useRef, useState } from "react";
import {
  Upload, Search, FileText, Download, Star,
  BookOpen, X, Loader2, Filter, Save, Edit2, Trash2, TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import NoteCard from "@/components/NoteCard";
import EmptyState from "@/components/EmptyState";
import { useNoteStore, Note } from "@/store/useNoteStore";
import { useAuthStore } from "@/store/useAuthStore";
import { getAllCourses, getCourse } from "@/lib/courseConfig";
import { cn } from "@/lib/utils";

const ALL_COURSES = getAllCourses();

export default function AdminPanel() {
  const { authUser } = useAuthStore();
  const { notes, stats, isLoading, isUploading, fetchAllNotes, fetchStats, uploadNote, updateNote, deleteNote } = useNoteStore();

  const [uploadOpen, setUploadOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({ title: "", description: "", course: "", semester: "", subject: "", subjectCode: "" });
  const fileRef = useRef<HTMLInputElement>(null);

  const [editNote, setEditNote] = useState<Note | null>(null);
  const [editForm, setEditForm] = useState({ title: "", description: "", subjectCode: "" });

  const [search, setSearch] = useState("");
  const [filterCourse, setFilterCourse] = useState("all");

  useEffect(() => { fetchAllNotes(); fetchStats(); }, []);

  // Dynamic semesters from course config
  const selectedCourseMeta = form.course ? getCourse(form.course) : null;
  const semesterOptions = selectedCourseMeta
    ? Array.from({ length: selectedCourseMeta.semesters }, (_, i) => i + 1)
    : Array.from({ length: 8 }, (_, i) => i + 1);

  const handleUpload = async () => {
    if (!file || !form.title || !form.course || !form.semester || !form.subject) return;
    const fd = new FormData();
    fd.append("file", file);
    Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
    const ok = await uploadNote(fd);
    if (ok) {
      setUploadOpen(false);
      setFile(null);
      setForm({ title: "", description: "", course: "", semester: "", subject: "", subjectCode: "" });
      fetchAllNotes(); fetchStats();
    }
  };

  const handleEditSave = async () => {
    if (!editNote) return;
    await updateNote(editNote._id, editForm);
    setEditNote(null);
    fetchAllNotes();
  };

  const openEdit = (note: Note) => {
    setEditNote(note);
    setEditForm({ title: note.title, description: note.description, subjectCode: note.subjectCode });
  };

  const filtered = notes.filter(n => {
    const q = search.toLowerCase();
    const matchSearch = !search || n.title.toLowerCase().includes(q) || n.subject.toLowerCase().includes(q);
    const matchCourse = filterCourse === "all" || n.course === filterCourse;
    return matchSearch && matchCourse;
  });

  const inputClass = "bg-muted border-border text-foreground placeholder:text-muted-foreground text-sm h-9 font-mono focus:border-primary focus-visible:ring-0 focus-visible:ring-offset-0";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="page-container section-padding">
        <PageHeader
          title="Admin Panel"
          subtitle={`manage notes · ${authUser?.email}`}
          actions={
            <Button onClick={() => setUploadOpen(true)} size="sm" className="gap-2 bg-primary hover:bg-primary/90 h-9">
              <Upload className="w-3.5 h-3.5" /> Upload Note
            </Button>
          }
        />

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {[
              { label: "Total Notes", value: stats.totalNotes, icon: FileText, color: "text-primary" },
              { label: "Total Downloads", value: stats.totalDownloads, icon: Download, color: "text-accent" },
              { label: "Active Courses", value: stats.perCourse.length, icon: BookOpen, color: "text-purple-400" },
              { label: "Avg Rating", value: "4.8★", icon: Star, color: "text-amber-400" },
            ].map(({ label, value, icon: Icon, color }) => (
              <Card key={label} className="border-border bg-card">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={cn("w-9 h-9 rounded-lg bg-muted border border-border flex items-center justify-center shrink-0", color)}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-foreground font-mono">{value}</p>
                    <p className="label-mono text-[10px]">{label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              className={`pl-9 ${inputClass}`}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <Select value={filterCourse} onValueChange={setFilterCourse}>
            <SelectTrigger className={`sm:w-44 ${inputClass} flex items-center gap-2`}>
              <Filter className="w-3.5 h-3.5 text-muted-foreground" />
              <SelectValue placeholder="All Courses" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="all" className="text-foreground font-mono text-sm">All Courses</SelectItem>
              {ALL_COURSES.map(c => (
                <SelectItem key={c.key} value={c.key} className="text-foreground font-mono text-sm">{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Count */}
        {filtered.length > 0 && (
          <p className="label-mono text-[11px] mb-4">{filtered.length} note{filtered.length !== 1 ? "s" : ""}{filterCourse !== "all" ? ` in ${getCourse(filterCourse).name}` : ""}</p>
        )}

        {/* Notes grid */}
        {isLoading ? (
          <div className="flex justify-center py-24"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No notes found"
            description={search || filterCourse !== "all" ? "Try adjusting your filters." : "Upload your first note to get started."}
            action={
              <Button onClick={() => setUploadOpen(true)} size="sm" className="gap-2 bg-primary hover:bg-primary/90">
                <Upload className="w-3.5 h-3.5" /> Upload Note
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((note, i) => (
              <div key={note._id} className="animate-fade-up" style={{ animationDelay: `${i * 40}ms` }}>
                <NoteCard note={note} onEdit={openEdit} />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ── Upload Dialog ───────────────────────────── */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <div className="w-7 h-7 bg-primary/10 border border-primary/20 rounded-md flex items-center justify-center">
                <Upload className="w-3.5 h-3.5 text-primary" />
              </div>
              Upload New Note
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-1">
            {/* Dropzone */}
            <div
              onClick={() => fileRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all",
                file
                  ? "border-accent/50 bg-accent/5"
                  : "border-border hover:border-primary/50 hover:bg-primary/5"
              )}
            >
              <input
                ref={fileRef} type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx"
                className="hidden"
                onChange={e => setFile(e.target.files?.[0] ?? null)}
              />
              {file ? (
                <div className="flex items-center justify-center gap-2 text-accent">
                  <FileText className="w-5 h-5 shrink-0" />
                  <span className="font-mono text-sm truncate max-w-xs">{file.name}</span>
                  <button onClick={e => { e.stopPropagation(); setFile(null); }} className="ml-1 text-muted-foreground hover:text-foreground shrink-0">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="w-7 h-7 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm font-medium text-foreground">Click to choose file</p>
                  <p className="label-mono mt-1 text-[11px]">PDF · DOC · DOCX · PPT · PPTX · max 20 MB</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Label className="label-mono text-[10px]">TITLE *</Label>
                <Input className={`mt-1.5 ${inputClass}`} placeholder="e.g. Unit 1 — Arrays & Pointers" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>
              <div>
                <Label className="label-mono text-[10px]">COURSE *</Label>
                <Select value={form.course} onValueChange={v => setForm({ ...form, course: v, semester: "" })}>
                  <SelectTrigger className={`mt-1.5 ${inputClass}`}><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {ALL_COURSES.map(c => (
                      <SelectItem key={c.key} value={c.key} className="text-foreground font-mono text-sm">{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="label-mono text-[10px]">SEMESTER *</Label>
                <Select value={form.semester} onValueChange={v => setForm({ ...form, semester: v })} disabled={!form.course}>
                  <SelectTrigger className={`mt-1.5 ${inputClass}`}><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {semesterOptions.map(s => (
                      <SelectItem key={s} value={String(s)} className="text-foreground font-mono text-sm">Semester {s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="label-mono text-[10px]">SUBJECT *</Label>
                <Input className={`mt-1.5 ${inputClass}`} placeholder="e.g. Data Structures" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
              </div>
              <div>
                <Label className="label-mono text-[10px]">SUBJECT CODE</Label>
                <Input className={`mt-1.5 ${inputClass}`} placeholder="e.g. CS301" value={form.subjectCode} onChange={e => setForm({ ...form, subjectCode: e.target.value })} />
              </div>
              <div className="col-span-2">
                <Label className="label-mono text-[10px]">DESCRIPTION</Label>
                <Textarea
                  className={`mt-1.5 ${inputClass} min-h-0 resize-none`}
                  placeholder="Brief description..." rows={3}
                  value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <Button variant="outline" className="flex-1 border-border h-9 text-sm" onClick={() => setUploadOpen(false)}>Cancel</Button>
              <Button
                className="flex-1 gap-2 bg-primary hover:bg-primary/90 h-9 text-sm"
                onClick={handleUpload}
                disabled={isUploading || !file || !form.title || !form.course || !form.semester || !form.subject}
              >
                {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Edit Dialog ─────────────────────────────── */}
      <Dialog open={!!editNote} onOpenChange={o => !o && setEditNote(null)}>
        <DialogContent className="max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <div className="w-7 h-7 bg-primary/10 border border-primary/20 rounded-md flex items-center justify-center">
                <Edit2 className="w-3.5 h-3.5 text-primary" />
              </div>
              Edit Note
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-1">
            <div>
              <Label className="label-mono text-[10px]">TITLE</Label>
              <Input className={`mt-1.5 ${inputClass}`} value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} />
            </div>
            <div>
              <Label className="label-mono text-[10px]">SUBJECT CODE</Label>
              <Input className={`mt-1.5 ${inputClass}`} value={editForm.subjectCode} onChange={e => setEditForm({ ...editForm, subjectCode: e.target.value })} />
            </div>
            <div>
              <Label className="label-mono text-[10px]">DESCRIPTION</Label>
              <Textarea className={`mt-1.5 ${inputClass} min-h-0 resize-none`} rows={3} value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} />
            </div>
            <div className="flex gap-2 pt-1">
              <Button variant="outline" className="flex-1 border-border h-9 text-sm" onClick={() => setEditNote(null)}>Cancel</Button>
              <Button className="flex-1 gap-2 bg-primary hover:bg-primary/90 h-9 text-sm" onClick={handleEditSave}>
                <Save className="w-3.5 h-3.5" /> Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
