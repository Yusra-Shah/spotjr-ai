import Link from 'next/link'
import { ArrowLeft, Navigation, Shield, Check } from 'lucide-react'
import { mockCase, mockGuards } from '@/lib/mock-data'

const CHECKLIST = [
  { label: 'Female child, approximately 7 years old',       confirmed: true  },
  { label: 'Pink upper clothing (shirt or top)',            confirmed: true  },
  { label: 'Black shoes',                                   confirmed: true  },
  { label: 'May carry a stuffed animal or toy',             confirmed: null  },
  { label: 'Moving toward Gate B / Parking area',           confirmed: true  },
  { label: 'No adult accompaniment observed',               confirmed: true  },
]

export default function GuardMissionPage() {
  const otherGuards = mockGuards.filter((g) => g.assignedCaseId && g.id !== 'GUARD-01')

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
            gap: 5,
            color: 'var(--color-status-online)',
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: 'var(--color-status-online)',
              display: 'inline-block',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          />
          ACTIVE
        </span>
      </div>

      <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-text-primary)', margin: 0 }}>
        Mission Brief
      </h1>

      {/* Child profile */}
      <div
        style={{
          background: 'var(--color-bg-elevated)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 12,
          padding: '16px',
          display: 'flex',
          gap: 16,
          alignItems: 'flex-start',
        }}
      >
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
            flexShrink: 0,
          }}
        >
          👧
        </div>
        <div>
          <div style={{ fontSize: 10, color: 'var(--color-text-muted)', letterSpacing: '0.1em', marginBottom: 4 }}>FIND</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: 6 }}>
            Female, ~{mockCase.childAge} yrs
          </div>
          <div style={{ color: 'var(--color-text-secondary)', fontSize: 15, lineHeight: 1.5 }}>
            {mockCase.clothingDescription}
          </div>
        </div>
      </div>

      {/* Go to */}
      <div
        style={{
          background: 'rgba(6,182,212,0.08)',
          border: '1px solid rgba(6,182,212,0.3)',
          borderRadius: 12,
          padding: '16px 18px',
        }}
      >
        <div style={{ fontSize: 10, color: 'var(--color-brand-cyan)', letterSpacing: '0.12em', marginBottom: 6, fontWeight: 700 }}>
          GO TO
        </div>
        <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: 4 }}>
          Gate B — Parking Level 1
        </div>
        <div style={{ color: 'var(--color-text-secondary)', fontSize: 15, lineHeight: 1.4 }}>
          AI: 78% chance child moving toward Gate B. Arrive in ~3 min.
        </div>
      </div>

      {/* Checklist */}
      <div
        style={{
          background: 'var(--color-bg-elevated)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 12,
          padding: '14px 16px',
        }}
      >
        <div style={{ fontSize: 10, color: 'var(--color-text-muted)', letterSpacing: '0.1em', marginBottom: 12 }}>
          WHAT TO LOOK FOR
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {CHECKLIST.map(({ label, confirmed }) => (
            <div
              key={label}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                padding: '8px 0',
                borderBottom: '1px solid var(--color-border-subtle)',
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background:
                    confirmed === true
                      ? 'rgba(16,185,129,0.12)'
                      : 'rgba(71,85,105,0.12)',
                  border: `1.5px solid ${confirmed === true ? 'var(--color-risk-low)' : 'var(--color-text-muted)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                {confirmed === true ? (
                  <Check size={11} style={{ color: 'var(--color-risk-low)' }} />
                ) : (
                  <span style={{ fontSize: 9, color: 'var(--color-text-muted)', fontWeight: 700 }}>?</span>
                )}
              </div>
              <span
                style={{
                  fontSize: 15,
                  color: confirmed === true ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                  lineHeight: 1.4,
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Risk badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: 'rgba(249,115,22,0.08)',
          border: '1px solid rgba(249,115,22,0.25)',
          borderRadius: 10,
          padding: '10px 14px',
        }}
      >
        <Shield size={16} style={{ color: 'var(--color-risk-high)', flexShrink: 0 }} />
        <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-risk-high)' }}>
          Risk: HIGH — Exit zone
        </span>
      </div>

      {/* Other guards */}
      {otherGuards.length > 0 && (
        <div
          style={{
            background: 'var(--color-bg-elevated)',
            border: '1px solid var(--color-border-default)',
            borderRadius: 10,
            padding: '12px 14px',
          }}
        >
          <div style={{ fontSize: 10, color: 'var(--color-text-muted)', letterSpacing: '0.1em', marginBottom: 8 }}>
            OTHER GUARDS DISPATCHED
          </div>
          {otherGuards.map((g) => (
            <div key={g.id} style={{ fontSize: 15, color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-risk-low)', display: 'inline-block' }} />
              {g.name} — also dispatched
            </div>
          ))}
        </div>
      )}

      {/* Action buttons */}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Link href="/guard/navigate" style={{ textDecoration: 'none' }}>
          <button
            style={{
              width: '100%',
              height: 64,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              background: 'var(--gradient-btn-primary)',
              color: '#fff',
              fontSize: 18,
              fontWeight: 800,
              borderRadius: 12,
              border: 'none',
              cursor: 'pointer',
              letterSpacing: '0.04em',
            }}
          >
            <Navigation size={20} /> START NAVIGATION
          </button>
        </Link>
      </div>
    </div>
  )
}
