'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Navigation } from 'lucide-react'

interface PredictionZone {
  id: string
  label: string
  x: number; y: number; w: number; h: number
  probability?: number
  isRisk?: boolean
}

interface GuardPos {
  id: string
  label: string
  cx: number
  cy: number
  status: 'en_route' | 'standby' | 'on_site'
}

interface Props {
  showPrediction?: boolean
  highlightZone?: string
}

// Compact map constants (400×280 canvas)
const ZONES: PredictionZone[] = [
  { id: 'entrance',   label: 'ENTRANCE',        x: 145, y: 230, w: 110, h: 44 },
  { id: 'foodcourt',  label: 'FOOD COURT',       x: 30,  y: 140, w: 110, h: 85 },
  { id: 'foodcourtE', label: 'FC EAST',           x: 145, y: 140, w: 100, h: 85 },
  { id: 'toyzone',    label: 'TOY ZONE',          x: 30,  y: 40,  w: 80,  h: 90 },
  { id: 'corridor',   label: 'CORRIDOR',          x: 250, y: 140, w: 50,  h: 85 },
  { id: 'gateB',      label: 'GATE B',            x: 306, y: 140, w: 75,  h: 50, isRisk: true, probability: 78 },
  { id: 'parking',    label: 'PARKING',           x: 306, y: 196, w: 75,  h: 78, isRisk: true, probability: 12 },
]

const CHILD_PATH_PTS = [
  { x: 85, y: 182, cam: 'CAM-02', conf: 78 },
  { x: 195, y: 182, cam: 'CAM-03', conf: 94 },
  { x: 278, y: 165, cam: 'CAM-06', conf: 89 },
]

const GUARDS: GuardPos[] = [
  { id: 'G1', label: 'Reza',   cx: 344, cy: 170, status: 'en_route' },
  { id: 'G2', label: 'Laila',  cx: 51,  cy: 182, status: 'standby' },
]

const LAST = CHILD_PATH_PTS[CHILD_PATH_PTS.length - 1]
const PREDICT_D = `M ${LAST.x} ${LAST.y} Q 340 140 380 165`

function guardColor(s: GuardPos['status']): string {
  if (s === 'en_route') return '#F59E0B'
  if (s === 'on_site')  return '#10B981'
  return '#64748B'
}

export default function PredictionMap({ showPrediction = true, highlightZone }: Props) {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null)
  const pathD = CHILD_PATH_PTS.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

  return (
    <div style={{ width: '100%', position: 'relative', background: '#080C18', borderRadius: 8, overflow: 'hidden' }}>
      <svg
        viewBox="0 0 400 280"
        style={{ width: '100%', display: 'block' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="pm-glow-cyan"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <filter id="pm-glow-red"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <pattern id="pm-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(37,54,89,0.2)" strokeWidth="0.4"/>
          </pattern>
        </defs>

        {/* Background */}
        <rect width="400" height="280" fill="#080C18"/>
        <rect width="400" height="280" fill="url(#pm-grid)"/>

        {/* Mall boundary */}
        <rect x="20" y="30" width="365" height="260" fill="none" stroke="#2E4470" strokeWidth="1.5" rx="3"/>

        {/* Zone fills */}
        {ZONES.map(z => {
          const isHov = hoveredZone === z.id
          const isHL  = highlightZone === z.id
          const fillOpacity = z.isRisk ? 0.18 : 0.1
          const fillColor   = z.isRisk ? 'rgba(239,68,68,' : 'rgba(37,54,89,'
          return (
            <g key={z.id}>
              <rect
                x={z.x} y={z.y} width={z.w} height={z.h}
                fill={`${fillColor}${isHov || isHL ? fillOpacity + 0.08 : fillOpacity})`}
                stroke={z.isRisk ? 'rgba(239,68,68,0.4)' : 'rgba(37,54,89,0.6)'}
                strokeWidth={z.isRisk ? 1.2 : 0.8}
                rx="2"
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredZone(z.id)}
                onMouseLeave={() => setHoveredZone(null)}
              />
              {/* Zone prediction probability overlay */}
              {showPrediction && z.probability !== undefined && (
                <rect
                  x={z.x} y={z.y} width={z.w} height={z.h}
                  fill={`rgba(245,158,11,${z.probability / 100 * 0.2})`}
                  rx="2"
                  pointerEvents="none"
                />
              )}
              {z.isRisk && (
                <rect
                  x={z.x} y={z.y} width={z.w} height={z.h}
                  fill="none" stroke="rgba(239,68,68,0.5)" strokeWidth="1"
                  rx="2" strokeDasharray="4 2"
                >
                  <animate attributeName="stroke-opacity" values="0.5;0.1;0.5" dur="1.6s" repeatCount="indefinite"/>
                </rect>
              )}
              <text
                x={z.x + z.w / 2} y={z.y + z.h / 2 - (z.probability ? 6 : 0)}
                textAnchor="middle" dominantBaseline="middle"
                fill={z.isRisk ? 'rgba(239,68,68,0.7)' : 'rgba(240,244,255,0.35)'}
                fontSize="7" fontFamily="monospace" fontWeight="600"
                letterSpacing="0.06em" pointerEvents="none"
              >
                {z.label}
              </text>
              {showPrediction && z.probability !== undefined && (
                <text
                  x={z.x + z.w / 2} y={z.y + z.h / 2 + 8}
                  textAnchor="middle" dominantBaseline="middle"
                  fill="rgba(245,158,11,0.9)"
                  fontSize="9" fontFamily="monospace" fontWeight="800"
                  pointerEvents="none"
                >
                  {z.probability}%
                </text>
              )}
            </g>
          )
        })}

        {/* Confirmed child path */}
        <path d={pathD} fill="none" stroke="rgba(6,182,212,0.2)" strokeWidth="6" strokeLinecap="round"/>
        <path
          d={pathD} fill="none" stroke="#06B6D4" strokeWidth="2"
          strokeLinecap="round" strokeDasharray="300" strokeDashoffset="300"
        >
          <animate attributeName="stroke-dashoffset" from="300" to="0" dur="1.5s" begin="0.2s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
        </path>

        {/* Detection dots */}
        {CHILD_PATH_PTS.map((p, i) => (
          <g key={p.cam}>
            <circle cx={p.x} cy={p.y} r="6" fill="rgba(6,182,212,0.15)"/>
            <circle cx={p.x} cy={p.y} r="3.5" fill="#06B6D4" stroke="#080C18" strokeWidth="1"/>
            <text x={p.x} y={p.y - 9} textAnchor="middle" fill="#06B6D4" fontSize="6" fontFamily="monospace" fontWeight="700">
              {p.cam}
            </text>
          </g>
        ))}

        {/* Last position ripple */}
        <circle cx={LAST.x} cy={LAST.y} r="5" fill="none" stroke="#06B6D4" strokeWidth="1.5">
          <animate attributeName="r" values="5;20" dur="1.8s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.7;0" dur="1.8s" repeatCount="indefinite"/>
        </circle>
        <circle cx={LAST.x} cy={LAST.y} r="4" fill="#06B6D4" filter="url(#pm-glow-cyan)">
          <animate attributeName="r" values="4;5.5;4" dur="1.2s" repeatCount="indefinite"/>
        </circle>

        {/* Predicted route */}
        {showPrediction && (
          <g>
            <path d={PREDICT_D} fill="none" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="6 3" strokeLinecap="round">
              <animate attributeName="stroke-dashoffset" values="0;-18" dur="0.8s" repeatCount="indefinite"/>
            </path>
            <polygon points="373,160 382,165 374,171" fill="#F59E0B" opacity="0.8"/>
          </g>
        )}

        {/* Guards */}
        {GUARDS.map(g => (
          <g key={g.id}>
            <circle cx={g.cx} cy={g.cy} r="10" fill={`${guardColor(g.status)}15`} stroke={guardColor(g.status)} strokeWidth="1.5">
              {g.status === 'en_route' && (
                <animate attributeName="r" values="10;13;10" dur="2s" repeatCount="indefinite"/>
              )}
            </circle>
            <text x={g.cx} y={g.cy} textAnchor="middle" dominantBaseline="middle" fill={guardColor(g.status)} fontSize="7" fontFamily="monospace" fontWeight="800">
              {g.id}
            </text>
            <text x={g.cx} y={g.cy + 16} textAnchor="middle" fill={`${guardColor(g.status)}BB`} fontSize="5.5" fontFamily="monospace">
              {g.label}
            </text>
          </g>
        ))}

        {/* Watermark */}
        <text x="390" y="276" textAnchor="end" fill="rgba(71,85,105,0.4)" fontSize="5.5" fontFamily="monospace">
          SUNWAY PYRAMID · FLOOR 1
        </text>
      </svg>
    </div>
  )
}
