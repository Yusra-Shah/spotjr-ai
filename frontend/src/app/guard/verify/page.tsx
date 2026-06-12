'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle, XCircle, Users, Check } from 'lucide-react'

type ItemStatus = 'confirmed' | 'uncertain' | 'unconfirmed'

interface ChecklistItem { id: string; label: string; status: ItemStatus }

const CHECKLIST: ChecklistItem[] = [
  { id: 'c1', label: 'Female, approximately 7 years old',  status: 'confirmed' },
  { id: 'c2', label: 'Pink upper clothing',                status: 'confirmed' },
  { id: 'c3', label: 'Dark lower clothing',                status: 'confirmed' },
  { id: 'c4', label: 'Stuffed animal (possible)',          status: 'uncertain' },
]

const STATUS_ICON: Record<ItemStatus, string> = {
  confirmed:   '✓',
  uncertain:   '?',
  unconfirmed: '—',
}

const STATUS_COLOR: Record<ItemStatus, string> = {
  confirmed:   'var(--color-risk-low)',
  uncertain:   'var(--color-text-muted)',
  unconfirmed: 'var(--color-text-muted)',
}

export default function GuardVerifyPage() {
  const [items, setItems] = useState(CHECKLIST)

  function toggleItem(id: string) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status:
                item.status === 'confirmed'   ? ('uncertain' as ItemStatus)
                : item.status === 'uncertain' ? ('unconfirmed' as ItemStatus)
                :                               ('confirmed' as ItemStatus),
            }
          : item,
      ),
    )
  }

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
      <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-text-primary)', margin: 0 }}>
        Verify: Is this the child?
      </h1>

      {/* Photo comparison */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10,
        }}
      >
        {/* Report photo */}
        <div>
          <div style={{ fontSize: 10, color: 'var(--color-text-muted)', letterSpacing: '0.1em', marginBottom: 6 }}>
            FROM REPORT
          </div>
          <div
            style={{
              borderRadius: 10,
              background: 'var(--color-bg-elevated)',
              border: '2px solid var(--color-brand-cyan)',
              height: 120,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <span style={{ fontSize: 40 }}>👧</span>
            <span style={{ fontSize: 10, color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
              NO PHOTO
            </span>
          </div>
        </div>

        {/* AI snapshot */}
        <div>
          <div style={{ fontSize: 10, color: 'var(--color-text-muted)', letterSpacing: '0.1em', marginBottom: 6 }}>
            AI LAST SNAPSHOT
          </div>
          <div
            style={{
              borderRadius: 10,
              background: '#0d1423',
              border: '2px solid var(--color-risk-medium)',
              height: 120,
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <span style={{ fontSize: 9, color: 'var(--color-text-muted)', fontFamily: 'monospace', textAlign: 'center' }}>
              [CCTV FRAME]
            </span>
            {/* Bounding box */}
            <div
              style={{
                position: 'absolute',
                top: '15%',
                left: '30%',
                width: '38%',
                height: '60%',
                border: '1.5px solid var(--color-risk-medium)',
                borderRadius: 2,
                boxShadow: '0 0 6px rgba(245,158,11,0.3)',
              }}
            />
            {/* Camera badge */}
            <div
              style={{
                position: 'absolute',
                bottom: 5,
                left: 5,
                fontSize: 8,
                fontFamily: 'monospace',
                background: 'rgba(8,12,24,0.8)',
                color: 'var(--color-brand-cyan)',
                padding: '1px 5px',
                borderRadius: 2,
              }}
            >
              CAM-06
            </div>
            {/* Time badge */}
            <div
              style={{
                position: 'absolute',
                top: 5,
                right: 5,
                fontSize: 8,
                fontFamily: 'monospace',
                background: 'rgba(8,12,24,0.8)',
                color: 'var(--color-text-muted)',
                padding: '1px 5px',
                borderRadius: 2,
              }}
            >
              2 min ago
            </div>
          </div>
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
          CHECK THESE DETAILS — tap to toggle
        </div>
        {items.map(({ id, label, status }) => (
          <button
            key={id}
            onClick={() => toggleItem(id)}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              padding: '10px 0',
              borderBottom: '1px solid var(--color-border-subtle)',
              background: 'none',
              border: 'none',
              width: '100%',
              cursor: 'pointer',
              borderBottomColor: 'var(--color-border-subtle)',
              borderBottomWidth: 1,
              borderBottomStyle: 'solid',
              textAlign: 'left',
            }}
          >
            <span
              style={{
                fontWeight: 800,
                fontSize: 16,
                color: STATUS_COLOR[status],
                width: 22,
                flexShrink: 0,
                marginTop: 1,
              }}
            >
              {STATUS_ICON[status]}
            </span>
            <span
              style={{
                fontSize: 16,
                color: status === 'confirmed' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                lineHeight: 1.4,
              }}
            >
              {label}
            </span>
            {status === 'confirmed' && (
              <CheckCircle
                size={16}
                style={{ color: 'var(--color-risk-low)', flexShrink: 0, marginLeft: 'auto', marginTop: 2 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Confidence display */}
      <div
        style={{
          background: 'rgba(6,182,212,0.06)',
          border: '1px solid rgba(6,182,212,0.2)',
          borderRadius: 10,
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>AI match confidence</span>
        <span style={{ fontSize: 20, fontFamily: 'monospace', fontWeight: 800, color: 'var(--color-risk-medium)' }}>
          {items.filter((i) => i.status === 'confirmed').length * 25}%
        </span>
      </div>

      {/* Action buttons */}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Link href="/guard/complete" style={{ textDecoration: 'none' }}>
          <button
            style={{
              width: '100%',
              height: 72,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              background: 'var(--gradient-btn-success)',
              color: '#fff',
              fontSize: 18,
              fontWeight: 800,
              borderRadius: 12,
              border: 'none',
              cursor: 'pointer',
              boxShadow: 'var(--glow-green)',
            }}
          >
            <CheckCircle size={22} /> YES — CHILD FOUND
          </button>
        </Link>
        <button
          style={{
            width: '100%',
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            background: 'transparent',
            color: 'var(--color-risk-critical)',
            fontSize: 16,
            fontWeight: 700,
            borderRadius: 10,
            border: '1.5px solid rgba(239,68,68,0.4)',
            cursor: 'pointer',
          }}
        >
          <XCircle size={18} /> NOT THIS CHILD
        </button>
        <button
          style={{
            width: '100%',
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            background: 'rgba(245,158,11,0.08)',
            color: 'var(--color-risk-medium)',
            fontSize: 16,
            fontWeight: 700,
            borderRadius: 10,
            border: '1.5px solid rgba(245,158,11,0.3)',
            cursor: 'pointer',
          }}
        >
          <Users size={18} /> NEED BACKUP
        </button>
      </div>
    </div>
  )
}
