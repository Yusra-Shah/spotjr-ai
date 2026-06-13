'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Video } from 'lucide-react'
import { mockCameras, mockCase } from '@/lib/mock-data'
import CameraFeedCard from '@/components/case/CameraFeedCard'
import type { Camera } from '@/lib/types'

// ── Offline placeholder cameras to fill remaining grid slots ──────────────────
const OFFLINE_CAMERAS: Camera[] = [
  { id: 'CAM-07', name: 'Toy Zone North',  zone: 'Toy Zone',       status: 'offline' },
  { id: 'CAM-08', name: 'Restrooms',        zone: 'Restrooms',      status: 'offline' },
  { id: 'CAM-09', name: 'Back Corridor',    zone: 'Back Corridor',  status: 'offline' },
  { id: 'CAM-10', name: 'Parking East',     zone: 'Parking East',   status: 'offline' },
  { id: 'CAM-11', name: 'Loading Dock',     zone: 'Loading Dock',   status: 'offline' },
  { id: 'CAM-12', name: 'Staff Entrance',   zone: 'Staff Entrance', status: 'offline' },
]

type GridKey = '2x2' | '3x3' | '4x3'

const GRID_CONFIGS: Record<GridKey, { cols: number; slots: number; label: string }> = {
  '2x2': { cols: 2, slots: 4,  label: '2×2' },
  '3x3': { cols: 3, slots: 9,  label: '3×3' },
  '4x3': { cols: 4, slots: 12, label: '4×3' },
}

// Sort order: high_risk first, then match, then live, then offline
const STATUS_ORDER = { high_risk: 0, match: 1, live: 2, offline: 3 }

export default function CCTVPage() {
  const [grid, setGrid] = useState<GridKey>('4x3')

  const { cols, slots } = GRID_CONFIGS[grid]

  // Sort cameras by priority and fill grid slots with offline placeholders
  const sorted = [...mockCameras].sort(
    (a, b) => (STATUS_ORDER[a.status] ?? 3) - (STATUS_ORDER[b.status] ?? 3),
  )
  const filled: Camera[] = [
    ...sorted,
    ...OFFLINE_CAMERAS,
  ].slice(0, slots)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        background: 'var(--color-bg-base)',
      }}
    >
      {/* ── Active case scanning banner ─────────────────────────────────────── */}
      <div
        style={{
          flexShrink: 0,
          background: 'rgba(245,158,11,0.1)',
          borderBottom: '1px solid rgba(245,158,11,0.3)',
          padding: '8px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: 'var(--color-risk-medium)',
            animation: 'pulse 1.2s ease-in-out infinite',
            display: 'inline-block',
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: 'var(--color-risk-medium)',
            letterSpacing: '0.06em',
          }}
        >
          ACTIVE CASE: {mockCase.id} — {mockCase.clothingDescription} — AI Scanning All Cameras
        </span>
        <Link
          href="/cases/demo-001"
          style={{
            marginLeft: 'auto',
            fontSize: 11,
            color: 'var(--color-brand-cyan)',
            fontWeight: 600,
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          View Case →
        </Link>
      </div>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div
        style={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          padding: '10px 20px',
          borderBottom: '1px solid var(--color-border-subtle)',
          gap: 12,
          background: 'var(--color-bg-surface)',
        }}
      >
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            color: 'var(--color-text-secondary)',
            textDecoration: 'none',
            fontSize: 12,
          }}
        >
          <ArrowLeft size={13} /> Command Center
        </Link>

        <div
          style={{
            width: 1,
            height: 16,
            background: 'var(--color-border-subtle)',
          }}
        />

        <Video size={14} style={{ color: 'var(--color-brand-cyan)' }} />
        <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)' }}>
          CCTV Wall
        </span>
        <span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
          {mockCameras.filter((c) => c.status !== 'offline').length}/{mockCameras.length + OFFLINE_CAMERAS.length} online
        </span>

        <div style={{ flex: 1 }} />

        {/* Grid size controls */}
        <div style={{ display: 'flex', gap: 4 }}>
          {(Object.keys(GRID_CONFIGS) as GridKey[]).map((k) => (
            <button
              key={k}
              onClick={() => setGrid(k)}
              style={{
                padding: '5px 11px',
                fontSize: 11,
                fontWeight: 700,
                fontFamily: 'monospace',
                borderRadius: 5,
                border: `1px solid ${k === grid ? 'var(--color-brand-cyan)' : 'var(--color-border-default)'}`,
                background: k === grid ? 'rgba(6,182,212,0.12)' : 'transparent',
                color: k === grid ? 'var(--color-brand-cyan)' : 'var(--color-text-muted)',
                cursor: 'pointer',
                transition: 'all 150ms',
              }}
            >
              {GRID_CONFIGS[k].label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Camera grid ────────────────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 16,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap: 10,
          }}
        >
          {filled.map((camera) => (
            <CameraFeedCard key={camera.id} camera={camera} videoSrc={camera.videoSrc} />
          ))}
        </div>
      </div>
    </div>
  )
}
