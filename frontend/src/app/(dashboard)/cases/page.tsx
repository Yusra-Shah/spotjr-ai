'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FolderOpen, Plus, Shield } from 'lucide-react'
import { mockCase, mockResolvedCase } from '@/lib/mock-data'
import type { Case } from '@/lib/types'

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

// ── Risk level styles ─────────────────────────────────────────────────────────
const riskBorderColor: Record<string, string> = {
  low:      'var(--color-risk-low)',
  medium:   'var(--color-risk-medium)',
  high:     'var(--color-risk-high)',
  critical: 'var(--color-risk-critical)',
}

const riskBadgeStyle: Record<string, { bg: string; color: string; border: string }> = {
  low:      { bg: 'rgba(16,185,129,0.12)',  color: 'var(--color-risk-low)',      border: 'rgba(16,185,129,0.35)' },
  medium:   { bg: 'rgba(245,158,11,0.12)',  color: 'var(--color-risk-medium)',   border: 'rgba(245,158,11,0.35)' },
  high:     { bg: 'rgba(249,115,22,0.12)',  color: 'var(--color-risk-high)',     border: 'rgba(249,115,22,0.35)' },
  critical: { bg: 'rgba(239,68,68,0.12)',   color: 'var(--color-risk-critical)', border: 'rgba(239,68,68,0.35)' },
}

// ── Active Case Card ──────────────────────────────────────────────────────────
function ActiveCaseCard({ activeCase }: { activeCase: Case }) {
  const elapsed = useElapsed(activeCase.reportedAt)
  const badge = riskBadgeStyle[activeCase.riskLevel]

  return (
    <Link href="/cases/CASE-A-001" style={{ textDecoration: 'none', display: 'block' }}>
      <div
        style={{
          borderRadius: 10,
          border: '1px solid var(--color-border-default)',
          borderLeft: `3.5px solid ${riskBorderColor[activeCase.riskLevel]}`,
          background: 'var(--color-bg-surface)',
          padding: '14px 16px',
          cursor: 'pointer',
          transition: 'background 150ms',
          display: 'flex',
          gap: 16,
          alignItems: 'flex-start',
        }}
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLDivElement).style.background = 'var(--color-bg-elevated)'
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLDivElement).style.background = 'var(--color-bg-surface)'
        }}
      >
        {/* Left: case info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
            <span
              style={{
                fontSize: 10,
                fontFamily: 'monospace',
                fontWeight: 700,
                color: 'var(--color-text-muted)',
              }}
            >
              {activeCase.id}
            </span>

            {/* Risk badge */}
            <span
              style={{
                padding: '2px 8px',
                borderRadius: 10,
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '0.06em',
                background: badge.bg,
                border: `1px solid ${badge.border}`,
                color: badge.color,
              }}
            >
              {activeCase.riskLevel.toUpperCase()}
            </span>

            {/* Live pulsing dot */}
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
            <span
              style={{
                fontSize: 12,
                fontFamily: 'monospace',
                fontWeight: 700,
                color: 'var(--color-risk-high)',
              }}
            >
              {elapsed}
            </span>
          </div>

          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              marginBottom: 3,
            }}
          >
            {activeCase.childAlias} — Age ~{activeCase.childAge}
          </div>
          <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 6 }}>
            {activeCase.clothingDescription}
          </div>

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
              Last seen: <strong style={{ color: 'var(--color-text-secondary)' }}>{activeCase.lastSeenZone}</strong>
            </span>
            <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
              Match confidence:{' '}
              <strong style={{ color: 'var(--color-risk-medium)' }}>{activeCase.matchConfidence}%</strong>
            </span>
          </div>
        </div>

        {/* Right: risk score + guard */}
        <div style={{ flexShrink: 0, textAlign: 'right' }}>
          <div
            style={{
              fontSize: 28,
              fontFamily: 'monospace',
              fontWeight: 800,
              color: riskBorderColor[activeCase.riskLevel],
              lineHeight: 1,
            }}
          >
            {activeCase.riskScore}
          </div>
          <div style={{ fontSize: 9, color: 'var(--color-text-muted)', letterSpacing: '0.06em', marginBottom: 8 }}>
            RISK SCORE
          </div>
          <div
            style={{
              fontSize: 10,
              padding: '3px 8px',
              borderRadius: 4,
              background: 'rgba(16,185,129,0.1)',
              border: '1px solid rgba(16,185,129,0.25)',
              color: 'var(--color-risk-low)',
              fontWeight: 600,
            }}
          >
            Reza · EN ROUTE
          </div>
        </div>
      </div>
    </Link>
  )
}

// ── Resolved Case Card ────────────────────────────────────────────────────────
function ResolvedCaseCard({ resolvedCase }: { resolvedCase: Case }) {
  return (
    <div
      style={{
        borderRadius: 10,
        border: '1px solid var(--color-border-subtle)',
        borderLeft: '3.5px solid var(--color-risk-low)',
        background: 'var(--color-bg-surface)',
        padding: '12px 16px',
        opacity: 0.6,
        display: 'flex',
        gap: 16,
        alignItems: 'center',
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--color-text-muted)' }}>
            {resolvedCase.id}
          </span>
          {/* Found badge */}
          <span
            style={{
              padding: '2px 8px',
              borderRadius: 10,
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.06em',
              background: 'rgba(16,185,129,0.12)',
              border: '1px solid rgba(16,185,129,0.35)',
              color: 'var(--color-risk-low)',
            }}
          >
            FOUND
          </span>
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 2 }}>
          {resolvedCase.childAlias} — Age ~{resolvedCase.childAge}
        </div>
        <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{resolvedCase.clothingDescription}</div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
          {resolvedCase.lastSeenZone}
        </div>
        <div style={{ fontSize: 11, color: 'var(--color-risk-low)', fontWeight: 600, marginTop: 2 }}>
          Resolved ✓
        </div>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function CasesPage() {
  const activeCases = [mockCase]
  const resolvedCases = [mockResolvedCase]

  return (
    <div
      style={{
        minHeight: '100%',
        background: 'var(--color-bg-base)',
        padding: '28px 32px',
        maxWidth: 900,
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 28,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <FolderOpen size={20} style={{ color: 'var(--color-brand-cyan)' }} />
          <h1
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: 'var(--color-text-primary)',
              margin: 0,
              letterSpacing: '-0.01em',
            }}
          >
            Cases
          </h1>
          <span
            style={{
              fontSize: 11,
              fontFamily: 'monospace',
              background: 'rgba(249,115,22,0.12)',
              border: '1px solid rgba(249,115,22,0.3)',
              color: 'var(--color-risk-high)',
              padding: '2px 8px',
              borderRadius: 10,
              fontWeight: 600,
            }}
          >
            {activeCases.length} active
          </span>
        </div>

        <Link
          href="/cases/new"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'var(--gradient-btn-primary)',
            color: '#fff',
            fontSize: 13,
            fontWeight: 700,
            padding: '9px 18px',
            borderRadius: 7,
            textDecoration: 'none',
          }}
        >
          <Plus size={14} /> New Case
        </Link>
      </div>

      {/* Active Cases Section */}
      <div style={{ marginBottom: 32 }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: 'var(--color-text-muted)',
            letterSpacing: '0.1em',
            marginBottom: 12,
          }}
        >
          ACTIVE
        </div>

        {activeCases.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {activeCases.map((c) => (
              <ActiveCaseCard key={c.id} activeCase={c} />
            ))}
          </div>
        ) : (
          /* Empty state */
          <div
            style={{
              borderRadius: 10,
              border: '1px dashed var(--color-border-subtle)',
              padding: '48px 32px',
              textAlign: 'center',
            }}
          >
            <Shield size={40} style={{ color: 'var(--color-text-muted)', margin: '0 auto 12px' }} />
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: 'var(--color-text-secondary)',
                marginBottom: 6,
              }}
            >
              All Clear
            </div>
            <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
              No active missing child cases. All children accounted for.
            </div>
          </div>
        )}
      </div>

      {/* Resolved Today Section */}
      <div>
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: 'var(--color-text-muted)',
            letterSpacing: '0.1em',
            marginBottom: 12,
          }}
        >
          RESOLVED TODAY
        </div>

        {resolvedCases.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {resolvedCases.map((c) => (
              <ResolvedCaseCard key={c.id} resolvedCase={c} />
            ))}
          </div>
        ) : (
          <div
            style={{
              fontSize: 12,
              color: 'var(--color-text-muted)',
              fontStyle: 'italic',
              padding: '12px 0',
            }}
          >
            No resolved cases today.
          </div>
        )}
      </div>
    </div>
  )
}
