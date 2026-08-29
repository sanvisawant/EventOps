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
│   ├── shared/      # AppShell, TopNavbar, SidebarNav, RoleSwitcher
│   ├── organizer/   # Command center widgets
│   ├── participant/ # Participant pass & matchmaking components
│   └── judge/       # Rubric scoring & evaluation components
├── pages/
│   ├── organizer/   # Command Center, CheckIn, SupportQueue, Announcements, Leaderboard, Health
│   ├── participant/ # Dashboard, Pass, Schedule, Matchmaking, Helpdesk, Announcements
│   ├── judge/       # Dashboard, Submissions, Evaluation, Leaderboard
│   └── auth/        # LoginPage
├── services/        # Clean service abstraction layer (Auth, Event, CheckIn, Support, Judging, Announcements)
├── utils/           # Business logic engines (matching.js, scoring.js, eventHealth.js, validation.js, permissions.js)
├── hooks/           # useRole context hook for demo role switching
├── data/            # Seed data representing live hackathon telemetry
├── lib/             # Supabase client abstraction with safe local fallback
└── tests/           # Vitest unit test suite
```

---

## Application Flow

1. **Gate Verification**: Attendee presents QR Pass → Organizer scans pass → Check-in log updates → Telemetry counter increments → Attendance rate recalculates.
2. **Support Ticket Triage**: Participant submits issue → Organizer Support Queue alerts → Event Health Index recalculates based on backlog.
3. **Rubric Evaluation**: Judge inputs scores → Weighted score calculated → Team aggregate updates → Live Leaderboard rank recalculates.

---

## Decision-Making Logic

- **Weighted Scoring Formula**:
  $$\text{Total Score} = \sum (\text{Criteria Score}_i \times \text{Weight}_i)$$
- **Team Compatibility Score**:
  - Skill Overlap: 40%
  - Preferred Role Fit: 30%
  - Track / Interests: 30%
- **Event Health Index**:
  - Starts at 100
  - -10 pts per high-priority support ticket
  - -15 pts if venue check-in velocity is below 40% threshold

---

## Security

- **Environment Variables**: Supabase credentials are read strictly from `.env` via `import.meta.env`.
- **Role-Based Access Guard**: Route access checked via `hasPermission(role, permission)`.
- **Score Validation**: Strict numeric bound checks (0.0 to 10.0) on all rubric submissions.
- **Git Hygiene**: `.gitignore` strictly prevents committing `.env`, `node_modules`, or build artifacts.

---

## Testing

Automated unit tests powered by **Vitest**:
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

---

## Future Scope

- Native WebRTC live QR camera scanning engine.
- Supabase Row Level Security (RLS) policies for multi-tenant organizations.
- Automated SMS / Push notification dispatch via Twilio / Firebase.
