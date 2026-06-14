'use client'

import Link from 'next/link'
import { VideoOff } from 'lucide-react'
import type { Camera, CameraStatus } from '@/lib/types'

interface Props {
  camera: Camera
  videoSrc?: string
  hideAlerts?: boolean
}

const STATUS_COLOR: Record<CameraStatus, string> = {
  live:      '#10B981',
  offline:   '#64748B',
  match:     '#F59E0B',
  high_risk: '#EF4444',
}

const STATUS_LABEL: Record<CameraStatus, string> = {
  live:      'LIVE',
  offline:   'OFFLINE',
  match:     'MATCH',
  high_risk: 'HIGH RISK',
}

function getTimestamp(): string {
  const now = new Date()
  const date = now.toISOString().slice(0, 10)
  const time = now.toLocaleTimeString('en-GB', { hour12: false })
  return `${date} ${time}`
}

export default function CameraFeedCard({ camera, videoSrc: videoSrcProp, hideAlerts = false }: Props) {
  const rawIsAlert = camera.status === 'match' || camera.status === 'high_risk'
  const isAlert = rawIsAlert && !hideAlerts
  const isOffline = camera.status === 'offline'
  const displayStatus = hideAlerts && rawIsAlert ? 'live' : camera.status
  const color = STATUS_COLOR[displayStatus]
  // Explicit prop takes priority; fall back to camera object's videoSrc field
  const videoSrc = videoSrcProp ?? camera.videoSrc

  const borderStyle: React.CSSProperties = isAlert
    ? {
        border: `1px solid ${color}`,
        animation: camera.status === 'high_risk' ? 'pulse-glow-red 1.8s ease-in-out infinite' : 'pulse-glow-amber 1.8s ease-in-out infinite',
      }
    : { border: '1px solid rgba(30,45,77,0.8)' }

  return (
    <Link href={`/cctv/${camera.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div
        style={{
          background: '#050810',
          borderRadius: 6,
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'transform 120ms',
          position: 'relative',
          ...borderStyle,
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.01)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
      >
        {/* ── Top bar: timestamp + cam ID + REC ─────────────────────────── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '4px 7px',
            background: 'rgba(0,0,0,0.7)',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
          }}
        >
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: 9,
              color: isOffline ? '#475569' : '#22c55e',
              letterSpacing: '0.04em',
              lineHeight: 1,
            }}
          >
            {camera.id} &nbsp;·&nbsp; {getTimestamp()}
          </span>

          {/* REC indicator */}
          {!isOffline && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div
                style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: '#EF4444',
                  boxShadow: '0 0 4px rgba(239,68,68,0.8)',
                  animation: 'blink-border 1.2s ease-in-out infinite',
                }}
              />
              <span style={{ fontFamily: 'monospace', fontSize: 9, fontWeight: 700, color: '#EF4444', letterSpacing: '0.08em' }}>
                REC
              </span>
            </div>
          )}
        </div>

        {/* ── Feed area ─────────────────────────────────────────────────── */}
        <div
          style={{
            height: 110,
            position: 'relative',
            overflow: 'hidden',
            background: isOffline
              ? 'linear-gradient(135deg, #070A10 0%, #0A0D14 100%)'
              : 'linear-gradient(135deg, #060A14 0%, #080D1A 50%, #060A14 100%)',
          }}
        >
          {/* ── Video base layer (z-index 0, behind all overlays) ──────────── */}
          {videoSrc && !isOffline && (
            <video
              src={videoSrc}
              autoPlay
              loop
              muted
              playsInline
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.7,
                zIndex: 0,
              }}
            />
          )}

          {/* CRT scan lines overlay */}
          <div
            style={{
              position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
              background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(0,0,0,0.18) 3px, rgba(0,0,0,0.18) 4px)',
            }}
          />

          {/* Subtle vignette */}
          <div
            style={{
              position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
              background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.45) 100%)',
            }}
          />

          {/* Green scan sweep (top-to-bottom) */}
          {!isOffline && (
            <div
              style={{
                position: 'absolute', left: 0, right: 0, height: '35%',
                background: 'linear-gradient(180deg, transparent 0%, rgba(34,197,94,0.04) 50%, transparent 100%)',
                pointerEvents: 'none', zIndex: 2,
                animation: 'cctv-scan 4s linear infinite',
              }}
            />
          )}

          {/* Offline state */}
          {isOffline && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 3, gap: 4 }}>
              <VideoOff size={20} style={{ color: '#475569' }} />
              <span style={{ fontFamily: 'monospace', fontSize: 8, color: '#475569', letterSpacing: '0.1em' }}>NO SIGNAL</span>
            </div>
          )}

          {/* Detection bounding box */}
          {isAlert && (
            <div
              style={{
                position: 'absolute',
                top: '12%', left: '28%',
                width: '38%', height: '65%',
                zIndex: 4, pointerEvents: 'none',
              }}
            >
              {/* "DETECTION ACTIVE" label */}
              <div
                style={{
                  position: 'absolute', top: -16, left: 0, right: 0,
                  textAlign: 'center',
                  fontFamily: 'monospace', fontSize: 7, fontWeight: 700,
                  color: color, letterSpacing: '0.08em',
                  textShadow: `0 0 8px ${color}`,
                }}
              >
                ▼ DETECTION ACTIVE
              </div>
              {/* Main bounding box */}
              <div
                style={{
                  width: '100%', height: '100%',
                  border: `1.5px solid ${color}`,
                  boxShadow: `0 0 10px ${color}66, inset 0 0 10px ${color}11`,
                  position: 'relative',
                }}
              >
                {/* Corner accents — top-left */}
                <div style={{ position: 'absolute', top: -1, left: -1, width: 9, height: 9, borderTop: `2.5px solid ${color}`, borderLeft: `2.5px solid ${color}` }} />
                {/* top-right */}
                <div style={{ position: 'absolute', top: -1, right: -1, width: 9, height: 9, borderTop: `2.5px solid ${color}`, borderRight: `2.5px solid ${color}` }} />
                {/* bottom-left */}
                <div style={{ position: 'absolute', bottom: -1, left: -1, width: 9, height: 9, borderBottom: `2.5px solid ${color}`, borderLeft: `2.5px solid ${color}` }} />
                {/* bottom-right */}
                <div style={{ position: 'absolute', bottom: -1, right: -1, width: 9, height: 9, borderBottom: `2.5px solid ${color}`, borderRight: `2.5px solid ${color}` }} />

                {/* Confidence badge inside box */}
                {camera.confidence != null && (
                  <div
                    style={{
                      position: 'absolute', bottom: 3, right: 3,
                      fontFamily: 'monospace', fontSize: 7.5, fontWeight: 700,
                      color: color, background: 'rgba(0,0,0,0.75)',
                      padding: '1px 4px', letterSpacing: '0.04em',
                    }}
                  >
                    {camera.confidence}%
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Live feed placeholder text (only when no video and no detection) */}
          {!isAlert && !isOffline && !videoSrc && (
            <div
              style={{
                position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 3, pointerEvents: 'none',
              }}
            >
              <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(34,197,94,0.2)', letterSpacing: '0.06em' }}>
                [ LIVE FEED ]
              </span>
            </div>
          )}
        </div>

        {/* ── Bottom bar: status only (zone removed to avoid conflicting with video) */}
        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
            padding: '4px 7px',
            background: 'rgba(0,0,0,0.6)',
            borderTop: '1px solid rgba(255,255,255,0.04)',
          }}
        >
          <span
            style={{
              fontFamily: 'monospace', fontSize: 8, fontWeight: 700,
              letterSpacing: '0.08em', color, flexShrink: 0,
            }}
          >
            {STATUS_LABEL[displayStatus]}
          </span>
        </div>
      </div>
    </Link>
  )
}
