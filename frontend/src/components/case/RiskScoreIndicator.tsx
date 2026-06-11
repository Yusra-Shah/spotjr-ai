'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { RiskLevel } from '@/lib/types'

interface Props {
  score: number
  level: RiskLevel
  reason: string
  trend: 'increasing' | 'stable' | 'decreasing'
}

const levelColor: Record<RiskLevel, string> = {
  low:      'var(--color-risk-low)',
  medium:   'var(--color-risk-medium)',
  high:     'var(--color-risk-high)',
  critical: 'var(--color-risk-critical)',
}

const levelLabel: Record<RiskLevel, string> = {
  low:      'LOW',
  medium:   'MEDIUM',
  high:     'HIGH',
  critical: 'CRITICAL',
}

// 270° arc: starts at 225° (bottom-left), sweeps clockwise to 315° (bottom-right)
// In SVG coordinates: we build the path with cx=70, cy=70, r=55
const CX = 70, CY = 70, R = 55

function polarToXY(angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180
  return {
    x: CX + R * Math.cos(rad),
    y: CY + R * Math.sin(rad),
  }
}

function arcPath(startDeg: number, endDeg: number) {
  if (Math.abs(endDeg - startDeg) < 0.01) return ''
  const start = polarToXY(startDeg)
  const end = polarToXY(endDeg)
  const sweep = endDeg - startDeg > 180 ? 1 : 0
  return `M ${start.x} ${start.y} A ${R} ${R} 0 ${sweep} 1 ${end.x} ${end.y}`
}

// Arc spans from 135° to 405° (= 45°) = 270° sweep
const START_ANG = 135
const TOTAL_SWEEP = 270

export default function RiskScoreIndicator({ score, level, reason, trend }: Props) {
  const [displayScore, setDisplayScore] = useState(0)

  useEffect(() => {
    let frame: number
    const start = Date.now()
    const duration = 900

    function tick() {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayScore(Math.round(eased * score))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [score])

  const color = levelColor[level]

  // Background track
  const trackPath = arcPath(START_ANG, START_ANG + TOTAL_SWEEP)
  // Filled arc
  const fillAngle = (displayScore / 100) * TOTAL_SWEEP
  const filledPath = fillAngle > 0.5 ? arcPath(START_ANG, START_ANG + fillAngle) : ''

  // Zone markers at thresholds
  const zones = [
    { at: 0,  color: 'var(--color-risk-low)' },
    { at: 39, color: 'var(--color-risk-medium)' },
    { at: 69, color: 'var(--color-risk-high)' },
    { at: 84, color: 'var(--color-risk-critical)' },
  ]

  const TrendIcon = trend === 'increasing' ? TrendingUp : trend === 'decreasing' ? TrendingDown : Minus
  const trendColor = trend === 'increasing' ? 'var(--color-risk-high)' : trend === 'decreasing' ? 'var(--color-risk-low)' : 'var(--color-text-muted)'

  const isHigh = level === 'high' || level === 'critical'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 0' }}>
      <svg
        width="140" height="100"
        viewBox="0 0 140 100"
        style={{ overflow: 'visible' }}
      >
        {/* Track */}
        <path
          d={trackPath}
          fill="none"
          stroke="var(--color-border-default)"
          strokeWidth="8"
          strokeLinecap="round"
        />

        {/* Zone coloring (thin line behind fill) */}
        {zones.map((z, i) => {
          const nextAt = zones[i + 1]?.at ?? 100
          const startF = (z.at / 100) * TOTAL_SWEEP
          const endF = (nextAt / 100) * TOTAL_SWEEP
          const segPath = arcPath(START_ANG + startF, START_ANG + endF)
          return (
            <path
              key={i}
              d={segPath}
              fill="none"
              stroke={z.color}
              strokeWidth="8"
              strokeLinecap="round"
              opacity="0.15"
            />
          )
        })}

        {/* Filled arc */}
        {filledPath && (
          <path
            d={filledPath}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            style={{
              filter: isHigh ? `drop-shadow(0 0 6px ${color})` : undefined,
            }}
          />
        )}

        {/* Score number */}
        <text
          x={CX}
          y={CY - 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={color}
          fontSize="26"
          fontFamily="'JetBrains Mono', monospace"
          fontWeight="800"
        >
          {displayScore}
        </text>

        {/* Level label */}
        <text
          x={CX}
          y={CY + 16}
          textAnchor="middle"
          fill={color}
          fontSize="8.5"
          fontFamily="Inter, system-ui, sans-serif"
          fontWeight="700"
          letterSpacing="1.5"
        >
          {levelLabel[level]}
        </text>
      </svg>

      {/* Trend + reason */}
      <div className="flex items-center gap-1" style={{ marginTop: 2 }}>
        <TrendIcon size={12} style={{ color: trendColor }} />
        <span style={{ fontSize: 10, color: trendColor, fontWeight: 600, letterSpacing: '0.05em' }}>
          {trend.toUpperCase()}
        </span>
      </div>

      <p
        style={{
          fontSize: 11,
          color: 'var(--color-text-secondary)',
          fontStyle: 'italic',
          textAlign: 'center',
          marginTop: 6,
          lineHeight: 1.5,
          padding: '0 8px',
        }}
      >
        {reason}
      </p>
    </div>
  )
}
