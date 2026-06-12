'use client'

import { useState, useEffect } from 'react'
import { Send, User, Navigation, X, Check, Zap } from 'lucide-react'
import { mockGuards, mockCase } from '@/lib/mock-data'
import type { Guard, GuardStatus } from '@/lib/types'

// ── ETA countdown hook ────────────────────────────────────────────────────────
function useEta(initial: number) {
  const [s, setS] = useState(initial)
  useEffect(() => {
    if (s <= 0) return
    const id = setInterval(() => setS((v) => Math.max(0, v - 1)), 1000)
    return () => clearInterval(id)
  }, [s])
  const m = Math.floor(s / 60).toString().padStart(2, '0')
  const sec = (s % 60).toString().padStart(2, '0')
  return s > 0 ? `${m}:${sec}` : 'ARRIVED'
}

// ── Guard status colors (shared) ─────────────────────────────────────────────
const GUARD_STATUS_COLOR: Record<GuardStatus, string> = {
  en_route: '#F59E0B',
  on_site:  '#10B981',
  standby:  '#06B6D4',
  off_duty: '#475569',
}

// ── Simplified mini mall map (guard positions only) ───────────────────────────
const MINI_ZONES = [
  { id: 'foodcourt',  label: 'Food Court',  x: 14,  y: 52,  w: 58, h: 48 },
  { id: 'foodcourtE', label: 'F.C. East',   x: 78,  y: 52,  w: 54, h: 48 },
  { id: 'toyzone',    label: 'Toy Zone',    x: 14,  y: 10,  w: 46, h: 36 },
  { id: 'corridor',   label: 'Corridor',    x: 138, y: 52,  w: 30, h: 48 },
  { id: 'gateB',      label: 'Gate B',      x: 174, y: 52,  w: 42, h: 24, isRisk: true },
  { id: 'parking',    label: 'Parking',     x: 174, y: 82,  w: 42, h: 42, isRisk: true },
  { id: 'entrance',   label: 'Entrance',    x: 78,  y: 106, w: 54, h: 24 },
]

const GUARD_POSITIONS: Record<string, { x: number; y: number }> = {
  'GUARD-01': { x: 195, y: 64 },
  'GUARD-02': { x: 40,  y: 76 },
  'GUARD-03': { x: 105, y: 118 },
}

function SimpleMallMap({ guards }: { guards: Guard[] }) {
  return (
    <svg
      viewBox="0 0 230 140"
      style={{
        width: '100%',
        height: 'auto',
        maxHeight: 280,
        background: '#080C18',
        borderRadius: 8,
        border: '1px solid var(--color-border-default)',
        display: 'block',
      }}
    >
      {MINI_ZONES.map((z) => (
        <g key={z.id}>
          <rect
            x={z.x} y={z.y} width={z.w} height={z.h} rx="2"
            fill={z.isRisk ? 'rgba(239,68,68,0.1)' : 'rgba(30,45,77,0.4)'}
            stroke={z.isRisk ? 'rgba(239,68,68,0.3)' : 'var(--color-border-default)'}
            strokeWidth="0.8"
          />
          <text
            x={z.x + z.w / 2} y={z.y + z.h / 2}
            textAnchor="middle" dominantBaseline="middle"
            fill="rgba(240,244,255,0.35)" fontSize="5" fontFamily="Inter, system-ui"
            style={{ userSelect: 'none', pointerEvents: 'none' }}
          >
            {z.label}
          </text>
        </g>
      ))}
      {guards.map((g) => {
        const pos = GUARD_POSITIONS[g.id]
        if (!pos) return null
        const color = GUARD_STATUS_COLOR[g.status]
        return (
          <g key={g.id}>
            <circle cx={pos.x} cy={pos.y} r="6" fill={color} fillOpacity="0.2" />
            <circle cx={pos.x} cy={pos.y} r="4" fill={color} stroke="#080C18" strokeWidth="0.8" />
            <text
              x={pos.x} y={pos.y + 11}
              textAnchor="middle"
              fill={color}
              fontSize="4.5"
              fontFamily="Inter, system-ui"
              fontWeight="700"
              style={{ userSelect: 'none', pointerEvents: 'none' }}
            >
              {g.name}
            </text>
          </g>
        )
      })}
      <text x="226" y="137" textAnchor="end" fill="rgba(240,244,255,0.15)" fontSize="4" fontFamily="monospace">
        FLOOR 1
      </text>
    </svg>
  )
}

// ── Dispatch Modal ────────────────────────────────────────────────────────────
const ZONES = ['Gate B', 'Food Court', 'Main Entrance', 'Parking Level 1', 'Corridor', 'Toy Zone']

function DispatchModal({
  guard,
  onClose,
  onDispatch,
}: {
  guard: Guard
  onClose: () => void
  onDispatch: (guardId: string) => void
}) {
  const [selectedZone, setSelectedZone] = useState('Gate B')
  const alertMsg = `Possible match near ${selectedZone}. Female child, ~7yr, pink shirt. Last seen 1 min ago.`

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(8,12,24,0.85)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--color-bg-elevated)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 12,
          padding: 24,
          width: '100%',
          maxWidth: 440,
        }}
      >
        {/* Modal header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', letterSpacing: '0.1em', marginBottom: 2 }}>
              DISPATCH GUARD
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-text-primary)' }}>
              {guard.name}
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: 4 }}>
            <X size={16} />
          </button>
        </div>

        {/* Case dropdown (static for demo) */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 6 }}>
            TO CASE
          </label>
          <div
            style={{
              background: 'var(--color-bg-inset)',
              border: '1px solid var(--color-border-default)',
              borderRadius: 6,
              padding: '9px 12px',
              fontSize: 13,
              color: 'var(--color-text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span style={{ fontFamily: 'monospace', color: 'var(--color-brand-cyan)', fontSize: 11 }}>{mockCase.id}</span>
            <span style={{ color: 'var(--color-text-secondary)' }}>{mockCase.childAlias}</span>
            <span
              style={{
                marginLeft: 'auto',
                fontSize: 9,
                background: 'rgba(249,115,22,0.12)',
                border: '1px solid rgba(249,115,22,0.3)',
                color: 'var(--color-risk-high)',
                padding: '1px 6px',
                borderRadius: 8,
                fontWeight: 700,
              }}
            >
              ACTIVE
            </span>
          </div>
        </div>

        {/* Zone selector */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 6 }}>
            DISPATCH ZONE
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {ZONES.map((zone) => (
              <button
                key={zone}
                onClick={() => setSelectedZone(zone)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 6,
                  border: `1px solid ${selectedZone === zone ? 'var(--color-brand-cyan)' : 'var(--color-border-default)'}`,
                  background: selectedZone === zone ? 'rgba(6,182,212,0.12)' : 'transparent',
                  color: selectedZone === zone ? 'var(--color-brand-cyan)' : 'var(--color-text-secondary)',
                  fontSize: 12,
                  fontWeight: selectedZone === zone ? 700 : 400,
                  cursor: 'pointer',
                  transition: 'all 150ms',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                {selectedZone === zone && <Check size={10} />}
                {zone}
              </button>
            ))}
          </div>
        </div>

        {/* AI Recommendation */}
        <div
          style={{
            background: 'rgba(139,92,246,0.08)',
            border: '1px solid rgba(139,92,246,0.25)',
            borderRadius: 8,
            padding: '10px 12px',
            marginBottom: 16,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 8,
          }}
        >
          <Zap size={13} style={{ color: 'var(--color-ai-primary)', flexShrink: 0, marginTop: 1 }} />
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--color-ai-primary)', letterSpacing: '0.1em', marginBottom: 3 }}>
              AI RECOMMENDATION
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
              Gate B — Predicted route segment — ETA ~3 min · Distance ~180m
            </div>
          </div>
        </div>

        {/* Alert message */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 6 }}>
            ALERT MESSAGE
          </label>
          <textarea
            defaultValue={alertMsg}
            rows={3}
            style={{
              width: '100%',
              background: 'var(--color-bg-inset)',
              border: '1px solid var(--color-border-default)',
              borderRadius: 6,
              padding: '9px 12px',
              color: 'var(--color-text-primary)',
              fontSize: 12,
              resize: 'none',
              outline: 'none',
              fontFamily: 'inherit',
              lineHeight: 1.5,
            }}
          />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '10px 0',
              borderRadius: 7,
              border: '1px solid var(--color-border-default)',
              background: 'transparent',
              color: 'var(--color-text-secondary)',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => onDispatch(guard.id)}
            style={{
              flex: 2,
              padding: '10px 0',
              borderRadius: 7,
              border: 'none',
              background: 'var(--gradient-btn-primary)',
              color: '#fff',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <Send size={13} /> Dispatch Guard →
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Guard Card ────────────────────────────────────────────────────────────────
const STATUS_LABEL: Record<GuardStatus, string> = {
  standby:  'STANDBY',
  en_route: 'EN ROUTE',
  on_site:  'ON SITE',
  off_duty: 'OFF DUTY',
}

const STATUS_COLOR: Record<GuardStatus, string> = {
  standby:  'var(--color-brand-cyan)',
  en_route: 'var(--color-risk-medium)',
  on_site:  'var(--color-risk-low)',
  off_duty: 'var(--color-text-muted)',
}

function GuardCard({
  guard,
  onDispatch,
}: {
  guard: Guard
  onDispatch: (g: Guard) => void
}) {
  const etaStr = useEta(guard.eta ?? 0)
  const color = STATUS_COLOR[guard.status]
  const isActive = guard.status === 'en_route' || guard.status === 'on_site'

  return (
    <div
      style={{
        borderRadius: 10,
        border: `1px solid ${isActive ? `${GUARD_STATUS_COLOR[guard.status]}44` : 'var(--color-border-default)'}`,
        background: isActive ? `${GUARD_STATUS_COLOR[guard.status]}08` : 'var(--color-bg-elevated)',
        padding: '14px 16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        {/* Avatar */}
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: `${GUARD_STATUS_COLOR[guard.status]}18`,
            border: `1.5px solid ${GUARD_STATUS_COLOR[guard.status]}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            fontWeight: 800,
            color: GUARD_STATUS_COLOR[guard.status],
            flexShrink: 0,
            fontFamily: 'monospace',
          }}
        >
          {guard.name[0]}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)' }}>
              {guard.name}
            </span>
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '0.08em',
                color,
                background: `${color}18`,
                border: `1px solid ${color}44`,
                padding: '1px 6px',
                borderRadius: 8,
              }}
            >
              {STATUS_LABEL[guard.status]}
            </span>
          </div>

          <div style={{ fontSize: 12, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Navigation size={10} />
            {guard.zone}
          </div>

          {guard.assignedCaseId && (
            <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 4 }}>
              Case:{' '}
              <span style={{ fontFamily: 'monospace', color: 'var(--color-brand-cyan)' }}>
                {guard.assignedCaseId}
              </span>
            </div>
          )}
        </div>

        {/* ETA or Dispatch button */}
        <div style={{ flexShrink: 0, textAlign: 'right' }}>
          {guard.status === 'en_route' && guard.eta != null && (
            <div>
              <div
                style={{
                  fontSize: 15,
                  fontFamily: 'monospace',
                  fontWeight: 800,
                  color: etaStr === 'ARRIVED' ? 'var(--color-risk-low)' : 'var(--color-risk-medium)',
                }}
              >
                {etaStr}
              </div>
              <div style={{ fontSize: 9, color: 'var(--color-text-muted)' }}>ETA</div>
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        {guard.status === 'en_route' && (
          <>
            <button
              style={{
                flex: 1,
                padding: '7px 0',
                borderRadius: 6,
                border: '1px solid var(--color-border-default)',
                background: 'transparent',
                color: 'var(--color-text-secondary)',
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
              }}
            >
              <User size={11} /> Contact
            </button>
            <button
              style={{
                flex: 1,
                padding: '7px 0',
                borderRadius: 6,
                border: '1px solid var(--color-border-default)',
                background: 'transparent',
                color: 'var(--color-text-secondary)',
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Reassign
            </button>
          </>
        )}
        {guard.status === 'standby' && (
          <button
            onClick={() => onDispatch(guard)}
            style={{
              width: '100%',
              padding: '8px 0',
              borderRadius: 6,
              border: '1px solid rgba(6,182,212,0.4)',
              background: 'rgba(6,182,212,0.1)',
              color: 'var(--color-brand-cyan)',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 5,
            }}
          >
            <Send size={12} /> Dispatch →
          </button>
        )}
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function DispatchPage() {
  const [guards, setGuards] = useState<Guard[]>(mockGuards)
  const [dispatchTarget, setDispatchTarget] = useState<Guard | null>(null)

  const activeCount  = guards.filter((g) => g.status === 'en_route' || g.status === 'on_site').length
  const standbyCount = guards.filter((g) => g.status === 'standby').length

  function handleDispatch(guardId: string) {
    setGuards((prev) =>
      prev.map((g) =>
        g.id === guardId
          ? { ...g, status: 'en_route' as const, assignedCaseId: mockCase.id, eta: 180, zone: 'Gate B' }
          : g,
      ),
    )
    setDispatchTarget(null)
  }

  return (
    <>
      {dispatchTarget && (
        <DispatchModal
          guard={dispatchTarget}
          onClose={() => setDispatchTarget(null)}
          onDispatch={handleDispatch}
        />
      )}

      <div
        style={{
          display: 'flex',
          height: '100%',
          overflow: 'hidden',
          background: 'var(--color-bg-base)',
        }}
      >
        {/* ── Left: Guard Roster (340px) ─────────────────────────────────── */}
        <div
          style={{
            width: 340,
            flexShrink: 0,
            borderRight: '1px solid var(--color-border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Panel header */}
          <div
            style={{
              padding: '14px 16px',
              borderBottom: '1px solid var(--color-border-subtle)',
              background: 'var(--color-bg-surface)',
              flexShrink: 0,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Send size={14} style={{ color: 'var(--color-brand-cyan)' }} />
              <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--color-text-primary)' }}>
                Guard Dispatch
              </span>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-risk-medium)' }}>
                {activeCount} Active
              </span>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-brand-cyan)' }}>
                {standbyCount} Standby
              </span>
            </div>
          </div>

          {/* Guard list */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {guards.map((g) => (
              <GuardCard key={g.id} guard={g} onDispatch={setDispatchTarget} />
            ))}
          </div>
        </div>

        {/* ── Right: Map ─────────────────────────────────────────────────── */}
        <div
          style={{
            flex: 1,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              padding: '14px 20px',
              borderBottom: '1px solid var(--color-border-subtle)',
              background: 'var(--color-bg-surface)',
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.1em' }}>
              GUARD POSITIONS — FLOOR 1
            </span>
          </div>

          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 24,
            }}
          >
            <div style={{ width: '100%', maxWidth: 560 }}>
              <SimpleMallMap guards={guards} />

              {/* Legend */}
              <div style={{ display: 'flex', gap: 16, marginTop: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
                {(
                  [
                    { status: 'en_route' as GuardStatus, label: 'En Route' },
                    { status: 'standby'  as GuardStatus, label: 'Standby' },
                    { status: 'on_site'  as GuardStatus, label: 'On Site' },
                  ] as Array<{ status: GuardStatus; label: string }>
                ).map(({ status, label }) => (
                  <div key={status} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: GUARD_STATUS_COLOR[status],
                        display: 'inline-block',
                      }}
                    />
                    <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{label}</span>
                  </div>
                ))}
              </div>

              {/* Guard name list under map */}
              <div
                style={{
                  marginTop: 20,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 10,
                }}
              >
                {guards.map((g) => (
                  <div
                    key={g.id}
                    style={{
                      background: 'var(--color-bg-elevated)',
                      border: '1px solid var(--color-border-default)',
                      borderRadius: 8,
                      padding: '10px 12px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: GUARD_STATUS_COLOR[g.status],
                          display: 'inline-block',
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-primary)' }}>
                        {g.name}
                      </span>
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>{g.zone}</div>
                    {g.assignedCaseId && (
                      <div style={{ fontSize: 10, color: 'var(--color-brand-cyan)', fontFamily: 'monospace', marginTop: 2 }}>
                        {g.assignedCaseId}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

