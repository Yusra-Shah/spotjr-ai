'use client'

import { useState } from 'react'

// ── Layout constants ──────────────────────────────────────────────
// SVG canvas: 800 × 580

interface Zone {
  id: string
  label: string
  x: number; y: number; w: number; h: number
  gradient: string
  isRisk?: boolean
}

const ZONES: Zone[] = [
  { id: 'entrance',   label: 'MAIN ENTRANCE',   x: 290, y: 480, w: 220, h: 80,  gradient: 'url(#grad-retail)' },
  { id: 'foodcourt',  label: 'FOOD COURT',       x: 60,  y: 280, w: 220, h: 180, gradient: 'url(#grad-food)' },
  { id: 'foodcourtE', label: 'FOOD COURT EAST',  x: 290, y: 280, w: 200, h: 180, gradient: 'url(#grad-food)' },
  { id: 'toyzone',    label: 'TOY ZONE',          x: 60,  y: 80,  w: 160, h: 180, gradient: 'url(#grad-toy)' },
  { id: 'restrooms',  label: 'RESTROOMS',         x: 240, y: 80,  w: 100, h: 80,  gradient: 'url(#grad-retail)' },
  { id: 'corridor',   label: 'CORRIDOR',          x: 500, y: 280, w: 100, h: 180, gradient: 'url(#grad-retail)' },
  { id: 'gateB',      label: 'GATE B',            x: 610, y: 280, w: 150, h: 100, gradient: 'url(#grad-risk)', isRisk: true },
  { id: 'parking',    label: 'PARKING LEVEL 1',   x: 610, y: 390, w: 150, h: 170, gradient: 'url(#grad-risk)', isRisk: true },
]

interface CameraMarker { id: string; cx: number; cy: number }
const CAMERAS: CameraMarker[] = [
  { id: 'CAM-01', cx: 400, cy: 520 },
  { id: 'CAM-02', cx: 170, cy: 365 },
  { id: 'CAM-03', cx: 390, cy: 365 },
  { id: 'CAM-04', cx: 140, cy: 130 },
  { id: 'CAM-05', cx: 550, cy: 328 },
  { id: 'CAM-08', cx: 658, cy: 305 },
]

interface Guard { id: string; cx: number; cy: number; label: string; status: string }
const GUARDS: Guard[] = [
  { id: 'G1', cx: 688, cy: 345, label: 'Reza',   status: 'EN ROUTE' },
  { id: 'G2', cx: 102, cy: 365, label: 'Laila',  status: 'STANDBY'  },
  { id: 'G3', cx: 370, cy: 508, label: 'Harith', status: 'STANDBY'  },
]

// Child confirmed path: CAM-02 → CAM-05 → CAM-08
const CHILD_PATH = [
  { x: 170, y: 365, cam: 'CAM-02' },
  { x: 550, y: 328, cam: 'CAM-05' },
  { x: 658, y: 305, cam: 'CAM-08' },
]

const LAST_POS = CHILD_PATH[CHILD_PATH.length - 1]

// Quadratic bezier: from last pos, curving toward Gate B exit
const PREDICT_D = `M ${LAST_POS.x} ${LAST_POS.y} Q 718 268 755 300`

type LayerKey = 'route' | 'cameras' | 'guards' | 'risk'

const LAYER_BTNS: { key: LayerKey; label: string }[] = [
  { key: 'route',   label: 'Route'      },
  { key: 'cameras', label: 'Cameras'    },
  { key: 'guards',  label: 'Guards'     },
  { key: 'risk',    label: 'Risk Zones' },
]

export default function MallDigitalTwin() {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null)
  const [layers, setLayers] = useState<Record<LayerKey, boolean>>({
    route: true, cameras: true, guards: true, risk: true,
  })

  function toggleLayer(key: LayerKey) {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const childPathD = CHILD_PATH
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ')

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', background: '#080C18' }}>

      {/* ── Layer toggles ─────────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute', top: 10, left: 10, zIndex: 10,
          display: 'flex', gap: 5, padding: '6px 10px',
          background: 'rgba(8,12,24,0.9)', borderRadius: 7,
          border: '1px solid rgba(37,54,89,0.8)',
          backdropFilter: 'blur(8px)',
        }}
      >
        {LAYER_BTNS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => toggleLayer(key)}
            style={{
              padding: '3px 9px', borderRadius: 4, fontSize: 10, fontWeight: 600,
              letterSpacing: '0.06em', cursor: 'pointer',
              border: `1px solid ${layers[key] ? '#06B6D4' : '#253659'}`,
              background: layers[key] ? 'rgba(6,182,212,0.12)' : 'transparent',
              color: layers[key] ? '#06B6D4' : '#475569',
              transition: 'all 120ms',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── LIVE badge ────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute', top: 10, right: 12, zIndex: 10,
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '5px 10px',
          background: 'rgba(8,12,24,0.9)', borderRadius: 5,
          border: '1px solid rgba(16,185,129,0.25)',
        }}
      >
        <div style={{
          width: 7, height: 7, borderRadius: '50%', background: '#10B981',
          boxShadow: '0 0 6px rgba(16,185,129,0.8)',
          animation: 'float-pulse 1.5s ease-in-out infinite',
        }} />
        <span style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 700, color: '#10B981', letterSpacing: '0.1em' }}>
          LIVE · FLOOR 1
        </span>
      </div>

      {/* ── SVG Map ───────────────────────────────────────────────────── */}
      <svg
        viewBox="0 0 800 580"
        preserveAspectRatio="xMidYMid slice"
        style={{ width: '100%', height: '100%', display: 'block' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Zone gradients */}
          <linearGradient id="grad-food" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(245,158,11,0.14)" />
            <stop offset="100%" stopColor="rgba(245,158,11,0.05)" />
          </linearGradient>
          <linearGradient id="grad-retail" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(37,54,89,0.65)" />
            <stop offset="100%" stopColor="rgba(17,24,39,0.4)" />
          </linearGradient>
          <linearGradient id="grad-toy" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(139,92,246,0.14)" />
            <stop offset="100%" stopColor="rgba(79,70,229,0.05)" />
          </linearGradient>
          <linearGradient id="grad-risk" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(239,68,68,0.2)" />
            <stop offset="100%" stopColor="rgba(220,38,38,0.08)" />
          </linearGradient>

          {/* Cyan glow filter for child path */}
          <filter id="glow-cyan" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Red glow filter for risk zones */}
          <filter id="glow-red" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Grid pattern for blueprint texture */}
          <pattern id="grid-bg" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(37,54,89,0.25)" strokeWidth="0.5" />
          </pattern>
          <pattern id="grid-fine" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(30,45,77,0.15)" strokeWidth="0.3" />
          </pattern>
        </defs>

        {/* ── Base ──────────────────────────────────────────────────────── */}
        <rect width="800" height="580" fill="#080C18" />
        <rect width="800" height="580" fill="url(#grid-fine)" />
        <rect width="800" height="580" fill="url(#grid-bg)" />

        {/* Outer mall boundary */}
        <rect x="50" y="70" width="720" height="490" fill="none" stroke="#2E4470" strokeWidth="2" rx="4" />
        {/* Inner structural dividers */}
        <line x1="50" y1="270" x2="600" y2="270" stroke="#1E2D4D" strokeWidth="1" />
        <line x1="280" y1="270" x2="280" y2="470" stroke="#1E2D4D" strokeWidth="1" />
        <line x1="490" y1="270" x2="490" y2="470" stroke="#1E2D4D" strokeWidth="1" />
        <line x1="600" y1="270" x2="600" y2="570" stroke="#1E2D4D" strokeWidth="1" />
        <line x1="230" y1="70" x2="230" y2="270" stroke="#1E2D4D" strokeWidth="1" />
        <line x1="350" y1="70" x2="350" y2="270" stroke="#1E2D4D" strokeWidth="1" />

        {/* ── Zone fills ────────────────────────────────────────────────── */}
        {ZONES.map((z) => {
          const isHov = hoveredZone === z.id
          const isRisk = z.isRisk && layers.risk
          return (
            <g key={z.id}>
              <rect
                x={z.x} y={z.y} width={z.w} height={z.h}
                fill={z.gradient}
                stroke={isRisk ? 'rgba(239,68,68,0.45)' : 'rgba(37,54,89,0.6)'}
                strokeWidth={isRisk ? 1.5 : 1}
                rx="3"
                opacity={isHov ? 1 : 0.85}
                style={{ cursor: 'pointer', transition: 'opacity 150ms' }}
                onMouseEnter={() => setHoveredZone(z.id)}
                onMouseLeave={() => setHoveredZone(null)}
              />
              {/* Risk zone animated pulsing border */}
              {isRisk && (
                <rect
                  x={z.x} y={z.y} width={z.w} height={z.h}
                  fill="none"
                  stroke="rgba(239,68,68,0.7)"
                  strokeWidth="1.5"
                  rx="3"
                  strokeDasharray="6 3"
                  filter="url(#glow-red)"
                >
                  <animate attributeName="stroke-opacity" values="0.7;0.15;0.7" dur="1.8s" repeatCount="indefinite" />
                  <animate attributeName="stroke-dashoffset" values="0;-18" dur="1.2s" repeatCount="indefinite" />
                </rect>
              )}
              {/* Zone label */}
              <text
                x={z.x + z.w / 2} y={z.y + z.h / 2}
                textAnchor="middle" dominantBaseline="middle"
                fill={isRisk ? 'rgba(239,68,68,0.85)' : 'rgba(240,244,255,0.45)'}
                fontSize="9" fontFamily="'JetBrains Mono', monospace" fontWeight="600"
                letterSpacing="0.08em"
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                {z.label}
              </text>
              {/* Risk badge icon */}
              {isRisk && (
                <text
                  x={z.x + z.w / 2} y={z.y + z.h / 2 + 14}
                  textAnchor="middle" dominantBaseline="middle"
                  fill="rgba(239,68,68,0.6)"
                  fontSize="8" fontFamily="monospace" fontWeight="700"
                  style={{ pointerEvents: 'none' }}
                >
                  ⚠ HIGH RISK ZONE
                </text>
              )}
            </g>
          )
        })}

        {/* ── Child confirmed route (animated draw) ─────────────────────── */}
        {layers.route && (
          <g>
            {/* Glow shadow of path */}
            <path
              d={childPathD}
              fill="none"
              stroke="rgba(6,182,212,0.25)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow-cyan)"
            />
            {/* Main cyan path with draw animation */}
            <path
              d={childPathD}
              fill="none"
              stroke="#06B6D4"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="500"
              strokeDashoffset="500"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="500" to="0"
                dur="1.8s"
                begin="0.3s"
                fill="freeze"
                calcMode="spline"
                keySplines="0.4 0 0.2 1"
              />
            </path>

            {/* Detection dots at each camera position */}
            {CHILD_PATH.map((p, i) => (
              <g key={p.cam}>
                {/* Dot glow */}
                <circle cx={p.x} cy={p.y} r="8" fill="rgba(6,182,212,0.15)" />
                {/* Main dot */}
                <circle cx={p.x} cy={p.y} r="5" fill="#06B6D4" stroke="#080C18" strokeWidth="1.5" />
                {/* Camera label */}
                <text
                  x={p.x} y={p.y - 13}
                  textAnchor="middle"
                  fill="#06B6D4"
                  fontSize="8" fontFamily="monospace" fontWeight="700"
                  style={{ pointerEvents: 'none' }}
                >
                  {p.cam}
                </text>
                {/* Confidence */}
                <text
                  x={p.x} y={p.y - 4}
                  textAnchor="middle"
                  fill="rgba(6,182,212,0.7)"
                  fontSize="7" fontFamily="monospace"
                  style={{ pointerEvents: 'none' }}
                >
                  {i === 0 ? '78%' : i === 1 ? '94%' : '89%'}
                </text>
              </g>
            ))}

            {/* ── Last known position — 3 ripple rings ──────────────────── */}
            <circle cx={LAST_POS.x} cy={LAST_POS.y} r="8" fill="none" stroke="#06B6D4" strokeWidth="1.8" opacity="0.7">
              <animate attributeName="r" values="8;28" dur="2s" begin="0s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.7;0" dur="2s" begin="0s" repeatCount="indefinite" />
            </circle>
            <circle cx={LAST_POS.x} cy={LAST_POS.y} r="8" fill="none" stroke="#06B6D4" strokeWidth="1.3" opacity="0.5">
              <animate attributeName="r" values="8;28" dur="2s" begin="0.65s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.5;0" dur="2s" begin="0.65s" repeatCount="indefinite" />
            </circle>
            <circle cx={LAST_POS.x} cy={LAST_POS.y} r="8" fill="none" stroke="#06B6D4" strokeWidth="0.8" opacity="0.35">
              <animate attributeName="r" values="8;28" dur="2s" begin="1.3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.35;0" dur="2s" begin="1.3s" repeatCount="indefinite" />
            </circle>
            {/* Core pulsing dot */}
            <circle cx={LAST_POS.x} cy={LAST_POS.y} r="5" fill="#06B6D4" filter="url(#glow-cyan)">
              <animate attributeName="r" values="5;7;5" dur="1.2s" repeatCount="indefinite" />
            </circle>

            {/* LAST SEEN label */}
            <rect x={LAST_POS.x - 32} y={LAST_POS.y - 30} width="64" height="14" rx="2" fill="rgba(6,182,212,0.15)" stroke="rgba(6,182,212,0.35)" strokeWidth="0.8" />
            <text
              x={LAST_POS.x} y={LAST_POS.y - 20}
              textAnchor="middle" dominantBaseline="middle"
              fill="#06B6D4" fontSize="8" fontFamily="monospace" fontWeight="700"
              letterSpacing="0.06em"
              style={{ pointerEvents: 'none' }}
            >
              ● LAST SEEN
            </text>
          </g>
        )}

        {/* ── Prediction arc toward Gate B ──────────────────────────────── */}
        {layers.route && (
          <g>
            {/* Animated dashed amber arc */}
            <path
              d={PREDICT_D}
              fill="none"
              stroke="#F59E0B"
              strokeWidth="2"
              strokeDasharray="8 4"
              strokeLinecap="round"
              opacity="0.85"
            >
              <animate attributeName="stroke-dashoffset" values="0;-24" dur="0.9s" repeatCount="indefinite" />
            </path>
            {/* Arrowhead at prediction end */}
            <polygon points="748,295 760,300 750,308" fill="#F59E0B" opacity="0.8" />

            {/* "78% GATE B" label */}
            <rect x="742" y="278" width="52" height="15" rx="2" fill="rgba(245,158,11,0.15)" stroke="rgba(245,158,11,0.4)" strokeWidth="0.8" />
            <text
              x="768" y="289"
              textAnchor="middle" dominantBaseline="middle"
              fill="#F59E0B" fontSize="8" fontFamily="monospace" fontWeight="700"
              letterSpacing="0.06em"
              style={{ pointerEvents: 'none' }}
            >
              78% GATE B
            </text>
          </g>
        )}

        {/* ── Camera markers ────────────────────────────────────────────── */}
        {layers.cameras && CAMERAS.map((cam) => (
          <g key={cam.id} style={{ cursor: 'pointer' }}>
            {/* Outer glow ring */}
            <circle cx={cam.cx} cy={cam.cy} r="12" fill="rgba(6,182,212,0.05)" stroke="rgba(6,182,212,0.15)" strokeWidth="0.8" />
            {/* Camera housing (rectangle body) */}
            <rect
              x={cam.cx - 7} y={cam.cy - 5}
              width="14" height="10" rx="2"
              fill="rgba(6,182,212,0.15)"
              stroke="#06B6D4" strokeWidth="1.3"
            />
            {/* Lens outer ring */}
            <circle cx={cam.cx} cy={cam.cy} r="3.5" fill="rgba(0,0,0,0.6)" stroke="#06B6D4" strokeWidth="1" />
            {/* Lens inner dot */}
            <circle cx={cam.cx} cy={cam.cy} r="1.2" fill="#06B6D4" opacity="0.9" />
            {/* ID label */}
            <text
              x={cam.cx} y={cam.cy + 17}
              textAnchor="middle"
              fill="rgba(6,182,212,0.75)"
              fontSize="7.5" fontFamily="monospace" fontWeight="600"
              style={{ pointerEvents: 'none' }}
            >
              {cam.id}
            </text>
          </g>
        ))}

        {/* ── Guard circles ─────────────────────────────────────────────── */}
        {layers.guards && GUARDS.map((g) => (
          <g key={g.id} style={{ cursor: 'pointer' }}>
            {/* Outer glow */}
            <circle cx={g.cx} cy={g.cy} r="16" fill="rgba(16,185,129,0.08)" stroke="rgba(16,185,129,0.2)" strokeWidth="1">
              {g.status === 'EN ROUTE' && (
                <animate attributeName="r" values="16;20;16" dur="2s" repeatCount="indefinite" />
              )}
            </circle>
            {/* Guard circle */}
            <circle
              cx={g.cx} cy={g.cy} r="12"
              fill="rgba(16,185,129,0.18)"
              stroke="#10B981" strokeWidth="2"
            />
            {/* Guard number */}
            <text
              x={g.cx} y={g.cy}
              textAnchor="middle" dominantBaseline="middle"
              fill="#10B981" fontSize="10" fontFamily="'JetBrains Mono', monospace" fontWeight="800"
              style={{ pointerEvents: 'none' }}
            >
              {g.id}
            </text>
            {/* Guard name label */}
            <text
              x={g.cx} y={g.cy + 22}
              textAnchor="middle"
              fill="rgba(16,185,129,0.75)"
              fontSize="7.5" fontFamily="monospace"
              style={{ pointerEvents: 'none' }}
            >
              {g.label}
            </text>
            {/* Status label */}
            <text
              x={g.cx} y={g.cy + 31}
              textAnchor="middle"
              fill={g.status === 'EN ROUTE' ? 'rgba(245,158,11,0.8)' : 'rgba(71,85,105,0.7)'}
              fontSize="6.5" fontFamily="monospace" fontWeight="600"
              letterSpacing="0.05em"
              style={{ pointerEvents: 'none' }}
            >
              {g.status}
            </text>
          </g>
        ))}

        {/* ── Floor label ───────────────────────────────────────────────── */}
        <text
          x="760" y="556"
          textAnchor="end"
          fill="rgba(71,85,105,0.5)"
          fontSize="8" fontFamily="monospace"
          style={{ pointerEvents: 'none' }}
        >
          SUNWAY PYRAMID · FLOOR 1 · SYNTHETIC DEMO
        </text>

        {/* ── Active case indicator ─────────────────────────────────────── */}
        <rect x="54" y="74" width="148" height="16" rx="2" fill="rgba(239,68,68,0.1)" stroke="rgba(239,68,68,0.3)" strokeWidth="0.8" />
        <text x="128" y="84" textAnchor="middle" dominantBaseline="middle" fill="rgba(239,68,68,0.8)" fontSize="8" fontFamily="monospace" fontWeight="700" letterSpacing="0.08em">
          ● ACTIVE CASE #2024-0311
        </text>
      </svg>
    </div>
  )
}
