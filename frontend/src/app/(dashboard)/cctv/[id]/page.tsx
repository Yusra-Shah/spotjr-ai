'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, ZoomIn, ZoomOut, Eye, EyeOff,
  Camera, Wifi, AlertTriangle, Search, ChevronRight, RefreshCw,
} from 'lucide-react'
import { mockCameras } from '@/lib/mock-data'

// ── Scan box definitions (positions relative to feed container) ───────────────
const SCAN_BOXES = [
  { left: '8%',  bottom: '44%', width: '17%', height: '40%', finalConf: 31, isMatch: false },
  { left: '52%', bottom: '30%', width: '14%', height: '47%', finalConf: 52, isMatch: false },
  { left: '73%', bottom: '28%', width: '13%', height: '43%', finalConf: 67, isMatch: false },
  { left: '36%', bottom: '28%', width: '14%', height: '58%', finalConf: 89, isMatch: true  },
]

// step layout:
//  0 = idle
//  1,2  = box0 analyzing / nomatch
//  3,4  = box1 analyzing / nomatch
//  5,6  = box2 analyzing / nomatch
//  7,8  = box3 analyzing / match
//  9    = complete

const CAMERA_METADATA = {
  name: 'Gate B Corridor',
  zone: 'Gate B / Parking Entrance',
  position: 'Exit corridor — east wall, 2.8 m height',
  coverage: '120° horizontal FOV',
  resolution: '1080p · 30fps',
  uptime: '99.8%',
  risk: 'HIGH — exit zone',
}

const SCAN_STEPS_OVERLAY = [
  'Initializing Azure AI Vision...',
  'Scanning CAM-01...', 'Scanning CAM-02...', 'Scanning CAM-03...',
  'Scanning CAM-04...', 'Scanning CAM-05...', 'Scanning CAM-06...',
  'Running Foundry IQ reasoning pipeline...',
  'Re-identification complete',
]
const SCAN_DELAYS_OVERLAY = [500, 300, 300, 300, 300, 300, 300, 1000, 500]

interface SearchResult {
  cameraId: string
  time: string
  confidence: number
  description: string
  cropUrl?: string
}

interface RealMatch {
  camera_id: string
  person_id: string
  bbox: { x: number; y: number; width: number; height: number }
  ai_description: string
  match_score: number
  crop_url: string
}

const MOCK_RESULTS: SearchResult[] = [
  { cameraId: 'CAM-02', time: '12:01', confidence: 78, description: 'Detection: upper body match, clothing color match' },
  { cameraId: 'CAM-03', time: '12:03', confidence: 94, description: 'Detection: upper body match, clothing color match, height match' },
  { cameraId: 'CAM-06', time: '12:06', confidence: 89, description: 'Detection: upper body match, accessory detected' },
]

const BACKEND = 'http://localhost:8000'

function parseQuery(q: string): string {
  const lower = q.toLowerCase()
  const parts: string[] = []
  if (lower.match(/red|pink/))              parts.push('red/pink upper clothing')
  if (lower.includes('blue'))               parts.push('blue clothing')
  if (lower.includes('black'))              parts.push('dark lower clothing')
  if (lower.match(/hat|cap/))              parts.push('hat accessory')
  if (lower.match(/shoe|nike/))            parts.push('notable footwear')
  if (lower.match(/boy|girl/))             parts.push(lower.includes('boy') ? 'male child' : 'female child')
  return parts.length ? parts.join(', ') : 'clothing match, stature match'
}

function confColor(c: number) {
  return c >= 85 ? '#10B981' : c >= 70 ? '#F59E0B' : '#EF4444'
}

export default function SingleCameraPage({ params }: { params: { id: string } }) {
  const cameraId = params.id.toUpperCase()
  const [showOverlays, setShowOverlays] = useState(true)
  const [zoom, setZoom] = useState(1)

  // ── Scan animation state ─────────────────────────────────────────────────
  const [scanStep, setScanStep] = useState(0)
  const [scanConf, setScanConf] = useState(0)
  const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([])

  // ── AI search overlay state ───────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [overlayStep, setOverlayStep] = useState(0)
  const [parsedQuery, setParsedQuery] = useState('')
  const [apiResults, setApiResults] = useState<{ matches: RealMatch[]; query_parsed: string } | null>(null)

  const cameraData = mockCameras.find(c => c.id === cameraId)
  const videoSrc = cameraData?.videoSrc

  // ── Start in-frame scan animation ────────────────────────────────────────
  function startScan() {
    timerRefs.current.forEach(clearTimeout)
    timerRefs.current = []
    setScanStep(0)
    setScanConf(0)

    const push = (fn: () => void, ms: number) => {
      const t = setTimeout(fn, ms)
      timerRefs.current.push(t)
      return t
    }

    push(() => setScanStep(1), 200)           // box0 analyzing
    push(() => setScanStep(2), 1100)          // box0 nomatch
    push(() => { setScanStep(3); setScanConf(0) }, 1550) // box1 analyzing
    push(() => setScanStep(4), 2450)          // box1 nomatch
    push(() => { setScanStep(5); setScanConf(0) }, 2900) // box2 analyzing
    push(() => setScanStep(6), 3800)          // box2 nomatch
    push(() => { setScanStep(7); setScanConf(0) }, 4250) // box3 analyzing (match)
    push(() => setScanStep(8), 5300)          // box3 confirmed MATCH
    push(() => setScanStep(9), 5700)          // complete
  }

  // Auto-trigger scan on mount
  useEffect(() => {
    const t = setTimeout(startScan, 600)
    return () => {
      clearTimeout(t)
      timerRefs.current.forEach(clearTimeout)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Confidence counter — runs during each "analyzing" phase
  useEffect(() => {
    const analyzingSteps: Record<number, number> = { 1: 31, 3: 52, 5: 67, 7: 89 }
    const target = analyzingSteps[scanStep]
    if (!target) return
    setScanConf(0)
    let cur = 0
    const id = setInterval(() => {
      cur = Math.min(cur + Math.ceil(target / 14), target)
      setScanConf(cur)
      if (cur >= target) clearInterval(id)
    }, 65)
    return () => clearInterval(id)
  }, [scanStep])

  // ── All-cameras search overlay ────────────────────────────────────────────
  async function startSearch() {
    if (!searchQuery.trim()) return
    setParsedQuery(parseQuery(searchQuery))
    setShowResults(false)
    setApiResults(null)
    setIsSearching(true)
    setOverlayStep(0)
    let step = 0
    const advance = () => {
      step++
      setOverlayStep(step)
      if (step < SCAN_STEPS_OVERLAY.length - 1) {
        setTimeout(advance, SCAN_DELAYS_OVERLAY[step] ?? 400)
      } else {
        // Animation finished — call real backend, then reveal results
        setTimeout(async () => {
          try {
            const resp = await fetch(`${BACKEND}/api/cases/CASE-A-001/search`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ description: searchQuery }),
            })
            if (resp.ok) {
              const data = await resp.json()
              setApiResults(data)
              if (data.query_parsed) setParsedQuery(data.query_parsed)
            }
          } catch {
            // Backend unavailable — MOCK_RESULTS are shown as fallback
          }
          setIsSearching(false)
          setShowResults(true)
        }, SCAN_DELAYS_OVERLAY[SCAN_STEPS_OVERLAY.length - 1])
      }
    }
    setTimeout(advance, SCAN_DELAYS_OVERLAY[0])
  }

  // ── Helpers to decide which scan box to show ─────────────────────────────
  function boxVisible(idx: number) {
    const ranges: [number, number][] = [[1,2],[3,4],[5,6],[7,9]]
    const [lo, hi] = ranges[idx]
    return scanStep >= lo && scanStep <= hi
  }
  function boxPhase(idx: number): 'analyzing' | 'nomatch' | 'match' {
    const nomatchSteps = [2, 4, 6]
    if (idx < 3 && nomatchSteps[idx] === scanStep) return 'nomatch'
    if (idx === 3 && scanStep >= 8) return 'match'
    return 'analyzing'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--color-bg-base)', overflow: 'hidden' }}>

      {/* ── All-cameras search overlay ──────────────────────────────────────── */}
      <AnimatePresence>
        {isSearching && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 9999,
              background: 'rgba(4,7,18,0.92)', backdropFilter: 'blur(8px)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24,
            }}
          >
            <div style={{ width: 72, height: 72, borderRadius: '50%', border: '3px solid rgba(6,182,212,0.15)', borderTop: '3px solid #06B6D4', animation: 'spin 1s linear infinite' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 700, color: '#06B6D4', letterSpacing: '0.12em', marginBottom: 12 }}>AI CHILD SEARCH · AZURE AI FOUNDRY</div>
              <AnimatePresence mode="wait">
                <motion.div key={overlayStep} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
                  style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 8 }}>
                  {SCAN_STEPS_OVERLAY[overlayStep]}
                </motion.div>
              </AnimatePresence>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Scanning {Math.min(overlayStep, 6)} / 6 cameras</div>
            </div>
            <div style={{ width: 280, height: 4, borderRadius: 2, background: 'rgba(6,182,212,0.15)', overflow: 'hidden' }}>
              <motion.div animate={{ width: `${Math.min((overlayStep / (SCAN_STEPS_OVERLAY.length - 1)) * 100, 100)}%` }} transition={{ duration: 0.3 }}
                style={{ height: '100%', background: '#06B6D4', borderRadius: 2 }} />
            </div>
            <div style={{ fontSize: 10, color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>Powered by Azure AI Foundry + Foundry IQ</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Top bar ──────────────────────────────────────────────────────────── */}
      <div style={{ height: 48, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', background: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link href="/cctv" style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--color-text-secondary)', fontSize: 13, textDecoration: 'none' }}>
            <ArrowLeft size={14} /> CCTV Wall
          </Link>
          <span style={{ color: 'var(--color-border-default)' }}>·</span>
          <Camera size={13} style={{ color: '#06B6D4' }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'monospace' }}>{cameraId}</span>
          <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{CAMERA_METADATA.name}</span>
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

      {/* ── Main split ───────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── Left: camera feed ─────────────────────────────────────────────── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 16 }}>

          {/* Feed container */}
          <div style={{
            flex: 1, position: 'relative', overflow: 'hidden',
            background: '#040709', borderRadius: 10,
            border: '1px solid rgba(239,68,68,0.35)',
            boxShadow: '0 0 24px rgba(239,68,68,0.12)',
          }}>
            {/* Scanlines */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.12) 0px, rgba(0,0,0,0.12) 1px, transparent 1px, transparent 3px)' }} />

            {/* Video / simulated scene */}
            <div style={{ position: 'absolute', inset: 0, transform: `scale(${zoom})`, transformOrigin: 'center', transition: 'transform 200ms' }}>
              {videoSrc ? (
                <video src={videoSrc} autoPlay loop muted playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #090E1A 0%, #0A1020 100%)' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%', background: 'rgba(30,45,77,0.3)', borderTop: '1px solid rgba(37,54,89,0.4)' }} />
                  {[...Array(5)].map((_, i) => (<div key={i} style={{ position: 'absolute', top: 0, bottom: '30%', left: `${i*20}%`, width: 1, background: 'rgba(37,54,89,0.2)' }} />))}
                  {[{l:'15%',h:38},{l:'28%',h:42},{l:'55%',h:35},{l:'70%',h:40},{l:'82%',h:44}].map((p, i) => (
                    <div key={i} style={{ position: 'absolute', bottom: '30%', left: p.l, width: 16, height: p.h, background: 'rgba(60,80,100,0.5)', borderRadius: '50% 50% 0 0' }} />
                  ))}
                  {/* The child silhouette (pink) */}
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

              {/* ── Animated scan boxes ─────────────────────────────────── */}
              <AnimatePresence>
                {showOverlays && SCAN_BOXES.map((box, idx) => {
                  if (!boxVisible(idx)) return null
                  const phase = boxPhase(idx)
                  const borderColor = phase === 'match' ? '#F59E0B' : phase === 'nomatch' ? '#64748B' : '#06B6D4'
                  const labelText = phase === 'nomatch'
                    ? 'No match'
                    : phase === 'match'
                    ? `${scanConf > 0 ? scanConf : box.finalConf}% MATCH`
                    : `Analyzing… ${scanConf}%`

                  return (
                    <motion.div
                      key={`scan-box-${idx}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: phase === 'nomatch' ? 0.4 : 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                      transition={{ duration: 0.25 }}
                      style={{
                        position: 'absolute',
                        left: box.left, bottom: box.bottom,
                        width: box.width, height: box.height,
                        border: `${phase === 'match' ? 2.5 : 2}px ${phase === 'analyzing' ? 'dashed' : 'solid'} ${borderColor}`,
                        borderRadius: 3,
                        zIndex: 5,
                        background: phase === 'analyzing' ? 'rgba(6,182,212,0.05)' : 'transparent',
                        boxShadow: phase === 'match'
                          ? `0 0 20px ${borderColor}88, inset 0 0 20px ${borderColor}11`
                          : phase === 'analyzing'
                          ? `0 0 8px rgba(6,182,212,0.35)`
                          : 'none',
                        animation: phase === 'match' ? 'pulseGlow 1.6s ease-in-out infinite' : 'none',
                      }}
                    >
                      {/* Label above box */}
                      <div style={{
                        position: 'absolute', top: -20, left: 0,
                        background: phase === 'match' ? '#F59E0B' : phase === 'nomatch' ? 'rgba(71,85,105,0.95)' : 'rgba(6,182,212,0.95)',
                        color: phase === 'match' ? '#000' : '#fff',
                        fontSize: 9, fontFamily: 'monospace', fontWeight: 800,
                        padding: '2px 6px', borderRadius: 2, whiteSpace: 'nowrap',
                        letterSpacing: '0.05em',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.5)',
                      }}>
                        {labelText}
                      </div>
                      {/* Corner accents for analyzing */}
                      {phase === 'analyzing' && <>
                        <div style={{ position: 'absolute', top: -1, left: -1, width: 10, height: 10, borderTop: '2.5px solid #06B6D4', borderLeft: '2.5px solid #06B6D4' }} />
                        <div style={{ position: 'absolute', top: -1, right: -1, width: 10, height: 10, borderTop: '2.5px solid #06B6D4', borderRight: '2.5px solid #06B6D4' }} />
                        <div style={{ position: 'absolute', bottom: -1, left: -1, width: 10, height: 10, borderBottom: '2.5px solid #06B6D4', borderLeft: '2.5px solid #06B6D4' }} />
                        <div style={{ position: 'absolute', bottom: -1, right: -1, width: 10, height: 10, borderBottom: '2.5px solid #06B6D4', borderRight: '2.5px solid #06B6D4' }} />
                      </>}
                      {/* Corner accents for match */}
                      {phase === 'match' && <>
                        <div style={{ position: 'absolute', top: -1, left: -1, width: 12, height: 12, borderTop: '3px solid #F59E0B', borderLeft: '3px solid #F59E0B' }} />
                        <div style={{ position: 'absolute', top: -1, right: -1, width: 12, height: 12, borderTop: '3px solid #F59E0B', borderRight: '3px solid #F59E0B' }} />
                        <div style={{ position: 'absolute', bottom: -1, left: -1, width: 12, height: 12, borderBottom: '3px solid #F59E0B', borderLeft: '3px solid #F59E0B' }} />
                        <div style={{ position: 'absolute', bottom: -1, right: -1, width: 12, height: 12, borderBottom: '3px solid #F59E0B', borderRight: '3px solid #F59E0B' }} />
                      </>}
                    </motion.div>
                  )
                })}
              </AnimatePresence>

              {/* Cyan sweep line (scanning) */}
              {showOverlays && scanStep > 0 && scanStep < 9 && (
                <div style={{
                  position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3,
                  background: 'linear-gradient(90deg, transparent 0%, rgba(6,182,212,0.07) 50%, transparent 100%)',
                  animation: 'scanSweep 2.5s ease-in-out infinite',
                }} />
              )}
            </div>

            {/* HUD overlays */}
            <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 6, display: 'flex', gap: 6 }}>
              <div style={{ background: 'rgba(0,0,0,0.8)', color: '#06B6D4', fontSize: 10, fontFamily: 'monospace', fontWeight: 700, padding: '3px 8px', borderRadius: 4 }}>
                {cameraId} · {CAMERA_METADATA.resolution}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(0,0,0,0.8)', padding: '3px 8px', borderRadius: 4 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#EF4444', animation: 'pulse 1.5s infinite' }} />
                <span style={{ fontSize: 9, fontFamily: 'monospace', color: '#EF4444', fontWeight: 700 }}>REC</span>
              </div>
            </div>
            <div style={{ position: 'absolute', bottom: 10, right: 10, zIndex: 6, fontSize: 9, fontFamily: 'monospace', color: 'rgba(240,244,255,0.4)', background: 'rgba(0,0,0,0.6)', padding: '3px 8px', borderRadius: 4 }}>
              SUNWAY PYRAMID · {CAMERA_METADATA.zone}
            </div>

            {/* Zoom controls */}
            <div style={{ position: 'absolute', bottom: 10, left: 10, zIndex: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <button onClick={() => setZoom(z => Math.min(2.5, z + 0.25))} style={{ width: 28, height: 28, borderRadius: 5, background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(37,54,89,0.8)', color: 'var(--color-text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ZoomIn size={13} /></button>
              <button onClick={() => setZoom(z => Math.max(1, z - 0.25))} style={{ width: 28, height: 28, borderRadius: 5, background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(37,54,89,0.8)', color: 'var(--color-text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ZoomOut size={13} /></button>
            </div>
          </div>

          {/* Controls bar */}
          <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 7, background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-subtle)' }}>
            <button
              onClick={() => setShowOverlays(!showOverlays)}
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 5, background: showOverlays ? 'rgba(6,182,212,0.15)' : 'transparent', border: `1px solid ${showOverlays ? 'rgba(6,182,212,0.4)' : 'var(--color-border-default)'}`, color: showOverlays ? '#06B6D4' : 'var(--color-text-muted)', fontSize: 12, cursor: 'pointer' }}
            >
              {showOverlays ? <Eye size={12} /> : <EyeOff size={12} />}
              AI Overlays {showOverlays ? 'ON' : 'OFF'}
            </button>

            {/* Re-scan button */}
            {scanStep >= 9 && (
              <button
                onClick={startScan}
                style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 5, background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.35)', color: '#8B5CF6', fontSize: 12, cursor: 'pointer' }}
              >
                <RefreshCw size={11} /> Re-scan
              </button>
            )}

            {scanStep > 0 && scanStep < 9 && (
              <span style={{ fontSize: 11, color: '#06B6D4', fontFamily: 'monospace' }}>
                Scanning person {Math.ceil(scanStep / 2)} of {SCAN_BOXES.length}…
              </span>
            )}

            <span style={{ fontSize: 11, color: 'var(--color-text-muted)', marginLeft: 'auto' }}>
              Zoom: {zoom.toFixed(2)}×
            </span>
            <div style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--color-text-muted)' }}>
              Azure AI Vision · Torchreid OSNet
            </div>
          </div>
        </div>

        {/* ── Right: AI Child Search Panel ─────────────────────────────────── */}
        <div style={{ width: 320, flexShrink: 0, borderLeft: '1px solid var(--color-border-subtle)', display: 'flex', flexDirection: 'column', overflowY: 'auto', background: 'var(--color-bg-surface)' }}>

          {/* Header */}
          <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--color-border-subtle)', background: 'var(--color-bg-elevated)', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <Search size={14} style={{ color: '#06B6D4' }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)' }}>AI Child Search</span>
              <span style={{ marginLeft: 'auto', fontSize: 8, fontFamily: 'monospace', fontWeight: 700, padding: '2px 6px', borderRadius: 3, background: 'rgba(0,120,212,0.15)', border: '1px solid rgba(0,120,212,0.3)', color: '#0078D4', letterSpacing: '0.06em' }}>
                AZURE AI FOUNDRY
              </span>
            </div>
            <div style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>Describe the missing child to search all cameras</div>
          </div>

          {/* Search input */}
          <div style={{ padding: 12, flexShrink: 0 }}>
            <textarea
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Describe the missing child… e.g. boy wearing red t-shirt, black hat, pink trousers, Nike shoes"
              rows={4}
              style={{ width: '100%', background: 'var(--color-bg-inset)', border: '1px solid var(--color-border-default)', borderRadius: 7, color: 'var(--color-text-primary)', fontSize: 12, padding: '10px 12px', resize: 'none', outline: 'none', fontFamily: 'inherit', lineHeight: 1.5, boxSizing: 'border-box' }}
              onFocus={e => { e.target.style.borderColor = 'rgba(6,182,212,0.5)' }}
              onBlur={e => { e.target.style.borderColor = 'var(--color-border-default)' }}
            />
            <button
              onClick={startSearch}
              disabled={!searchQuery.trim() || isSearching}
              style={{ marginTop: 8, width: '100%', padding: '11px 0', borderRadius: 7, border: 'none', background: searchQuery.trim() ? 'linear-gradient(135deg, #0891B2 0%, #06B6D4 50%, #22D3EE 100%)' : 'rgba(6,182,212,0.15)', color: searchQuery.trim() ? '#000' : 'var(--color-text-muted)', fontSize: 13, fontWeight: 700, cursor: searchQuery.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}
            >
              <Search size={14} /> Search All Cameras
            </button>
          </div>

          {/* Results */}
          <AnimatePresence>
            {showResults && (() => {
              // Normalize real API results or fall back to mock
              const displayResults: SearchResult[] = apiResults
                ? apiResults.matches.map(m => ({
                    cameraId: m.camera_id,
                    time: 'LIVE',
                    confidence: m.match_score,
                    description: m.ai_description,
                    cropUrl: m.crop_url,
                  }))
                : MOCK_RESULTS
              const reidCams = displayResults.map(r => r.cameraId)
              const isReal = !!apiResults

              return (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '0 12px 12px', flexShrink: 0 }}>
                  <div style={{ padding: '8px 12px', borderRadius: 6, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', marginBottom: 10 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#10B981', marginBottom: 3 }}>
                      {displayResults.length} possible match{displayResults.length !== 1 ? 'es' : ''} found{isReal ? ' · Azure AI' : ' across 6 cameras'}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>Query matched: {parsedQuery}</div>
                  </div>
                  {/* Re-ID chain */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 10px', borderRadius: 5, marginBottom: 10, background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.2)', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 9, fontFamily: 'monospace', color: 'var(--color-text-muted)', marginRight: 4 }}>Re-ID Chain:</span>
                    {reidCams.map((cam, i, arr) => (
                      <span key={cam + i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 700, color: '#06B6D4', background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.25)', padding: '1px 5px', borderRadius: 3 }}>{cam}</span>
                        {i < arr.length - 1 && <ChevronRight size={10} style={{ color: 'var(--color-text-muted)' }} />}
                      </span>
                    ))}
                  </div>
                  {/* Result cards */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {displayResults.map((result, ri) => {
                      const bc = confColor(result.confidence)
                      return (
                        <div key={result.cameraId + ri} style={{ borderRadius: 7, border: '1px solid var(--color-border-subtle)', borderLeft: `3px solid ${bc}`, background: 'var(--color-bg-elevated)', overflow: 'hidden' }}>
                          {/* Crop image (real) or placeholder (mock) */}
                          {result.cropUrl ? (
                            <div style={{ position: 'relative', background: '#060A14' }}>
                              <img
                                src={`${BACKEND}${result.cropUrl}`}
                                alt={`${result.cameraId} crop`}
                                style={{ width: '100%', height: 80, objectFit: 'cover', display: 'block', opacity: 0.92 }}
                                onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                              />
                              <div style={{ position: 'absolute', top: 4, right: 4, background: bc, color: '#000', fontSize: 8, fontFamily: 'monospace', fontWeight: 800, padding: '1px 5px', borderRadius: 2 }}>{result.confidence}%</div>
                              <div style={{ position: 'absolute', bottom: 4, left: 4, fontSize: 8, fontFamily: 'monospace', color: '#06B6D4', background: 'rgba(0,0,0,0.7)', padding: '1px 4px', borderRadius: 2 }}>{result.cameraId}</div>
                            </div>
                          ) : (
                            <div style={{ height: 52, background: '#060A14', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <div style={{ position: 'absolute', left: '30%', bottom: '8%', width: '16%', height: '75%', border: `1.5px solid ${bc}`, borderRadius: 2, boxShadow: `0 0 6px ${bc}66` }} />
                              <span style={{ fontSize: 8, color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>FRAME · {result.time}</span>
                              <div style={{ position: 'absolute', top: 4, right: 4, background: bc, color: '#000', fontSize: 8, fontFamily: 'monospace', fontWeight: 800, padding: '1px 5px', borderRadius: 2 }}>{result.confidence}%</div>
                              <div style={{ position: 'absolute', bottom: 4, left: 4, fontSize: 8, fontFamily: 'monospace', color: '#06B6D4', background: 'rgba(0,0,0,0.7)', padding: '1px 4px', borderRadius: 2 }}>{result.cameraId}</div>
                            </div>
                          )}
                          <div style={{ padding: '8px 10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'monospace' }}>{result.cameraId}</span>
                              <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--color-text-muted)' }}>{result.time}</span>
                            </div>
                            <div style={{ marginBottom: 5 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                                <span style={{ fontSize: 9, color: 'var(--color-text-muted)' }}>Confidence</span>
                                <span style={{ fontSize: 9, fontFamily: 'monospace', fontWeight: 700, color: bc }}>{result.confidence}%</span>
                              </div>
                              <div style={{ height: 3, borderRadius: 2, background: 'var(--color-border-subtle)', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${result.confidence}%`, background: bc, borderRadius: 2 }} />
                              </div>
                            </div>
                            <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginBottom: 7, lineHeight: 1.4 }}>{result.description}</div>
                            <button
                              onClick={() => { window.location.href = '/cctv/' + result.cameraId.toLowerCase() }}
                              style={{ width: '100%', padding: '5px 0', borderRadius: 5, background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)', color: '#06B6D4', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
                            >
                              View Camera
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div style={{ marginTop: 10, fontSize: 9, fontFamily: 'monospace', color: '#8B5CF6', textAlign: 'center', letterSpacing: '0.04em' }}>
                    {isReal ? 'Azure AI Vision + GPT-4o · Real inference' : 'Powered by Azure AI Foundry + Foundry IQ'}
                  </div>
                </motion.div>
              )
            })()}
          </AnimatePresence>

          {/* Camera metadata */}
          <div style={{ margin: '0 12px 12px', padding: 12, background: 'var(--color-bg-inset)', borderRadius: 8, border: '1px solid var(--color-border-subtle)', flexShrink: 0 }}>
            <div style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.1em', marginBottom: 10 }}>CAMERA METADATA</div>
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
                <span style={{ fontSize: 10, color: item.color ?? 'var(--color-text-secondary)', textAlign: 'right', fontFamily: 'monospace', fontWeight: item.color ? 700 : 400 }}>{item.value}</span>
              </div>
            ))}
          </div>

          {/* Quick nav */}
          <div style={{ padding: '0 12px 12px', display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
            <Link href="/cases/CASE-A-001/timeline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: 6, textDecoration: 'none', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)', color: '#8B5CF6', fontSize: 12, fontWeight: 600 }}>
              View in AI Timeline <ChevronRight size={12} />
            </Link>
            <Link href="/cctv" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: 6, textDecoration: 'none', background: 'transparent', border: '1px solid var(--color-border-default)', color: 'var(--color-text-secondary)', fontSize: 12 }}>
              Back to CCTV Wall <ChevronRight size={12} />
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes scanSweep { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 8px rgba(245,158,11,0.4); }
          50%       { box-shadow: 0 0 20px rgba(245,158,11,0.7); }
        }
      `}</style>
    </div>
  )
}
