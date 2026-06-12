'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ArrowLeft, Check, X, AlertTriangle, User, Navigation, ChevronRight } from 'lucide-react'
import MallDigitalTwin from '@/components/map/MallDigitalTwin'
import RiskScoreIndicator from '@/components/case/RiskScoreIndicator'
import AIReasoningTimeline from '@/components/ai/AIReasoningTimeline'
import { mockCase, mockTimeline, mockGuards } from '@/lib/mock-data'

// ── Detection Match Card ──────────────────────────────────────────────────────
interface DetectionMatch {
  id: string
  cameraId: string
  zone: string
  time: string
  confidence: number
  status: 'pending' | 'confirmed' | 'rejected'
}

const INITIAL_MATCHES: DetectionMatch[] = [
  { id: 'M1', cameraId: 'CAM-02', zone: 'Food Court',      time: '12:01:45', confidence: 78, status: 'confirmed' },
  { id: 'M2', cameraId: 'CAM-03', zone: 'Food Court East', time: '12:03:12', confidence: 94, status: 'confirmed' },
  { id: 'M3', cameraId: 'CAM-06', zone: 'Gate B Corridor', time: '12:06:00', confidence: 89, status: 'pending'   },
]

function DetectionMatchCard({
  match,
  onConfirm,
  onReject,
}: {
  match: DetectionMatch
  onConfirm: () => void
  onReject: () => void
}) {
  const isHigh = match.confidence >= 90
  const borderColor =
    match.status === 'confirmed'
      ? 'var(--color-risk-medium)'
      : match.status === 'rejected'
      ? 'var(--color-border-default)'
      : isHigh
      ? 'var(--color-risk-critical)'
      : 'var(--color-risk-medium)'

  return (
    <div
      style={{
        borderRadius: 8,
        border: `1px solid ${borderColor}`,
        background: match.status === 'rejected' ? 'transparent' : 'var(--color-bg-elevated)',
        overflow: 'hidden',
        opacity: match.status === 'rejected' ? 0.45 : 1,
        transition: 'all 200ms',
      }}
    >
      {/* Thumbnail */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 80,
          background: '#0d1423',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ fontSize: 9, color: 'var(--color-text-muted)', fontFamily: 'monospace', textAlign: 'center' }}>
          <div style={{ marginBottom: 2 }}>[CCTV FEED]</div>
          <div>{match.cameraId}</div>
        </div>
        {/* Bounding box overlay */}
        {match.status !== 'rejected' && (
          <div
            style={{
              position: 'absolute',
              top: '20%',
              left: '35%',
              width: '28%',
              height: '55%',
              border: `1.5px solid ${isHigh ? 'var(--color-risk-critical)' : 'var(--color-risk-medium)'}`,
              borderRadius: 2,
              boxShadow: isHigh ? '0 0 6px rgba(239,68,68,0.4)' : '0 0 6px rgba(245,158,11,0.3)',
              pointerEvents: 'none',
            }}
          />
        )}
        {/* Camera ID badge */}
        <div
          style={{
            position: 'absolute',
            bottom: 4,
            left: 4,
            fontSize: 9,
            fontFamily: 'monospace',
            background: 'rgba(8,12,24,0.8)',
            color: 'var(--color-brand-cyan)',
            padding: '1px 5px',
            borderRadius: 3,
          }}
        >
          {match.cameraId}
        </div>
        {/* Time badge */}
        <div
          style={{
            position: 'absolute',
            top: 4,
            right: 4,
            fontSize: 9,
            fontFamily: 'monospace',
            background: 'rgba(8,12,24,0.8)',
            color: 'var(--color-text-muted)',
            padding: '1px 5px',
            borderRadius: 3,
          }}
        >
          {match.time}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '8px 10px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 6 }}>
          {match.zone}
        </div>

        {/* Confidence bar */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
            <span style={{ fontSize: 9, color: 'var(--color-text-muted)' }}>Confidence</span>
            <span
              style={{
                fontSize: 10,
                fontFamily: 'monospace',
                fontWeight: 700,
                color: isHigh ? 'var(--color-risk-critical)' : 'var(--color-risk-medium)',
              }}
            >
              {match.confidence}%
            </span>
          </div>
          <div style={{ height: 3, borderRadius: 2, background: 'var(--color-border-subtle)', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${match.confidence}%`,
                background: isHigh ? 'var(--color-risk-critical)' : 'var(--color-risk-medium)',
                borderRadius: 2,
              }}
            />
          </div>
        </div>

        {/* Action buttons or status */}
        {match.status === 'pending' ? (
          <div style={{ display: 'flex', gap: 5 }}>
            <button
              onClick={onConfirm}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3,
                background: 'rgba(16,185,129,0.12)',
                border: '1px solid rgba(16,185,129,0.4)',
                color: 'var(--color-risk-low)',
                fontSize: 10,
                fontWeight: 600,
                padding: '4px 0',
                borderRadius: 4,
                cursor: 'pointer',
              }}
            >
              <Check size={10} /> Confirm
            </button>
            <button
              onClick={onReject}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3,
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.3)',
                color: 'var(--color-risk-critical)',
                fontSize: 10,
                fontWeight: 600,
                padding: '4px 0',
                borderRadius: 4,
                cursor: 'pointer',
              }}
            >
              <X size={10} /> Reject
            </button>
          </div>
        ) : (
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: match.status === 'confirmed' ? 'var(--color-risk-low)' : 'var(--color-text-muted)',
              textAlign: 'center',
              padding: '3px 0',
            }}
          >
            {match.status === 'confirmed' ? '✓ Confirmed' : '✗ Rejected'}
          </div>
        )}
      </div>
    </div>
  )
}

// ── ETA countdown ─────────────────────────────────────────────────────────────
function useEtaCountdown(initialSeconds: number) {
  const [seconds, setSeconds] = useState(initialSeconds)
  useEffect(() => {
    if (seconds <= 0) return
    const id = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000)
    return () => clearInterval(id)
  }, [seconds])
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return seconds > 0 ? `${m}:${s}` : 'ARRIVED'
}

// ── Elapsed timer ─────────────────────────────────────────────────────────────
function useElapsed(start: string) {
  const [elapsed, setElapsed] = useState(0)
  useEffect(() => {
    const tick = () => setElapsed(Math.floor((Date.now() - new Date(start).getTime()) / 1000))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [start])
  const m = Math.floor(elapsed / 60).toString().padStart(2, '0')
  const s = (elapsed % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function CaseDetailPage() {
  const [matches, setMatches] = useState<DetectionMatch[]>(INITIAL_MATCHES)
  const [marked, setMarked] = useState(false)

  const elapsed = useElapsed(mockCase.reportedAt)
  const etaDisplay = useEtaCountdown(mockGuards[0].eta ?? 120)
  const reza = mockGuards[0]

  const handleConfirm = useCallback((id: string) => {
    setMatches((prev) => prev.map((m) => (m.id === id ? { ...m, status: 'confirmed' as const } : m)))
  }, [])

  const handleReject = useCallback((id: string) => {
    setMatches((prev) => prev.map((m) => (m.id === id ? { ...m, status: 'rejected' as const } : m)))
  }, [])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        background: 'var(--color-bg-base)',
      }}
    >
      {/* ── Header bar ─────────────────────────────────────────────────────── */}
      <div
        style={{
          height: 52,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '0 16px',
          borderBottom: '1px solid var(--color-border-subtle)',
          background: 'var(--color-bg-surface)',
        }}
      >
        <Link
          href="/cases"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            color: 'var(--color-text-secondary)',
            textDecoration: 'none',
            fontSize: 12,
            flexShrink: 0,
          }}
        >
          <ArrowLeft size={13} /> Cases
        </Link>
        <ChevronRight size={12} style={{ color: 'var(--color-text-muted)' }} />

        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'monospace' }}>
          {mockCase.id}
        </span>

        <span
          style={{
            padding: '2px 8px',
            borderRadius: 12,
            fontSize: 10,
            fontWeight: 700,
            background: 'rgba(249,115,22,0.15)',
            border: '1px solid rgba(249,115,22,0.4)',
            color: 'var(--color-risk-high)',
            letterSpacing: '0.06em',
          }}
        >
          HIGH RISK
        </span>

        {/* Live elapsed */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 4 }}>
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'var(--color-risk-critical)',
              animation: 'pulse 1.2s ease-in-out infinite',
              display: 'inline-block',
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: 13, fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-risk-high)' }}>
            {elapsed}
          </span>
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>elapsed</span>
        </div>

        <div style={{ flex: 1 }} />

        <button
          onClick={() => setMarked(true)}
          disabled={marked}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            padding: '6px 14px',
            borderRadius: 6,
            border: 'none',
            background: marked ? 'rgba(16,185,129,0.15)' : 'var(--gradient-btn-success)',
            color: marked ? 'var(--color-risk-low)' : '#fff',
            fontSize: 12,
            fontWeight: 700,
            cursor: marked ? 'default' : 'pointer',
            transition: 'all 200ms',
          }}
        >
          {marked ? (
            <><Check size={13} /> Marked Found</>
          ) : (
            <><Check size={13} /> Mark as Found</>
          )}
        </button>

        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            padding: '6px 14px',
            borderRadius: 6,
            border: '1px solid rgba(239,68,68,0.4)',
            background: 'rgba(239,68,68,0.1)',
            color: 'var(--color-risk-critical)',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <AlertTriangle size={13} /> Escalate
        </button>
      </div>

      {/* ── Main content ───────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>
        {/* Left: Detection Match List (300px) */}
        <div
          style={{
            width: 300,
            flexShrink: 0,
            overflowY: 'auto',
            borderRight: '1px solid var(--color-border-subtle)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              padding: '10px 12px',
              borderBottom: '1px solid var(--color-border-subtle)',
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.1em' }}>
              DETECTION MATCHES
            </span>
            <span style={{ marginLeft: 8, fontSize: 10, fontFamily: 'monospace', color: 'var(--color-brand-cyan)' }}>
              {matches.filter((m) => m.status !== 'rejected').length}/{matches.length}
            </span>
          </div>

          <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {matches.map((m) => (
              <DetectionMatchCard
                key={m.id}
                match={m}
                onConfirm={() => handleConfirm(m.id)}
                onReject={() => handleReject(m.id)}
              />
            ))}
          </div>

          {/* AI scanning footer */}
          <div
            style={{
              marginTop: 'auto',
              padding: '10px 12px',
              borderTop: '1px solid var(--color-border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: 'var(--color-ai-primary)',
              fontSize: 10,
              fontWeight: 600,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'var(--color-ai-primary)',
                animation: 'pulse 1.4s ease-in-out infinite',
                display: 'inline-block',
              }}
            />
            AI scanning remaining feeds...
          </div>
        </div>

        {/* Center: Mall Digital Twin */}
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          <MallDigitalTwin />
        </div>

        {/* Right: Intelligence Panel (380px) */}
        <div
          style={{
            width: 380,
            flexShrink: 0,
            overflowY: 'auto',
            borderLeft: '1px solid var(--color-border-subtle)',
            background: 'var(--color-bg-surface)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--color-border-subtle)' }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.1em' }}>
              INTELLIGENCE PANEL
            </span>
          </div>

          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Risk Score */}
            <RiskScoreIndicator
              score={mockCase.riskScore}
              level={mockCase.riskLevel}
              reason="Child near exit gate without adult accompaniment for 14+ minutes"
              trend="increasing"
            />

            {/* Match confidence + Re-ID chain */}
            <div
              style={{
                background: 'var(--color-bg-elevated)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 8,
                padding: '12px 14px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                  Match Confidence
                </span>
                <span
                  style={{
                    fontSize: 14,
                    fontFamily: 'monospace',
                    fontWeight: 800,
                    color: 'var(--color-risk-medium)',
                  }}
                >
                  {mockCase.matchConfidence}%
                </span>
              </div>
              <div
                style={{
                  height: 6,
                  borderRadius: 3,
                  background: 'var(--color-border-subtle)',
                  overflow: 'hidden',
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${mockCase.matchConfidence}%`,
                    background: 'var(--color-risk-medium)',
                    borderRadius: 3,
                  }}
                />
              </div>

              <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginBottom: 5 }}>Re-ID Chain</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {['CAM-02', 'CAM-05', 'CAM-08'].map((cam, i, arr) => (
                  <div key={cam} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span
                      style={{
                        fontSize: 10,
                        fontFamily: 'monospace',
                        fontWeight: 600,
                        color: 'var(--color-brand-cyan)',
                        background: 'rgba(6,182,212,0.1)',
                        border: '1px solid rgba(6,182,212,0.25)',
                        padding: '2px 6px',
                        borderRadius: 3,
                      }}
                    >
                      {cam}
                    </span>
                    {i < arr.length - 1 && (
                      <ChevronRight size={10} style={{ color: 'var(--color-text-muted)' }} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* AI Reasoning */}
            <div className="ai-block">
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  color: 'var(--color-ai-primary)',
                  letterSpacing: '0.1em',
                  marginBottom: 6,
                }}
              >
                AI REASONING
              </div>
              <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.6 }}>
                Subject identified via Re-ID chain across 3 cameras. Movement trajectory indicates
                heading toward Gate B exit (confidence 87%). No adult accompaniment detected for
                14+ minutes — risk escalated to HIGH. Predicted arrival at Gate B: ~3 minutes.
              </p>
            </div>

            {/* Guard dispatch */}
            <div
              style={{
                background: 'rgba(16,185,129,0.06)',
                border: '1px solid rgba(16,185,129,0.25)',
                borderRadius: 8,
                padding: '12px 14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: 'rgba(16,185,129,0.15)',
                    border: '1.5px solid var(--color-risk-low)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <User size={13} style={{ color: 'var(--color-risk-low)' }} />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-primary)' }}>{reza.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--color-risk-low)', fontWeight: 600, letterSpacing: '0.06em' }}>
                    EN ROUTE
                  </div>
                </div>
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontFamily: 'monospace',
                      fontWeight: 800,
                      color: etaDisplay === 'ARRIVED' ? 'var(--color-risk-low)' : 'var(--color-risk-medium)',
                    }}
                  >
                    {etaDisplay}
                  </div>
                  <div style={{ fontSize: 9, color: 'var(--color-text-muted)' }}>ETA</div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  fontSize: 10,
                  color: 'var(--color-text-muted)',
                  marginBottom: 10,
                }}
              >
                <Navigation size={10} />
                Heading to {reza.zone}
              </div>

              <button
                style={{
                  width: '100%',
                  padding: '7px 0',
                  borderRadius: 6,
                  border: '1px solid var(--color-border-default)',
                  background: 'transparent',
                  color: 'var(--color-text-secondary)',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 5,
                }}
              >
                <User size={11} /> Dispatch Another Guard
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom: AI Timeline ─────────────────────────────────────────────── */}
      <div
        style={{
          height: 160,
          flexShrink: 0,
          borderTop: '1px solid var(--color-border-subtle)',
          overflow: 'hidden',
        }}
      >
        <AIReasoningTimeline events={mockTimeline} />
      </div>
    </div>
  )
}
