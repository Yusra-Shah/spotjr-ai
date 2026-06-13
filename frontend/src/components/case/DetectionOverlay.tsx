'use client'

import { motion } from 'framer-motion'

export interface BBox {
  x: number   // 0-1 normalized
  y: number
  w: number
  h: number
}

export type MatchLabel = 'possible_match' | 'confirmed_match' | 'unknown'

export interface Detection {
  id: string
  bbox: BBox
  confidence: number
  label: MatchLabel
  trackId?: string
}

interface Props {
  detections: Detection[]
  activeTrackId?: string
  containerWidth: number
  containerHeight: number
  showLabels?: boolean
}

const COLORS: Record<MatchLabel, string> = {
  possible_match:  '#F59E0B',
  confirmed_match: '#06B6D4',
  unknown:         '#475569',
}

export default function DetectionOverlay({ detections, activeTrackId, containerWidth, containerHeight, showLabels = true }: Props) {
  return (
    <svg
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      width={containerWidth}
      height={containerHeight}
      viewBox={`0 0 ${containerWidth} ${containerHeight}`}
    >
      {detections.map(det => {
        const isActive = !activeTrackId || det.trackId === activeTrackId
        const color = COLORS[det.label]
        const x = det.bbox.x * containerWidth
        const y = det.bbox.y * containerHeight
        const w = det.bbox.w * containerWidth
        const h = det.bbox.h * containerHeight
        const opacity = isActive ? 1 : 0.3

        return (
          <g key={det.id} opacity={opacity}>
            {/* Glow shadow */}
            <rect
              x={x - 2} y={y - 2} width={w + 4} height={h + 4}
              fill="none"
              stroke={color}
              strokeWidth={6}
              rx={4}
              opacity={0.15}
              filter="url(#det-blur)"
            />
            {/* Main bounding box */}
            <rect
              x={x} y={y} width={w} height={h}
              fill="none"
              stroke={color}
              strokeWidth={2}
              rx={2}
              strokeDasharray={det.label === 'possible_match' ? '8 3' : undefined}
            >
              {isActive && det.label === 'confirmed_match' && (
                <animate attributeName="opacity" values="1;0.6;1" dur="1.8s" repeatCount="indefinite" />
              )}
            </rect>

            {/* Corner accents */}
            {[
              [x, y, 1, 1], [x + w, y, -1, 1],
              [x, y + h, 1, -1], [x + w, y + h, -1, -1],
            ].map(([cx, cy, dx, dy], i) => (
              <g key={i}>
                <line x1={cx as number} y1={cy as number} x2={(cx as number) + (dx as number) * 10} y2={cy as number} stroke={color} strokeWidth={2.5} strokeLinecap="round" />
                <line x1={cx as number} y1={cy as number} x2={cx as number} y2={(cy as number) + (dy as number) * 10} stroke={color} strokeWidth={2.5} strokeLinecap="round" />
              </g>
            ))}

            {/* Confidence label */}
            {showLabels && (
              <g>
                <rect
                  x={x} y={y - 20} width={70} height={16}
                  fill={color} rx={3}
                />
                <text
                  x={x + 35} y={y - 9}
                  textAnchor="middle"
                  fill="#000"
                  fontSize={9}
                  fontFamily="'JetBrains Mono', monospace"
                  fontWeight="800"
                >
                  {det.confidence}% {det.label === 'confirmed_match' ? 'CONFIRMED' : 'MATCH'}
                </text>
              </g>
            )}
          </g>
        )
      })}

      <defs>
        <filter id="det-blur" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>
    </svg>
  )
}
