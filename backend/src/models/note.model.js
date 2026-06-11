import mongoose from "mongoose";
import { VALID_COURSES } from "../lib/courseConfig.js";

const noteSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    course:      { type: String, required: true, enum: VALID_COURSES },
    semester:    { type: Number, required: true, min: 1, max: 8 },
    subject:     { type: String, required: true, trim: true },
    subjectCode: { type: String, default: "", trim: true },
    fileUrl:     { type: String, required: true },
    publicId:    { type: String, required: true },
    fileType:    { type: String, required: true },
    fileSize:    { type: Number, default: 0 },
    uploadedBy:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    downloads:   { type: Number, default: 0 },
    ratings: [{
      user:  { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      value: { type: Number, min: 1, max: 5 },
    }],
  },
  { timestamps: true }
);

noteSchema.virtual("avgRating").get(function () {
  if (!this.ratings?.length) return 0;
  return Math.round((this.ratings.reduce((s, r) => s + r.value, 0) / this.ratings.length) * 10) / 10;
});

noteSchema.set("toJSON", { virtuals: true });
noteSchema.set("toObject", { virtuals: true });

export default mongoose.model("Note", noteSchema);
