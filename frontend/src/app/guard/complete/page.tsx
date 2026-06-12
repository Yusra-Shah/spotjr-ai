'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { mockCase } from '@/lib/mock-data'

const REUNITED_OPTIONS = [
  'Parent/guardian on-site',
  'Handed to security desk',
  'Other',
]

export default function GuardCompletePage() {
  const [reunited, setReunited] = useState(REUNITED_OPTIONS[0])
  const [notes, setNotes] = useState('')
  const now = new Date()
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

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
        gap: 20,
      }}
    >
      {/* Recovery header */}
      <div style={{ textAlign: 'center', paddingTop: 20 }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: 'rgba(16,185,129,0.12)',
            border: '2px solid var(--color-risk-low)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}
        >
          <CheckCircle size={36} style={{ color: 'var(--color-risk-low)' }} />
        </div>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: 'var(--color-risk-low)',
            margin: '0 0 6px',
            letterSpacing: '-0.01em',
          }}
        >
          CHILD RECOVERED
        </h1>
        <div style={{ color: 'var(--color-text-muted)', fontFamily: 'monospace', fontSize: 12 }}>
          {mockCase.id} — CLOSED
        </div>
      </div>

      {/* Recovery details */}
      <div
        style={{
          background: 'var(--color-bg-elevated)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 12,
          padding: 16,
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {[
            { label: 'Recovery Location', value: 'Gate B, Parking Level 1' },
            { label: 'Recovery Time', value: timeStr },
            { label: 'Response Time', value: '5 min 12 sec' },
            { label: 'Case ID', value: mockCase.id },
          ].map(({ label, value }) => (
            <div key={label}>
              <div style={{ fontSize: 10, color: 'var(--color-text-muted)', letterSpacing: '0.08em', marginBottom: 3 }}>
                {label.toUpperCase()}
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)' }}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Reunited with */}
      <div
        style={{
          background: 'var(--color-bg-elevated)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 12,
          padding: 16,
        }}
      >
        <div style={{ fontSize: 15, color: 'var(--color-text-primary)', fontWeight: 600, marginBottom: 12 }}>
          Reunited with:
        </div>
        {REUNITED_OPTIONS.map((option) => (
          <label
            key={option}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 0',
              borderBottom: option !== 'Other' ? '1px solid var(--color-border-subtle)' : 'none',
              cursor: 'pointer',
            }}
          >
            <div
              onClick={() => setReunited(option)}
              style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                border: `2px solid ${reunited === option ? 'var(--color-brand-cyan)' : 'var(--color-border-default)'}`,
                background: reunited === option ? 'rgba(6,182,212,0.15)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                cursor: 'pointer',
              }}
            >
              {reunited === option && (
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: 'var(--color-brand-cyan)',
                  }}
                />
              )}
            </div>
            <span style={{ fontSize: 16, color: 'var(--color-text-secondary)' }}>{option}</span>
          </label>
        ))}
      </div>

      {/* Notes */}
      <div
        style={{
          background: 'var(--color-bg-elevated)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 12,
          padding: 16,
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 10 }}>
          Notes (optional):
        </div>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any additional notes..."
          style={{
            width: '100%',
            background: 'var(--color-bg-inset)',
            border: '1px solid var(--color-border-default)',
            borderRadius: 8,
            padding: '10px 12px',
            color: 'var(--color-text-primary)',
            fontSize: 15,
            resize: 'none',
            outline: 'none',
            fontFamily: 'inherit',
            lineHeight: 1.5,
          }}
        />
      </div>

      {/* Submit */}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Link href="/guard/alert" style={{ textDecoration: 'none' }}>
          <button
            style={{
              width: '100%',
              height: 64,
              background: 'var(--gradient-btn-success)',
              color: '#fff',
              fontSize: 18,
              fontWeight: 800,
              borderRadius: 12,
              border: 'none',
              cursor: 'pointer',
              letterSpacing: '0.04em',
            }}
          >
            SUBMIT REPORT
          </button>
        </Link>
        <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 14, margin: 0, paddingTop: 4 }}>
          Thank you, Guard Reza.
        </p>
      </div>
    </div>
  )
}
