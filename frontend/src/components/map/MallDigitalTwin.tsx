'use client'

import { useState } from 'react'

// Hardcoded demo mall layout at 800×580 SVG canvas
// All positions are pixel coordinates within the SVG viewBox

interface Zone {
  id: string
  label: string
  x: number
  y: number
  w: number
  h: number
  isRisk?: boolean
}

const ZONES: Zone[] = [
  { id: 'entrance',     label: 'Main Entrance',    x: 290, y: 480, w: 220, h: 80 },
  { id: 'foodcourt',    label: 'Food Court',        x: 60,  y: 280, w: 220, h: 180 },
  { id: 'foodcourtE',   label: 'Food Court East',   x: 290, y: 280, w: 200, h: 180 },
  { id: 'toyzone',      label: 'Toy Zone',          x: 60,  y: 80,  w: 160, h: 180 },
  { id: 'restrooms',    label: 'Restrooms',         x: 240, y: 80,  w: 100, h: 80 },
  { id: 'corridor',     label: 'Corridor',          x: 500, y: 280, w: 100, h: 180 },
  { id: 'gateB',        label: 'Gate B',            x: 610, y: 280, w: 150, h: 100, isRisk: true },
  { id: 'parking',      label: 'Parking Level 1',   x: 610, y: 390, w: 150, h: 170, isRisk: true },
]

interface CameraMarker {
  id: string
  cx: number
  cy: number
  label: string
}

const CAMERAS: CameraMarker[] = [
  { id: 'CAM-01', cx: 400, cy: 520, label: 'Main Entrance' },
  { id: 'CAM-02', cx: 170, cy: 370, label: 'Food Court' },
  { id: 'CAM-03', cx: 390, cy: 370, label: 'Food Court East' },
  { id: 'CAM-04', cx: 140, cy: 130, label: 'Toy Zone' },
  { id: 'CAM-05', cx: 550, cy: 330, label: 'Corridor' },
  { id: 'CAM-06', cx: 685, cy: 310, label: 'Gate B' },
]

// Child confirmed path: CAM-02 → CAM-03 → CAM-05
const CHILD_PATH = [
  { x: 170, y: 370 },
  { x: 390, y: 370 },
  { x: 550, y: 330 },
]

// Predicted arc control point toward Gate B
const LAST_POS = { x: 550, y: 330 }
const PREDICT_END = { x: 685, y: 330 }

// Guard position
const GUARD_POS = { x: 620, y: 360 }

type LayerKey = 'route' | 'cameras' | 'guards' | 'risk'

export default function MallDigitalTwin() {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null)
  const [layers, setLayers] = useState<Record<LayerKey, boolean>>({
    route: true,
    cameras: true,
    guards: true,
    risk: true,
  })

  function toggleLayer(key: LayerKey) {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const childPathD = CHILD_PATH
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ')

  // Quadratic bezier for prediction arc
  const predictD = `M ${LAST_POS.x} ${LAST_POS.y} Q ${(LAST_POS.x + PREDICT_END.x) / 2} ${LAST_POS.y - 40} ${PREDICT_END.x} ${PREDICT_END.y}`

  const layerBtns: { key: LayerKey; label: string }[] = [
    { key: 'route',   label: 'Route' },
    { key: 'cameras', label: 'Cameras' },
    { key: 'guards',  label: 'Guards' },
    { key: 'risk',    label: 'Risk Zones' },
  ]

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Layer toggles */}
      <div
        style={{
          display: 'flex',
          gap: 6,
          padding: '8px 12px',
          position: 'absolute',
          top: 8,
          left: 8,
          zIndex: 10,
          background: 'rgba(8,12,24,0.85)',
          borderRadius: 8,
          border: '1px solid var(--color-border-subtle)',
        }}
      >
        {layerBtns.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => toggleLayer(key)}
            style={{
              padding: '3px 10px',
              borderRadius: 4,
              border: `1px solid ${layers[key] ? 'var(--color-brand-cyan)' : 'var(--color-border-default)'}`,
              background: layers[key] ? 'rgba(6,182,212,0.12)' : 'transparent',
              color: layers[key] ? 'var(--color-brand-cyan)' : 'var(--color-text-muted)',
              fontSize: 11,
              fontWeight: 600,
              cursor: 'pointer',
              letterSpacing: '0.05em',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* SVG Map */}
      <svg
        viewBox="0 0 800 580"
        style={{ width: '100%', height: '100%', display: 'block' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background */}
        <rect width="800" height="580" fill="#080C18" />

        {/* Outer mall boundary */}
        <rect
          x="50" y="70" width="720" height="490"
          fill="none"
          stroke="var(--color-border-strong)"
          strokeWidth="2"
          rx="4"
        />

        {/* Zone fills */}
        {ZONES.map((z) => {
          const isHovered = hoveredZone === z.id
          const isRisk = z.isRisk && layers.risk
          return (
            <g key={z.id}>
              <rect
                x={z.x} y={z.y} width={z.w} height={z.h}
                fill={
                  isRisk
                    ? isHovered ? 'rgba(239,68,68,0.25)' : 'rgba(239,68,68,0.14)'
                    : isHovered ? 'rgba(37,54,89,0.8)' : 'rgba(30,45,77,0.4)'
                }
                stroke={isRisk ? 'rgba(239,68,68,0.5)' : 'var(--color-border-default)'}
                strokeWidth={isRisk ? 1.5 : 1}
                rx="3"
                style={{ cursor: 'pointer', transition: 'fill 150ms' }}
                onMouseEnter={() => setHoveredZone(z.id)}
                onMouseLeave={() => setHoveredZone(null)}
              />
              {isRisk && layers.risk && (
                <rect
                  x={z.x} y={z.y} width={z.w} height={z.h}
                  fill="none"
                  stroke="rgba(239,68,68,0.6)"
                  strokeWidth="1.5"
                  rx="3"
                  strokeDasharray="6 3"
                >
                  <animate
                    attributeName="stroke-opacity"
                    values="0.6;0.2;0.6"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </rect>
              )}
              {/* Zone label */}
              <text
                x={z.x + z.w / 2}
                y={z.y + z.h / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={isRisk ? 'rgba(239,68,68,0.9)' : 'rgba(240,244,255,0.55)'}
                fontSize="11"
                fontFamily="Inter, system-ui, sans-serif"
                fontWeight="500"
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                {z.label}
              </text>
            </g>
          )
        })}

        {/* Child confirmed route */}
        {layers.route && (
          <>
            <path
              d={childPathD}
              fill="none"
              stroke="var(--color-brand-cyan)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <animate attributeName="stroke-dasharray" from="0 400" to="400 0" dur="1.2s" fill="freeze" />
            </path>
            {/* Detection dots on path */}
            {CHILD_PATH.map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r="5" fill="var(--color-brand-cyan)" />
                <text
                  x={p.x}
                  y={p.y - 10}
                  textAnchor="middle"
                  fill="var(--color-brand-cyan)"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  {CAMERAS[i + 1]?.id ?? CAMERAS[i]?.id}
                </text>
              </g>
            ))}
          </>
        )}

        {/* Predicted route (dashed amber) */}
        {layers.route && (
          <path
            d={predictD}
            fill="none"
            stroke="var(--color-risk-medium)"
            strokeWidth="2"
            strokeDasharray="8 4"
            strokeLinecap="round"
            opacity="0.85"
          />
        )}

        {/* Last seen pulsing circle */}
        {layers.route && (
          <g>
            <circle cx={LAST_POS.x} cy={LAST_POS.y} r="10" fill="none" stroke="var(--color-brand-cyan)" strokeWidth="1.5" opacity="0.4">
              <animate attributeName="r" values="10;18;10" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx={LAST_POS.x} cy={LAST_POS.y} r="6" fill="var(--color-brand-cyan)" opacity="0.9" />
            <text
              x={LAST_POS.x}
              y={LAST_POS.y - 16}
              textAnchor="middle"
              fill="var(--color-brand-cyan)"
              fontSize="9"
              fontFamily="Inter, system-ui, sans-serif"
              fontWeight="600"
            >
              Last seen
            </text>
          </g>
        )}

        {/* Prediction endpoint label */}
        {layers.route && (
          <g>
            <text
              x={PREDICT_END.x + 8}
              y={PREDICT_END.y - 8}
              fill="var(--color-risk-medium)"
              fontSize="9"
              fontFamily="monospace"
              fontWeight="700"
            >
              78%
            </text>
            <circle cx={PREDICT_END.x} cy={PREDICT_END.y} r="4" fill="none" stroke="var(--color-risk-medium)" strokeWidth="1.5" />
          </g>
        )}

        {/* Camera markers */}
        {layers.cameras && CAMERAS.map((cam) => (
          <g key={cam.id} style={{ cursor: 'pointer' }}>
            <circle
              cx={cam.cx} cy={cam.cy} r="7"
              fill="rgba(6,182,212,0.15)"
              stroke="var(--color-brand-cyan)"
              strokeWidth="1.5"
            />
            <circle cx={cam.cx} cy={cam.cy} r="2.5" fill="var(--color-brand-cyan)" />
            <text
              x={cam.cx}
              y={cam.cy + 16}
              textAnchor="middle"
              fill="rgba(6,182,212,0.75)"
              fontSize="8"
              fontFamily="monospace"
            >
              {cam.id}
            </text>
          </g>
        ))}

        {/* Guard position */}
        {layers.guards && (
          <g style={{ cursor: 'pointer' }}>
            <circle
              cx={GUARD_POS.x} cy={GUARD_POS.y} r="12"
              fill="rgba(16,185,129,0.2)"
              stroke="var(--color-status-online)"
              strokeWidth="2"
            />
            <text
              x={GUARD_POS.x}
              y={GUARD_POS.y + 1}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="var(--color-status-online)"
              fontSize="10"
              fontFamily="Inter, system-ui, sans-serif"
              fontWeight="700"
            >
              G1
            </text>
            <text
              x={GUARD_POS.x}
              y={GUARD_POS.y + 22}
              textAnchor="middle"
              fill="rgba(16,185,129,0.7)"
              fontSize="8"
              fontFamily="Inter, system-ui, sans-serif"
            >
              Reza · En Route
            </text>
          </g>
        )}

        {/* Corridor connecting lines */}
        <line x1="500" y1="370" x2="610" y2="370" stroke="var(--color-border-subtle)" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="490" y1="280" x2="490" y2="460" stroke="var(--color-border-subtle)" strokeWidth="1" />

        {/* Floor label */}
        <text
          x="760" y="558"
          textAnchor="end"
          fill="var(--color-text-muted)"
          fontSize="9"
          fontFamily="monospace"
        >
          FLOOR 1 · SYNTHETIC MAP
        </text>
      </svg>
    </div>
  )
}
