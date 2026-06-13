'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Play, Pause, Camera, AlertTriangle, Shield,
  User, Clock, ChevronRight, Download, Cpu, Database,
  Zap, Eye, Link2, MapPin, Check, X, Activity, Brain,
} from 'lucide-react'

// ── Extended demo event data ──────────────────────────────────────────────────
interface MatchSignal { label: string; match: number; status?: 'confirmed' | 'unconfirmed' }
interface Prediction  { zone: string; probability: number }
interface ReIdStep    { cam: string; conf: number; zone: string; time: string; reIdConf?: number }

interface DeepEvent {
  id: string
  type: 'case_created' | 'detection' | 'prediction' | 'risk_change' | 'guard_dispatched' | 'case_closed'
  timestamp: string
  title: string
  subtitle: string
  description: string
  confidence: number | null
  cameraId: string | null
  zone?: string
  riskDelta?: number
  matchSignals?: MatchSignal[]
  aiReasoning: string
  azureService: string
  predictions?: Prediction[]
  reidChain?: ReIdStep[]
}

const DEEP_EVENTS: DeepEvent[] = [
  {
    id: 'EVT-000',
    type: 'case_created',
    timestamp: '2026-06-11T12:01:00Z',
    title: 'Case Activated',
    subtitle: 'Azure AI Foundry · Search Initiated',
    description: 'Missing child report filed. Azure AI Foundry Coordinator Agent activated. Scanning 12 camera feeds across Sunway Pyramid.',
    confidence: null,
    cameraId: null,
    riskDelta: 0,
    aiReasoning: 'Case intake complete. Child description parsed by Azure OpenAI GPT-4 Vision: female child, ~7 years, pink upper garment, black footwear, possible soft toy. Embedding vector generated and stored in Azure Cosmos DB (TTL: case closure + 72h). Search agent dispatched to all 12 registered cameras. Initial risk score: 42 (MEDIUM) — child is not yet located.',
    azureService: 'Azure AI Foundry · Intake Agent',
  },
  {
    id: 'EVT-001',
    type: 'detection',
    timestamp: '2026-06-11T12:01:45Z',
    title: 'First Detection',
    subtitle: 'CAM-02 · Food Court',
    description: 'Person detected matching uploaded description. Pink upper clothing confirmed. Short stature consistent with ~7yr. Direction of movement: East.',
    confidence: 78,
    cameraId: 'CAM-02',
    zone: 'Food Court',
    riskDelta: 0,
    matchSignals: [
      { label: 'Upper Clothing Colour', match: 95 },
      { label: 'Height / Build',        match: 88 },
      { label: 'Carried Object',        match: 72 },
      { label: 'Lower Clothing',        match: 0,  status: 'unconfirmed' },
    ],
    aiReasoning: 'Azure AI Vision detected person at Food Court entrance (frame 0341). Azure OpenAI GPT-4 Vision cross-referenced against case embedding: Pink upper garment 95% colour match (hex #F472B6 → #EC4899). Estimated height 105–118 cm (88% match with age bracket 6–8). Soft object visible in right hand (72% match). Lower clothing obscured by crowd. Motion vector: eastward at ~0.7 m/s. No adult within 1.5 m radius.',
    azureService: 'Azure AI Vision · GPT-4 Vision',
  },
  {
    id: 'EVT-002',
    type: 'detection',
    timestamp: '2026-06-11T12:03:12Z',
    title: 'Re-ID Confirmed',
    subtitle: 'CAM-03 · Food Court East',
    description: 'Cross-camera re-identification confirms same individual. OSNet confidence: 89% same person as EVT-001. Overall confidence increased to 94%.',
    confidence: 94,
    cameraId: 'CAM-03',
    zone: 'Food Court East',
    riskDelta: +12,
    matchSignals: [
      { label: 'Upper Clothing Colour', match: 96 },
      { label: 'Height / Build',        match: 91 },
      { label: 'Carried Object',        match: 80 },
      { label: 'Gait Pattern',          match: 78 },
    ],
    aiReasoning: 'Azure Machine Learning endpoint (Torchreid OSNet model) matched CAM-03 detection to EVT-001 with 89% same-person probability. Clothing embedding cosine similarity: 0.942. Gait cycle analysis: stride length 42 cm, cadence 118 steps/min — consistent across both feeds. No adult accompaniment for 3+ minutes. Risk score updated: 54 (MEDIUM↑).',
    azureService: 'Azure ML · Torchreid OSNet',
    reidChain: [
      { cam: 'CAM-02', conf: 78, zone: 'Food Court',      time: '12:01:45' },
      { cam: 'CAM-03', conf: 94, zone: 'Food Court East', time: '12:03:12', reIdConf: 89 },
    ],
  },
  {
    id: 'EVT-003',
    type: 'prediction',
    timestamp: '2026-06-11T12:04:30Z',
    title: 'Movement Prediction',
    subtitle: 'NetworkX Graph Engine · Azure Functions',
    description: 'Graph-based movement prediction activated. Highest probability route: Gate B (78%). AI recommends pre-positioning a guard.',
    confidence: 78,
    cameraId: null,
    riskDelta: +8,
    predictions: [
      { zone: 'Gate B / Parking Entrance', probability: 78 },
      { zone: 'Toy Zone',                  probability: 15 },
      { zone: 'Food Court Return',          probability: 7  },
    ],
    aiReasoning: 'Azure Functions worker executed NetworkX graph traversal on mall zone adjacency model. Direction vector over 2.4 minutes of tracking: consistent eastward at bearing 087°. Probability weights: movement direction (0.40), exit proximity (0.35), no redirection signal (0.25). Gate B is 160 m ahead on current heading. Child alone for 3m 30s — time-alone risk multiplier: 1.4×. Pre-positioning guard at Gate B recommended.',
    azureService: 'Azure Functions · NetworkX Graph Engine',
  },
  {
    id: 'EVT-004',
    type: 'risk_change',
    timestamp: '2026-06-11T12:06:00Z',
    title: 'RISK ESCALATED — HIGH',
    subtitle: 'CAM-06 · Gate B Corridor',
    description: 'Child confirmed in exit corridor. 14 min 12 sec alone. Gate B proximity triggers HIGH risk threshold (85/100).',
    confidence: 89,
    cameraId: 'CAM-06',
    zone: 'Gate B Corridor',
    riskDelta: +25,
    matchSignals: [
      { label: 'Upper Clothing Colour', match: 93 },
      { label: 'Height / Build',        match: 90 },
      { label: 'Re-ID Chain Score',     match: 87 },
      { label: 'Gait Pattern',          match: 82 },
    ],
    aiReasoning: 'ESCALATION — Microsoft Responsible AI Risk Engine flags CRITICAL combination: (1) Exit zone proximity: Gate B corridor, 12 m from parking entrance. (2) Duration unaccompanied: 14 min 12 sec (threshold: 10 min). (3) Trajectory: child continues toward public road access. (4) Re-ID chain confidence 87% (3 cameras). Combined risk score: 85 / 100. Azure AI Foundry Coordinator Agent initiating guard dispatch protocol. Global status bar set to URGENT.',
    azureService: 'Azure AI Foundry · Risk Engine · Responsible AI',
    reidChain: [
      { cam: 'CAM-02', conf: 78, zone: 'Food Court',       time: '12:01:45' },
      { cam: 'CAM-03', conf: 94, zone: 'Food Court East',  time: '12:03:12', reIdConf: 89 },
      { cam: 'CAM-06', conf: 89, zone: 'Gate B Corridor',  time: '12:06:00', reIdConf: 92 },
    ],
  },
  {
    id: 'EVT-005',
    type: 'guard_dispatched',
    timestamp: '2026-06-11T12:06:30Z',
    title: 'Guard Dispatched',
    subtitle: 'Guard Reza → Gate B · ETA 2 min',
    description: 'AI coordinator selected nearest available guard. Alert delivered via in-app WebSocket + Azure Communication Services simulation.',
    confidence: null,
    cameraId: null,
    riskDelta: -5,
    aiReasoning: 'Azure AI Foundry Coordinator Agent evaluated 3 available guards. Selection criteria: (1) Reza — 180 m from Gate B, ETA ~2 min, STANDBY status. (2) Laila — 340 m, ETA ~4 min. (3) Harith — 290 m, ETA ~3.5 min. Guard Reza selected. Alert payload: child description (pink shirt, black shoes, soft toy), last detected frame (CAM-06, 12:06:00), navigation route to Gate B, risk level HIGH. Notification sent via Azure Communication Services webhook. Azure SignalR broadcast to all connected operator dashboards.',
    azureService: 'Azure AI Foundry · Azure Communication Services · Azure SignalR',
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
}

function eventColor(type: DeepEvent['type']): string {
  switch (type) {
    case 'detection':       return '#F59E0B'
    case 'prediction':      return '#8B5CF6'
    case 'risk_change':     return '#EF4444'
    case 'guard_dispatched':return '#10B981'
    case 'case_created':    return '#06B6D4'
    case 'case_closed':     return '#10B981'
    default:                return '#94A3B8'
  }
}

function EventIcon({ type, size = 16 }: { type: DeepEvent['type']; size?: number }) {
  const style = { width: size, height: size }
  switch (type) {
    case 'detection':        return <Camera style={style} />
    case 'prediction':       return <MapPin style={style} />
    case 'risk_change':      return <AlertTriangle style={style} />
    case 'guard_dispatched': return <User style={style} />
    case 'case_created':     return <Zap style={style} />
    case 'case_closed':      return <Check style={style} />
    default:                 return <Activity style={style} />
  }
}

// ── Confidence bar ─────────────────────────────────────────────────────────────
function SignalBar({ signal }: { signal: MatchSignal }) {
  const isUnconfirmed = signal.status === 'unconfirmed' || signal.match === 0
  const pct = signal.match
  const color = pct >= 85 ? '#10B981' : pct >= 65 ? '#F59E0B' : '#EF4444'

  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: 'var(--color-text-secondary)', fontFamily: 'monospace', letterSpacing: '0.04em' }}>
          {signal.label}
        </span>
        <span style={{
          fontSize: 11, fontFamily: 'monospace', fontWeight: 700,
          color: isUnconfirmed ? 'var(--color-text-muted)' : color,
        }}>
          {isUnconfirmed ? '— unconfirmed' : `${pct}%`}
        </span>
      </div>
      <div style={{
        height: 5, borderRadius: 99,
        background: 'var(--color-border-subtle)',
        overflow: 'hidden',
      }}>
        {!isUnconfirmed && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
            style={{ height: '100%', borderRadius: 99, background: color }}
          />
        )}
      </div>
    </div>
  )
}

// ── Re-ID Chain ────────────────────────────────────────────────────────────────
function ReIDChain({ steps }: { steps: ReIdStep[] }) {
  return (
    <div style={{ marginTop: 16, padding: '14px 16px', background: 'rgba(139,92,246,0.06)', borderRadius: 8, border: '1px solid rgba(139,92,246,0.2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
        <Link2 size={12} style={{ color: 'var(--color-ai-primary)' }} />
        <span style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-ai-primary)', letterSpacing: '0.1em' }}>
          RE-IDENTIFICATION CHAIN · TORCHREID OSNET
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, flexWrap: 'wrap', rowGap: 8 }}>
        {steps.map((step, i) => (
          <div key={step.cam} style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.15 }}
              style={{
                padding: '6px 10px',
                background: 'rgba(6,182,212,0.1)',
                border: '1px solid rgba(6,182,212,0.3)',
                borderRadius: 6,
                textAlign: 'center',
                minWidth: 90,
              }}
            >
              <div style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 700, color: '#06B6D4' }}>{step.cam}</div>
              <div style={{ fontSize: 9, color: 'var(--color-text-muted)', marginTop: 1 }}>{step.zone}</div>
              <div style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 700, color: '#F59E0B', marginTop: 3 }}>{step.conf}%</div>
              <div style={{ fontSize: 8, color: 'var(--color-text-muted)' }}>{step.time}</div>
            </motion.div>
            {i < steps.length - 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 6px' }}>
                <ChevronRight size={14} style={{ color: 'var(--color-ai-primary)' }} />
                {steps[i + 1].reIdConf && (
                  <span style={{ fontSize: 8, fontFamily: 'monospace', color: 'var(--color-ai-primary)', marginTop: 2 }}>
                    {steps[i + 1].reIdConf}% same
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 8 }}>
          <ChevronRight size={14} style={{ color: 'var(--color-text-muted)' }} />
          <div style={{
            padding: '6px 10px', background: 'rgba(16,185,129,0.1)',
            border: '1px solid rgba(16,185,129,0.3)', borderRadius: 6,
          }}>
            <div style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 700, color: '#10B981' }}>OVERALL</div>
            <div style={{ fontSize: 12, fontFamily: 'monospace', fontWeight: 800, color: '#10B981' }}>
              {steps.length === 2 ? '87%' : '91%'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Simulated CCTV frame ───────────────────────────────────────────────────────
function CamFrame({ event }: { event: DeepEvent }) {
  if (!event.cameraId) return null
  const isRisk = event.type === 'risk_change'
  const boxColor = isRisk ? '#EF4444' : '#F59E0B'

  return (
    <div style={{
      width: '100%', paddingTop: '56%', position: 'relative',
      background: '#050810', borderRadius: 8, overflow: 'hidden',
      border: `1px solid ${isRisk ? 'rgba(239,68,68,0.3)' : 'rgba(245,158,11,0.25)'}`,
      boxShadow: isRisk ? '0 0 20px rgba(239,68,68,0.15)' : '0 0 16px rgba(245,158,11,0.1)',
    }}>
      <div style={{ position: 'absolute', inset: 0 }}>
        {/* Scanline texture */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 3px)',
          zIndex: 2, pointerEvents: 'none',
        }} />
        {/* Simulated crowd */}
        {[...Array(8)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${10 + i * 11}%`, bottom: `${20 + (i % 3) * 8}%`,
            width: 18, height: 40,
            background: `rgba(${[60, 80, 55, 70, 65, 75, 58, 68][i]},${[70, 90, 75, 85, 80, 88, 72, 82][i]},${[90, 100, 88, 95, 92, 98, 86, 94][i]},0.25)`,
            borderRadius: '50% 50% 0 0',
          }} />
        ))}
        {/* The child — highlighted person */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            position: 'absolute', left: '38%', bottom: '18%',
            width: 22, height: 48,
          }}
        >
          <div style={{ width: '100%', height: '30%', background: '#F472B6', borderRadius: '50% 50% 0 0' }} />
          <div style={{ width: '100%', height: '45%', background: '#F9A8D4', marginTop: 1 }} />
          <div style={{ display: 'flex', gap: 2, height: '25%' }}>
            <div style={{ flex: 1, background: '#1C1C1C', borderRadius: '0 0 2px 2px' }} />
            <div style={{ flex: 1, background: '#1C1C1C', borderRadius: '0 0 2px 2px' }} />
          </div>
        </motion.div>
        {/* Bounding box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            position: 'absolute', left: '34%', bottom: '15%',
            width: '14%', height: '62%',
            border: `2px solid ${boxColor}`,
            borderRadius: 3,
            boxShadow: `0 0 12px ${boxColor}55`,
          }}
        >
          {/* Confidence chip */}
          <div style={{
            position: 'absolute', top: -18, left: 0,
            background: boxColor, color: '#000', fontSize: 9,
            fontFamily: 'monospace', fontWeight: 800, padding: '2px 6px', borderRadius: 3,
            whiteSpace: 'nowrap',
          }}>
            {event.confidence}% MATCH
          </div>
          {/* Corner accents */}
          {['tl','tr','bl','br'].map(c => (
            <div key={c} style={{
              position: 'absolute',
              ...(c.includes('t') ? { top: -2 } : { bottom: -2 }),
              ...(c.includes('l') ? { left: -2 } : { right: -2 }),
              width: 8, height: 8,
              borderTop: c.includes('t') ? `2px solid ${boxColor}` : 'none',
              borderBottom: c.includes('b') ? `2px solid ${boxColor}` : 'none',
              borderLeft: c.includes('l') ? `2px solid ${boxColor}` : 'none',
              borderRight: c.includes('r') ? `2px solid ${boxColor}` : 'none',
            }} />
          ))}
        </motion.div>
        {/* Timestamp overlay */}
        <div style={{
          position: 'absolute', top: 8, left: 8,
          background: 'rgba(0,0,0,0.8)', color: '#06B6D4',
          fontSize: 9, fontFamily: 'monospace', fontWeight: 700,
          padding: '3px 7px', borderRadius: 3, letterSpacing: '0.06em',
        }}>
          {event.cameraId} · {fmtTime(event.timestamp)}
        </div>
        {/* REC indicator */}
        <div style={{
          position: 'absolute', top: 8, right: 8,
          display: 'flex', alignItems: 'center', gap: 4,
          background: 'rgba(0,0,0,0.8)', padding: '3px 7px', borderRadius: 3,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#EF4444', animation: 'pulse 1.5s infinite' }} />
          <span style={{ fontSize: 8, fontFamily: 'monospace', color: '#EF4444', fontWeight: 700 }}>REC</span>
        </div>
        {/* Zone label */}
        <div style={{
          position: 'absolute', bottom: 8, left: 8,
          background: 'rgba(0,0,0,0.8)', color: 'var(--color-text-secondary)',
          fontSize: 9, fontFamily: 'monospace', padding: '3px 7px', borderRadius: 3,
        }}>
          {event.zone ?? 'SUNWAY PYRAMID'}
        </div>
      </div>
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function CaseTimelinePage({ params }: { params: { id: string } }) {
  const caseId = params.id
  const [selectedId, setSelectedId] = useState<string>('EVT-001')
  const [isPlaying, setIsPlaying] = useState(false)
  const playRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const selectedEvent = DEEP_EVENTS.find(e => e.id === selectedId) ?? DEEP_EVENTS[1]

  // Playback: auto-advance every 3 seconds
  useEffect(() => {
    if (isPlaying) {
      playRef.current = setInterval(() => {
        setSelectedId(prev => {
          const idx = DEEP_EVENTS.findIndex(e => e.id === prev)
          if (idx >= DEEP_EVENTS.length - 1) { setIsPlaying(false); return prev }
          return DEEP_EVENTS[idx + 1].id
        })
      }, 3000)
    }
    return () => { if (playRef.current) clearInterval(playRef.current) }
  }, [isPlaying])

  const color = eventColor(selectedEvent.type)
  const isRisk = selectedEvent.type === 'risk_change'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--color-bg-base)', overflow: 'hidden' }}>

      {/* ── Top bar ── */}
      <div style={{
        height: 52, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px',
        background: 'var(--color-bg-surface)',
        borderBottom: '1px solid var(--color-border-subtle)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href={`/cases/${caseId}`} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-secondary)', fontSize: 13, textDecoration: 'none' }}>
            <ArrowLeft size={14} />
            Back to Case
          </Link>
          <span style={{ color: 'var(--color-border-default)' }}>·</span>
          <span style={{ fontSize: 13, color: 'var(--color-text-secondary)', fontFamily: 'monospace' }}>CASE-A-001</span>
          <ChevronRight size={12} style={{ color: 'var(--color-text-muted)' }} />
          <span style={{ fontSize: 13, color: 'var(--color-text-primary)', fontWeight: 600 }}>AI Investigation Timeline</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Azure Foundry badge */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '5px 10px', borderRadius: 6,
            background: 'rgba(0,120,212,0.12)',
            border: '1px solid rgba(0,120,212,0.3)',
          }}>
            <Brain size={12} style={{ color: '#0078D4' }} />
            <span style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 700, color: '#0078D4', letterSpacing: '0.06em' }}>
              AZURE AI FOUNDRY
            </span>
          </div>

          {/* Playback controls */}
          <button
            onClick={() => {
              if (!isPlaying) setSelectedId('EVT-000')
              setIsPlaying(!isPlaying)
            }}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 14px', borderRadius: 6, cursor: 'pointer',
              background: isPlaying ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)',
              border: `1px solid ${isPlaying ? 'rgba(239,68,68,0.4)' : 'rgba(16,185,129,0.4)'}`,
              color: isPlaying ? '#EF4444' : '#10B981',
              fontSize: 12, fontWeight: 600,
            }}
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} />}
            {isPlaying ? 'Stop Replay' : 'Replay Timeline'}
          </button>

          <button style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 12px', borderRadius: 6, cursor: 'pointer',
            background: 'transparent',
            border: '1px solid var(--color-border-default)',
            color: 'var(--color-text-secondary)', fontSize: 12,
          }}>
            <Download size={13} />
            Export PDF
          </button>
        </div>
      </div>

      {/* ── Main layout ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Left: Vertical Timeline (320px) */}
        <div style={{
          width: 320, flexShrink: 0,
          borderRight: '1px solid var(--color-border-subtle)',
          overflowY: 'auto',
          background: 'var(--color-bg-surface)',
        }}>
          <div style={{ padding: '16px 16px 8px', borderBottom: '1px solid var(--color-border-subtle)' }}>
            <div style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.1em' }}>
              CASE TIMELINE · {DEEP_EVENTS.length} EVENTS
            </div>
            {/* Risk sparkline placeholder */}
            <div style={{ marginTop: 10, height: 32, background: 'var(--color-bg-inset)', borderRadius: 4, overflow: 'hidden', position: 'relative' }}>
              <svg width="100%" height="100%" viewBox="0 0 280 32" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="spark-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="40%" stopColor="#F59E0B" />
                    <stop offset="70%" stopColor="#F97316" />
                    <stop offset="100%" stopColor="#EF4444" />
                  </linearGradient>
                </defs>
                <polyline points="0,28 56,26 112,22 140,18 168,14 196,7 224,8 280,8" fill="none" stroke="url(#spark-grad)" strokeWidth="2" />
                <polyline points="0,28 56,26 112,22 140,18 168,14 196,7 224,8 280,8 280,32 0,32" fill="url(#spark-grad)" opacity="0.12" />
              </svg>
              <div style={{ position: 'absolute', bottom: 3, left: 4, fontSize: 8, fontFamily: 'monospace', color: 'var(--color-text-muted)' }}>RISK SCORE OVER TIME</div>
            </div>
          </div>

          <div style={{ padding: 12, position: 'relative' }}>
            {/* Vertical line */}
            <div style={{
              position: 'absolute', left: 31, top: 0, bottom: 0,
              width: 1, background: 'var(--color-border-subtle)',
            }} />

            {DEEP_EVENTS.map((event, i) => {
              const isSel = event.id === selectedId
              const evColor = eventColor(event.type)
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => { setSelectedId(event.id); setIsPlaying(false) }}
                  style={{
                    display: 'flex', gap: 12, marginBottom: 4,
                    padding: '10px 10px 10px 0',
                    borderRadius: 8,
                    background: isSel ? `${evColor}11` : 'transparent',
                    border: `1px solid ${isSel ? evColor + '44' : 'transparent'}`,
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 150ms',
                  }}
                >
                  {/* Icon node */}
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                    background: `${evColor}20`,
                    border: `2px solid ${isSel ? evColor : evColor + '60'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: evColor, marginLeft: 4,
                    boxShadow: isSel ? `0 0 10px ${evColor}44` : 'none',
                    zIndex: 1,
                  }}>
                    <EventIcon type={event.type} size={13} />
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                      <span style={{
                        fontSize: 12, fontWeight: isSel ? 700 : 500,
                        color: isSel ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                        fontFamily: event.type === 'risk_change' ? 'monospace' : 'inherit',
                      }}>
                        {event.title}
                      </span>
                      {event.confidence !== null && (
                        <span style={{
                          fontSize: 10, fontFamily: 'monospace', fontWeight: 700,
                          color: evColor, flexShrink: 0,
                          padding: '1px 5px', borderRadius: 3,
                          background: `${evColor}18`,
                        }}>
                          {event.confidence}%
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 1 }}>
                      {fmtTime(event.timestamp)}
                    </div>
                    {event.cameraId && (
                      <div style={{ fontSize: 10, fontFamily: 'monospace', color: '#06B6D4', marginTop: 2 }}>
                        {event.cameraId} · {event.zone}
                      </div>
                    )}
                  </div>

                  {isSel && (
                    <div style={{
                      position: 'absolute', left: -1, top: 8, bottom: 8,
                      width: 3, background: evColor, borderRadius: '0 2px 2px 0',
                    }} />
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Right: Event Detail */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedId}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            style={{ flex: 1, overflowY: 'auto', padding: 24 }}
          >
            {/* Event header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 9,
                    background: `${color}18`, border: `2px solid ${color}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color, boxShadow: `0 0 16px ${color}33`,
                  }}>
                    <EventIcon type={selectedEvent.type} size={17} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-text-primary)', margin: 0, lineHeight: 1.2 }}>
                      {selectedEvent.title}
                    </h2>
                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2, fontFamily: 'monospace' }}>
                      {selectedEvent.subtitle}
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, fontFamily: 'monospace', color: 'var(--color-text-secondary)' }}>
                  {fmtTime(selectedEvent.timestamp)}
                </div>
                {selectedEvent.confidence !== null && (
                  <div style={{
                    fontSize: 22, fontFamily: 'monospace', fontWeight: 800,
                    color, marginTop: 2,
                  }}>
                    {selectedEvent.confidence}%
                  </div>
                )}
                {(selectedEvent.riskDelta ?? 0) !== 0 && (
                  <div style={{
                    fontSize: 11, fontFamily: 'monospace', fontWeight: 700,
                    color: (selectedEvent.riskDelta ?? 0) > 0 ? '#EF4444' : '#10B981',
                    marginTop: 2,
                  }}>
                    {(selectedEvent.riskDelta ?? 0) > 0 ? '▲' : '▼'} Risk {Math.abs(selectedEvent.riskDelta ?? 0)} pts
                  </div>
                )}
              </div>
            </div>

            {/* Two-column layout */}
            <div style={{ display: 'grid', gridTemplateColumns: selectedEvent.cameraId ? '1fr 1fr' : '1fr', gap: 20 }}>

              {/* Camera frame */}
              {selectedEvent.cameraId && <CamFrame event={selectedEvent} />}

              {/* Matching signals */}
              {selectedEvent.matchSignals && (
                <div style={{
                  padding: 16, background: 'var(--color-bg-elevated)',
                  borderRadius: 8, border: '1px solid var(--color-border-subtle)',
                }}>
                  <div style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.1em', marginBottom: 14 }}>
                    MATCHING SIGNALS · AZURE OPENAI GPT-4 VISION
                  </div>
                  {selectedEvent.matchSignals.map(sig => (
                    <SignalBar key={sig.label} signal={sig} />
                  ))}
                  <div style={{
                    marginTop: 14, paddingTop: 12,
                    borderTop: '1px solid var(--color-border-subtle)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}>
                    <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Overall confidence</span>
                    <span style={{
                      fontSize: 16, fontFamily: 'monospace', fontWeight: 800,
                      color: (selectedEvent.confidence ?? 0) >= 85 ? '#10B981' : '#F59E0B',
                    }}>
                      {selectedEvent.confidence}%
                    </span>
                  </div>
                </div>
              )}

              {/* Prediction panel */}
              {selectedEvent.predictions && (
                <div style={{
                  padding: 16, background: 'var(--color-bg-elevated)',
                  borderRadius: 8, border: '1px solid rgba(139,92,246,0.25)',
                }}>
                  <div style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-ai-primary)', letterSpacing: '0.1em', marginBottom: 14 }}>
                    MOVEMENT PREDICTION · NETWORKX + AZURE FUNCTIONS
                  </div>
                  {selectedEvent.predictions.map((p, i) => (
                    <div key={p.zone} style={{ marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 12, color: 'var(--color-text-primary)', fontWeight: i === 0 ? 600 : 400 }}>{p.zone}</span>
                        <span style={{
                          fontSize: 12, fontFamily: 'monospace', fontWeight: 700,
                          color: i === 0 ? '#F59E0B' : 'var(--color-text-muted)',
                        }}>{p.probability}%</span>
                      </div>
                      <div style={{ height: 6, borderRadius: 99, background: 'var(--color-border-subtle)', overflow: 'hidden' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${p.probability}%` }}
                          transition={{ duration: 0.9, delay: i * 0.15 }}
                          style={{
                            height: '100%', borderRadius: 99,
                            background: i === 0 ? '#F59E0B' : 'var(--color-border-strong)',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* AI Reasoning block */}
            <div style={{
              marginTop: 20, padding: 16,
              background: 'var(--color-ai-trail)',
              borderRadius: 8,
              borderLeft: '3px solid var(--color-ai-primary)',
              border: '1px solid rgba(139,92,246,0.2)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <Brain size={14} style={{ color: 'var(--color-ai-primary)' }} />
                <span style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-ai-primary)', letterSpacing: '0.1em' }}>
                  AI REASONING
                </span>
                <span style={{
                  fontSize: 9, fontFamily: 'monospace',
                  background: 'rgba(0,120,212,0.15)', color: '#0078D4',
                  padding: '2px 7px', borderRadius: 3, border: '1px solid rgba(0,120,212,0.3)',
                  marginLeft: 'auto',
                }}>
                  {selectedEvent.azureService}
                </span>
              </div>
              <p style={{
                fontSize: 13, color: 'var(--color-text-secondary)',
                lineHeight: 1.7, margin: 0, fontFamily: 'monospace',
              }}>
                {selectedEvent.aiReasoning}
              </p>
            </div>

            {/* Re-ID Chain */}
            {selectedEvent.reidChain && selectedEvent.reidChain.length > 0 && (
              <ReIDChain steps={selectedEvent.reidChain} />
            )}

            {/* Microsoft Responsible AI notice */}
            {isRisk && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                style={{
                  marginTop: 16, padding: '12px 16px',
                  background: 'rgba(239,68,68,0.06)',
                  borderRadius: 8,
                  border: '1px solid rgba(239,68,68,0.2)',
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                }}
              >
                <Shield size={16} style={{ color: '#EF4444', flexShrink: 0, marginTop: 1 }} />
                <div>
                  <div style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 700, color: '#EF4444', letterSpacing: '0.08em', marginBottom: 4 }}>
                    MICROSOFT RESPONSIBLE AI — HUMAN-IN-THE-LOOP
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.6 }}>
                    This risk escalation is an AI recommendation, not an automated action. All guard dispatch decisions require operator confirmation. No permanent identity profile is created — temporary embeddings will be deleted after case closure.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Azure provenance footer */}
            <div style={{
              marginTop: 20, padding: '10px 14px',
              borderRadius: 6, background: 'var(--color-bg-inset)',
              border: '1px solid var(--color-border-subtle)',
              display: 'flex', gap: 20, flexWrap: 'wrap',
            }}>
              {[
                { icon: Database, label: 'Azure Cosmos DB', value: 'CASE-A-001 · event stored' },
                { icon: Eye,      label: 'Azure AI Vision',  value: 'Frame analyzed · 12 cameras' },
                { icon: Cpu,      label: 'Azure AI Foundry', value: 'Coordinator Agent active' },
                { icon: Zap,      label: 'Azure SignalR',    value: 'Dashboard synced · 0ms' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <Icon size={12} style={{ color: '#0078D4' }} />
                  <div>
                    <div style={{ fontSize: 9, fontFamily: 'monospace', fontWeight: 700, color: '#0078D4', letterSpacing: '0.06em' }}>{label}</div>
                    <div style={{ fontSize: 9, color: 'var(--color-text-muted)' }}>{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
