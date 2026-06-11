// ─────────────────────────────────────────────────────────────────────────────
// COURSE CONFIGURATION
// To add a new course: add an entry here. The whole app picks it up automatically.
// ─────────────────────────────────────────────────────────────────────────────

export interface CourseConfig {
  name: string;        // Display name
  semesters: number;   // Total number of semesters
  emoji: string;       // Icon emoji shown on dashboard
  description: string; // Short subtitle
  accentClass: string; // Tailwind border/bg class for course card
}

export const COURSE_CONFIG: Record<string, CourseConfig> = {
  btech: {
    name: "B.Tech",
    semesters: 8,
    emoji: "⚙️",
    description: "Bachelor of Technology",
    accentClass: "border-blue-500/30 hover:border-blue-500/60",
  },
  bca: {
    name: "BCA",
    semesters: 6,
    emoji: "🖥️",
    description: "Bachelor of Computer Applications",
    accentClass: "border-green-500/30 hover:border-green-500/60",
  },
  mca: {
    name: "MCA",
    semesters: 4,
    emoji: "💻",
    description: "Master of Computer Applications",
    accentClass: "border-purple-500/30 hover:border-purple-500/60",
  },
  mba: {
    name: "MBA",
    semesters: 4,
    emoji: "📊",
    description: "Master of Business Administration",
    accentClass: "border-amber-500/30 hover:border-amber-500/60",
  },
  bsc: {
    name: "B.Sc",
    semesters: 6,
    emoji: "🔬",
    description: "Bachelor of Science",
    accentClass: "border-cyan-500/30 hover:border-cyan-500/60",
  },
};

export const getCourse = (key: string): CourseConfig =>
  COURSE_CONFIG[key] ?? {
    name: key.toUpperCase(),
    semesters: 8,
    emoji: "📘",
    description: "Course",
    accentClass: "border-border hover:border-primary/40",
  };

export const getAllCourses = () => Object.entries(COURSE_CONFIG).map(([key, cfg]) => ({ key, ...cfg }));
