import { Send } from 'lucide-react'
import { mockGuards } from '@/lib/mock-data'
import StatusDot from '@/components/ui/StatusDot'
import type { GuardStatus } from '@/lib/types'

const guardStatusLabel: Record<GuardStatus, string> = {
  standby:  'Standby',
  en_route: 'En Route',
  on_site:  'On Site',
  off_duty: 'Off Duty',
}

export default function DispatchPage() {
  return (
    <div style={{ padding: 32 }}>
      <div className="flex items-center gap-3" style={{ marginBottom: 24 }}>
        <Send size={20} style={{ color: 'var(--color-brand-cyan)' }} />
        <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>
          Guard Dispatch
        </h1>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 8,
          marginBottom: 24,
        }}
      >
        {[
          { label: 'Active',   count: mockGuards.filter(g => g.status === 'en_route' || g.status === 'on_site').length },
          { label: 'Standby',  count: mockGuards.filter(g => g.status === 'standby').length },
          { label: 'Off Duty', count: mockGuards.filter(g => g.status === 'off_duty').length },
        ].map(({ label, count }) => (
          <div
            key={label}
            className="card"
            style={{ padding: '12px 20px', minWidth: 100, textAlign: 'center' }}
          >
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'monospace' }}>
              {count}
            </div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2, letterSpacing: '0.08em' }}>
              {label.toUpperCase()}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {mockGuards.map((guard) => (
          <div
            key={guard.id}
            className="card"
            style={{ display: 'flex', alignItems: 'center', gap: 16 }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'var(--color-bg-inset)',
                border: '1px solid var(--color-border-default)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                fontWeight: 700,
                color: 'var(--color-text-secondary)',
                flexShrink: 0,
              }}
            >
              {guard.name[0]}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: 'var(--color-text-primary)', fontWeight: 600, fontSize: 14 }}>
                {guard.name}
              </div>
              <div style={{ color: 'var(--color-text-secondary)', fontSize: 12, marginTop: 2 }}>
                Zone: {guard.zone}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <StatusDot status={guard.status} />
              <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
                {guardStatusLabel[guard.status]}
              </span>
            </div>
            {guard.eta && (
              <span
                style={{
                  fontSize: 11,
                  fontFamily: 'monospace',
                  color: 'var(--color-status-warning)',
                  background: 'rgba(245, 158, 11, 0.1)',
                  padding: '2px 8px',
                  borderRadius: 4,
                }}
              >
                ETA {Math.floor(guard.eta / 60)}:{String(guard.eta % 60).padStart(2, '0')}
              </span>
            )}
            {guard.status === 'standby' && (
              <button
                style={{
                  background: 'var(--gradient-btn-primary)',
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: 600,
                  padding: '6px 14px',
                  borderRadius: 5,
                  border: 'none',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                Dispatch →
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
