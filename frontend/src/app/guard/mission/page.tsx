import Link from 'next/link'
import { ArrowLeft, Navigation } from 'lucide-react'
import { mockCase, mockGuards } from '@/lib/mock-data'

export default function GuardMissionPage() {
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
      <div className="flex items-center justify-between">
        <Link
          href="/guard/alert"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            color: 'var(--color-text-secondary)',
            textDecoration: 'none',
            fontSize: 13,
          }}
        >
          <ArrowLeft size={14} /> {mockCase.id}
        </Link>
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            color: 'var(--color-status-online)',
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-status-online)', display: 'inline-block' }} />
          ACTIVE
        </span>
      </div>

      <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-text-primary)', margin: 0 }}>
        Mission Brief
      </h1>

      <div className="card" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'var(--color-bg-inset)',
            border: '2px solid var(--color-border-default)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
            flexShrink: 0,
          }}
        >
          👧
        </div>
        <div>
          <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 4, letterSpacing: '0.08em' }}>FIND</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)' }}>
            Female child, ~{mockCase.childAge} yrs
          </div>
          <div style={{ color: 'var(--color-text-secondary)', fontSize: 13, marginTop: 4, lineHeight: 1.5 }}>
            {mockCase.clothingDescription}
          </div>
        </div>
      </div>

      <div
        style={{
          background: 'rgba(6, 182, 212, 0.08)',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          borderRadius: 8,
          padding: '14px 16px',
        }}
      >
        <div style={{ fontSize: 11, color: 'var(--color-brand-cyan)', letterSpacing: '0.1em', marginBottom: 6, fontWeight: 600 }}>
          GO TO
        </div>
        <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-text-primary)' }}>
          Gate B — Parking Level 1
        </div>
        <div style={{ color: 'var(--color-text-secondary)', fontSize: 13, marginTop: 4 }}>
          AI: 78% chance child moving toward Gate B. Arrive in ~3 min.
        </div>
      </div>

      <div className="card">
        <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 8, letterSpacing: '0.08em' }}>OTHER GUARDS</div>
        {mockGuards.filter(g => g.assignedCaseId).map(g => (
          <div key={g.id} style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
            {g.name} — also dispatched
          </div>
        ))}
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Link href="/guard/navigate" style={{ textDecoration: 'none' }}>
          <button
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              background: 'var(--gradient-btn-primary)',
              color: '#fff',
              fontSize: 16,
              fontWeight: 800,
              padding: '18px',
              borderRadius: 10,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <Navigation size={18} />
            START NAVIGATION
          </button>
        </Link>
      </div>
    </div>
  )
}
