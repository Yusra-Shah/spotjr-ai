'use client'

import { useRouter } from 'next/navigation'
import { LogIn, Zap, ArrowRight } from 'lucide-react'

function setDemoAccess(router: ReturnType<typeof useRouter>) {
  localStorage.setItem('spotjr_token', 'demo-token')
  localStorage.setItem('spotjr_role', 'operator')
  router.push('/cases')
}

export default function LandingPage() {
  const router = useRouter()

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg-base)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      {/* ── Logo ─────────────────────────────────────────────────────────── */}
      <div style={{ textAlign: 'center', marginBottom: 52 }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 18,
            background: 'linear-gradient(135deg, #06B6D4 0%, #8B5CF6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 0 40px rgba(6,182,212,0.3)',
          }}
        >
          <span style={{ color: '#fff', fontWeight: 900, fontSize: 34, fontFamily: 'monospace' }}>S</span>
        </div>

        <h1
          style={{
            fontSize: 44,
            fontWeight: 900,
            color: 'var(--color-text-primary)',
            margin: '0 0 10px',
            letterSpacing: '-0.02em',
          }}
        >
          SpotJr
        </h1>

        <p style={{ fontSize: 16, color: 'var(--color-text-secondary)', margin: '0 0 6px' }}>
          AI-Powered Missing Child Detection System
        </p>

        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0 }}>
          Microsoft Agents League Hackathon 2026 &nbsp;·&nbsp; Reasoning Agents Track
        </p>
      </div>

      {/* ── Buttons ──────────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          width: '100%',
          maxWidth: 400,
        }}
      >
        {/* Primary: Skip Login — View Demo */}
        <button
          onClick={() => setDemoAccess(router)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            width: '100%',
            background: 'linear-gradient(135deg, #06B6D4 0%, #2463EB 100%)',
            border: 'none',
            color: '#fff',
            fontSize: 15,
            fontWeight: 700,
            padding: '18px 24px',
            borderRadius: 10,
            cursor: 'pointer',
            textAlign: 'left',
            boxShadow: '0 4px 24px rgba(6,182,212,0.3)',
            transition: 'opacity 150ms',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          <Zap size={22} style={{ flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div>Skip Login — View Demo</div>
            <div style={{ fontSize: 11, fontWeight: 400, opacity: 0.8, marginTop: 2 }}>
              Instant access · no login required for judges
            </div>
          </div>
          <ArrowRight size={16} style={{ flexShrink: 0, opacity: 0.7 }} />
        </button>

        {/* Secondary: Demo Access (same action, explicit label) */}
        <button
          onClick={() => setDemoAccess(router)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            width: '100%',
            background: 'rgba(6,182,212,0.08)',
            border: '1px solid rgba(6,182,212,0.35)',
            color: '#06B6D4',
            fontSize: 15,
            fontWeight: 600,
            padding: '16px 24px',
            borderRadius: 10,
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 150ms',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(6,182,212,0.14)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(6,182,212,0.08)' }}
        >
          <Zap size={20} style={{ flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div>Demo Access</div>
            <div style={{ fontSize: 11, fontWeight: 400, opacity: 0.75, marginTop: 2 }}>
              Sets demo credentials and opens the command center
            </div>
          </div>
        </button>

        {/* Tertiary: Enter via sign-in */}
        <a
          href="/sign-in"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            width: '100%',
            background: 'transparent',
            border: '1px solid var(--color-border-default)',
            color: 'var(--color-text-secondary)',
            fontSize: 15,
            fontWeight: 600,
            padding: '16px 24px',
            borderRadius: 10,
            textDecoration: 'none',
            boxSizing: 'border-box',
            transition: 'border-color 150ms',
          }}
        >
          <LogIn size={20} style={{ flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div>Enter Command Center</div>
            <div style={{ fontSize: 11, fontWeight: 400, opacity: 0.7, marginTop: 2 }}>
              Login with operator or guard credentials
            </div>
          </div>
        </a>
      </div>

      {/* ── Footer note ──────────────────────────────────────────────────── */}
      <p
        style={{
          marginTop: 40,
          fontSize: 11,
          color: 'var(--color-text-muted)',
          textAlign: 'center',
          lineHeight: 1.6,
        }}
      >
        All demo data is synthetic · No real child data or PII used
        <br />
        Demo accounts: <span style={{ fontFamily: 'monospace' }}>operator / spotjr2026</span> &nbsp;·&nbsp; <span style={{ fontFamily: 'monospace' }}>guard / spotjr2026</span>
      </p>
    </div>
  )
}
