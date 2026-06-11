import Link from 'next/link'
import { VideoOff } from 'lucide-react'
import type { Camera, CameraStatus } from '@/lib/types'
import StatusDot from '@/components/ui/StatusDot'

interface Props {
  camera: Camera
}

const statusLabel: Record<CameraStatus, string> = {
  live:      'LIVE',
  offline:   'OFFLINE',
  match:     'MATCH',
  high_risk: 'HIGH RISK',
}

const borderColor: Partial<Record<CameraStatus, string>> = {
  match:     'var(--color-status-warning)',
  high_risk: 'var(--color-status-critical)',
}

export default function CameraFeedCard({ camera }: Props) {
  const accentBorder = borderColor[camera.status]

  return (
    <Link href={`/cctv/${camera.id}`} style={{ textDecoration: 'none' }}>
      <div
        style={{
          background: 'var(--gradient-card)',
          border: `1px solid ${accentBorder ?? 'var(--color-border-subtle)'}`,
          borderRadius: 8,
          overflow: 'hidden',
          cursor: 'pointer',
          boxShadow: accentBorder
            ? camera.status === 'high_risk'
              ? 'var(--glow-red)'
              : 'var(--glow-amber)'
            : 'var(--shadow-md)',
          transition: 'box-shadow 150ms',
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '6px 8px',
            background: 'rgba(0,0,0,0.4)',
          }}
        >
          <span
            style={{
              color: 'var(--color-text-secondary)',
              fontSize: 10,
              fontFamily: 'monospace',
              background: 'rgba(0,0,0,0.6)',
              padding: '2px 6px',
              borderRadius: 3,
            }}
          >
            {camera.id}
          </span>

          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.08em',
              color:
                camera.status === 'live'      ? 'var(--color-status-online)'
                : camera.status === 'offline'   ? 'var(--color-status-offline)'
                : camera.status === 'match'     ? 'var(--color-status-warning)'
                : 'var(--color-status-critical)',
            }}
          >
            <StatusDot status={camera.status} size={6} pulse={camera.status === 'high_risk'} />
            {statusLabel[camera.status]}
            {camera.confidence && ` ${camera.confidence}%`}
          </span>
        </div>

        {/* Feed placeholder */}
        <div
          style={{
            height: 120,
            background: camera.status === 'offline'
              ? 'linear-gradient(135deg, #0A0A0A 0%, #111 100%)'
              : 'linear-gradient(135deg, var(--color-bg-inset) 0%, var(--color-bg-base) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
          className={camera.status === 'live' ? 'animate-scan-sweep' : undefined}
        >
          {camera.status === 'offline' ? (
            <VideoOff size={24} style={{ color: 'var(--color-status-offline)', opacity: 0.5 }} />
          ) : (
            <span
              style={{
                color: 'var(--color-text-muted)',
                fontSize: 11,
                fontFamily: 'monospace',
                opacity: 0.5,
              }}
            >
              {camera.status === 'match' || camera.status === 'high_risk' ? '[ Detection Active ]' : '[ Live Feed ]'}
            </span>
          )}

          {/* Detection box overlay for match cameras */}
          {(camera.status === 'match' || camera.status === 'high_risk') && (
            <div
              style={{
                position: 'absolute',
                top: '20%',
                left: '35%',
                width: '30%',
                height: '55%',
                border: `2px solid ${camera.status === 'high_risk' ? 'var(--color-status-critical)' : 'var(--color-status-warning)'}`,
                borderRadius: 2,
                pointerEvents: 'none',
              }}
            />
          )}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            padding: '5px 8px',
            background: 'rgba(0,0,0,0.3)',
          }}
        >
          <span
            style={{
              color: 'var(--color-text-secondary)',
              fontSize: 11,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              display: 'block',
            }}
          >
            {camera.zone}
          </span>
        </div>
      </div>
    </Link>
  )
}
