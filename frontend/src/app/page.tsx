'use client'

import { useEffect, useState } from 'react'
import { Zap, ArrowRight, LogIn, Shield } from 'lucide-react'
import { motion } from 'framer-motion'

// Reliable navigation — no router dependency
function goToDemo() {
  if (typeof window === 'undefined') return
  localStorage.setItem('spotjr_token', 'demo-token')
  localStorage.setItem('spotjr_role', 'operator')
  window.location.href = '/cases'
}

const FADE_UP = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] },
})

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const token = localStorage.getItem('spotjr_token')
    const role = localStorage.getItem('spotjr_role')
    if (token) {
      window.location.href = role === 'guard' ? '/guard/alert' : '/cases'
    }
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      background: '#FDFCFB',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 24px 48px',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Inter Variable', 'Inter', system-ui, sans-serif",
    }}>

      {/* ── Top accent bar (Linear trademark) ─────────────────────────────── */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        height: 3,
        background: 'linear-gradient(90deg, #A20022 0%, #E5C1BF 40%, #65A4D1 70%, #5A7B12 100%)',
        zIndex: 100,
      }} />

      {/* ── Animated background blobs ─────────────────────────────────────── */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div className="blob blob-crimson" />
        <div className="blob blob-blue" />
        <div className="blob blob-green" />
        <div className="blob blob-pink" />

        {/* Dot grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(162,0,34,0.12) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />

        {/* Horizontal rule lines (Linear grid) */}
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: 0, right: 0,
            top: `${(i + 1) * 16.6}%`,
            height: 1,
            background: 'rgba(162,0,34,0.04)',
          }} />
        ))}
      </div>

      {/* ── Floating micro-cards (decorative) ────────────────────────────── */}
      {mounted && (
        <>
          <motion.div
            initial={{ opacity: 0, x: -40, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'absolute',
              left: '6%',
              top: '22%',
              padding: '10px 14px',
              borderRadius: 12,
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(162,0,34,0.12)',
              boxShadow: '0 4px 20px rgba(162,0,34,0.08)',
              fontSize: 11,
              color: '#A20022',
              fontWeight: 600,
              letterSpacing: '0.04em',
              animation: 'floatCard1 6s ease-in-out infinite',
              whiteSpace: 'nowrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#A20022', display: 'inline-block', flexShrink: 0, animation: 'blink 1.5s ease-in-out infinite' }} />
              ALERT: Child detected · CAM-02
            </div>
            <div style={{ color: '#9A8A84', fontWeight: 400, marginTop: 3 }}>Confidence 94% · Food Court</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 1.0, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'absolute',
              right: '6%',
              top: '28%',
              padding: '10px 14px',
              borderRadius: 12,
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(101,164,209,0.2)',
              boxShadow: '0 4px 20px rgba(101,164,209,0.1)',
              fontSize: 11,
              color: '#2E7CB8',
              fontWeight: 600,
              letterSpacing: '0.04em',
              animation: 'floatCard2 8s ease-in-out infinite',
              whiteSpace: 'nowrap',
            }}
          >
            <div>Azure AI Foundry</div>
            <div style={{ color: '#9A8A84', fontWeight: 400, marginTop: 3 }}>Coordinator Agent · Online</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'absolute',
              right: '8%',
              bottom: '22%',
              padding: '10px 14px',
              borderRadius: 12,
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(90,123,18,0.2)',
              boxShadow: '0 4px 20px rgba(90,123,18,0.08)',
              fontSize: 11,
              color: '#4A6A0A',
              fontWeight: 600,
              letterSpacing: '0.04em',
              animation: 'floatCard3 7s ease-in-out infinite',
              whiteSpace: 'nowrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#5A7B12', display: 'inline-block', flexShrink: 0 }} />
              Child found · Gate B
            </div>
            <div style={{ color: '#9A8A84', fontWeight: 400, marginTop: 3 }}>Response: 5m 12s</div>
          </motion.div>
        </>
      )}

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 440 }}>

        {/* Hackathon badge */}
        <motion.div {...FADE_UP(0)} style={{ textAlign: 'center', marginBottom: 24 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '6px 16px',
            borderRadius: 999,
            background: 'rgba(162,0,34,0.06)',
            border: '1px solid rgba(162,0,34,0.18)',
            fontSize: 11, fontWeight: 700, color: '#A20022',
            letterSpacing: '0.06em', textTransform: 'uppercase',
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%', background: '#A20022',
              display: 'inline-block', animation: 'blink 1.4s ease-in-out infinite',
            }} />
            Child Safety AI &nbsp;·&nbsp; Portfolio Demo
          </span>
        </motion.div>

        {/* Logo */}
        <motion.div {...FADE_UP(0.08)} style={{ textAlign: 'center', marginBottom: 40 }}>
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width: 80, height: 80,
              borderRadius: 22,
              background: 'linear-gradient(135deg, #A20022 0%, #C8283C 50%, #E5C1BF 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 22px',
              boxShadow: '0 12px 40px rgba(162,0,34,0.28), 0 2px 8px rgba(162,0,34,0.18), inset 0 1px 0 rgba(255,255,255,0.15)',
            }}
          >
            <span style={{ color: '#fff', fontWeight: 900, fontSize: 38, lineHeight: 1, fontFamily: 'monospace' }}>S</span>
          </motion.div>

          <h1 style={{
            fontSize: 56,
            fontWeight: 900,
            color: '#0F0A08',
            margin: '0 0 10px',
            letterSpacing: '-0.04em',
            lineHeight: 1,
          }}>
            SpotJr
          </h1>

          <p style={{ fontSize: 15, color: '#5A4A44', margin: '0 0 4px', fontWeight: 500, lineHeight: 1.4 }}>
            AI-Powered Missing Child Detection System
          </p>
          <p style={{ fontSize: 12, color: '#B0A09A', margin: 0, letterSpacing: '0.02em' }}>
            Multi-agent detection &nbsp;·&nbsp; Powered by Azure AI Foundry
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div {...FADE_UP(0.2)} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

          {/* Primary — crimson */}
          <button
            onClick={goToDemo}
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              width: '100%',
              background: 'linear-gradient(135deg, #8A0018 0%, #A20022 60%, #BF0030 100%)',
              border: 'none',
              color: '#fff',
              fontSize: 15, fontWeight: 700,
              padding: '18px 22px',
              borderRadius: 12,
              cursor: 'pointer',
              textAlign: 'left',
              boxShadow: '0 4px 24px rgba(162,0,34,0.32), 0 1px 4px rgba(162,0,34,0.2), inset 0 1px 0 rgba(255,255,255,0.12)',
              transition: 'all 200ms cubic-bezier(0.34,1.56,0.64,1)',
              letterSpacing: '-0.01em',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)'
              e.currentTarget.style.boxShadow = '0 8px 36px rgba(162,0,34,0.42), 0 2px 8px rgba(162,0,34,0.25), inset 0 1px 0 rgba(255,255,255,0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)'
              e.currentTarget.style.boxShadow = '0 4px 24px rgba(162,0,34,0.32), 0 1px 4px rgba(162,0,34,0.2), inset 0 1px 0 rgba(255,255,255,0.12)'
            }}
            onMouseDown={(e) => { e.currentTarget.style.transform = 'translateY(0) scale(0.99)' }}
            onMouseUp={(e) => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)' }}
          >
            <Zap size={20} style={{ flexShrink: 0, filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.4))' }} />
            <div style={{ flex: 1 }}>
              <div>Skip Login — View Demo</div>
              <div style={{ fontSize: 11, fontWeight: 400, opacity: 0.75, marginTop: 2 }}>
                Instant access · no login required for judges
              </div>
            </div>
            <ArrowRight size={16} style={{ opacity: 0.8, flexShrink: 0 }} />
          </button>

          {/* Secondary — sky blue */}
          <button
            onClick={goToDemo}
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              width: '100%',
              background: 'rgba(101,164,209,0.07)',
              border: '1.5px solid rgba(101,164,209,0.35)',
              color: '#1E6898',
              fontSize: 15, fontWeight: 600,
              padding: '16px 22px',
              borderRadius: 12,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 200ms cubic-bezier(0.34,1.56,0.64,1)',
              letterSpacing: '-0.01em',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(101,164,209,0.13)'
              e.currentTarget.style.borderColor = 'rgba(101,164,209,0.6)'
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(101,164,209,0.18)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(101,164,209,0.07)'
              e.currentTarget.style.borderColor = 'rgba(101,164,209,0.35)'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
            onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.99)' }}
            onMouseUp={(e) => { e.currentTarget.style.transform = 'translateY(-1px)' }}
          >
            <Shield size={20} style={{ flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div>Demo Access</div>
              <div style={{ fontSize: 11, fontWeight: 400, opacity: 0.65, marginTop: 2 }}>
                Sets demo credentials and opens the command center
              </div>
            </div>
          </button>

          {/* Tertiary — neutral */}
          <a
            href="/sign-in"
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              width: '100%',
              background: 'transparent',
              border: '1.5px solid rgba(90,74,68,0.14)',
              color: '#5A4A44',
              fontSize: 15, fontWeight: 600,
              padding: '16px 22px',
              borderRadius: 12,
              textDecoration: 'none',
              boxSizing: 'border-box',
              transition: 'all 180ms ease',
              letterSpacing: '-0.01em',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(90,74,68,0.28)'
              e.currentTarget.style.background = 'rgba(90,74,68,0.04)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(90,74,68,0.14)'
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <LogIn size={20} style={{ flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div>Enter Command Center</div>
              <div style={{ fontSize: 11, fontWeight: 400, opacity: 0.55, marginTop: 2 }}>
                Login with operator or guard credentials
              </div>
            </div>
          </a>
        </motion.div>

        {/* Azure badges row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.6 }}
          style={{
            marginTop: 28,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 6, flexWrap: 'wrap',
          }}
        >
          {[
            { label: 'Azure AI Foundry', color: '#0078D4' },
            { label: 'GPT-4 Vision',     color: '#0078D4' },
            { label: 'Torchreid OSNet',  color: '#5A7B12' },
            { label: 'Azure SignalR',    color: '#65A4D1' },
          ].map(({ label, color }) => (
            <span key={label} style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '3px 9px',
              borderRadius: 999,
              background: `${color}0D`,
              border: `1px solid ${color}22`,
              fontSize: 10, fontWeight: 600, color,
              letterSpacing: '0.03em',
            }}>
              {label}
            </span>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65, duration: 0.5 }}
          style={{ textAlign: 'center', color: '#B0A09A', fontSize: 11, marginTop: 18, lineHeight: 1.65 }}
        >
          All demo data is synthetic · No real child data or PII used
        </motion.p>
      </div>

      <style>{`
        body { background: #FDFCFB !important; }

        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          will-change: transform;
        }
        .blob-crimson {
          width: 560px; height: 560px;
          background: radial-gradient(circle, rgba(229,193,191,0.55) 0%, transparent 70%);
          top: -180px; right: -120px;
          animation: blobFloat1 14s ease-in-out infinite;
        }
        .blob-blue {
          width: 480px; height: 480px;
          background: radial-gradient(circle, rgba(101,164,209,0.35) 0%, transparent 70%);
          bottom: -120px; left: -120px;
          animation: blobFloat2 17s ease-in-out infinite;
        }
        .blob-green {
          width: 380px; height: 380px;
          background: radial-gradient(circle, rgba(90,123,18,0.18) 0%, transparent 70%);
          top: 42%; left: 55%;
          animation: blobFloat3 11s ease-in-out infinite;
        }
        .blob-pink {
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(162,0,34,0.08) 0%, transparent 70%);
          top: 10%; left: 8%;
          animation: blobFloat4 9s ease-in-out infinite;
        }

        @keyframes blobFloat1 {
          0%, 100% { transform: translate(0,0) scale(1); }
          33%       { transform: translate(-28px, 22px) scale(1.04); }
          66%       { transform: translate(18px, -14px) scale(0.97); }
        }
        @keyframes blobFloat2 {
          0%, 100% { transform: translate(0,0) scale(1); }
          40%       { transform: translate(22px, -18px) scale(1.05); }
          70%       { transform: translate(-14px, 26px) scale(0.96); }
        }
        @keyframes blobFloat3 {
          0%, 100% { transform: translate(0,0) scale(1); }
          50%       { transform: translate(-18px, 14px) scale(1.07); }
        }
        @keyframes blobFloat4 {
          0%, 100% { transform: translate(0,0) scale(1); }
          50%       { transform: translate(14px, -10px) scale(1.05); }
        }

        @keyframes floatCard1 {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes floatCard2 {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50%       { transform: translateY(-6px) rotate(0.5deg); }
        }
        @keyframes floatCard3 {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-10px); }
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}
