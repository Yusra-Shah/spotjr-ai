'use client'

import { useState, useEffect } from 'react'
import { Loader2, AlertCircle, Shield, Smartphone, ArrowLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

async function apiLogin(username: string, password: string) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  if (!res.ok) throw new Error(`${res.status}`)
  const data = await res.json()
  localStorage.setItem('spotjr_token', data.access_token)
  localStorage.setItem('spotjr_role', data.role)
  return data.role as string
}

export default function SignInPage() {
  const [loading, setLoading] = useState<'operator' | 'guard' | null>(null)
  const [error, setError]   = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('spotjr_token')
    const role  = localStorage.getItem('spotjr_role')
    if (token) window.location.href = role === 'guard' ? '/guard/alert' : '/cases'
  }, [])

  async function handleLogin(role: 'operator' | 'guard') {
    setLoading(role)
    setError(null)
    try {
      const returnedRole = await apiLogin(role, 'spotjr2026')
      window.location.href = returnedRole === 'guard' ? '/guard/alert' : '/cases'
    } catch {
      setError('Backend offline — use "Skip Login" on the main page for demo access.')
      setLoading(null)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#FDFCFB',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Inter Variable', 'Inter', system-ui, sans-serif",
    }}>
      {/* Top accent */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 3,
        background: 'linear-gradient(90deg, #A20022 0%, #E5C1BF 40%, #65A4D1 70%, #5A7B12 100%)',
        zIndex: 100,
      }} />

      {/* Background blobs */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(229,193,191,0.5) 0%, transparent 70%)',
          top: -150, right: -100, filter: 'blur(80px)',
          animation: 'blobA 13s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', width: 420, height: 420, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(101,164,209,0.3) 0%, transparent 70%)',
          bottom: -100, left: -80, filter: 'blur(80px)',
          animation: 'blobB 16s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(162,0,34,0.1) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 400 }}
      >
        {/* Back link */}
        <a href="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          color: '#9A8A84', fontSize: 12, fontWeight: 500, textDecoration: 'none',
          marginBottom: 28, transition: 'color 150ms',
        }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#A20022' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#9A8A84' }}
        >
          <ArrowLeft size={13} /> Back to home
        </a>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width: 64, height: 64, borderRadius: 18,
              background: 'linear-gradient(135deg, #8A0018 0%, #A20022 60%, #E5C1BF 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 18px',
              boxShadow: '0 8px 32px rgba(162,0,34,0.25), 0 2px 8px rgba(162,0,34,0.15), inset 0 1px 0 rgba(255,255,255,0.15)',
            }}
          >
            <span style={{ color: '#fff', fontWeight: 900, fontSize: 28, fontFamily: 'monospace', lineHeight: 1 }}>S</span>
          </motion.div>

          <h1 style={{ fontSize: 30, fontWeight: 900, color: '#0F0A08', margin: '0 0 6px', letterSpacing: '-0.03em' }}>
            Command Center
          </h1>
          <p style={{ fontSize: 13, color: '#9A8A84', margin: 0, fontWeight: 400 }}>
            Sign in to your SpotJr account
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(20px)',
          border: '1.5px solid rgba(90,74,68,0.1)',
          borderRadius: 16,
          padding: '28px 24px',
          boxShadow: '0 8px 40px rgba(90,74,68,0.08), 0 2px 8px rgba(90,74,68,0.05)',
        }}>

          {/* Error banner */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: 'hidden', marginBottom: 16 }}
              >
                <div style={{
                  display: 'flex', alignItems: 'flex-start', gap: 8,
                  background: 'rgba(162,0,34,0.06)',
                  border: '1px solid rgba(162,0,34,0.2)',
                  borderRadius: 8, padding: '10px 12px',
                }}>
                  <AlertCircle size={14} style={{ color: '#A20022', flexShrink: 0, marginTop: 1 }} />
                  <p style={{ fontSize: 12, color: '#A20022', margin: 0, lineHeight: 1.5 }}>{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

            {/* Operator */}
            <button
              onClick={() => handleLogin('operator')}
              disabled={loading !== null}
              style={{
                width: '100%',
                display: 'flex', alignItems: 'center', gap: 12,
                background: loading !== null ? 'rgba(162,0,34,0.7)' : 'linear-gradient(135deg, #8A0018 0%, #A20022 100%)',
                color: '#fff',
                fontSize: 14, fontWeight: 600,
                padding: '15px 18px',
                borderRadius: 10,
                border: 'none',
                cursor: loading !== null ? 'not-allowed' : 'pointer',
                opacity: loading === 'guard' ? 0.45 : 1,
                transition: 'all 180ms cubic-bezier(0.34,1.56,0.64,1)',
                boxShadow: '0 2px 12px rgba(162,0,34,0.25)',
                textAlign: 'left',
              }}
              onMouseEnter={(e) => {
                if (loading) return
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(162,0,34,0.35)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 2px 12px rgba(162,0,34,0.25)'
              }}
            >
              {loading === 'operator'
                ? <Loader2 size={18} style={{ flexShrink: 0, animation: 'spin 1s linear infinite' }} />
                : <Shield size={18} style={{ flexShrink: 0 }} />
              }
              <div>
                <div>{loading === 'operator' ? 'Signing in…' : 'Login as Operator'}</div>
                <div style={{ fontSize: 11, fontWeight: 400, opacity: 0.75, marginTop: 1 }}>
                  Access command center &amp; full controls
                </div>
              </div>
            </button>

            {/* Guard */}
            <button
              onClick={() => handleLogin('guard')}
              disabled={loading !== null}
              style={{
                width: '100%',
                display: 'flex', alignItems: 'center', gap: 12,
                background: 'rgba(101,164,209,0.08)',
                border: '1.5px solid rgba(101,164,209,0.3)',
                color: '#1E6898',
                fontSize: 14, fontWeight: 600,
                padding: '14px 18px',
                borderRadius: 10,
                cursor: loading !== null ? 'not-allowed' : 'pointer',
                opacity: loading === 'operator' ? 0.45 : 1,
                transition: 'all 180ms cubic-bezier(0.34,1.56,0.64,1)',
                textAlign: 'left',
              }}
              onMouseEnter={(e) => {
                if (loading) return
                e.currentTarget.style.background = 'rgba(101,164,209,0.14)'
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(101,164,209,0.18)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(101,164,209,0.08)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {loading === 'guard'
                ? <Loader2 size={18} style={{ flexShrink: 0, color: '#65A4D1', animation: 'spin 1s linear infinite' }} />
                : <Smartphone size={18} style={{ flexShrink: 0 }} />
              }
              <div>
                <div>{loading === 'guard' ? 'Signing in…' : 'Login as Guard'}</div>
                <div style={{ fontSize: 11, fontWeight: 400, opacity: 0.65, marginTop: 1 }}>
                  Access mobile guard app
                </div>
              </div>
            </button>
          </div>

          <div style={{
            marginTop: 20, paddingTop: 16,
            borderTop: '1px solid rgba(90,74,68,0.08)',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: 11, color: '#B0A09A', margin: 0, lineHeight: 1.6 }}>
              Demo mode · All data is synthetic
              <br />
              <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#C0B0AA' }}>
                operator / spotjr2026 &nbsp;·&nbsp; guard / spotjr2026
              </span>
            </p>
          </div>
        </div>
      </motion.div>

      <style>{`
        body { background: #FDFCFB !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes blobA {
          0%,100% { transform: translate(0,0) scale(1); }
          40%      { transform: translate(-22px, 18px) scale(1.04); }
          70%      { transform: translate(16px, -12px) scale(0.97); }
        }
        @keyframes blobB {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(20px, -16px) scale(1.06); }
        }
      `}</style>
    </div>
  )
}
