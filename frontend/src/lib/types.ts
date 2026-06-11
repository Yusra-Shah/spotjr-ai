export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'
export type CaseStatus = 'active' | 'resolved' | 'closed'
export type GuardStatus = 'standby' | 'en_route' | 'on_site' | 'off_duty'
export type CameraStatus = 'live' | 'offline' | 'match' | 'high_risk'

export interface Case {
  id: string
  childAlias: string
  childAge: number
  clothingDescription: string
  lastSeenZone: string
  reportedAt: string
  riskScore: number
  riskLevel: RiskLevel
  status: CaseStatus
  matchConfidence: number
}

export interface Camera {
  id: string
  name: string
  zone: string
  status: CameraStatus
  confidence?: number
}

export interface Guard {
  id: string
  name: string
  zone: string
  status: GuardStatus
  assignedCaseId?: string
  eta?: number
}

export interface TimelineEvent {
  id: string
  type: 'detection' | 'prediction' | 'risk_change' | 'guard_dispatched' | 'case_created' | 'case_closed'
  timestamp: string
  title: string
  description: string
  cameraId?: string
  confidence?: number
}
