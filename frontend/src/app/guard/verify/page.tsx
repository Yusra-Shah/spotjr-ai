import Link from 'next/link'
import { CheckCircle, XCircle, Users } from 'lucide-react'

export default function GuardVerifyPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg-base)',
        maxWidth: 390,
        margin: '0 auto',
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text-primary)', margin: 0 }}>
        Verify: Is this the child?
      </h1>

      <div className="card">
        <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 12, letterSpacing: '0.08em' }}>
          CHECK THESE DETAILS
        </div>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: 'var(--color-bg-inset)',
            border: '2px solid var(--color-border-default)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32,
            margin: '0 auto 16px',
          }}
        >
          👧
        </div>
        {[
          { label: '✓', text: 'Female, approximately 7 years', match: true },
          { label: '✓', text: 'Pink upper clothing', match: true },
          { label: '✓', text: 'Dark lower clothing', match: true },
          { label: '?', text: 'Stuffed animal (possible)', match: null },
        ].map(({ label, text, match }) => (
          <div
            key={text}
            style={{
              display: 'flex',
              gap: 10,
              padding: '6px 0',
              borderBottom: '1px solid var(--color-border-subtle)',
            }}
          >
            <span
              style={{
                fontWeight: 700,
                color: match === null ? 'var(--color-text-muted)' : 'var(--color-risk-low)',
                width: 16,
                flexShrink: 0,
              }}
            >
              {label}
            </span>
            <span style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}>{text}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Link href="/guard/complete" style={{ textDecoration: 'none' }}>
          <button
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              background: 'var(--gradient-btn-success)',
              color: '#fff',
              fontSize: 16,
              fontWeight: 800,
              padding: '18px',
              borderRadius: 10,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <CheckCircle size={20} />
            YES — CHILD FOUND
          </button>
        </Link>
        <button
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            background: 'var(--color-bg-elevated)',
            color: 'var(--color-text-primary)',
            fontSize: 14,
            fontWeight: 600,
            padding: '14px',
            borderRadius: 10,
            border: '1px solid var(--color-border-default)',
            cursor: 'pointer',
          }}
        >
          <XCircle size={16} style={{ color: 'var(--color-status-critical)' }} />
          NOT THIS CHILD
        </button>
        <button
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            background: 'rgba(239, 68, 68, 0.12)',
            color: 'var(--color-risk-critical)',
            fontSize: 14,
            fontWeight: 600,
            padding: '14px',
            borderRadius: 10,
            border: '1px solid rgba(239, 68, 68, 0.3)',
            cursor: 'pointer',
          }}
        >
          <Users size={16} />
          NEED BACKUP
        </button>
      </div>
    </div>
  )
}
