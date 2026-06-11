import { v2 as cloudinary } from "cloudinary";
import Note from "../models/note.model.js";

// Upload a note (admin only)
export const uploadNote = async (req, res) => {
  try {
    const { title, description, course, semester, subject, subjectCode } = req.body;
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // Upload buffer to Cloudinary as raw resource
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          folder: `studyroot/${course}/sem${semester}/${subject}`,
          public_id: `${Date.now()}_${req.file.originalname.replace(/\s+/g, "_")}`,
          access_mode: "public",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    const note = await Note.create({
      title,
      description,
      course,
      semester: Number(semester),
      subject,
      subjectCode,
      fileUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      uploadedBy: req.user._id,
    });

    await note.populate("uploadedBy", "fullName email");
    res.status(201).json(note);
  } catch (err) {
    console.error("uploadNote error:", err);
    res.status(500).json({ message: err.message || "Upload failed" });
  }
};

// Get all notes (with filters)
export const getNotes = async (req, res) => {
  try {
    const { course, semester, subject, search } = req.query;
    const filter = {};
    if (course) filter.course = course;
    if (semester) filter.semester = Number(semester);
    if (subject) filter.subject = new RegExp(subject, "i");
    if (search) filter.title = new RegExp(search, "i");

    const notes = await Note.find(filter)
      .populate("uploadedBy", "fullName email")
      .sort({ createdAt: -1 });

    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get distinct courses
export const getCourses = async (req, res) => {
  try {
    const courses = await Note.distinct("course");
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get semesters for a course
export const getSemesters = async (req, res) => {
  try {
    const { course } = req.params;
    const semesters = await Note.distinct("semester", { course });
    res.json(semesters.sort((a, b) => a - b));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get subjects for a course+semester
export const getSubjects = async (req, res) => {
  try {
    const { course, semester } = req.params;
    const subjects = await Note.distinct("subject", {
      course,
      semester: Number(semester),
    });
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get notes for a course+semester+subject
export const getNotesBySubject = async (req, res) => {
  try {
    const { course, semester, subject } = req.params;
    const notes = await Note.find({
      course,
      semester: Number(semester),
      subject: new RegExp(`^${subject}$`, "i"),
    })
      .populate("uploadedBy", "fullName email")
      .sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Increment download count
export const trackDownload = async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloads: 1 } },
      { new: true }
    );
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json({ downloads: note.downloads });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Rate a note
export const rateNote = async (req, res) => {
  try {
    const { value } = req.body;
    if (!value || value < 1 || value > 5)
      return res.status(400).json({ message: "Rating must be 1–5" });

    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    const existing = note.ratings.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (existing) {
      existing.value = value;
    } else {
      note.ratings.push({ user: req.user._id, value });
    }
    await note.save();
    res.json({ avgRating: note.avgRating, totalRatings: note.ratings.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a note (admin only)
export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    await cloudinary.uploader.destroy(note.publicId, { resource_type: "raw" });
    await note.deleteOne();
    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a note (admin only)
export const updateNote = async (req, res) => {
  try {
    const { title, description, subjectCode } = req.body;
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { title, description, subjectCode },
      { new: true }
    ).populate("uploadedBy", "fullName email");
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin stats
export const getStats = async (req, res) => {
  try {
    const [totalNotes, totalDownloads, perCourse] = await Promise.all([
      Note.countDocuments(),
      Note.aggregate([{ $group: { _id: null, total: { $sum: "$downloads" } } }]),
      Note.aggregate([{ $group: { _id: "$course", count: { $sum: 1 } } }]),
    ]);
    res.json({
      totalNotes,
      totalDownloads: totalDownloads[0]?.total || 0,
      perCourse,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
