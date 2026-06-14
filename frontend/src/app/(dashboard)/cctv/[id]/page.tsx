'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Check, X, ZoomIn, ZoomOut, Eye, EyeOff,
  Camera, Wifi, AlertTriangle, Search, CheckCircle, ChevronRight,
} from 'lucide-react'
import { mockCameras } from '@/lib/mock-data'

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
  resolution: '1080p · 30fps',
  uptime: '99.8%',
  risk: 'HIGH — exit zone',
}

const SCAN_STEPS = [
  'Initializing Azure AI Vision...',
  'Scanning CAM-01...',
  'Scanning CAM-02...',
  'Scanning CAM-03...',
  'Scanning CAM-04...',
  'Scanning CAM-05...',
  'Scanning CAM-06...',
  'Running Foundry IQ reasoning pipeline...',
  'Re-identification complete',
]

const SCAN_DELAYS = [500, 300, 300, 300, 300, 300, 300, 1000, 500]

interface SearchResult {
  cameraId: string
  time: string
  confidence: number
  description: string
}

const MOCK_RESULTS: SearchResult[] = [
  { cameraId: 'CAM-02', time: '12:01', confidence: 78,  description: 'Detection: upper body match, clothing color match' },
  { cameraId: 'CAM-03', time: '12:03', confidence: 94,  description: 'Detection: upper body match, clothing color match, height match' },
  { cameraId: 'CAM-06', time: '12:06', confidence: 89,  description: 'Detection: upper body match, accessory detected' },
]

function parseQuery(q: string): string {
  const lower = q.toLowerCase()
  const parts: string[] = []
  if (lower.includes('red') || lower.includes('pink'))    parts.push('red/pink upper clothing')
  if (lower.includes('blue'))                              parts.push('blue clothing')
  if (lower.includes('black'))                             parts.push('dark lower clothing')
  if (lower.includes('hat') || lower.includes('cap'))      parts.push('hat accessory')
  if (lower.includes('shoe') || lower.includes('nike'))    parts.push('notable footwear')
  if (lower.includes('boy') || lower.includes('girl'))     parts.push(lower.includes('boy') ? 'male child' : 'female child')
  return parts.length > 0 ? parts.join(', ') : 'clothing match, stature match'
}

function confidenceBorderColor(conf: number) {
  if (conf >= 85) return '#10B981'
  if (conf >= 70) return '#F59E0B'
  return '#EF4444'
}

export default function SingleCameraPage({ params }: { params: { id: string } }) {
  const cameraId = params.id.toUpperCase()
  const [showOverlays, setShowOverlays] = useState(true)
  const [zoom, setZoom] = useState(1)
  const [detections, setDetections] = useState<Detection[]>(DETECTIONS)
  const [selectedDet, setSelectedDet] = useState<string>('D1')

  // AI Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [overlayStep, setOverlayStep] = useState(0)
  const [parsedQuery, setParsedQuery] = useState('')

  // Find camera videoSrc from mock data
  const cameraData = mockCameras.find(c => c.id === cameraId)
  const videoSrc = cameraData?.videoSrc

  function setStatus(id: string, status: 'confirmed' | 'wrong') {
    setDetections(prev => prev.map(d => d.id === id ? { ...d, status } : d))
  }

  const activeDet = detections.find(d => d.id === selectedDet)

  function startSearch() {
    if (!searchQuery.trim()) return
    setParsedQuery(parseQuery(searchQuery))
    setShowResults(false)
    setIsSearching(true)
    setOverlayStep(0)

    let step = 0
    function advance() {
      step++
      setOverlayStep(step)
      if (step < SCAN_STEPS.length - 1) {
        setTimeout(advance, SCAN_DELAYS[step] ?? 400)
      } else {
        setTimeout(() => {
          setIsSearching(false)
          setShowResults(true)
        }, SCAN_DELAYS[SCAN_STEPS.length - 1])
      }
    }
    setTimeout(advance, SCAN_DELAYS[0])
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--color-bg-base)', overflow: 'hidden' }}>

      {/* ── Scanning overlay ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {isSearching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 9999,
              background: 'rgba(4,7,18,0.92)',
              backdropFilter: 'blur(8px)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: 24,
            }}
          >
            {/* Spinning ring */}
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              border: '3px solid rgba(6,182,212,0.15)',
              borderTop: '3px solid #06B6D4',
              animation: 'spin 1s linear infinite',
            }} />

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 700, color: '#06B6D4', letterSpacing: '0.12em', marginBottom: 12 }}>
                AI CHILD SEARCH · AZURE AI FOUNDRY
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={overlayStep}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 8 }}
                >
                  {SCAN_STEPS[overlayStep]}
                </motion.div>
              </AnimatePresence>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                Scanning {Math.min(overlayStep, 6)} / 6 cameras
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ width: 280, height: 4, borderRadius: 2, background: 'rgba(6,182,212,0.15)', overflow: 'hidden' }}>
              <motion.div
                animate={{ width: `${Math.min((overlayStep / (SCAN_STEPS.length - 1)) * 100, 100)}%` }}
                transition={{ duration: 0.3 }}
                style={{ height: '100%', background: '#06B6D4', borderRadius: 2 }}
              />
            </div>

            <div style={{ fontSize: 10, color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
              Powered by Azure AI Foundry + Foundry IQ
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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

            {/* Video or simulated feed */}
            <div style={{
              position: 'absolute', inset: 0,
              transform: `scale(${zoom})`,
              transformOrigin: 'center center',
              transition: 'transform 200ms',
            }}>
              {videoSrc ? (
                <video
                  src={videoSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <>
                  {/* Simulated background scene */}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #090E1A 0%, #0A1020 100%)' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%', background: 'rgba(30,45,77,0.3)', borderTop: '1px solid rgba(37,54,89,0.4)' }} />
                  {[...Array(5)].map((_, i) => (
                    <div key={i} style={{ position: 'absolute', top: 0, bottom: '30%', left: `${i * 20}%`, width: 1, background: 'rgba(37,54,89,0.2)' }} />
                  ))}
                  {[{ left: '15%', h: 38 }, { left: '28%', h: 42 }, { left: '55%', h: 35 }, { left: '70%', h: 40 }, { left: '82%', h: 44 }].map((p, i) => (
                    <div key={i} style={{ position: 'absolute', bottom: '30%', left: p.left, width: 16, height: p.h, background: 'rgba(60,80,100,0.5)', borderRadius: '50% 50% 0 0' }} />
                  ))}
                  <div style={{ position: 'absolute', bottom: '30%', left: '40%', width: 18, height: 44 }}>
                    <div style={{ width: '100%', height: '30%', background: '#F472B6', borderRadius: '50% 50% 0 0' }} />
                    <div style={{ width: '100%', height: '45%', background: '#F9A8D4' }} />
                    <div style={{ display: 'flex', gap: 2, height: '25%' }}>
                      <div style={{ flex: 1, background: '#1A1A1A', borderRadius: '0 0 2px 2px' }} />
                      <div style={{ flex: 1, background: '#1A1A1A', borderRadius: '0 0 2px 2px' }} />
                    </div>
                  </div>
                </>
              )}

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

        {/* ── Right: AI Child Search Panel ─────────────────────────────────── */}
        <div style={{
          width: 320, flexShrink: 0,
          borderLeft: '1px solid var(--color-border-subtle)',
          display: 'flex', flexDirection: 'column',
          overflowY: 'auto',
          background: 'var(--color-bg-surface)',
        }}>

          {/* Panel header */}
          <div style={{
            padding: '12px 14px',
            borderBottom: '1px solid var(--color-border-subtle)',
            background: 'var(--color-bg-elevated)',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <Search size={14} style={{ color: '#06B6D4' }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)' }}>AI Child Search</span>
              <span style={{
                marginLeft: 'auto',
                fontSize: 8, fontFamily: 'monospace', fontWeight: 700,
                padding: '2px 6px', borderRadius: 3,
                background: 'rgba(0,120,212,0.15)',
                border: '1px solid rgba(0,120,212,0.3)',
                color: '#0078D4',
                letterSpacing: '0.06em',
              }}>
                AZURE AI FOUNDRY
              </span>
            </div>
            <div style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>
              Describe the missing child to search all cameras
            </div>
          </div>

          {/* Search input */}
          <div style={{ padding: 12, flexShrink: 0 }}>
            <textarea
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Describe the missing child... e.g. boy wearing red t-shirt, black hat, pink trousers, Nike shoes"
              rows={4}
              style={{
                width: '100%',
                background: 'var(--color-bg-inset)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 7,
                color: 'var(--color-text-primary)',
                fontSize: 12,
                padding: '10px 12px',
                resize: 'none',
                outline: 'none',
                fontFamily: 'inherit',
                lineHeight: 1.5,
                boxSizing: 'border-box',
                transition: 'border-color 150ms',
              }}
              onFocus={(e) => { e.target.style.borderColor = 'rgba(6,182,212,0.5)' }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--color-border-default)' }}
            />

            <button
              onClick={startSearch}
              disabled={!searchQuery.trim() || isSearching}
              style={{
                marginTop: 8,
                width: '100%',
                padding: '11px 0',
                borderRadius: 7,
                border: 'none',
                background: searchQuery.trim()
                  ? 'linear-gradient(135deg, #0891B2 0%, #06B6D4 50%, #22D3EE 100%)'
                  : 'rgba(6,182,212,0.15)',
                color: searchQuery.trim() ? '#000' : 'var(--color-text-muted)',
                fontSize: 13, fontWeight: 700,
                cursor: searchQuery.trim() ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                transition: 'all 150ms',
                letterSpacing: '0.01em',
              }}
            >
              <Search size={14} />
              Search All Cameras
            </button>
          </div>

          {/* Search results */}
          <AnimatePresence>
            {showResults && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ padding: '0 12px 12px', flexShrink: 0 }}
              >
                {/* Results summary */}
                <div style={{
                  padding: '8px 12px',
                  borderRadius: 6,
                  background: 'rgba(16,185,129,0.08)',
                  border: '1px solid rgba(16,185,129,0.25)',
                  marginBottom: 10,
                }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#10B981', marginBottom: 3 }}>
                    3 possible matches found across 6 cameras
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>
                    Query matched: {parsedQuery}
                  </div>
                </div>

                {/* Re-ID chain */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  padding: '6px 10px', borderRadius: 5, marginBottom: 10,
                  background: 'rgba(6,182,212,0.06)',
                  border: '1px solid rgba(6,182,212,0.2)',
                }}>
                  <span style={{ fontSize: 9, fontFamily: 'monospace', color: 'var(--color-text-muted)', marginRight: 4 }}>Re-ID Chain:</span>
                  {['CAM-02', 'CAM-03', 'CAM-06'].map((cam, i, arr) => (
                    <span key={cam} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{
                        fontSize: 10, fontFamily: 'monospace', fontWeight: 700,
                        color: '#06B6D4',
                        background: 'rgba(6,182,212,0.12)',
                        border: '1px solid rgba(6,182,212,0.25)',
                        padding: '1px 5px', borderRadius: 3,
                      }}>
                        {cam}
                      </span>
                      {i < arr.length - 1 && <ChevronRight size={10} style={{ color: 'var(--color-text-muted)' }} />}
                    </span>
                  ))}
                </div>

                {/* Result cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {MOCK_RESULTS.map((result) => {
                    const borderColor = confidenceBorderColor(result.confidence)
                    return (
                      <div key={result.cameraId} style={{
                        borderRadius: 7,
                        border: '1px solid var(--color-border-subtle)',
                        borderLeft: `3px solid ${borderColor}`,
                        background: 'var(--color-bg-elevated)',
                        overflow: 'hidden',
                      }}>
                        {/* Thumbnail area */}
                        <div style={{
                          height: 52, background: '#060A14',
                          position: 'relative',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <div style={{
                            position: 'absolute', left: '30%', bottom: '8%',
                            width: '16%', height: '75%',
                            border: `1.5px solid ${borderColor}`,
                            borderRadius: 2,
                            boxShadow: `0 0 6px ${borderColor}66`,
                          }} />
                          <span style={{ fontSize: 8, color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
                            FRAME · {result.time}
                          </span>
                          <div style={{
                            position: 'absolute', top: 4, right: 4,
                            background: borderColor, color: '#000',
                            fontSize: 8, fontFamily: 'monospace', fontWeight: 800,
                            padding: '1px 5px', borderRadius: 2,
                          }}>
                            {result.confidence}%
                          </div>
                          <div style={{
                            position: 'absolute', bottom: 4, left: 4,
                            fontSize: 8, fontFamily: 'monospace', color: '#06B6D4',
                            background: 'rgba(0,0,0,0.7)', padding: '1px 4px', borderRadius: 2,
                          }}>
                            {result.cameraId}
                          </div>
                        </div>

                        {/* Card body */}
                        <div style={{ padding: '8px 10px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'monospace' }}>
                              {result.cameraId}
                            </span>
                            <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--color-text-muted)' }}>
                              {result.time}
                            </span>
                          </div>

                          {/* Confidence bar */}
                          <div style={{ marginBottom: 5 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                              <span style={{ fontSize: 9, color: 'var(--color-text-muted)' }}>Confidence</span>
                              <span style={{ fontSize: 9, fontFamily: 'monospace', fontWeight: 700, color: borderColor }}>{result.confidence}%</span>
                            </div>
                            <div style={{ height: 3, borderRadius: 2, background: 'var(--color-border-subtle)', overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${result.confidence}%`, background: borderColor, borderRadius: 2 }} />
                            </div>
                          </div>

                          <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginBottom: 7, lineHeight: 1.4 }}>
                            {result.description}
                          </div>

                          <button
                            onClick={() => { window.location.href = '/cctv/' + result.cameraId }}
                            style={{
                              width: '100%', padding: '5px 0',
                              borderRadius: 5,
                              background: 'rgba(6,182,212,0.1)',
                              border: '1px solid rgba(6,182,212,0.3)',
                              color: '#06B6D4',
                              fontSize: 11, fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            View Camera
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Powered by footer */}
                <div style={{
                  marginTop: 10, fontSize: 9, fontFamily: 'monospace',
                  color: '#8B5CF6', textAlign: 'center',
                  letterSpacing: '0.04em',
                }}>
                  Powered by Azure AI Foundry + Foundry IQ
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Camera metadata */}
          <div style={{ margin: '0 12px 12px', padding: 12, background: 'var(--color-bg-inset)', borderRadius: 8, border: '1px solid var(--color-border-subtle)', flexShrink: 0 }}>
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
          <div style={{ padding: '0 12px 12px', display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
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

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes scanSweep {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  )
}
