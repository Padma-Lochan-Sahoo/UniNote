// ─────────────────────────────────────────────────────────────────────────────
// COURSE CONFIGURATION — single source of truth for the whole app.
//
// To add a new course  →  add an entry to COURSE_CONFIG.
// To add/rename a subject  →  edit the subjectsBySemester map for that course.
//
// The Dashboard, CourseView, and SemesterView all read directly from this file
// and no longer depend on the database being populated first.
// ─────────────────────────────────────────────────────────────────────────────

export interface CourseConfig {
  name: string;
  /** Total number of semesters */
  semesters: number;
  emoji: string;
  description: string;
  /** Tailwind class(es) applied to the course card border */
  accentClass: string;
  /** Canonical subject list per semester — drives SemesterView subject grid */
  subjectsBySemester: Record<number, string[]>;
}

export const COURSE_CONFIG: Record<string, CourseConfig> = {
  btech: {
    name: "B.Tech",
    semesters: 8,
    emoji: "⚙️",
    description: "Bachelor of Technology",
    accentClass: "border-blue-500/30 hover:border-blue-500/60",
    subjectsBySemester: {
      1: ["Mathematics I", "Physics", "Chemistry", "Engineering Drawing", "Basic Electronics"],
      2: ["Mathematics II", "Engineering Mechanics", "Programming in C", "Environmental Science", "Communication Skills"],
      3: ["Data Structures", "Digital Electronics", "Discrete Mathematics", "Object Oriented Programming", "Database Management Systems"],
      4: ["Analysis of Algorithms", "Computer Organization", "Operating Systems", "Software Engineering", "Computer Networks"],
      5: ["Compiler Design", "Theory of Computation", "Artificial Intelligence", "Web Technologies", "Elective I"],
      6: ["Machine Learning", "Cloud Computing", "Information Security", "Mobile Application Development", "Elective II"],
      7: ["Big Data Analytics", "Internet of Things", "Project Management", "Elective III", "Minor Project"],
      8: ["Major Project", "Seminar", "Elective IV"],
    },
  },

  bca: {
    name: "BCA",
    semesters: 6,
    emoji: "🖥️",
    description: "Bachelor of Computer Applications",
    accentClass: "border-green-500/30 hover:border-green-500/60",
    subjectsBySemester: {
      1: ["Mathematics I", "Programming in C", "Computer Fundamentals", "Digital Electronics", "Communication Skills"],
      2: ["Mathematics II", "Data Structures", "Object Oriented Programming", "Database Management Systems", "Web Designing"],
      3: ["Operating Systems", "Computer Networks", "Java Programming", "Software Engineering", "Numerical Methods"],
      4: ["Analysis of Algorithms", "Advanced Java", "Python Programming", "Computer Graphics", "Elective I"],
      5: ["Artificial Intelligence", "Mobile Computing", "Information Security", "Cloud Computing", "Minor Project"],
      6: ["Major Project", "Machine Learning", "Seminar", "Elective II"],
    },
  },

  mca: {
    name: "MCA",
    semesters: 4,
    emoji: "💻",
    description: "Master of Computer Applications",
    accentClass: "border-purple-500/30 hover:border-purple-500/60",
    subjectsBySemester: {
      1: ["Advanced Mathematics", "Data Structures & Algorithms", "Advanced DBMS", "System Software", "Object Oriented Analysis & Design"],
      2: ["Advanced Operating Systems", "Advanced Computer Networks", "Software Engineering", "Web Application Development", "Elective I"],
      3: ["Machine Learning", "Cloud Computing", "Information Security", "Research Methodology", "Minor Project"],
      4: ["Major Project", "Seminar", "Elective II"],
    },
  },

  mba: {
    name: "MBA",
    semesters: 4,
    emoji: "📊",
    description: "Master of Business Administration",
    accentClass: "border-amber-500/30 hover:border-amber-500/60",
    subjectsBySemester: {
      1: ["Management Concepts", "Organisational Behaviour", "Business Economics", "Accounting for Managers", "Business Communication"],
      2: ["Marketing Management", "Financial Management", "Human Resource Management", "Operations Management", "Research Methodology"],
      3: ["Strategic Management", "Business Ethics", "Elective I", "Elective II", "Summer Project"],
      4: ["Major Project", "Entrepreneurship", "Elective III", "Seminar"],
    },
  },

  bsc: {
    name: "B.Sc",
    semesters: 6,
    emoji: "🔬",
    description: "Bachelor of Science",
    accentClass: "border-cyan-500/30 hover:border-cyan-500/60",
    subjectsBySemester: {
      1: ["Mathematics I", "Physics I", "Chemistry I", "English", "Environmental Science"],
      2: ["Mathematics II", "Physics II", "Chemistry II", "Computer Science Basics", "Communication Skills"],
      3: ["Applied Mathematics", "Optics", "Organic Chemistry", "Programming in Python", "Statistics I"],
      4: ["Numerical Methods", "Electromagnetism", "Physical Chemistry", "Data Science Basics", "Statistics II"],
      5: ["Complex Analysis", "Quantum Mechanics", "Inorganic Chemistry", "Machine Learning Basics", "Minor Project"],
      6: ["Major Project", "Seminar", "Elective I", "Elective II"],
    },
  },

  // ── Add a new course here ──────────────────────────────────────────────────
  // example: {
  //   name: "B.Com",
  //   semesters: 6,
  //   emoji: "💼",
  //   description: "Bachelor of Commerce",
  //   accentClass: "border-pink-500/30 hover:border-pink-500/60",
  //   subjectsBySemester: {
  //     1: ["Financial Accounting", "Business Law", ...],
  //     ...
  //   },
  // },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const getCourse = (key: string): CourseConfig =>
  COURSE_CONFIG[key] ?? {
    name: key.toUpperCase(),
    semesters: 8,
    emoji: "📘",
    description: "Course",
    accentClass: "border-border hover:border-primary/40",
    subjectsBySemester: {},
  };

/** All courses as a flat array — used on Dashboard and AdminPanel */
export const getAllCourses = () =>
  Object.entries(COURSE_CONFIG).map(([key, cfg]) => ({ key, ...cfg }));

/** All semester numbers for a given course key (1 … n) */
export const getSemestersForCourse = (courseKey: string): number[] => {
  const cfg = COURSE_CONFIG[courseKey];
  if (!cfg) return [];
  return Array.from({ length: cfg.semesters }, (_, i) => i + 1);
};

/** Subject list for a specific course + semester */
export const getSubjectsForSemester = (courseKey: string, semester: number): string[] =>
  COURSE_CONFIG[courseKey]?.subjectsBySemester?.[semester] ?? [];