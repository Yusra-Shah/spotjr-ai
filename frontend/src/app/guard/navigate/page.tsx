'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// ── ETA countdown ─────────────────────────────────────────────────────────────
function useCountdown(initial: number) {
  const [s, setS] = useState(initial)
  useEffect(() => {
    if (s <= 0) return
    const id = setInterval(() => setS((v) => Math.max(0, v - 1)), 1000)
    return () => clearInterval(id)
  }, [s])
  const m = Math.floor(s / 60)
  const sec = (s % 60).toString().padStart(2, '0')
  return s > 0 ? `${m} min ${sec} sec` : 'ARRIVED'
}

// ── Mini navigation mall SVG ──────────────────────────────────────────────────
function NavMallMap() {
  return (
    <svg
      viewBox="0 0 240 160"
      style={{
        width: '100%',
        height: 'auto',
        borderRadius: 12,
        background: '#080C18',
        border: '1px solid var(--color-border-default)',
        display: 'block',
      }}
    >
      {/* Zones */}
      <rect x="12" y="10"  width="52" height="40" rx="2" fill="rgba(30,45,77,0.5)"     stroke="var(--color-border-default)" strokeWidth="0.7" />
      <rect x="12" y="58"  width="64" height="54" rx="2" fill="rgba(30,45,77,0.5)"     stroke="var(--color-border-default)" strokeWidth="0.7" />
      <rect x="84" y="58"  width="60" height="54" rx="2" fill="rgba(30,45,77,0.5)"     stroke="var(--color-border-default)" strokeWidth="0.7" />
      <rect x="152" y="58" width="36" height="24" rx="2" fill="rgba(30,45,77,0.4)"     stroke="var(--color-border-default)" strokeWidth="0.7" />
      <rect x="192" y="58" width="40" height="26" rx="2" fill="rgba(239,68,68,0.15)"   stroke="rgba(239,68,68,0.35)"         strokeWidth="0.8" />
      <rect x="192" y="90" width="40" height="50" rx="2" fill="rgba(239,68,68,0.12)"   stroke="rgba(239,68,68,0.3)"          strokeWidth="0.8" />
      <rect x="84"  y="120" width="60" height="28" rx="2" fill="rgba(30,45,77,0.4)"    stroke="var(--color-border-default)" strokeWidth="0.7" />

      {/* Zone labels */}
      {[
        { x: 38,  y: 30,  t: 'Toy Zone' },
        { x: 44,  y: 85,  t: 'Food Court' },
        { x: 114, y: 85,  t: 'FC East' },
        { x: 170, y: 70,  t: 'Corridor' },
        { x: 212, y: 71,  t: 'Gate B',   isRisk: true },
        { x: 212, y: 115, t: 'Parking',  isRisk: true },
        { x: 114, y: 134, t: 'Entrance' },
      ].map(({ x, y, t, isRisk }) => (
        <text
          key={t}
          x={x} y={y}
          textAnchor="middle" dominantBaseline="middle"
          fill={isRisk ? 'rgba(239,68,68,0.7)' : 'rgba(240,244,255,0.35)'}
          fontSize="5.5"
          fontFamily="Inter, system-ui"
          style={{ userSelect: 'none' }}
        >
          {t}
        </text>
      ))}

      {/* Confirmed path: Food Court → Corridor  (solid cyan) */}
      <polyline
        points="76,85 152,70"
        stroke="#06B6D4" strokeWidth="1.5" fill="none"
        strokeLinecap="round"
      />
      {/* Detection dots on path */}
      <circle cx="44" cy="85" r="3" fill="#06B6D4" />
      <circle cx="114" cy="85" r="3" fill="#06B6D4" />

      {/* Route highlight: Corridor → Gate B */}
      <line x1="188" y1="70" x2="192" y2="70" stroke="#06B6D4" strokeWidth="1.5" strokeDasharray="3,2" />

      {/* Target star at Gate B */}
      <circle cx="212" cy="71" r="5" fill="rgba(245,158,11,0.2)" stroke="#F59E0B" strokeWidth="1.2" />
      <text x="212" y="71.5" textAnchor="middle" dominantBaseline="middle" fill="#F59E0B" fontSize="7" fontWeight="700" style={{ userSelect: 'none' }}>★</text>

      {/* Guard position (blue circle) at Corridor */}
      <circle cx="170" cy="70" r="5.5" fill="#2463EB" fillOpacity="0.25" />
      <circle cx="170" cy="70" r="3.5" fill="#2463EB" stroke="#080C18" strokeWidth="0.6" />
      <text x="170" y="82" textAnchor="middle" fill="#93C5FD" fontSize="4.5" fontFamily="Inter, system-ui" fontWeight="700" style={{ userSelect: 'none' }}>You</text>

      {/* Route path guard → gate B */}
      <path d="M174,70 L192,70" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3,2" strokeLinecap="round" />

      {/* Legend */}
      <circle cx="12" cy="153" r="3" fill="#2463EB" />
      <text x="18" y="153" dominantBaseline="middle" fill="rgba(240,244,255,0.5)" fontSize="4.5" fontFamily="Inter">You</text>
      <circle cx="44" cy="153" r="3" fill="#F59E0B" />
      <text x="50" y="153" dominantBaseline="middle" fill="rgba(240,244,255,0.5)" fontSize="4.5" fontFamily="Inter">Target</text>
    </svg>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function GuardNavigatePage() {
  const etaStr = useCountdown(150)

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg-base)',
        maxWidth: 390,
        margin: '0 auto',
        padding: '20px 20px 32px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      {/* Header */}
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: 4 }}>
          Navigating to Gate B
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <span
            style={{
              fontSize: 20,
              fontFamily: 'monospace',
              fontWeight: 800,
              color: etaStr === 'ARRIVED' ? 'var(--color-risk-low)' : 'var(--color-brand-cyan)',
            }}
          >
            {etaStr}
          </span>
          <span style={{ fontSize: 16, color: 'var(--color-text-secondary)', alignSelf: 'center' }}>
            · 190m
          </span>
        </div>
      </div>

      {/* Mini mall navigation map */}
      <NavMallMap />

      {/* Direction instruction */}
      <div
        style={{
          background: 'var(--color-bg-elevated)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 12,
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
        }}
      >
        <div
          style={{
            fontSize: 28,
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          ↑
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1.3 }}>
            Head straight, then left at the escalator bank
          </div>
          <div style={{ fontSize: 14, color: 'var(--color-text-muted)', marginTop: 4 }}>
            Continue ~80m, turn left, Gate B will be ahead
          </div>
        </div>
      </div>

      {/* Child status update */}
      <div
        style={{
          background: 'rgba(139,92,246,0.08)',
          border: '1px solid rgba(139,92,246,0.25)',
          borderRadius: 10,
          padding: '12px 16px',
        }}
      >
        <div style={{ fontSize: 10, color: 'var(--color-ai-primary)', fontWeight: 700, letterSpacing: '0.12em', marginBottom: 6 }}>
          CHILD STATUS UPDATE
        </div>
        <div style={{ fontSize: 16, color: 'var(--color-text-primary)', lineHeight: 1.4 }}>
          Last confirmed: <strong>45 sec ago</strong>, Camera 8
        </div>
        <div style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginTop: 3 }}>
          Moving in your direction toward Gate B
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Link href="/guard/verify" style={{ textDecoration: 'none' }}>
          <button
            style={{
              width: '100%',
              height: 64,
              background: 'var(--gradient-btn-success)',
              color: '#fff',
              fontSize: 18,
              fontWeight: 800,
              borderRadius: 12,
              border: 'none',
              cursor: 'pointer',
              letterSpacing: '0.04em',
            }}
          >
            I&apos;VE ARRIVED
          </button>
        </Link>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            style={{
              flex: 1,
              height: 52,
              background: 'var(--color-bg-elevated)',
              color: 'var(--color-text-primary)',
              fontSize: 15,
              fontWeight: 600,
              borderRadius: 10,
              border: '1px solid var(--color-border-default)',
              cursor: 'pointer',
            }}
          >
            Update Status
          </button>
          <button
            style={{
              flex: 1,
              height: 52,
              background: 'rgba(239,68,68,0.1)',
              color: 'var(--color-risk-critical)',
              fontSize: 15,
              fontWeight: 600,
              borderRadius: 10,
              border: '1px solid rgba(239,68,68,0.3)',
              cursor: 'pointer',
            }}
          >
            SOS
          </button>
        </div>
      </div>
    </div>
  )
}
