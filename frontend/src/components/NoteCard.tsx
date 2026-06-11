import { FileText, Download, Star, Trash2, Edit2, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Note, useNoteStore } from "@/store/useNoteStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useState } from "react";
import { cn } from "@/lib/utils";

const FILE_LABELS: Record<string, string> = {
  "application/pdf": "PDF",
  "application/msword": "DOC",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX",
  "application/vnd.ms-powerpoint": "PPT",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "PPTX",
};

const FILE_COLORS: Record<string, string> = {
  PDF:  "text-red-400 bg-red-400/10 border-red-400/20",
  DOC:  "text-blue-400 bg-blue-400/10 border-blue-400/20",
  DOCX: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  PPT:  "text-orange-400 bg-orange-400/10 border-orange-400/20",
  PPTX: "text-orange-400 bg-orange-400/10 border-orange-400/20",
};

function formatBytes(bytes: number) {
  if (!bytes) return "";
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${["B","KB","MB"][i]}`;
}

interface Props { note: Note; onEdit?: (n: Note) => void; }

export default function NoteCard({ note, onEdit }: Props) {
  const { authUser } = useAuthStore();
  const { trackDownload, deleteNote, rateNote } = useNoteStore();
  const [userRating, setUserRating] = useState(0);
  const [hovered, setHovered] = useState(0);

  const label = FILE_LABELS[note.fileType] ?? "FILE";
  const colorClass = FILE_COLORS[label] ?? "text-muted-foreground bg-muted border-border";
  const isAdmin = authUser?.role === "admin";

  const handleDownload = async () => {
    await trackDownload(note._id);
    window.open(note.fileUrl, "_blank");
  };

  const handleRate = async (v: number) => {
    setUserRating(v);
    await rateNote(note._id, v);
  };

  return (
    <Card className="card-hover group border-border bg-card flex flex-col h-full overflow-hidden">
      {/* Top accent bar */}
      <div className="h-0.5 w-full bg-gradient-to-r from-primary/60 via-accent/40 to-transparent" />

      <CardContent className="p-4 sm:p-5 flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="w-9 h-9 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4 text-primary" />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            <span className={cn("label-mono px-2 py-0.5 rounded border text-[10px]", colorClass)}>
              {label}
            </span>
            {note.subjectCode && (
              <span className="label-mono px-2 py-0.5 rounded border border-border text-muted-foreground text-[10px]">
                {note.subjectCode}
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-foreground text-sm sm:text-base leading-snug mb-1.5 line-clamp-2">
          {note.title}
        </h3>

        {/* Description */}
        {note.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed font-mono">
            {note.description}
          </p>
        )}

        {/* Meta row */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground font-mono mt-3">
          <span className="flex items-center gap-1">
            <User className="w-3 h-3" />
            {note.uploadedBy?.fullName ?? "Admin"}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(note.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
          </span>
          <span className="flex items-center gap-1">
            <Download className="w-3 h-3" />
            {note.downloads ?? 0}
          </span>
          {note.fileSize > 0 && <span>{formatBytes(note.fileSize)}</span>}
        </div>

        {/* Stars */}
        <div className="flex items-center gap-0.5 mt-3">
          {[1,2,3,4,5].map((s) => (
            <button
              key={s}
              onClick={() => handleRate(s)}
              onMouseEnter={() => setHovered(s)}
              onMouseLeave={() => setHovered(0)}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={cn("w-3.5 h-3.5 transition-colors", {
                  "fill-accent text-accent": s <= (hovered || userRating || Math.round(note.avgRating)),
                  "text-muted": s > (hovered || userRating || Math.round(note.avgRating)),
                })}
              />
            </button>
          ))}
          <span className="text-[11px] text-muted-foreground font-mono ml-1.5">
            {note.avgRating > 0 ? `${note.avgRating} (${note.ratings?.length})` : "—"}
          </span>
        </div>
      </CardContent>

      <CardFooter className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0 flex gap-2">
        <Button
          onClick={handleDownload}
          size="sm"
          className="flex-1 gap-1.5 h-8 text-xs bg-primary hover:bg-primary/90"
        >
          <Download className="w-3.5 h-3.5" /> Download
        </Button>
        {isAdmin && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit?.(note)}
              className="h-8 w-8 p-0 border-border hover:border-primary/50 hover:text-primary"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => confirm(`Delete "${note.title}"?`) && deleteNote(note._id)}
              className="h-8 w-8 p-0 border-border hover:border-destructive/50 hover:text-destructive"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
