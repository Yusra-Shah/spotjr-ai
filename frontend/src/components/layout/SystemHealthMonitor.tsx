import Link from 'next/link'
import { Plus, Video } from 'lucide-react'

export default function SystemHealthMonitor() {
  const services = [
    { name: 'Backend',     status: 'online'      as const },
    { name: 'AI Pipeline', status: 'processing'  as const },
    { name: 'Cameras',     status: 'degraded'    as const, detail: '5/6' },
  ]

  const dotColor = {
    online:     'var(--color-status-online)',
    processing: 'var(--color-ai-primary)',
    degraded:   'var(--color-status-warning)',
    offline:    'var(--color-status-offline)',
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 8,
        padding: '8px 16px',
        borderLeft: '1px solid var(--color-border-subtle)',
        height: '100%',
      }}
    >
      {/* Title */}
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: 'var(--color-text-muted)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}
      >
        System Health
      </div>

      {/* Status dots */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {services.map((s) => (
          <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: dotColor[s.status],
                flexShrink: 0,
                ...(s.status === 'processing'
                  ? { boxShadow: `0 0 0 2px rgba(139,92,246,0.3)`, animation: 'pulse 1.5s ease-in-out infinite' }
                  : {}),
              }}
            />
            <span style={{ fontSize: 11, color: 'var(--color-text-secondary)', flex: 1 }}>
              {s.name}
            </span>
            {s.detail && (
              <span style={{ fontSize: 10, fontFamily: 'monospace', color: dotColor[s.status] }}>
                {s.detail}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
        <Link
          href="/cases/new"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            background: 'var(--gradient-btn-primary)',
            color: '#fff',
            fontSize: 11,
            fontWeight: 600,
            padding: '5px 10px',
            borderRadius: 5,
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          <Plus size={11} /> New Case
        </Link>
        <Link
          href="/cctv"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            background: 'var(--color-bg-elevated)',
            color: 'var(--color-text-secondary)',
            fontSize: 11,
            fontWeight: 600,
            padding: '5px 10px',
            borderRadius: 5,
            textDecoration: 'none',
            border: '1px solid var(--color-border-default)',
            flexShrink: 0,
          }}
        >
          <Video size={11} /> All Cameras
        </Link>
      </div>
    </div>
  )
}
