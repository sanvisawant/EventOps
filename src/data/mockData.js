export const MOCK_EVENT = {
  id: 'evt_eventops_2026',
  name: 'Tech Summit 2026',
  tagline: 'The real-time operating system for live events.',
  vertical: 'Live Event Command Center & Real-Time Orchestration',
  location: 'Innovation Hub, Building 4 & Online Hybrid',
  startDate: '2026-08-29T09:00:00Z',
  endDate: '2026-08-30T18:00:00Z',
  stats: {
    totalRegistered: 450,
    totalCheckedIn: 312,
    totalTeams: 64,
    totalJudges: 12,
    activeSupportTickets: 3,
    evaluationsCompleted: 28,
    totalEvaluationsExpected: 64,
  },
  health: {
    score: 94, // 0 to 100
    status: 'OPTIMAL', // OPTIMAL, WARNING, CRITICAL
    checkinRatePerHour: 48,
    avgSupportResponseMinutes: 4.2,
    judgingProgressPercentage: 44,
  }
};

export const MOCK_USERS = [
  {
    id: 'usr_part_1',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    role: 'PARTICIPANT',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav',
    teamId: 'team_alpha',
    skills: ['React', 'Node.js', 'Tailwind CSS', 'Python'],
    preferredRole: 'Frontend Lead',
    interests: ['AI Tools', 'DevTools', 'Real-time Web'],
    qrCode: 'EVTOPS-PASS-AARAV-7821',
    isCheckedIn: true,
    checkInTime: '2026-08-29T09:14:22Z',
  },
  {
    id: 'usr_part_2',
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    role: 'PARTICIPANT',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    teamId: 'team_alpha',
    skills: ['Python', 'FastAPI', 'Supabase', 'Docker'],
    preferredRole: 'Backend Engineer',
    interests: ['Database Design', 'Cloud Native'],
    qrCode: 'EVTOPS-PASS-PRIYA-9012',
    isCheckedIn: true,
    checkInTime: '2026-08-29T09:20:10Z',
  },
  {
    id: 'usr_part_3',
    name: 'Rohan Mehta',
    email: 'rohan.mehta@example.com',
    role: 'PARTICIPANT',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan',
    teamId: null, // Solo participant looking for team
    skills: ['Figma', 'UI/UX Design', 'CSS Animations', 'Tailwind CSS'],
    preferredRole: 'Product Designer',
    interests: ['Design Systems', 'Accessibility', 'Mobile UI'],
    qrCode: 'EVTOPS-PASS-ROHAN-4412',
    isCheckedIn: true,
    checkInTime: '2026-08-29T10:05:45Z',
  },
  {
    id: 'usr_judge_1',
    name: 'Dr. Vikramaditya Rao',
    email: 'vikram.rao@techfest.org',
    role: 'JUDGE',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram',
    title: 'Principal AI Researcher & Tech Lead',
    organization: 'Google Cloud Platform',
    assignedTeamIds: ['team_alpha', 'team_beta', 'team_gamma', 'team_delta'],
  },
  {
    id: 'usr_org_1',
    name: 'Sanvi Sawant (Lead Organizer)',
    email: 'sanvi.organizer@eventops.io',
    role: 'ORGANIZER',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sanvi',
    title: 'Lead Operations Director',
  }
];

export const MOCK_TEAMS = [
  {
    id: 'team_alpha',
    name: 'Synthetix AI',
    tagline: 'Autonomous Workflow Orchestration Engine',
    track: 'AI & Developer Tools',
    leaderId: 'usr_part_1',
    members: ['usr_part_1', 'usr_part_2'],
    requiredSkills: ['UI Designer', 'DevOps Specialist'],
    submission: {
      id: 'sub_alpha',
      githubUrl: 'https://github.com/example/synthetix-ai',
      demoUrl: 'https://synthetix-ai.cloudrun.app',
      videoUrl: 'https://youtube.com/watch?v=example1',
      description: 'An autonomous agent orchestration tool that monitors live build pipelines and auto-fixes configuration drift.',
      submittedAt: '2026-08-29T13:45:00Z',
      status: 'SUBMITTED',
    },
    scores: {
      innovation: 9,
      complexity: 9,
      design: 8,
      impact: 9,
      totalWeightedScore: 8.8,
    },
    evaluationsCount: 3,
    rank: 1,
  },
  {
    id: 'team_beta',
    name: 'PulseOps RealTime',
    tagline: 'Sub-millisecond Event Telemetry Engine',
    track: 'Infrastructure & Real-Time Apps',
    leaderId: 'usr_part_3',
    members: ['usr_part_3'],
    requiredSkills: ['Go Engineer', 'React Specialist'],
    submission: {
      id: 'sub_beta',
      githubUrl: 'https://github.com/example/pulse-ops',
      demoUrl: 'https://pulse-ops.cloudrun.app',
      description: 'Distributed WebSocket telemetry hub designed for high-density live venue check-ins.',
      submittedAt: '2026-08-29T14:10:00Z',
      status: 'SUBMITTED',
    },
    scores: {
      innovation: 8,
      complexity: 9,
      design: 9,
      impact: 8,
      totalWeightedScore: 8.5,
    },
    evaluationsCount: 2,
    rank: 2,
  },
  {
    id: 'team_gamma',
    name: 'EcoGrid Smart',
    tagline: 'Micro-Grid Energy Balancing Platform',
    track: 'Sustainability & Smart Cities',
    leaderId: 'usr_part_4',
    members: [],
    requiredSkills: ['Data Scientist'],
    submission: {
      id: 'sub_gamma',
      githubUrl: 'https://github.com/example/ecogrid',
      demoUrl: 'https://ecogrid.example.com',
      description: 'Machine learning model predicting solar grid surges and redistributing municipal battery reserves.',
      submittedAt: '2026-08-29T14:25:00Z',
      status: 'SUBMITTED',
    },
    scores: {
      innovation: 8,
      complexity: 7,
      design: 8,
      impact: 9,
      totalWeightedScore: 7.95,
    },
    evaluationsCount: 2,
    rank: 3,
  }
];

export const MOCK_SCHEDULE = [
  {
    id: 'sch_1',
    time: '09:00 AM',
    title: 'Registration & Verification Pass Issuance',
    location: 'Main Atrium Check-In Counter',
    category: 'Logistics',
    status: 'COMPLETED',
  },
  {
    id: 'sch_2',
    time: '10:00 AM',
    title: 'Grand Keynote & Hackathon Kickoff',
    location: 'Auditorium A',
    category: 'Keynote',
    status: 'COMPLETED',
  },
  {
    id: 'sch_3',
    time: '11:00 AM',
    title: 'Hacking Sprint 1 & Team Formation Wall',
    location: 'Main Hacking Hall & Online Discord',
    category: 'Hacking',
    status: 'IN_PROGRESS',
  },
  {
    id: 'sch_4',
    time: '02:00 PM',
    title: 'Mentor Office Hours & Tech Helpdesk',
    location: 'Lab 204 & Support Queue',
    category: 'Support',
    status: 'UPCOMING',
  },
  {
    id: 'sch_5',
    time: '05:00 PM',
    title: 'Project Submission Cut-Off Deadline',
    location: 'EVENTOPS Platform Submission Portal',
    category: 'Deadline',
    status: 'UPCOMING',
  },
  {
    id: 'sch_6',
    time: '06:00 PM',
    title: 'Judging Round 1 — Rubric Evaluation',
    location: 'Judge Command Booths',
    category: 'Judging',
    status: 'UPCOMING',
  }
];

export const MOCK_SUPPORT_TICKETS = [
  {
    id: 'tkt_101',
    title: 'Wi-Fi disconnects frequently in Innovation Lab 3',
    category: 'Infrastructure',
    priority: 'HIGH',
    status: 'OPEN',
    submittedBy: 'Aarav Sharma (Synthetix AI)',
    timeAgo: '12m ago',
    createdAt: '2026-08-29T14:32:00Z',
  },
  {
    id: 'tkt_102',
    title: 'Need extra power strip at Table #24',
    category: 'Hardware',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    submittedBy: 'Rohan Mehta',
    timeAgo: '28m ago',
    createdAt: '2026-08-29T14:16:00Z',
  },
  {
    id: 'tkt_103',
    title: 'Clarification on Supabase API quota limits',
    category: 'Mentorship',
    priority: 'LOW',
    status: 'RESOLVED',
    submittedBy: 'Priya Patel',
    timeAgo: '1h ago',
    createdAt: '2026-08-29T13:30:00Z',
  }
];

export const MOCK_ANNOUNCEMENTS = [
  {
    id: 'anc_201',
    title: '🚨 Mentor Office Hours are now LIVE in Lab 204!',
    message: 'Connect with Google Cloud & Supabase mentors for architecture reviews between 11 AM and 1 PM.',
    priority: 'IMPORTANT',
    targetRole: 'ALL',
    publishedAt: '2026-08-29T11:00:00Z',
    author: 'Sanvi Sawant (Organizer)',
  },
  {
    id: 'anc_202',
    title: 'Submission Guidelines & Dockerfile Instructions Released',
    message: 'Ensure your GitHub repository remains public with a single branch and includes a Google Cloud Run Dockerfile.',
    priority: 'CRITICAL',
    targetRole: 'PARTICIPANT',
    publishedAt: '2026-08-29T12:30:00Z',
    author: 'Event Command Desk',
  }
];

export const MOCK_CHECKIN_LOGS = [
  {
    id: 'chk_1001',
    participantId: 'usr_part_1',
    participantName: 'Aarav Sharma',
    qrCode: 'EVTOPS-PASS-AARAV-7821',
    scannedAt: '2026-08-29T09:14:22Z',
    scannedBy: 'Gate Scanner Alpha',
    status: 'VERIFIED',
  },
  {
    id: 'chk_1002',
    participantId: 'usr_part_2',
    participantName: 'Priya Patel',
    qrCode: 'EVTOPS-PASS-PRIYA-9012',
    scannedAt: '2026-08-29T09:20:10Z',
    scannedBy: 'Gate Scanner Alpha',
    status: 'VERIFIED',
  },
  {
    id: 'chk_1003',
    participantId: 'usr_part_3',
    participantName: 'Rohan Mehta',
    qrCode: 'EVTOPS-PASS-ROHAN-4412',
    scannedAt: '2026-08-29T10:05:45Z',
    scannedBy: 'Gate Scanner Beta',
    status: 'VERIFIED',
  }
];

export const MOCK_RUBRIC_CRITERIA = [
  {
    id: 'crit_innovation',
    name: 'Innovation & Creativity',
    weight: 0.25,
    maxScore: 10,
    description: 'Originality of solution, novelty of prompt engineering or agent architecture.',
  },
  {
    id: 'crit_complexity',
    name: 'Technical Execution & Architecture',
    weight: 0.30,
    maxScore: 10,
    description: 'Code quality, system design, maintainability, clean separation of concerns, and integration complexity.',
  },
  {
    id: 'crit_design',
    name: 'Design, UX & Accessibility',
    weight: 0.20,
    maxScore: 10,
    description: 'Visual polish, responsive UI command center layout, keyboard navigation, and ARIA accessibility.',
  },
  {
    id: 'crit_impact',
    name: 'Practical Impact & Alignment',
    weight: 0.25,
    maxScore: 10,
    description: 'Direct alignment with problem statement, real-time command center utility, and operational value.',
  }
];
