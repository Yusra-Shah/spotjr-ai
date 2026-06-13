'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Check, X, ZoomIn, ZoomOut, Eye, EyeOff, ChevronRight, Camera, Wifi, AlertTriangle, CheckCircle, Clock, Shield } from 'lucide-react'

interface Detection {
  id: string
  time: string
  confidence: number
  label: string
  status: 'pending' | 'confirmed' | 'wrong'
  signals: { label: string; match: number }[]
}

const DETECTIONS: Detection[] = [
  {
    id: 'D1',
    time: '12:06:00',
    confidence: 89,
    label: 'Possible match — pink upper clothing, short stature',
    status: 'pending',
    signals: [
      { label: 'Upper Clothing', match: 93 },
      { label: 'Height / Build',  match: 90 },
      { label: 'Re-ID Chain',     match: 87 },
    ],
  },
  {
    id: 'D2',
    time: '12:05:41',
    confidence: 61,
    label: 'Similar height and clothing — lower confidence',
    status: 'wrong',
    signals: [
      { label: 'Upper Clothing', match: 65 },
      { label: 'Height / Build',  match: 70 },
      { label: 'Re-ID Chain',     match: 48 },
    ],
  },
]

const CAMERA_METADATA = {
  id: 'CAM-06',
  name: 'Gate B Corridor',
  zone: 'Gate B / Parking Entrance',
  position: 'Exit corridor — east wall, 2.8 m height',
  coverage: '120° horizontal FOV',
  status: 'online' as const,
  risk: 'HIGH — exit zone',
  resolution: '1080p · 30fps',
  uptime: '99.8%',
}

export default function SingleCameraPage({ params }: { params: { id: string } }) {
  const cameraId = params.id.toUpperCase()
  const [showOverlays, setShowOverlays] = useState(true)
  const [zoom, setZoom] = useState(1)
  const [detections, setDetections] = useState<Detection[]>(DETECTIONS)
  const [selectedDet, setSelectedDet] = useState<string>('D1')

  function setStatus(id: string, status: 'confirmed' | 'wrong') {
    setDetections(prev => prev.map(d => d.id === id ? { ...d, status } : d))
  }

  const activeDet = detections.find(d => d.id === selectedDet)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--color-bg-base)', overflow: 'hidden' }}>

      {/* Top bar */}
      <div style={{
        height: 48, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px',
        background: 'var(--color-bg-surface)',
        borderBottom: '1px solid var(--color-border-subtle)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link href="/cctv" style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--color-text-secondary)', fontSize: 13, textDecoration: 'none' }}>
            <ArrowLeft size={14} /> CCTV Wall
          </Link>
          <span style={{ color: 'var(--color-border-default)' }}>·</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Camera size={13} style={{ color: '#06B6D4' }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'monospace' }}>{cameraId}</span>
            <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{CAMERA_METADATA.name}</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 9px', borderRadius: 5, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)' }}>
            <AlertTriangle size={11} style={{ color: '#EF4444' }} />
            <span style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 700, color: '#EF4444' }}>HIGH RISK ZONE</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 9px', borderRadius: 5, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)' }}>
            <Wifi size={11} style={{ color: '#10B981' }} />
            <span style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 700, color: '#10B981' }}>LIVE</span>
          </div>
        </div>
      </div>

      {/* Main split */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Left: camera feed */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 16 }}>

          {/* Feed container */}
          <div style={{
            flex: 1, position: 'relative', overflow: 'hidden',
            background: '#040709', borderRadius: 10,
            border: '1px solid rgba(239,68,68,0.35)',
            boxShadow: '0 0 24px rgba(239,68,68,0.12)',
          }}>
            {/* Scanlines */}
            <div style={{
              position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
              backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.12) 0px, rgba(0,0,0,0.12) 1px, transparent 1px, transparent 3px)',
            }} />

            {/* Simulated feed */}
            <div style={{
              position: 'absolute', inset: 0,
              transform: `scale(${zoom})`,
              transformOrigin: 'center center',
              transition: 'transform 200ms',
            }}>
              {/* Background scene */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #090E1A 0%, #0A1020 100%)' }} />
              {/* Floor */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%', background: 'rgba(30,45,77,0.3)', borderTop: '1px solid rgba(37,54,89,0.4)' }} />
              {/* Wall texture */}
              {[...Array(5)].map((_, i) => (
                <div key={i} style={{
                  position: 'absolute', top: 0, bottom: '30%',
                  left: `${i * 20}%`, width: 1,
                  background: 'rgba(37,54,89,0.2)',
                }} />
              ))}
              {/* People silhouettes */}
              {[
                { left: '15%', h: 38 }, { left: '28%', h: 42 },
                { left: '55%', h: 35 }, { left: '70%', h: 40 },
                { left: '82%', h: 44 },
              ].map((p, i) => (
                <div key={i} style={{
                  position: 'absolute', bottom: '30%', left: p.left,
                  width: 16, height: p.h,
                  background: 'rgba(60,80,100,0.5)', borderRadius: '50% 50% 0 0',
                }} />
              ))}
              {/* The child */}
              <div style={{ position: 'absolute', bottom: '30%', left: '40%', width: 18, height: 44 }}>
                <div style={{ width: '100%', height: '30%', background: '#F472B6', borderRadius: '50% 50% 0 0' }} />
                <div style={{ width: '100%', height: '45%', background: '#F9A8D4' }} />
                <div style={{ display: 'flex', gap: 2, height: '25%' }}>
                  <div style={{ flex: 1, background: '#1A1A1A', borderRadius: '0 0 2px 2px' }} />
                  <div style={{ flex: 1, background: '#1A1A1A', borderRadius: '0 0 2px 2px' }} />
                </div>
              </div>

              {/* Bounding box overlay */}
              {showOverlays && activeDet && activeDet.status !== 'wrong' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    position: 'absolute', bottom: '28%', left: '36%',
                    width: '12%', height: '58%',
                    border: `2px solid ${activeDet.status === 'confirmed' ? '#06B6D4' : '#F59E0B'}`,
                    borderRadius: 3,
                    boxShadow: activeDet.status === 'confirmed' ? '0 0 12px rgba(6,182,212,0.4)' : '0 0 12px rgba(245,158,11,0.4)',
                  }}
                >
                  <div style={{
                    position: 'absolute', top: -20, left: 0,
                    background: activeDet.status === 'confirmed' ? '#06B6D4' : '#F59E0B',
                    color: '#000', fontSize: 9, fontFamily: 'monospace', fontWeight: 800,
                    padding: '2px 6px', borderRadius: 3, whiteSpace: 'nowrap',
                  }}>
                    {activeDet.confidence}% {activeDet.status === 'confirmed' ? 'CONFIRMED' : 'MATCH'}
                  </div>
                </motion.div>
              )}

              {/* AI scanning sweep */}
              {showOverlays && (
                <div style={{
                  position: 'absolute', inset: 0, pointerEvents: 'none',
                  background: 'linear-gradient(90deg, transparent 0%, rgba(6,182,212,0.06) 50%, transparent 100%)',
                  animation: 'scanSweep 2.5s ease-in-out infinite',
                }} />
              )}
            </div>

            {/* Overlays */}
            <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 4, display: 'flex', gap: 6 }}>
              <div style={{ background: 'rgba(0,0,0,0.8)', color: '#06B6D4', fontSize: 10, fontFamily: 'monospace', fontWeight: 700, padding: '3px 8px', borderRadius: 4 }}>
                {cameraId} · {CAMERA_METADATA.resolution}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(0,0,0,0.8)', padding: '3px 8px', borderRadius: 4 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#EF4444', animation: 'pulse 1.5s infinite' }} />
                <span style={{ fontSize: 9, fontFamily: 'monospace', color: '#EF4444', fontWeight: 700 }}>REC</span>
              </div>
            </div>
            <div style={{ position: 'absolute', bottom: 10, right: 10, zIndex: 4, fontSize: 9, fontFamily: 'monospace', color: 'rgba(240,244,255,0.4)', background: 'rgba(0,0,0,0.6)', padding: '3px 8px', borderRadius: 4 }}>
              SUNWAY PYRAMID · {CAMERA_METADATA.zone}
            </div>

            {/* Zoom controls */}
            <div style={{ position: 'absolute', bottom: 10, left: 10, zIndex: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <button onClick={() => setZoom(z => Math.min(2.5, z + 0.25))} style={{ width: 28, height: 28, borderRadius: 5, background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(37,54,89,0.8)', color: 'var(--color-text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ZoomIn size={13} />
              </button>
              <button onClick={() => setZoom(z => Math.max(1, z - 0.25))} style={{ width: 28, height: 28, borderRadius: 5, background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(37,54,89,0.8)', color: 'var(--color-text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ZoomOut size={13} />
              </button>
            </div>
          </div>

          {/* Feed controls bar */}
          <div style={{
            marginTop: 10, display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 12px', borderRadius: 7,
            background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-subtle)',
          }}>
            <button
              onClick={() => setShowOverlays(!showOverlays)}
              style={{
                display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 5,
                background: showOverlays ? 'rgba(6,182,212,0.15)' : 'transparent',
                border: `1px solid ${showOverlays ? 'rgba(6,182,212,0.4)' : 'var(--color-border-default)'}`,
                color: showOverlays ? '#06B6D4' : 'var(--color-text-muted)',
                fontSize: 12, cursor: 'pointer',
              }}
            >
              {showOverlays ? <Eye size={12} /> : <EyeOff size={12} />}
              AI Overlays {showOverlays ? 'ON' : 'OFF'}
            </button>
            <span style={{ fontSize: 11, color: 'var(--color-text-muted)', marginLeft: 8 }}>
              Zoom: {zoom.toFixed(2)}×
            </span>
            <div style={{ marginLeft: 'auto', fontSize: 10, fontFamily: 'monospace', color: 'var(--color-text-muted)' }}>
              Azure AI Vision · GPT-4 Vision · Torchreid OSNet
            </div>
          </div>
        </div>

        {/* Right: Detections sidebar */}
        <div style={{
          width: 300, flexShrink: 0,
          borderLeft: '1px solid var(--color-border-subtle)',
          display: 'flex', flexDirection: 'column',
          overflowY: 'auto',
          background: 'var(--color-bg-surface)',
        }}>
          {/* Detections list */}
          <div style={{ padding: 12 }}>
            <div style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.1em', marginBottom: 10, paddingBottom: 8, borderBottom: '1px solid var(--color-border-subtle)' }}>
              DETECTIONS IN THIS CAMERA
            </div>

            {detections.map(det => (
              <motion.div
                key={det.id}
                layout
                onClick={() => setSelectedDet(det.id)}
                style={{
                  borderRadius: 8, overflow: 'hidden', marginBottom: 8, cursor: 'pointer',
                  border: `1px solid ${selectedDet === det.id
                    ? det.status === 'confirmed' ? 'rgba(6,182,212,0.5)' : det.status === 'wrong' ? 'rgba(71,85,105,0.4)' : 'rgba(245,158,11,0.5)'
                    : 'var(--color-border-subtle)'}`,
                  background: selectedDet === det.id ? 'var(--color-bg-elevated)' : 'transparent',
                  opacity: det.status === 'wrong' ? 0.5 : 1,
                  transition: 'all 150ms',
                }}
              >
                {/* Simulated frame thumbnail */}
                <div style={{
                  height: 60, background: '#060A15',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative',
                }}>
                  <div style={{
                    position: 'absolute', left: '35%', bottom: '10%',
                    width: '14%', height: '70%',
                    border: `1.5px solid ${det.status === 'confirmed' ? '#06B6D4' : det.status === 'wrong' ? '#475569' : '#F59E0B'}`,
                    borderRadius: 2,
                  }} />
                  <span style={{ fontSize: 9, color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
                    FRAME · {det.time}
                  </span>
                  <div style={{
                    position: 'absolute', top: 4, right: 4,
                    background: det.status === 'confirmed' ? '#06B6D4' : det.status === 'wrong' ? '#475569' : '#F59E0B',
                    color: '#000', fontSize: 8, fontFamily: 'monospace', fontWeight: 800,
                    padding: '1px 5px', borderRadius: 2,
                  }}>
                    {det.confidence}%
                  </div>
                </div>

                <div style={{ padding: '8px 10px' }}>
                  <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginBottom: 6, lineHeight: 1.4 }}>
                    {det.label}
                  </div>

                  {/* Signals */}
                  {selectedDet === det.id && det.signals.map(s => (
                    <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                      <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>{s.label}</span>
                      <span style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 700, color: s.match >= 85 ? '#10B981' : '#F59E0B' }}>{s.match}%</span>
                    </div>
                  ))}

                  {/* Actions */}
                  {det.status === 'pending' && (
                    <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                      <button
                        onClick={e => { e.stopPropagation(); setStatus(det.id, 'confirmed') }}
                        style={{
                          flex: 1, padding: '5px 0', borderRadius: 5, cursor: 'pointer',
                          background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.4)',
                          color: '#06B6D4', fontSize: 11, fontWeight: 600,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                        }}
                      >
                        <Check size={11} /> Confirm
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); setStatus(det.id, 'wrong') }}
                        style={{
                          flex: 1, padding: '5px 0', borderRadius: 5, cursor: 'pointer',
                          background: 'transparent', border: '1px solid var(--color-border-default)',
                          color: 'var(--color-text-muted)', fontSize: 11, fontWeight: 600,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                        }}
                      >
                        <X size={11} /> Wrong
                      </button>
                    </div>
                  )}

                  {det.status === 'confirmed' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 8, padding: '4px 8px', borderRadius: 4, background: 'rgba(6,182,212,0.12)' }}>
                      <CheckCircle size={11} style={{ color: '#06B6D4' }} />
                      <span style={{ fontSize: 10, color: '#06B6D4', fontWeight: 600 }}>Added to case evidence</span>
                    </div>
                  )}
                  {det.status === 'wrong' && (
                    <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 6, fontStyle: 'italic' }}>
                      Rejected · AI notified
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Camera metadata */}
          <div style={{ margin: '0 12px 12px', padding: 12, background: 'var(--color-bg-inset)', borderRadius: 8, border: '1px solid var(--color-border-subtle)' }}>
            <div style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.1em', marginBottom: 10 }}>
              CAMERA METADATA
            </div>
            {[
              { label: 'Zone',       value: CAMERA_METADATA.zone },
              { label: 'Position',   value: CAMERA_METADATA.position },
              { label: 'Coverage',   value: CAMERA_METADATA.coverage },
              { label: 'Resolution', value: CAMERA_METADATA.resolution },
              { label: 'Uptime',     value: CAMERA_METADATA.uptime },
              { label: 'Risk',       value: CAMERA_METADATA.risk, color: '#EF4444' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 7, gap: 8 }}>
                <span style={{ fontSize: 10, color: 'var(--color-text-muted)', flexShrink: 0 }}>{item.label}</span>
                <span style={{ fontSize: 10, color: item.color ?? 'var(--color-text-secondary)', textAlign: 'right', fontFamily: 'monospace', fontWeight: item.color ? 700 : 400 }}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          {/* Quick navigation */}
          <div style={{ padding: '0 12px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Link href="/cases/CASE-A-001/timeline" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '8px 12px', borderRadius: 6, textDecoration: 'none',
              background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)',
              color: '#8B5CF6', fontSize: 12, fontWeight: 600,
            }}>
              View in AI Timeline <ChevronRight size={12} />
            </Link>
            <Link href="/cctv" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '8px 12px', borderRadius: 6, textDecoration: 'none',
              background: 'transparent', border: '1px solid var(--color-border-default)',
              color: 'var(--color-text-secondary)', fontSize: 12,
            }}>
              Back to CCTV Wall <ChevronRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
