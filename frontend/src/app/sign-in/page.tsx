'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, Smartphone, Loader2, AlertCircle } from 'lucide-react'
import { login } from '@/lib/api'

export default function SignInPage() {
  const router = useRouter()
  const [loading, setLoading] = useState<'operator' | 'guard' | null>(null)
  const [error, setError] = useState<string | null>(null)

  // If already logged in, redirect immediately
  useEffect(() => {
    if (typeof window === 'undefined') return
    const token = localStorage.getItem('spotjr_token')
    const role = localStorage.getItem('spotjr_role')
    if (token) {
      router.replace(role === 'guard' ? '/guard/alert' : '/cases')
    }
  }, [router])

  async function handleLogin(role: 'operator' | 'guard') {
    setLoading(role)
    setError(null)
    try {
      await login(role, 'spotjr2026')
      router.push(role === 'guard' ? '/guard/alert' : '/cases')
    } catch (err) {
      console.error('[sign-in] login failed:', err)
      setError('Login failed. Backend may be offline — check that the server is running.')
      setLoading(null)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg-base)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: 'linear-gradient(135deg, var(--color-brand-cyan) 0%, var(--color-ai-primary) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 24 }}>S</span>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-text-primary)', margin: '0 0 6px' }}>
            SpotJr
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 13, margin: 0 }}>
            AI-Powered Missing Child Detection System
          </p>
        </div>

        <div className="card">
          <h2
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--color-text-secondary)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              textAlign: 'center',
              margin: '0 0 24px',
            }}
          >
            Demo Login
          </h2>

          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8,
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: 7,
                padding: '10px 12px',
                marginBottom: 16,
              }}
            >
              <AlertCircle size={14} style={{ color: 'var(--color-risk-critical)', flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontSize: 12, color: 'var(--color-risk-critical)', margin: 0, lineHeight: 1.5 }}>
                {error}
              </p>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button
              onClick={() => handleLogin('operator')}
              disabled={loading !== null}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                background: loading !== null ? 'rgba(36,99,235,0.6)' : 'var(--gradient-btn-primary)',
                color: '#fff',
                fontSize: 14,
                fontWeight: 600,
                padding: '14px 20px',
                borderRadius: 8,
                border: 'none',
                cursor: loading !== null ? 'not-allowed' : 'pointer',
                opacity: loading === 'guard' ? 0.5 : 1,
                transition: 'all 150ms',
              }}
            >
              {loading === 'operator' ? (
                <Loader2 size={18} style={{ flexShrink: 0, animation: 'spin 1s linear infinite' }} />
              ) : (
                <Shield size={18} style={{ flexShrink: 0 }} />
              )}
              <div style={{ textAlign: 'left' }}>
                <div>{loading === 'operator' ? 'Logging in…' : 'Login as Operator'}</div>
                <div style={{ fontSize: 11, fontWeight: 400, opacity: 0.8, marginTop: 1 }}>
                  Access command center &amp; full controls
                </div>
              </div>
            </button>

            <button
              onClick={() => handleLogin('guard')}
              disabled={loading !== null}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                background: 'var(--color-bg-elevated)',
                color: 'var(--color-text-primary)',
                fontSize: 14,
                fontWeight: 600,
                padding: '14px 20px',
                borderRadius: 8,
                border: '1px solid var(--color-border-default)',
                cursor: loading !== null ? 'not-allowed' : 'pointer',
                opacity: loading === 'operator' ? 0.5 : 1,
                transition: 'all 150ms',
              }}
            >
              {loading === 'guard' ? (
                <Loader2 size={18} style={{ flexShrink: 0, color: 'var(--color-brand-cyan)', animation: 'spin 1s linear infinite' }} />
              ) : (
                <Smartphone size={18} style={{ flexShrink: 0, color: 'var(--color-brand-cyan)' }} />
              )}
              <div style={{ textAlign: 'left' }}>
                <div>{loading === 'guard' ? 'Logging in…' : 'Login as Guard'}</div>
                <div style={{ fontSize: 11, fontWeight: 400, color: 'var(--color-text-secondary)', marginTop: 1 }}>
                  Access mobile guard app
                </div>
              </div>
            </button>
          </div>

          <p
            style={{
              textAlign: 'center',
              color: 'var(--color-text-muted)',
              fontSize: 11,
              marginTop: 20,
              marginBottom: 0,
              lineHeight: 1.5,
            }}
          >
            Demo mode — all data is synthetic.
            <br />
            No real child data or PII is used.
          </p>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
