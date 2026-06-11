import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { mockCase } from '@/lib/mock-data'

export default function GuardCompletePage() {
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
        gap: 20,
      }}
    >
      <div style={{ textAlign: 'center', paddingTop: 24 }}>
        <CheckCircle size={48} style={{ color: 'var(--color-status-online)', margin: '0 auto 16px' }} />
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-status-online)', margin: '0 0 4px' }}>
          CHILD RECOVERED
        </h1>
        <div style={{ color: 'var(--color-text-muted)', fontFamily: 'monospace', fontSize: 12 }}>
          {mockCase.id} — CLOSED
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { label: 'Recovery Location', value: 'Gate B, Parking Level 1' },
            { label: 'Recovery Time', value: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
            { label: 'Response Time', value: '5 min 12 sec' },
            { label: 'Case ID', value: mockCase.id },
          ].map(({ label, value }) => (
            <div key={label}>
              <div style={{ fontSize: 10, color: 'var(--color-text-muted)', letterSpacing: '0.08em', marginBottom: 2 }}>
                {label.toUpperCase()}
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 12 }}>
          Reunited with:
        </div>
        {['Parent/guardian on-site', 'Handed to security desk', 'Other'].map((option, i) => (
          <label
            key={option}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 0',
              cursor: 'pointer',
              color: 'var(--color-text-secondary)',
              fontSize: 13,
            }}
          >
            <input type="radio" name="reunited" defaultChecked={i === 0} style={{ accentColor: 'var(--color-brand-cyan)' }} />
            {option}
          </label>
        ))}
      </div>

      <div className="card">
        <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 8 }}>
          Notes (optional):
        </div>
        <textarea
          rows={3}
          placeholder="Any additional notes..."
          style={{
            width: '100%',
            background: 'var(--color-bg-inset)',
            border: '1px solid var(--color-border-default)',
            borderRadius: 6,
            padding: '10px 12px',
            color: 'var(--color-text-primary)',
            fontSize: 13,
            resize: 'none',
            outline: 'none',
            fontFamily: 'inherit',
          }}
        />
      </div>

      <Link href="/guard/alert" style={{ textDecoration: 'none', marginTop: 'auto' }}>
        <button
          style={{
            width: '100%',
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
          SUBMIT REPORT
        </button>
      </Link>

      <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 12, margin: 0 }}>
        Thank you, Guard Reza.
      </p>
    </div>
  )
}
