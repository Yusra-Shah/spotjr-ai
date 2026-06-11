import { Shield, AlertTriangle, CheckCircle, AlertOctagon } from 'lucide-react'
import type { RiskLevel } from '@/lib/types'

interface Props {
  level: RiskLevel
  score?: number
}

const config: Record<RiskLevel, { label: string; color: string; bg: string; Icon: React.ElementType }> = {
  low: {
    label: 'LOW',
    color: 'var(--color-risk-low)',
    bg: 'rgba(16, 185, 129, 0.12)',
    Icon: CheckCircle,
  },
  medium: {
    label: 'MEDIUM',
    color: 'var(--color-risk-medium)',
    bg: 'rgba(245, 158, 11, 0.12)',
    Icon: AlertTriangle,
  },
  high: {
    label: 'HIGH',
    color: 'var(--color-risk-high)',
    bg: 'rgba(249, 115, 22, 0.12)',
    Icon: Shield,
  },
  critical: {
    label: 'CRITICAL',
    color: 'var(--color-risk-critical)',
    bg: 'rgba(239, 68, 68, 0.12)',
    Icon: AlertOctagon,
  },
}

export default function RiskBadge({ level, score }: Props) {
  const { label, color, bg, Icon } = config[level]

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        background: bg,
        color: color,
        border: `1px solid ${color}33`,
        borderRadius: 9999,
        padding: '2px 8px',
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.08em',
        lineHeight: 1.5,
      }}
    >
      <Icon size={10} style={{ flexShrink: 0 }} />
      {label}
      {score !== undefined && ` ${score}`}
    </span>
  )
}
