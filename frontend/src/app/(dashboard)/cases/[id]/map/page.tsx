'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, ChevronRight, Maximize2, MapPin, Clock, ZoomIn, ZoomOut, Layers } from 'lucide-react'
import MallDigitalTwin from '@/components/map/MallDigitalTwin'

const TIMESTAMPS = [
  { label: '12:01', desc: 'Case created' },
  { label: '12:01:45', desc: 'CAM-02 detection' },
  { label: '12:03:12', desc: 'CAM-03 re-ID' },
  { label: '12:04:30', desc: 'Prediction' },
  { label: '12:06:00', desc: 'CAM-06 HIGH RISK' },
  { label: '12:06:30', desc: 'Guard dispatched' },
  { label: 'NOW', desc: 'Live' },
]

export default function CaseMapPage({ params }: { params: { id: string } }) {
  const caseId = params.id
  const [scrubIdx, setScrubIdx] = useState(TIMESTAMPS.length - 1)
  const current = TIMESTAMPS[scrubIdx]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--color-bg-base)', overflow: 'hidden' }}>

      {/* Top bar */}
      <div style={{
        height: 48, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px',
        background: 'rgba(8,12,24,0.95)',
        borderBottom: '1px solid var(--color-border-subtle)',
        backdropFilter: 'blur(8px)',
        position: 'relative', zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link href={`/cases/${caseId}`} style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--color-text-secondary)', fontSize: 13, textDecoration: 'none' }}>
            <ArrowLeft size={14} /> Back
          </Link>
          <span style={{ color: 'var(--color-border-default)' }}>·</span>
          <span style={{ fontSize: 13, fontFamily: 'monospace', color: 'var(--color-text-muted)' }}>CASE-A-001</span>
          <ChevronRight size={12} style={{ color: 'var(--color-text-muted)' }} />
          <span style={{ fontSize: 13, color: 'var(--color-text-primary)', fontWeight: 600 }}>Mall Digital Twin</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Current time indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 5, background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-default)' }}>
            <Clock size={11} style={{ color: 'var(--color-brand-cyan)' }} />
            <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--color-brand-cyan)', fontWeight: 700 }}>{current.label}</span>
            <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{current.desc}</span>
          </div>

          {/* Azure Maps badge */}
          <div style={{
            padding: '4px 9px', borderRadius: 5,
            background: 'rgba(0,120,212,0.12)', border: '1px solid rgba(0,120,212,0.3)',
            fontSize: 10, fontFamily: 'monospace', fontWeight: 700, color: '#0078D4',
          }}>
            AZURE MAPS ENGINE
          </div>
        </div>
      </div>

      {/* Full-screen map */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <MallDigitalTwin />

        {/* Floating legend */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            position: 'absolute', top: 16, right: 16, zIndex: 10,
            background: 'var(--glass-background)',
            border: '1px solid var(--glass-border)',
            borderRadius: 10,
            backdropFilter: 'blur(16px)',
            padding: 14,
            minWidth: 180,
            boxShadow: 'var(--glass-shadow)',
          }}
        >
          <div style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.1em', marginBottom: 10 }}>
            MAP LEGEND
          </div>
          {[
            { color: '#06B6D4', label: 'Confirmed path' },
            { color: '#F59E0B', dash: true, label: 'Predicted route' },
            { color: '#10B981', label: 'Guard position', circle: true },
            { color: '#EF4444', label: 'High-risk zone', fill: true },
            { color: '#06B6D4', label: 'Camera position', cam: true },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
              {item.circle ? (
                <div style={{ width: 14, height: 14, borderRadius: '50%', border: `2px solid ${item.color}`, background: `${item.color}22`, flexShrink: 0 }} />
              ) : item.fill ? (
                <div style={{ width: 14, height: 8, borderRadius: 2, background: `${item.color}44`, border: `1px solid ${item.color}`, flexShrink: 0 }} />
              ) : item.cam ? (
                <div style={{ width: 14, height: 10, borderRadius: 2, border: `1.5px solid ${item.color}`, background: `${item.color}22`, flexShrink: 0 }} />
              ) : (
                <div style={{
                  width: 22, height: 2, background: item.color, flexShrink: 0,
                  ...(item.dash ? { backgroundImage: `repeating-linear-gradient(90deg, ${item.color} 0px, ${item.color} 4px, transparent 4px, transparent 8px)`, background: 'none' } : {}),
                }} />
              )}
              <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>{item.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Floating case panel */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            position: 'absolute', top: 16, left: 16, zIndex: 10,
            background: 'var(--glass-background)',
            border: '1px solid var(--glass-border)',
            borderRadius: 10,
            backdropFilter: 'blur(16px)',
            padding: 14,
            minWidth: 200,
            boxShadow: 'var(--glass-shadow)',
          }}
        >
          <div style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.1em', marginBottom: 8 }}>
            ACTIVE CASE
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 4 }}>
            CASE-A-001
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#EF4444', boxShadow: '0 0 6px #EF4444' }} />
            <span style={{ fontSize: 12, fontFamily: 'monospace', fontWeight: 700, color: '#EF4444' }}>HIGH RISK · 85</span>
          </div>
          <div style={{ marginTop: 8, fontSize: 11, color: 'var(--color-text-muted)' }}>
            3 cameras · 1 guard en route
          </div>
          <div style={{ marginTop: 10, display: 'flex', gap: 6 }}>
            <Link href={`/cases/${caseId}`} style={{
              flex: 1, padding: '5px 0', borderRadius: 5, textAlign: 'center',
              background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)',
              color: '#06B6D4', fontSize: 11, fontWeight: 600, textDecoration: 'none',
            }}>
              Case Detail
            </Link>
            <Link href={`/cases/${caseId}/timeline`} style={{
              flex: 1, padding: '5px 0', borderRadius: 5, textAlign: 'center',
              background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)',
              color: '#8B5CF6', fontSize: 11, fontWeight: 600, textDecoration: 'none',
            }}>
              Timeline
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Timeline scrubber */}
      <div style={{
        height: 64, flexShrink: 0,
        background: 'rgba(8,12,24,0.97)',
        borderTop: '1px solid var(--color-border-subtle)',
        display: 'flex', alignItems: 'center',
        padding: '0 20px', gap: 12,
      }}>
        <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--color-text-muted)', flexShrink: 0 }}>TIMELINE</span>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 0, position: 'relative' }}>
          {/* Track */}
          <div style={{ position: 'absolute', left: 0, right: 0, height: 2, background: 'var(--color-border-subtle)', borderRadius: 1 }}>
            <div style={{
              height: '100%', borderRadius: 1,
              background: 'linear-gradient(90deg, #10B981, #F59E0B, #EF4444)',
              width: `${(scrubIdx / (TIMESTAMPS.length - 1)) * 100}%`,
              transition: 'width 300ms',
            }} />
          </div>
          {/* Tick points */}
          {TIMESTAMPS.map((ts, i) => {
            const pct = (i / (TIMESTAMPS.length - 1)) * 100
            const isActive = i === scrubIdx
            const isPast = i <= scrubIdx
            return (
              <button
                key={ts.label}
                onClick={() => setScrubIdx(i)}
                style={{
                  position: 'absolute', left: `${pct}%`,
                  transform: 'translateX(-50%)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  gap: 4, background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                }}
              >
                <div style={{
                  width: isActive ? 14 : 8, height: isActive ? 14 : 8,
                  borderRadius: '50%',
                  background: isActive ? '#F59E0B' : isPast ? '#06B6D4' : 'var(--color-border-default)',
                  border: isActive ? '2px solid rgba(245,158,11,0.5)' : '1px solid transparent',
                  boxShadow: isActive ? '0 0 8px #F59E0B' : 'none',
                  transition: 'all 200ms',
                  zIndex: 1,
                }} />
                {isActive && (
                  <div style={{
                    position: 'absolute', top: 18,
                    background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-default)',
                    borderRadius: 4, padding: '3px 7px', whiteSpace: 'nowrap',
                  }}>
                    <div style={{ fontSize: 9, fontFamily: 'monospace', fontWeight: 700, color: '#F59E0B' }}>{ts.label}</div>
                    <div style={{ fontSize: 8, color: 'var(--color-text-muted)' }}>{ts.desc}</div>
                  </div>
                )}
              </button>
            )
          })}
        </div>
        <Link href={`/cases/${caseId}/timeline`} style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '6px 12px', borderRadius: 6, textDecoration: 'none',
          background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)',
          fontSize: 11, fontWeight: 600, color: '#8B5CF6', flexShrink: 0,
        }}>
          Full Timeline <ChevronRight size={11} />
        </Link>
      </div>
    </div>
  )
}
