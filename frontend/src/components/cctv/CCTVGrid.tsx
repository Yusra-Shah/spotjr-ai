import Link from 'next/link'
import CameraFeedCard from '@/components/case/CameraFeedCard'
import type { Camera, Case } from '@/lib/types'

interface Props {
  cameras: Camera[]
  activeCase?: Case
}

export default function CCTVGrid({ cameras, activeCase }: Props) {
  // Cameras with detections float to top
  const sorted = [...cameras].sort((a, b) => {
    const priority: Record<string, number> = { high_risk: 0, match: 1, live: 2, offline: 3 }
    return (priority[a.status] ?? 3) - (priority[b.status] ?? 3)
  })

  const displayed = sorted.slice(0, 6)

  return (
    <div
      style={{
        width: 320,
        flexShrink: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--color-bg-surface)',
        borderRight: '1px solid var(--color-border-subtle)',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '10px 12px',
          borderBottom: '1px solid var(--color-border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: 'var(--color-text-secondary)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          Live CCTV
        </span>
        {activeCase && (
          <span
            style={{
              fontSize: 10,
              color: 'var(--color-brand-cyan)',
              background: 'rgba(6,182,212,0.1)',
              padding: '2px 7px',
              borderRadius: 10,
              fontWeight: 600,
            }}
          >
            Scanning
          </span>
        )}
      </div>

      {/* 2×3 Grid */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 6,
          padding: 8,
          alignContent: 'start',
          overflowY: 'auto',
        }}
      >
        {displayed.map((cam) => (
          <CameraFeedCard
            key={cam.id}
            camera={cam}
          />
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: '8px 12px',
          borderTop: '1px solid var(--color-border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
          {cameras.filter(c => c.status !== 'offline').length}/{cameras.length} online
        </span>
        <Link
          href="/cctv"
          style={{
            fontSize: 11,
            color: 'var(--color-brand-cyan)',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          View All →
        </Link>
      </div>
    </div>
  )
}
