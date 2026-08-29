# EVENTOPS
> **"The real-time operating system for live events."**

[![Cloud Run Deployment](https://img.shields.io/badge/Google_Cloud_Run-Ready-4285F4?logo=googlecloud&logoColor=white)](https://cloud.google.com/run)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Vitest](https://img.shields.io/badge/Tests-Passing-brightgreen?logo=vitest&logoColor=white)](https://vitest.dev)

---

## Problem
Event organizers for large-scale hackathons, tech fests, and conferences currently rely on multiple fragmented tools:
- Separate forms for registration
- Third-party apps for QR check-ins
- Discord/Slack channels for support tickets and team formation
- External spreadsheets for rubric judging and scoring

This fragmentation causes operational latency, check-in bottlenecks, unmonitored ticket backlogs, and delayed leaderboard updates.

---

## Solution
**EVENTOPS** unifies these workflows into a single **live event command center**. Organizers obtain real-time operational telemetry, live QR gate verification, automated event health metrics, and instant broadcast capabilities. Participants gain access to personal QR passes, smart team matchmaking, and instant helpdesk ticketing. Judges benefit from a streamlined 4-criteria rubric evaluation engine feeding directly into a live leaderboard.

---

## Chosen Challenge Vertical
**Live Event Command Center & Real-Time Orchestration Platform**

---

## User Personas

| Persona | Primary Needs & Responsibilities | Key Views |
| :--- | :--- | :--- |
| **Organizer** | Live check-in gate scanning, support queue triage, broadcast center, event health telemetry. | Command Center, Gate Scanner, Support Queue, Broadcast Center, Health Monitor |
| **Participant** | Personal QR access pass, event schedule, smart team matchmaking, helpdesk submission. | Participant Home, QR Pass, Schedule, Matchmaking Engine, Helpdesk |
| **Judge** | Evaluation queue, 4-criteria rubric scoring, feedback submission, leaderboard monitoring. | Judge Command, Submissions Queue, Rubric Evaluator, Standings |

---

## Authentication

Authentication in **EVENTOPS** is built using **Supabase Auth** with a centralized `AuthContext` service abstraction (`src/services/auth/authService.js`):

- **Session Handling**: Restores sessions seamlessly on refresh (`supabase.auth.getSession()` and `onAuthStateChange`). Prevents protected view flashing during session hydration.
- **Profiles Data Model**: User accounts map directly to `public.profiles` (`id`, `name`, `email`, `role`, `created_at`).
- **Role-Based Authorization**: Client routing is strictly protected by `ProtectedRoute` components. Unauthenticated requests redirect to `/login`. Unauthorized role attempts (e.g. a `PARTICIPANT` attempting to open `/organizer/*`) render a dedicated **HTTP 403 Access Denied** state (`src/pages/auth/UnauthorizedPage.jsx`).

---

## Security

- **Environment Variables**: Supabase credentials are read strictly from `.env` via `import.meta.env.VITE_SUPABASE_URL` and `import.meta.env.VITE_SUPABASE_ANON_KEY`. Credentials are never hardcoded or committed.
- **Row Level Security (RLS)**: Production schema script in `supabase/schema.sql` enforces RLS policies on `public.profiles` using `auth.uid()` checks (users can only read/update their own profile; Organizers have elevated read access).
- **Role Escalation Prevention**: `validateRole(role)` restricts valid roles to `ORGANIZER`, `JUDGE`, or `PARTICIPANT`. Arbitrary role strings are rejected.
- **Score & Input Validation**: Strict numeric bound checking (0.0 to 10.0) on rubric submissions and email format verification.
- **Git & Asset Hygiene**: `.gitignore` strictly excludes `.env`, `node_modules`, `dist`, and binary build output, maintaining repository size < 10 MB.

---

## Authentication Assumptions

- **Public Self-Registration**: Public users can self-register as `PARTICIPANT` or `JUDGE`. Public registration as `ORGANIZER` is restricted to prevent arbitrary privilege escalation. Organizer accounts are pre-provisioned.
- **Interactive Demo Mode**: For competition presentation and judging evaluation, a top bar `RoleSwitcher` permits instant persona switching. In production, `isDemoMode` is toggled off and strict JWT session authorization is enforced.

---

## Core Features

- **Live Command Telemetry**: Real-time stats for venue check-ins, open support requests, and judging completion.
- **Smart Team Matchmaking**: 0–100% compatibility engine evaluating skill overlaps, preferred roles, and technical tracks.
- **Duplicate Check-In Prevention**: Algorithmic gate verification blocking duplicate scan attempts.
- **Dynamic Event Health Index**: Calculated 0–100 score with automatic operational recommendations (e.g. queue spikes, low attendance).
- **Structured Rubric Evaluator**: Weighted multi-criteria grading (Innovation 25%, Complexity 30%, Design 20%, Impact 25%).
- **Instant Role Switcher**: Demo bar for zero-delay switching between Organizer, Participant, and Judge perspectives.

---

## System Architecture

```
src/
├── components/
│   ├── ui/          # Accessible UI primitives (Button, Card, Badge, StatCard, Input, Modal, Alert)
│   ├── shared/      # AppShell, TopNavbar, SidebarNav, RoleSwitcher, ProtectedRoute
│   ├── organizer/   # Command center widgets
│   ├── participant/ # Participant pass & matchmaking components
│   └── judge/       # Rubric scoring & evaluation components
├── context/         # AuthContext session & profile state provider
├── pages/
│   ├── organizer/   # Command Center, CheckIn, SupportQueue, Announcements, Leaderboard, Health
│   ├── participant/ # Dashboard, Pass, Schedule, Matchmaking, Helpdesk, Announcements
│   ├── judge/       # Dashboard, Submissions, Evaluation, Leaderboard
│   └── auth/        # LoginPage, SignUpPage, UnauthorizedPage (403)
├── services/        # Service layer (Auth, Event, CheckIn, Support, Judging, Announcements)
├── utils/           # Business logic engines (matching.js, scoring.js, eventHealth.js, validation.js, permissions.js)
├── hooks/           # useAuth and useRole context hooks
├── data/            # Seed data representing live hackathon telemetry
├── lib/             # Supabase client abstraction with safe local fallback
├── tests/           # Vitest unit test suite (including auth & security tests)
└── supabase/        # RLS schema & migration SQL scripts
```

---

## Testing

Automated unit tests powered by **Vitest**:
- `auth.test.js` — Role validation, credential format checking, RBAC permission isolation
- `matching.test.js` — Team compatibility algorithm validation
- `scoring.test.js` — Rubric score calculator & leaderboard rank compiler
- `eventHealth.test.js` — Health index score & recommendation generator
- `validation.test.js` — Score bounds & duplicate QR check-in detection
- `permissions.test.js` — Role permission checks

Run tests:
```bash
npm test
```

---

## Accessibility

- Semantic HTML5 layout (`<header>`, `<main>`, `<aside>`, `<nav>`)
- Visible focus outline rings on interactive components (`focus-visible:ring-2`)
- Non-color-only status indicators with explicit textual badges and pulsing status beacons
- ARIA dialogs (`role="dialog"`, `aria-modal="true"`)
- Full keyboard navigation support (Escape key modal dismissal)

---

## Efficiency

- Minimal dependency footprint (< 10 MB total repository size)
- Zero commit of build output or `node_modules`
- Optimized SVG graphics instead of heavy raster images

---

## Assumptions

- Offline-first fallback: If Supabase credentials are not supplied, the platform seamlessly defaults to reactive mock telemetry for live presentation.
- Single branch git strategy (`main`).

---

## Local Setup

1. **Clone repository**:
   ```bash
   git clone https://github.com/sanvisawant/EventOps.git
   cd EventOps
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start local development server**:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000` in your browser.

---

## Environment Variables

Copy `.env.example` to `.env`:
```env
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

---

## Deployment

### Google Cloud Run Deployment

This repository includes a multi-stage `Dockerfile` ready for Google Cloud Run deployment:

1. **Build Docker Image**:
   ```bash
   docker build -t gcr.io/YOUR_PROJECT_ID/eventops:latest .
   ```

2. **Deploy to Cloud Run**:
   ```bash
   gcloud run deploy eventops \
     --image gcr.io/YOUR_PROJECT_ID/eventops:latest \
     --platform managed \
     --allow-unauthenticated \
     --port 8080
   ```
