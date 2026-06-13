// SYNTHETIC DEMO DATA ONLY - NO REAL CHILD DATA
// All persons, cases, and events below are entirely fictional.
// Used exclusively for hackathon demonstration purposes.

import type { Case, Camera, Guard, TimelineEvent } from './types'

export const mockCase: Case = {
  id: 'CASE-A-001',
  childAlias: 'Case A-001',
  childAge: 7,
  clothingDescription: 'Pink shirt, black shoes, may carry stuffed toy',
  lastSeenZone: 'Food Court',
  reportedAt: '2026-06-11T12:01:00Z',
  riskScore: 85,
  riskLevel: 'high',
  status: 'active',
  matchConfidence: 89,
}

export const mockCameras: Camera[] = [
  {
    id: 'CAM-01',
    name: 'Main Entrance',
    zone: 'Main Entrance',
    status: 'live',
    videoSrc: '/videos/cam-01.mp4',
  },
  {
    id: 'CAM-02',
    name: 'Food Court',
    zone: 'Food Court',
    status: 'match',
    confidence: 78,
    videoSrc: '/videos/cam-02.mp4',
  },
  {
    id: 'CAM-03',
    name: 'Food Court East',
    zone: 'Food Court East',
    status: 'match',
    confidence: 94,
    videoSrc: '/videos/cam-03.mp4',
  },
  {
    id: 'CAM-04',
    name: 'Escalator North',
    zone: 'Escalator North',
    status: 'live',
    videoSrc: '/videos/cam-04.mp4',
  },
  {
    id: 'CAM-05',
    name: 'Exit A',
    zone: 'Exit A',
    status: 'live',
    videoSrc: '/videos/cam-05.mp4',
  },
  {
    id: 'CAM-06',
    name: 'Gate B Corridor',
    zone: 'Gate B Corridor',
    status: 'high_risk',
    confidence: 89,
    videoSrc: '/videos/cam-06.mp4',
  },
]

export const mockGuards: Guard[] = [
  {
    id: 'GUARD-01',
    name: 'Reza',
    zone: 'Toy Zone',
    status: 'en_route',
    assignedCaseId: 'CASE-A-001',
    eta: 120,
  },
  {
    id: 'GUARD-02',
    name: 'Laila',
    zone: 'Main Entrance',
    status: 'standby',
  },
  {
    id: 'GUARD-03',
    name: 'Harith',
    zone: 'Parking Level 1',
    status: 'standby',
  },
]

export const mockResolvedCase: Case = {
  id: 'CASE-A-000',
  childAlias: 'Case A-000',
  childAge: 5,
  clothingDescription: 'Blue jacket, white sneakers',
  lastSeenZone: 'Toy Zone',
  reportedAt: '2026-06-12T09:15:00Z',
  riskScore: 0,
  riskLevel: 'low',
  status: 'resolved',
  matchConfidence: 95,
}

export const mockTimeline: TimelineEvent[] = [
  {
    id: 'EVT-001',
    type: 'case_created',
    timestamp: '2026-06-11T12:01:00Z',
    title: 'Case Created',
    description: 'Missing child report filed. AI search activated on 12 cameras.',
  },
  {
    id: 'EVT-002',
    type: 'detection',
    timestamp: '2026-06-11T12:01:45Z',
    title: 'CAM-02 Detection',
    description: 'Possible match detected at Food Court entrance. Pink clothing, short stature, ~7yr.',
    cameraId: 'CAM-02',
    confidence: 78,
  },
  {
    id: 'EVT-003',
    type: 'detection',
    timestamp: '2026-06-11T12:03:12Z',
    title: 'CAM-03 Match',
    description: 'Re-ID confirms same individual. Moving east toward corridor. Confidence increased.',
    cameraId: 'CAM-03',
    confidence: 94,
  },
  {
    id: 'EVT-004',
    type: 'risk_change',
    timestamp: '2026-06-11T12:06:00Z',
    title: 'Risk Escalated: HIGH',
    description: 'Child detected near exit corridor. No adult accompaniment for 14+ minutes. Gate B proximity.',
    confidence: 89,
  },
  {
    id: 'EVT-005',
    type: 'guard_dispatched',
    timestamp: '2026-06-11T12:06:30Z',
    title: 'Guard Dispatched',
    description: 'Guard Reza dispatched to Gate B corridor. ETA 2 minutes. Distance: ~180m.',
  },
]
