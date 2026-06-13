'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ExternalLink, CheckCircle, AlertOctagon, Navigation, Volume2 } from 'lucide-react'
import type { Case } from '@/lib/types'
import RiskScoreIndicator from './RiskScoreIndicator'

interface Props {
  activeCase: Case
}

function useElapsed(reportedAt: string) {
  const [secs, setSecs] = useState(0)

  useEffect(() => {
    function update() {
      setSecs(Math.floor((Date.now() - new Date(reportedAt).getTime()) / 1000))
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [reportedAt])

  const m = Math.floor(secs / 60)
  const s = secs % 60
  return { elapsed: `${m}:${s.toString().padStart(2, '0')}`, secs }
}

export default function ActiveCasePanel({ activeCase }: Props) {
  const { elapsed, secs } = useElapsed(activeCase.reportedAt)
  const isHigh = activeCase.riskLevel === 'high' || activeCase.riskLevel === 'critical'
  const isOverTenMin = secs >= 600
  const isHighRisk = activeCase.riskScore >= 70

  return (
    <div
      style={{
        width: 380,
        flexShrink: 0,
        height: '100%',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--color-bg-surface)',
        borderLeft: '1px solid var(--color-border-subtle)',
      }}
    >
      {/* Panel header */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid var(--color-border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: 'var(--color-text-secondary)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          Active Intelligence
        </span>
        <span
          style={{
            fontSize: 10,
            fontFamily: 'monospace',
            color: 'var(--color-text-muted)',
          }}
        >
          #{activeCase.id}
        </span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 0 }}>
        {/* ── Section 1: Child Profile ── */}
        <section
          style={{
            padding: '14px 16px',
            borderBottom: '1px solid var(--color-border-subtle)',
          }}
        >
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            {/* Child silhouette avatar with amber glow */}
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 10,
                background: 'rgba(10,15,28,0.9)',
                border: '1.5px solid rgba(245,158,11,0.45)',
                boxShadow: '0 0 16px rgba(245,158,11,0.18), 0 0 4px rgba(245,158,11,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                overflow: 'hidden',
              }}
            >
              <svg viewBox="0 0 40 58" width="34" height="50" xmlns="http://www.w3.org/2000/svg">
                {/* Head */}
                <circle cx="20" cy="11" r="9" fill="rgba(240,244,255,0.12)" stroke="rgba(240,244,255,0.35)" strokeWidth="1.3" />
                {/* Body */}
                <path
                  d="M 8 52 L 8 30 Q 8 21 20 21 Q 32 21 32 30 L 32 52 Z"
                  fill="rgba(240,244,255,0.10)" stroke="rgba(240,244,255,0.28)" strokeWidth="1.3" strokeLinejoin="round"
                />
                {/* Arms */}
                <line x1="8" y1="34" x2="2" y2="42" stroke="rgba(240,244,255,0.22)" strokeWidth="1.2" strokeLinecap="round" />
                <line x1="32" y1="34" x2="38" y2="42" stroke="rgba(240,244,255,0.22)" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  {activeCase.childAlias}
                </span>
                <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
                  ~{activeCase.childAge} yrs
                </span>
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.4,
                  marginBottom: 6,
                }}
              >
                {activeCase.clothingDescription}
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                  Last seen: {activeCase.lastSeenZone}
                </span>
              </div>
            </div>
          </div>

          {/* Elapsed timer */}
          <div
            style={{
              marginTop: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: isOverTenMin ? 'rgba(239,68,68,0.06)' : 'var(--color-bg-inset)',
              borderRadius: 6,
              padding: '6px 12px',
              border: isOverTenMin ? '1px solid rgba(239,68,68,0.25)' : '1px solid transparent',
              transition: 'all 0.5s ease',
            }}
          >
            <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Time missing</span>
            <span
              style={{
                fontSize: 15,
                fontFamily: 'monospace',
                fontWeight: 700,
                color: isOverTenMin ? 'var(--color-risk-critical)' : isHigh ? 'var(--color-risk-critical)' : 'var(--color-risk-medium)',
                animation: isOverTenMin ? 'blink-border 2s ease-in-out infinite' : 'none',
              }}
            >
              {elapsed}
            </span>
          </div>
        </section>

        {/* ── Section 2: Risk Score ── */}
        <section
          style={{
            padding: '12px 16px',
            borderBottom: '1px solid var(--color-border-subtle)',
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: 'var(--color-text-muted)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: 4,
            }}
          >
            Risk Score
          </div>
          <div style={isHighRisk ? { borderRadius: 8, animation: 'pulse-glow-red 2.5s ease-in-out infinite' } : {}}>
            <RiskScoreIndicator
              score={activeCase.riskScore}
              level={activeCase.riskLevel}
              reason="Near Exit B — alone, 14+ min, exit zone proximity"
              trend="increasing"
            />
          </div>
        </section>

        {/* ── Section 3: Match Confidence ── */}
        <section
          style={{
            padding: '12px 16px',
            borderBottom: '1px solid var(--color-border-subtle)',
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: 'var(--color-text-muted)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: 10,
            }}
          >
            AI Confidence
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span
              style={{
                fontSize: 20,
                fontFamily: 'monospace',
                fontWeight: 800,
                color: 'var(--color-brand-cyan)',
              }}
            >
              {activeCase.matchConfidence}%
            </span>
            <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>
              3 camera matches
            </span>
          </div>

          {/* Confidence bar */}
          <div
            style={{
              height: 5,
              background: 'var(--color-border-subtle)',
              borderRadius: 3,
              overflow: 'hidden',
              marginBottom: 8,
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${activeCase.matchConfidence}%`,
                background: 'linear-gradient(90deg, var(--color-brand-cyan) 0%, var(--color-ai-primary) 100%)',
                borderRadius: 3,
                transition: 'width 0.8s ease',
              }}
            />
          </div>

          {/* Re-ID chain */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
            {['CAM-02', 'CAM-05', 'CAM-08'].map((cam, i, arr) => (
              <span key={cam} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span
                  style={{
                    fontSize: 10,
                    fontFamily: 'monospace',
                    color: 'var(--color-brand-cyan)',
                    background: 'rgba(6,182,212,0.1)',
                    border: '1px solid rgba(6,182,212,0.2)',
                    padding: '1px 6px',
                    borderRadius: 3,
                  }}
                >
                  {cam}
                </span>
                {i < arr.length - 1 && (
                  <ArrowRight size={10} style={{ color: 'var(--color-text-muted)' }} />
                )}
              </span>
            ))}
          </div>

          <Link
            href={`/cases/${activeCase.id}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              marginTop: 8,
              color: 'var(--color-brand-cyan)',
              fontSize: 11,
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            View Evidence <ExternalLink size={10} />
          </Link>
        </section>

        {/* ── Section 4: AI Reasoning ── */}
        <section
          style={{
            padding: '12px 16px',
            borderBottom: '1px solid var(--color-border-subtle)',
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: 'var(--color-text-muted)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: 8,
            }}
          >
            Latest AI Insight
          </div>
          <div
            style={{
              background: 'rgba(139,92,246,0.07)',
              borderLeft: '3px solid var(--color-ai-primary)',
              borderRadius: '0 6px 6px 0',
              padding: '10px 12px',
              boxShadow: '0 0 12px rgba(139,92,246,0.12), inset 0 0 20px rgba(139,92,246,0.03)',
            }}
          >
            <p
              className="animate-typing-cursor"
              style={{
                fontSize: 12,
                color: 'var(--color-text-secondary)',
                fontStyle: 'italic',
                lineHeight: 1.6,
                margin: '0 0 6px',
              }}
            >
              Child appears to be moving toward Gate B exit. No adult accompaniment
              detected for 8+ minutes. Risk increasing due to exit proximity.
            </p>
            <span
              style={{
                fontSize: 10,
                fontFamily: 'monospace',
                color: 'var(--color-ai-primary)',
                opacity: 0.85,
              }}
            >
              AI Agent · {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
        </section>

        {/* ── Section 5: Guard Dispatch ── */}
        <section
          style={{
            padding: '12px 16px',
            borderBottom: '1px solid var(--color-border-subtle)',
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: 'var(--color-text-muted)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: 10,
            }}
          >
            Guard Dispatch
          </div>

          <div
            style={{
              background: 'rgba(16,185,129,0.06)',
              border: '1px solid rgba(16,185,129,0.2)',
              borderRadius: 8,
              padding: '10px 12px',
              marginBottom: 8,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: 'rgba(16,185,129,0.15)',
                  border: '1.5px solid var(--color-status-online)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 700,
                  color: 'var(--color-status-online)',
                  flexShrink: 0,
                }}
              >
                R
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  Guard Reza
                </div>
                <div style={{ fontSize: 10, color: 'var(--color-status-online)', fontWeight: 600, letterSpacing: '0.05em' }}>
                  EN ROUTE
                </div>
              </div>
              <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                <div
                  style={{
                    fontSize: 14,
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    color: 'var(--color-status-warning)',
                  }}
                >
                  2:00
                </div>
                <div style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>ETA</div>
              </div>
            </div>
            <Link
              href="/dispatch"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 10,
                color: 'var(--color-brand-cyan)',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              <Navigation
                size={10}
                style={{ animation: 'float-pulse 2s ease-in-out infinite' }}
              />
              Track on Map
            </Link>
          </div>
        </section>

        {/* ── Section 6: Actions ── */}
        <section style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              background: 'var(--gradient-btn-success)',
              color: '#fff',
              fontSize: 13,
              fontWeight: 700,
              padding: '10px',
              borderRadius: 7,
              border: 'none',
              cursor: 'pointer',
              letterSpacing: '0.03em',
            }}
          >
            <CheckCircle size={14} /> Mark as Found
          </button>
          <button
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              background: 'transparent',
              color: 'var(--color-risk-critical)',
              fontSize: 13,
              fontWeight: 700,
              padding: '10px',
              borderRadius: 7,
              border: '1px solid rgba(239,68,68,0.4)',
              cursor: 'pointer',
              letterSpacing: '0.03em',
            }}
          >
            <AlertOctagon size={14} /> Escalate / Backup
          </button>
        </section>
      </div>
    </div>
  )
}
