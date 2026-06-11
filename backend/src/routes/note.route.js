import express from "express";
import { protectRoute, adminRoute } from "../middleware/auth.moddleware.js";
import upload from "../lib/multer.js";
import {
  uploadNote,
  getNotes,
  getCourses,
  getSemesters,
  getSubjects,
  getNotesBySubject,
  trackDownload,
  rateNote,
  deleteNote,
  updateNote,
  getStats,
} from "../controllers/note.controller.js";

const router = express.Router();

// Public (authenticated)
router.get("/", protectRoute, getNotes);
router.get("/courses", protectRoute, getCourses);
router.get("/stats", protectRoute, adminRoute, getStats);
router.get("/:course/semesters", protectRoute, getSemesters);
router.get("/:course/:semester/subjects", protectRoute, getSubjects);
router.get("/:course/:semester/:subject", protectRoute, getNotesBySubject);
router.post("/:id/download", protectRoute, trackDownload);
router.post("/:id/rate", protectRoute, rateNote);

// Admin only
router.post("/upload", protectRoute, adminRoute, upload.single("file"), uploadNote);
router.put("/:id", protectRoute, adminRoute, updateNote);
router.delete("/:id", protectRoute, adminRoute, deleteNote);

export default router;
