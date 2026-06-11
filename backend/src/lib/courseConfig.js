// ─────────────────────────────────────────────────────────────────────────────
// COURSE CONFIGURATION (backend mirror)
// Keeps semester count authoritative on the server for validation.
// ─────────────────────────────────────────────────────────────────────────────

export const COURSE_CONFIG = {
  btech: { name: "B.Tech", semesters: 8 },
  bca:   { name: "BCA",    semesters: 6 },
  mca:   { name: "MCA",    semesters: 4 },
  mba:   { name: "MBA",    semesters: 4 },
  // Add new courses here
};

export const VALID_COURSES = Object.keys(COURSE_CONFIG);

export const getMaxSemester = (course) => COURSE_CONFIG[course]?.semesters ?? 8;
