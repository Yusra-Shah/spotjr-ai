'use client'

import Link from 'next/link'
import { AlertTriangle, MapPin, Clock } from 'lucide-react'
import { mockCase } from '@/lib/mock-data'

export default function GuardAlertPage() {
  const now = new Date()
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #2D0A0A 0%, #1A0808 30%, #080C18 60%)',
        display: 'flex',
        flexDirection: 'column',
        maxWidth: 390,
        margin: '0 auto',
        padding: '20px 20px 32px',
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 28,
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: 'var(--color-risk-critical)',
            animation: 'pulse 1s ease-in-out infinite',
            flexShrink: 0,
          }}
        />
        <span
          style={{
            color: 'var(--color-risk-critical)',
            fontWeight: 800,
            fontSize: 13,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            flex: 1,
          }}
        >
          URGENT ALERT
        </span>
        <span style={{ color: 'var(--color-text-muted)', fontSize: 13, fontFamily: 'monospace' }}>
          {timeStr}
        </span>
      </div>

      {/* Main alert card */}
      <div
        style={{
          background: 'rgba(239,68,68,0.06)',
          border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: 16,
          padding: '28px 24px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
        }}
      >
        {/* MISSING CHILD heading */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <AlertTriangle size={28} style={{ color: 'var(--color-risk-critical)', margin: '0 auto 12px' }} />
          <div
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.01em',
              lineHeight: 1.1,
              marginBottom: 6,
            }}
          >
            MISSING CHILD
          </div>
          <div style={{ fontSize: 14, fontFamily: 'monospace', color: 'var(--color-text-muted)' }}>
            {mockCase.id}
          </div>
        </div>

        {/* Child icon */}
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: '50%',
            background: 'rgba(239,68,68,0.08)',
            border: '2px solid rgba(239,68,68,0.25)',
            margin: '0 auto 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 40,
          }}
        >
          👧
        </div>

        {/* Case details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-text-primary)', textAlign: 'center' }}>
            Female, ~{mockCase.childAge} years old
          </div>
          <div style={{ fontSize: 17, color: 'var(--color-text-secondary)', textAlign: 'center', lineHeight: 1.4 }}>
            {mockCase.clothingDescription}
          </div>
        </div>

        {/* Last seen + time */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '10px 14px' }}>
            <MapPin size={16} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
            <span style={{ fontSize: 16, color: 'var(--color-text-secondary)' }}>
              Last seen: <strong style={{ color: 'var(--color-text-primary)' }}>{mockCase.lastSeenZone}</strong>
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '10px 14px' }}>
            <Clock size={16} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
            <span style={{ fontSize: 16, color: 'var(--color-text-secondary)' }}>2 minutes ago</span>
          </div>
        </div>

        {/* AI prediction */}
        <div
          style={{
            background: 'rgba(139,92,246,0.1)',
            border: '1px solid rgba(139,92,246,0.25)',
            borderRadius: 10,
            padding: '12px 16px',
            marginBottom: 16,
          }}
        >
          <div style={{ fontSize: 10, color: 'var(--color-ai-primary)', fontWeight: 700, letterSpacing: '0.12em', marginBottom: 6 }}>
            AI PREDICTION
          </div>
          <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--color-text-primary)' }}>
            Moving toward Gate B
          </div>
          <div style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginTop: 2 }}>
            78% confidence
          </div>
        </div>

        {/* Risk level */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--color-text-muted)', letterSpacing: '0.1em', marginBottom: 8 }}>RISK LEVEL</div>
          <div
            style={{
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: 8,
              padding: '12px 14px',
            }}
          >
            <div
              style={{
                height: 8,
                borderRadius: 4,
                marginBottom: 8,
                background: 'linear-gradient(90deg, #10B981 0%, #F59E0B 40%, #F97316 70%, #EF4444 100%)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  bottom: 0,
                  width: `${100 - mockCase.riskScore}%`,
                  background: 'rgba(8,12,24,0.7)',
                }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-risk-critical)' }}>HIGH</span>
              <span style={{ fontSize: 24, fontFamily: 'monospace', fontWeight: 800, color: 'var(--color-risk-critical)' }}>
                {mockCase.riskScore}
              </span>
            </div>
          </div>
        </div>

        {/* Position */}
        <div
          style={{
            fontSize: 16,
            color: 'var(--color-text-secondary)',
            textAlign: 'center',
            marginBottom: 24,
            padding: '8px 0',
          }}
        >
          Your position: <strong style={{ color: 'var(--color-text-primary)' }}>~200m from Gate B</strong>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 'auto' }}>
          <Link href="/guard/mission" style={{ textDecoration: 'none' }}>
            <button
              style={{
                width: '100%',
                height: 72,
                background: 'var(--gradient-btn-success)',
                color: '#fff',
                fontSize: 18,
                fontWeight: 800,
                borderRadius: 12,
                border: 'none',
                cursor: 'pointer',
                letterSpacing: '0.06em',
                boxShadow: 'var(--glow-green)',
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
              fontSize: 14,
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
