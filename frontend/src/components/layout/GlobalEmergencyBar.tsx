'use client'

import Link from 'next/link'
import { AlertTriangle, CheckCircle, Clock, MapPin, Volume2 } from 'lucide-react'
import type { Case } from '@/lib/types'

interface Props {
  activeCase?: Case
}

function formatElapsed(reportedAt: string): string {
  const diff = Math.floor((Date.now() - new Date(reportedAt).getTime()) / 1000)
  const m = Math.floor(diff / 60)
  const s = diff % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function GlobalEmergencyBar({ activeCase }: Props) {
  if (!activeCase) {
    return (
      <div
        style={{ height: 52, background: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border-subtle)' }}
        className="flex items-center px-6 gap-3 shrink-0"
      >
        <CheckCircle size={16} style={{ color: 'var(--color-risk-low)' }} />
        <span style={{ color: 'var(--color-risk-low)', fontWeight: 600, fontSize: 13, letterSpacing: '0.08em' }}>
          ALL CLEAR
        </span>
        <span style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>No active cases</span>
      </div>
    )
  }

  const isHigh = activeCase.riskLevel === 'high' || activeCase.riskLevel === 'critical'
  const isMedium = activeCase.riskLevel === 'medium'

  const barStyle: React.CSSProperties = {
    height: 52,
    borderBottom: '1px solid var(--color-border-subtle)',
    borderLeft: `3px solid ${isHigh ? 'var(--color-risk-critical)' : 'var(--color-risk-medium)'}`,
    background: isHigh ? 'var(--gradient-alert-high)' : 'var(--gradient-alert-medium)',
    position: 'relative',
    overflow: 'hidden',
  }

  return (
    <div
      style={barStyle}
      className="flex items-center px-5 gap-4 shrink-0"
    >
      {/* Red scan sweep across entire bar (HIGH only) */}
      {isHigh && (
        <div
          style={{
            position: 'absolute', top: 0, bottom: 0, width: '22%',
            background: 'linear-gradient(90deg, transparent 0%, rgba(239,68,68,0.07) 50%, transparent 100%)',
            animation: 'scan-bar 3s linear infinite',
            pointerEvents: 'none', zIndex: 0,
          }}
        />
      )}

      <AlertTriangle
        size={16}
        style={{ color: isHigh ? 'var(--color-risk-critical)' : 'var(--color-risk-medium)', flexShrink: 0, position: 'relative', zIndex: 1 }}
      />

      {/* Alert sound indicator (HIGH only) */}
      {isHigh && (
        <Volume2
          size={13}
          style={{
            color: 'var(--color-risk-critical)',
            flexShrink: 0, position: 'relative', zIndex: 1,
            animation: 'float-pulse 1.4s ease-in-out infinite',
          }}
        />
      )}

      <span
        style={{
          color: isHigh ? 'var(--color-risk-critical)' : 'var(--color-risk-medium)',
          fontWeight: 700,
          fontSize: 12,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          flexShrink: 0,
          position: 'relative', zIndex: 1,
          animation: isHigh ? 'blink-border 1.8s ease-in-out infinite' : 'none',
        }}
      >
        {isHigh ? 'URGENT' : 'ACTIVE CASE'}
      </span>

      <span style={{ color: 'var(--color-text-primary)', fontSize: 13, fontWeight: 600 }}>
        {activeCase.childAlias}
      </span>

      <span style={{ color: 'var(--color-text-secondary)', fontSize: 12 }}>Age ~{activeCase.childAge}</span>

      <span
        style={{
          color: 'var(--color-border-strong)',
          fontSize: 12,
          paddingLeft: 4,
          paddingRight: 4,
        }}
      >
        |
      </span>

      <div className="flex items-center gap-1.5">
        <Clock size={12} style={{ color: 'var(--color-text-muted)' }} />
        <span style={{ color: 'var(--color-text-secondary)', fontSize: 12, fontFamily: 'monospace' }}>
          Missing: {formatElapsed(activeCase.reportedAt)}
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <MapPin size={12} style={{ color: 'var(--color-text-muted)' }} />
        <span style={{ color: 'var(--color-text-secondary)', fontSize: 12 }}>
          Last seen: {activeCase.lastSeenZone}
        </span>
      </div>

      <span
        style={{
          fontWeight: 700,
          fontSize: 12,
          color: isHigh ? 'var(--color-risk-critical)' : isMedium ? 'var(--color-risk-medium)' : 'var(--color-risk-high)',
        }}
      >
        Risk: {activeCase.riskLevel.toUpperCase()} ({activeCase.riskScore})
      </span>

      <div className="ml-auto">
        <Link
          href={`/cases/${activeCase.id}`}
          style={{
            background: 'var(--gradient-btn-primary)',
            color: '#fff',
            fontSize: 12,
            fontWeight: 600,
            padding: '6px 14px',
            borderRadius: 4,
            textDecoration: 'none',
            letterSpacing: '0.05em',
          }}
        >
          VIEW CASE →
        </Link>
      </div>
    </div>
  )
}
