import Link from 'next/link'
import { Shield, Smartphone } from 'lucide-react'

export default function SignInPage() {
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Link
              href="/"
              style={{ textDecoration: 'none' }}
            >
              <button
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  background: 'var(--gradient-btn-primary)',
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 600,
                  padding: '14px 20px',
                  borderRadius: 8,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <Shield size={18} style={{ flexShrink: 0 }} />
                <div style={{ textAlign: 'left' }}>
                  <div>Login as Operator</div>
                  <div style={{ fontSize: 11, fontWeight: 400, opacity: 0.8, marginTop: 1 }}>
                    Access command center &amp; full controls
                  </div>
                </div>
              </button>
            </Link>

            <Link
              href="/guard/alert"
              style={{ textDecoration: 'none' }}
            >
              <button
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
                  cursor: 'pointer',
                }}
              >
                <Smartphone size={18} style={{ flexShrink: 0, color: 'var(--color-brand-cyan)' }} />
                <div style={{ textAlign: 'left' }}>
                  <div>Login as Guard</div>
                  <div style={{ fontSize: 11, fontWeight: 400, color: 'var(--color-text-secondary)', marginTop: 1 }}>
                    Access mobile guard app
                  </div>
                </div>
              </button>
            </Link>
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
    </div>
  )
}
