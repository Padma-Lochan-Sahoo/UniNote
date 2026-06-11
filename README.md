# 📚 UniNote

> Semester-wise study notes platform for university students.

A full-stack EdTech application where faculty admins upload course notes (PDF/DOCX/PPT) and students browse them by course → semester → subject, rate them, and download with one click.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite (SWC) |
| Styling | Tailwind CSS + shadcn/ui |
| State | Zustand (with persist) |
| Data Fetching | TanStack Query v5 |
| Backend | Node.js + Express 5 |
| Database | MongoDB + Mongoose |
| Auth | JWT (httpOnly cookies) + OTP email |
| File Storage | Cloudinary |
| Email | Nodemailer (Gmail) |

## Features

- 🌑 **Dark-first design** — JetBrains Mono + Inter, `#0A0A0A` background, `#1B1BFF` primary, `#00FF9C` accent
- 🔐 **OTP-verified registration** — bcrypt-hashed, 10-min TTL
- 📱 **Fully mobile responsive** — hamburger nav, adaptive grids
- 📁 **Course → Semester → Subject drill-down** (real API data, zero hardcoding)
- 🗂️ **Course Config** — `src/lib/courseConfig.ts` — add a new course in one place
- ⬆️ **Admin upload** — PDF/DOCX/PPT via Cloudinary (memoryStorage → stream upload)
- ⭐ **Star ratings** — per-user, average displayed on card
- 📥 **Download tracking** — increments on each download
- 🛡️ **Role-based auth** — `adminRoute` middleware, `ProtectedRoute` component
- 🔍 **Admin search + course filter**
- 📊 **Admin stats dashboard** — total notes, downloads, active courses

## Quick Start

### Backend
```bash
cd backend && npm install
cp .env.example .env   # fill in your credentials
npm run dev
```

### Frontend
```bash
cd frontend && npm install
npm run dev
```

## Course Configuration

Edit `frontend/src/lib/courseConfig.ts` (and mirror in `backend/src/lib/courseConfig.js`) to add a new course:

```ts
export const COURSE_CONFIG = {
  btech: { name: "B.Tech", semesters: 8, emoji: "⚙️", ... },
  bca:   { name: "BCA",    semesters: 6, emoji: "🖥️", ... },
  mca:   { name: "MCA",    semesters: 4, emoji: "💻", ... },
  mba:   { name: "MBA",    semesters: 4, emoji: "📊", ... },
  // Add here ↓
  bsc: { name: "B.Sc", semesters: 6, emoji: "🔬", description: "Bachelor of Science", accentClass: "..." },
};
```

That's it — the dashboard, CourseView semester grid, and AdminPanel upload form all pick it up automatically.
