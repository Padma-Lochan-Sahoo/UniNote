import { create } from "zustand";
import axios from "@/lib/axiosInstance";
import toast from "react-hot-toast";

export interface Note {
  _id: string;
  title: string;
  description: string;
  course: string;
  semester: number;
  subject: string;
  subjectCode: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  downloads: number;
  avgRating: number;
  ratings: { user: string; value: number }[];
  uploadedBy: { fullName: string; email: string };
  createdAt: string;
}

export interface Stats {
  totalNotes: number;
  totalDownloads: number;
  perCourse: { _id: string; count: number }[];
}

interface NoteStore {
  notes: Note[];
  courses: string[];
  semesters: number[];
  subjects: string[];
  stats: Stats | null;
  isLoading: boolean;
  isUploading: boolean;

  fetchCourses: () => Promise<void>;
  fetchSemesters: (course: string) => Promise<void>;
  fetchSubjects: (course: string, semester: number) => Promise<void>;
  fetchNotesBySubject: (course: string, semester: number, subject: string) => Promise<void>;
  fetchAllNotes: (filters?: Record<string, string>) => Promise<void>;
  uploadNote: (formData: FormData) => Promise<boolean>;
  deleteNote: (id: string) => Promise<boolean>;
  updateNote: (id: string, data: Partial<Note>) => Promise<boolean>;
  trackDownload: (id: string) => Promise<void>;
  rateNote: (id: string, value: number) => Promise<void>;
  fetchStats: () => Promise<void>;
}

export const useNoteStore = create<NoteStore>((set, get) => ({
  notes: [],
  courses: [],
  semesters: [],
  subjects: [],
  stats: null,
  isLoading: false,
  isUploading: false,

  fetchCourses: async () => {
    try {
      const res = await axios.get("/notes/courses");
      set({ courses: res.data });
    } catch { /* silent */ }
  },

  fetchSemesters: async (course) => {
    try {
      const res = await axios.get(`/notes/${course}/semesters`);
      set({ semesters: res.data });
    } catch { /* silent */ }
  },

  fetchSubjects: async (course, semester) => {
    try {
      const res = await axios.get(`/notes/${course}/${semester}/subjects`);
      set({ subjects: res.data });
    } catch { /* silent */ }
  },

  fetchNotesBySubject: async (course, semester, subject) => {
    set({ isLoading: true });
    try {
      const res = await axios.get(`/notes/${course}/${semester}/${subject}`);
      set({ notes: res.data });
    } catch {
      set({ notes: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAllNotes: async (filters = {}) => {
    set({ isLoading: true });
    try {
      const params = new URLSearchParams(filters).toString();
      const res = await axios.get(`/notes${params ? "?" + params : ""}`);
      set({ notes: res.data });
    } catch {
      set({ notes: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  uploadNote: async (formData) => {
    set({ isUploading: true });
    try {
      await axios.post("/notes/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Note uploaded successfully!");
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Upload failed");
      return false;
    } finally {
      set({ isUploading: false });
    }
  },

  deleteNote: async (id) => {
    try {
      await axios.delete(`/notes/${id}`);
      set((state) => ({ notes: state.notes.filter((n) => n._id !== id) }));
      toast.success("Note deleted");
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Delete failed");
      return false;
    }
  },

  updateNote: async (id, data) => {
    try {
      const res = await axios.put(`/notes/${id}`, data);
      set((state) => ({
        notes: state.notes.map((n) => (n._id === id ? res.data : n)),
      }));
      toast.success("Note updated");
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Update failed");
      return false;
    }
  },

  trackDownload: async (id) => {
    try { await axios.post(`/notes/${id}/download`); } catch { /* silent */ }
  },

  rateNote: async (id, value) => {
    try {
      await axios.post(`/notes/${id}/rate`, { value });
      toast.success("Rating submitted!");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Rating failed");
    }
  },

  fetchStats: async () => {
    try {
      const res = await axios.get("/notes/stats");
      set({ stats: res.data });
    } catch { /* silent */ }
  },
}));
