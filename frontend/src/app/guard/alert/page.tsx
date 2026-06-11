import Link from 'next/link'
import { AlertTriangle, MapPin, Clock } from 'lucide-react'
import { mockCase } from '@/lib/mock-data'

export default function GuardAlertPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #1A0A0A 0%, var(--color-bg-base) 40%)',
        display: 'flex',
        flexDirection: 'column',
        padding: 24,
        maxWidth: 390,
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2" style={{ marginBottom: 24 }}>
        <AlertTriangle size={18} style={{ color: 'var(--color-risk-critical)' }} />
        <span
          style={{
            color: 'var(--color-risk-critical)',
            fontWeight: 800,
            fontSize: 13,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}
        >
          URGENT ALERT
        </span>
        <span style={{ marginLeft: 'auto', color: 'var(--color-text-muted)', fontSize: 12 }}>
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {/* Alert card */}
      <div
        style={{
          background: 'var(--color-bg-elevated)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          borderLeft: '3px solid var(--color-risk-critical)',
          borderRadius: 12,
          padding: 24,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: 'var(--color-text-muted)', letterSpacing: '0.1em', marginBottom: 4 }}>
            MISSING CHILD
          </div>
          <div style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--color-text-secondary)' }}>
            {mockCase.id}
          </div>
        </div>

        {/* Child avatar placeholder */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'var(--color-bg-inset)',
            border: '2px solid var(--color-border-default)',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32,
          }}
        >
          👧
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 6 }}>
            {mockCase.childAlias}
          </div>
          <div style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>
            Female, ~{mockCase.childAge} years old
          </div>
          <div style={{ color: 'var(--color-text-secondary)', fontSize: 14, marginTop: 2 }}>
            {mockCase.clothingDescription}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="flex items-center gap-2">
            <MapPin size={14} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
            <span style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}>
              Last seen: <strong style={{ color: 'var(--color-text-primary)' }}>{mockCase.lastSeenZone}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={14} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
            <span style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}>2 minutes ago</span>
          </div>
        </div>

        <div
          style={{
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            borderRadius: 8,
            padding: '10px 14px',
          }}
        >
          <div style={{ fontSize: 11, color: 'var(--color-ai-primary)', fontWeight: 600, letterSpacing: '0.08em', marginBottom: 4 }}>
            AI PREDICTION
          </div>
          <div style={{ fontSize: 13, color: 'var(--color-text-primary)' }}>
            Moving toward Gate B (78% confidence)
          </div>
        </div>

        <div>
          <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 6 }}>RISK LEVEL</div>
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 6,
              padding: '8px 12px',
            }}
          >
            <div
              style={{
                height: 6,
                borderRadius: 3,
                background: `linear-gradient(90deg, var(--color-risk-low) 0%, var(--color-risk-medium) 40%, var(--color-risk-high) 70%, var(--color-risk-critical) 100%)`,
                clipPath: `inset(0 ${100 - mockCase.riskScore}% 0 0 round 3px)`,
              }}
            />
            <div style={{ color: 'var(--color-risk-critical)', fontWeight: 700, fontSize: 13, marginTop: 6 }}>
              HIGH ({mockCase.riskScore})
            </div>
          </div>
        </div>

        <div style={{ fontSize: 12, color: 'var(--color-text-muted)', textAlign: 'center' }}>
          Your position: ~200m from Gate B
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 'auto' }}>
          <Link href="/guard/mission" style={{ textDecoration: 'none' }}>
            <button
              style={{
                width: '100%',
                background: 'var(--gradient-btn-success)',
                color: '#fff',
                fontSize: 16,
                fontWeight: 800,
                padding: '20px',
                borderRadius: 10,
                border: 'none',
                cursor: 'pointer',
                letterSpacing: '0.05em',
              }}
            >
              ACCEPT MISSION
            </button>
          </Link>
          <button
            style={{
              width: '100%',
              background: 'transparent',
              color: 'var(--color-text-muted)',
              fontSize: 13,
              padding: '10px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Decline / Not Available
          </button>
        </div>
      </div>
    </div>
  )
}
