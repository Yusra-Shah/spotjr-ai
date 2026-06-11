import type { CameraStatus, GuardStatus } from '@/lib/types'

type Status = CameraStatus | GuardStatus

const colorMap: Record<string, string> = {
  // Camera statuses
  live:      'var(--color-status-online)',
  offline:   'var(--color-status-offline)',
  match:     'var(--color-status-warning)',
  high_risk: 'var(--color-status-critical)',
  // Guard statuses
  standby:   'var(--color-brand-cyan)',
  en_route:  'var(--color-status-warning)',
  on_site:   'var(--color-status-online)',
  off_duty:  'var(--color-status-offline)',
}

interface Props {
  status: Status
  size?: number
  pulse?: boolean
}

export default function StatusDot({ status, size = 8, pulse = false }: Props) {
  const color = colorMap[status] ?? 'var(--color-text-muted)'

  return (
    <span
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        flexShrink: 0,
        animation: pulse ? 'pulse 1.5s ease-in-out infinite' : undefined,
      }}
    />
  )
}
