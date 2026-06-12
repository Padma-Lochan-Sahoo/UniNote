<div align="center">

<img src="https://img.shields.io/badge/UniNote-1.0.0-1B1BFF?style=for-the-badge&logo=bookstack&logoColor=white" alt="UniNote" />

# UniNote

**Semester-wise study notes platform for university students**

Browse, download, and rate faculty-uploaded course notes — organised by course, semester, and subject.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-uninote--zeta.vercel.app-00FF9C?style=flat-square&logo=vercel&logoColor=black)](https://uninote-zeta.vercel.app)
[![API](https://img.shields.io/badge/API-Render-46E3B7?style=flat-square&logo=render&logoColor=black)](https://uninote-wcxh.onrender.com/api)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Express](https://img.shields.io/badge/Express-5.1-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%208-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongoosejs.com)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Live Demo](#live-demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Course Configuration](#course-configuration)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

UniNote is a full-stack EdTech platform where faculty admins upload course notes (PDF, DOCX, PPT) and students browse them through a clean **Course → Semester → Subject** drill-down. Notes are stored on Cloudinary, authentication is OTP-verified via email, and access is role-based.

---

## Live Demo

| | URL |
|---|---|
| 🌐 **Frontend** | [https://uninote-zeta.vercel.app](https://uninote-zeta.vercel.app) |
| ⚙️ **Backend API** | [https://uninote-wcxh.onrender.com/api](https://uninote-wcxh.onrender.com/api) |

| Role | How to access |
|------|---------------|
| Student | Register via OTP on the live site |
| Admin | Contact the repo owner to have your role promoted |

> **Note:** The backend is hosted on Render's free tier. The first request after inactivity may take 30–60 seconds while the instance spins up.

---

## Features

| Feature | Details |
|---------|---------|
| 🌑 **Dark-first design** | JetBrains Mono + Inter · `#0A0A0A` bg · `#1B1BFF` primary · `#00FF9C` accent |
| 🔐 **OTP email auth** | 6-digit OTP · bcrypt-hashed · 10-min TTL · JWT in httpOnly cookie (7d) |
| 📱 **Mobile responsive** | Hamburger drawer nav · adaptive 1→2→3→4 col grids |
| 📁 **Drill-down browse** | Course → Semester → Subject → Notes (all from courseConfig, zero DB dependency for navigation) |
| ⬆️ **Admin upload** | PDF · DOCX · PPT up to 20 MB · Cloudinary stream upload · organised by folder |
| 🗂️ **Course config** | Single `courseConfig.ts` file drives the entire nav tree — add a course in one place |
| ⭐ **Star ratings** | Per-user ratings · server-side average · stored in note document |
| 📥 **Download tracking** | Increments on every download click |
| 🛡️ **Role-based auth** | `protectRoute` + `adminRoute` middleware · `ProtectedRoute` component |
| 🔍 **Admin tools** | Search · course filter · upload dialog · inline edit · delete · stats dashboard |
| 🚫 **No stale flash** | Zustand slices cleared on navigation — previous course/semester data never bleeds through |

---

## Tech Stack

### Frontend

| Package | Version | Purpose |
|---------|---------|---------|
| React | 18.3 | UI framework |
| TypeScript | 5.5 | Type safety |
| Vite (SWC) | 5.4 | Build tool |
| Tailwind CSS | 3.4 | Utility-first styling |
| shadcn/ui + Radix UI | — | Accessible component primitives |
| Zustand | 5.0 | Global state management |
| TanStack Query | 5.56 | Server state / caching |
| React Router | 6.26 | Client-side routing |
| React Hook Form | 7.53 | Form handling |
| Zod | 3.23 | Schema validation |
| Axios | 1.10 | HTTP client |
| Lucide React | 0.462 | Icons |
| react-hot-toast | 2.5 | Notifications |

### Backend

| Package | Version | Purpose |
|---------|---------|---------|
| Node.js | ≥ 18 | Runtime |
| Express | 5.1 | HTTP framework |
| MongoDB + Mongoose | 8.16 | Database + ODM |
| jsonwebtoken | 9.0 | JWT auth |
| bcryptjs | 3.0 | Password hashing |
| Nodemailer | 7.0 | OTP email delivery |
| Cloudinary SDK | 2.7 | File storage |
| Multer | 1.4 | Multipart upload |
| cookie-parser | 1.4 | Cookie middleware |
| dotenv | 17.2 | Environment config |
| nodemon | 3.1 | Dev auto-restart |

---

## Project Structure

```
UniNote/
├── backend/
│   └── src/
│       ├── controllers/
│       │   ├── auth.controller.js    # signup, login, logout, verifyOtp, checkAuth
│       │   └── note.controller.js    # upload, get, delete, update, rate, download, stats
│       ├── models/
│       │   ├── user.model.js         # User schema (email, fullName, password, role)
│       │   ├── otp.model.js          # OTP schema (TTL 600s, bcrypt-hashed)
│       │   └── note.model.js         # Note schema (file meta, ratings, downloads)
│       ├── routes/
│       │   ├── auth.route.js         # /api/auth/*
│       │   └── note.route.js         # /api/notes/*
│       ├── middleware/
│       │   └── auth.moddleware.js    # protectRoute, adminRoute
│       └── lib/
│           ├── db.js                 # MongoDB connection
│           ├── cloudinary.js         # Cloudinary config
│           ├── multer.js             # Memory storage, file-type filter
│           ├── utils.js              # generateToken, generateOTP, sendOtpEmail
│           └── courseConfig.js       # Backend mirror of course config (validation source)
│
└── frontend/
    └── src/
        ├── components/
        │   ├── ui/                   # shadcn/ui primitives
        │   ├── Navbar.tsx            # Sticky nav with mobile drawer
        │   ├── NoteCard.tsx          # Note display card with ratings & download
        │   ├── PageHeader.tsx        # Breadcrumb + title + actions
        │   ├── EmptyState.tsx        # Empty / zero-state component
        │   └── ProtectedRoute.tsx    # Role-based route guard
        ├── pages/
        │   ├── Index.tsx             # Landing page
        │   ├── Login.tsx             # Sign in / Sign up / OTP verify
        │   ├── Dashboard.tsx         # Course selection (from courseConfig)
        │   ├── CourseView.tsx        # Semester grid (from courseConfig)
        │   ├── SemesterView.tsx      # Subject list (config + DB badges)
        │   ├── SubjectView.tsx       # Notes grid for a subject
        │   ├── AdminPanel.tsx        # Upload, edit, delete, stats
        │   └── NotFound.tsx          # 404 page
        ├── store/
        │   ├── useAuthStore.ts       # Auth state (login, signup, OTP, logout)
        │   ├── useNoteStore.ts       # Notes state (fetch, upload, rate, clear helpers)
        │   └── useThemeStore.ts      # Dark/light toggle (persisted)
        └── lib/
            ├── axiosInstance.ts      # Axios with baseURL + credentials
            └── courseConfig.ts       # ★ Single source of truth for all courses
```

---

## Getting Started

### Prerequisites

- Node.js **≥ 18**
- npm **≥ 9**
- MongoDB Atlas cluster (free tier works)
- Cloudinary account (free tier works)
- Gmail account with an [App Password](https://support.google.com/accounts/answer/185833) enabled

### Backend Setup

```bash
# 1. Navigate to backend
cd backend

# 2. Install dependencies
npm install

# 3. Create your .env file
cp .env.example .env
# → Edit .env with your credentials (see Environment Variables below)

# 4. Start development server
npm run dev
# Server runs on http://localhost:5000
```

### Frontend Setup

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Create your .env file
cp .env.example .env
# → Set VITE_API_URL=http://localhost:5000/api for local dev

# 4. Start development server
npm run dev
# App runs on http://localhost:5173

# 5. Build for production
npm run build
```

---

## Environment Variables

### Backend — `backend/.env`

```env
# ── Server ────────────────────────────────────────────
PORT=5000
NODE_ENV=development

# ── Database ──────────────────────────────────────────
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/uninote

# ── Auth ──────────────────────────────────────────────
# Generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=your_super_secret_jwt_key_minimum_32_chars

# ── Email (OTP delivery) ──────────────────────────────
# Use a Gmail App Password — not your regular Gmail password
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_16_char_app_password

# ── Cloudinary (file storage) ─────────────────────────
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_SECRET_KEY=your_api_secret

# ── CORS ──────────────────────────────────────────────
FRONTEND_URL=http://localhost:5173
# Production: FRONTEND_URL=https://uninote-zeta.vercel.app
```

> **Security note:** Never commit your `.env` file. It is already listed in `.gitignore`.

### Frontend — `frontend/.env`

```env
# Local development
VITE_API_URL=http://localhost:5000/api

# Production (set this in Vercel dashboard — do not commit)
# VITE_API_URL=https://uninote-wcxh.onrender.com/api
```

---

## API Reference

**Base URL (Production):** `https://uninote-wcxh.onrender.com/api`  
**Base URL (Local):** `http://localhost:5000/api`

All protected routes require a valid JWT cookie (`jwt`) set at login.

### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/signup` | Public | Register — sends OTP to email |
| `POST` | `/verify-otp` | Public | Verify OTP — creates account + returns JWT cookie |
| `POST` | `/login` | Public | Login with email + password |
| `POST` | `/logout` | Public | Clears JWT cookie |
| `GET` | `/check` | 🔒 User | Returns current authenticated user |

### Notes — `/api/notes`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/` | 🔒 User | List notes (query params: `course`, `semester`, `subject`, `search`) |
| `GET` | `/courses` | 🔒 User | Distinct courses that have uploaded notes |
| `GET` | `/:course/semesters` | 🔒 User | Semesters with notes for a course |
| `GET` | `/:course/:semester/subjects` | 🔒 User | Subjects with notes for a course + semester |
| `GET` | `/:course/:semester/:subject` | 🔒 User | All notes for a specific subject |
| `POST` | `/:id/download` | 🔒 User | Increment download counter |
| `POST` | `/:id/rate` | 🔒 User | Submit or update a star rating `{ value: 1–5 }` |
| `GET` | `/stats` | 🔒 Admin | Total notes, downloads, per-course breakdown |
| `POST` | `/upload` | 🔒 Admin | Upload a new note file (`multipart/form-data`) |
| `PUT` | `/:id` | 🔒 Admin | Update note title / description / subjectCode |
| `DELETE` | `/:id` | 🔒 Admin | Delete note + Cloudinary file |

---

## Course Configuration

All navigation (courses, semesters, subjects) is driven by a single config file — **no database entry is needed before students can browse**.

**Frontend (UI source of truth):** `frontend/src/lib/courseConfig.ts`  
**Backend (validation mirror):** `backend/src/lib/courseConfig.js`

### Adding a new course — 3 steps

**Step 1 — Add to `frontend/src/lib/courseConfig.ts`**

```ts
export const COURSE_CONFIG = {
  // existing courses...

  // Add your course here ↓
  bcom: {
    name: "B.Com",
    semesters: 6,
    emoji: "💼",
    description: "Bachelor of Commerce",
    accentClass: "border-pink-500/30 hover:border-pink-500/60",
  },
};
```

**Step 2 — Mirror in `backend/src/lib/courseConfig.js`**

```js
export const COURSE_CONFIG = {
  // existing courses...
  bcom: { name: "B.Com", semesters: 6 },
};
```

**Step 3 — Deploy.** The Dashboard, CourseView, SemesterView, and AdminPanel upload form all pick it up automatically. No other changes needed.

> The backend config is the authoritative source for server-side validation. The frontend config mirrors it and adds UI metadata (emoji, description, accentClass).

---

## Deployment

### Backend — Render *(current deployment)*

The API is live at **[https://uninote-wcxh.onrender.com/api](https://uninote-wcxh.onrender.com/api)**.

To redeploy or set up your own instance on Render:

1. Create a new **Web Service** on [render.com](https://render.com) and connect your GitHub repo.
2. Set **Root Directory** to `backend`.
3. Set **Build Command** to `npm install`.
4. Set **Start Command** to `node src/server.js`.
5. Add all environment variables from the [Backend env section](#backend--backendenv) in the Render dashboard.
6. Set `NODE_ENV=production` and `FRONTEND_URL=https://uninote-zeta.vercel.app`.

> **Free tier note:** Render spins down inactive services. The first request after inactivity takes 30–60 seconds. Upgrade to a paid instance to eliminate cold starts.

### Frontend — Vercel *(current deployment)*

The frontend is live at **[https://uninote-zeta.vercel.app](https://uninote-zeta.vercel.app)**.

To redeploy or set up your own instance on Vercel:

1. Connect your GitHub repo to [vercel.com](https://vercel.com).
2. Set **Root Directory** to `frontend`.
3. Add the environment variable in the Vercel dashboard:
   ```
   VITE_API_URL = https://uninote-wcxh.onrender.com/api
   ```
4. Add a `vercel.json` inside the `frontend/` folder to handle client-side routing:
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/" }]
   }
   ```
5. Vercel auto-detects Vite and builds with `npm run build`.

> **Important:** In production, `NODE_ENV` must be `production` on the backend so the JWT cookie is issued with `sameSite: 'none'` and `secure: true`. The backend `CORS` origin must exactly match the Vercel URL — trailing slashes will cause CORS errors.

### Making a user an admin

There is no self-service admin promotion UI. Connect to your MongoDB Atlas cluster and run:

```js
db.users.updateOne(
  { email: "faculty@university.edu" },
  { $set: { role: "admin" } }
)
```

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: add subject search"`
4. Push to your fork: `git push origin feature/your-feature-name`
5. Open a Pull Request against the `main` branch.

Please ensure `npm run lint` passes in the `frontend/` directory before opening a PR.

---

## License

ISC © UniNote

---

<div align="center">

Made for students · Built with React, Express, and MongoDB

**[uninote-zeta.vercel.app](https://uninote-zeta.vercel.app)** · API: **[uninote-wcxh.onrender.com](https://uninote-wcxh.onrender.com/api)**

</div>