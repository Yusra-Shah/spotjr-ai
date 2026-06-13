'use client'

import { useState, useRef, useEffect } from 'react'
import { Camera, ArrowRight, Shield, User, Plus, CheckCircle } from 'lucide-react'
import type { TimelineEvent } from '@/lib/types'

interface Props {
  events: TimelineEvent[]
}

const typeConfig = {
  detection: {
    Icon: Camera,
    color: 'var(--color-risk-medium)',
    bg: 'rgba(245,158,11,0.12)',
    border: 'rgba(245,158,11,0.3)',
    label: 'Detection',
  },
  prediction: {
    Icon: ArrowRight,
    color: 'var(--color-ai-primary)',
    bg: 'rgba(139,92,246,0.12)',
    border: 'rgba(139,92,246,0.3)',
    label: 'Prediction',
  },
  risk_change: {
    Icon: Shield,
    color: 'var(--color-risk-critical)',
    bg: 'rgba(239,68,68,0.12)',
    border: 'rgba(239,68,68,0.3)',
    label: 'Risk',
  },
  guard_dispatched: {
    Icon: User,
    color: 'var(--color-status-online)',
    bg: 'rgba(16,185,129,0.12)',
    border: 'rgba(16,185,129,0.3)',
    label: 'Guard',
  },
  case_created: {
    Icon: Plus,
    color: 'var(--color-text-primary)',
    bg: 'rgba(240,244,255,0.06)',
    border: 'rgba(240,244,255,0.15)',
    label: 'Case',
  },
  case_closed: {
    Icon: CheckCircle,
    color: 'var(--color-risk-low)',
    bg: 'rgba(16,185,129,0.12)',
    border: 'rgba(16,185,129,0.3)',
    label: 'Closed',
  },
}

export default function AIReasoningTimeline({ events }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to the latest event
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth
    }
  }, [events])

  const selected = events.find(e => e.id === selectedId)

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--color-bg-surface)',
        borderTop: '1px solid var(--color-border-subtle)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '6px 16px',
          borderBottom: '1px solid var(--color-border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: 'var(--color-text-muted)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          AI Investigation Timeline
        </span>
        {selected && (
          <button
            onClick={() => setSelectedId(null)}
            style={{
              marginLeft: 'auto',
              fontSize: 10,
              color: 'var(--color-text-muted)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0 4px',
            }}
          >
            ✕ close
          </button>
        )}
      </div>

      {/* Expanded event detail */}
      {selected && (
        <div
          style={{
            padding: '8px 16px',
            borderBottom: '1px solid var(--color-border-subtle)',
            background: 'var(--color-bg-elevated)',
            display: 'flex',
            gap: 16,
            alignItems: 'flex-start',
            flexShrink: 0,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                marginBottom: 2,
              }}
            >
              {selected.title}
            </div>
            <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
              {selected.description}
            </div>
          </div>
          <div style={{ flexShrink: 0, textAlign: 'right' }}>
            <div
              style={{
                fontSize: 10,
                fontFamily: 'monospace',
                color: 'var(--color-text-muted)',
              }}
            >
              {new Date(selected.timestamp).toLocaleTimeString()}
            </div>
            {selected.confidence && (
              <div
                style={{
                  fontSize: 11,
                  fontFamily: 'monospace',
                  color: 'var(--color-risk-medium)',
                  fontWeight: 700,
                  marginTop: 2,
                }}
              >
                {selected.confidence}% conf
              </div>
            )}
          </div>
        </div>
      )}

      {/* Horizontal scroll area */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowX: 'auto',
          overflowY: 'hidden',
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          gap: 0,
        }}
      >
        {events.map((event, i) => {
          const cfg = typeConfig[event.type]
          const Icon = cfg.Icon
          const isSelected = selectedId === event.id
          const isLast = i === events.length - 1
          const staggerDelay = `${i * 0.18}s`

          return (
            <div
              key={event.id}
              style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}
            >
              {/* Node with bounce-in animation staggered */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                  cursor: 'pointer',
                  padding: '0 6px',
                  animation: `node-bounce-in 0.4s cubic-bezier(0.34,1.56,0.64,1) both`,
                  animationDelay: staggerDelay,
                }}
                onClick={() => setSelectedId(isSelected ? null : event.id)}
              >
                {/* Icon circle */}
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: isSelected ? cfg.bg : 'var(--color-bg-elevated)',
                    border: `1.5px solid ${isSelected ? cfg.color : cfg.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 150ms',
                    boxShadow: isSelected
                      ? `0 0 0 3px ${cfg.color}33`
                      : isLast
                        ? `0 0 0 0 ${cfg.color}55`
                        : 'none',
                    animation: isLast && !isSelected ? 'pulse-node 2s ease-in-out infinite' : undefined,
                  }}
                >
                  <Icon size={14} style={{ color: cfg.color }} />
                </div>

                {/* Time */}
                <span
                  style={{
                    fontSize: 9,
                    fontFamily: 'monospace',
                    color: 'var(--color-text-muted)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>

                {/* Label */}
                <span
                  style={{
                    fontSize: 9,
                    color: cfg.color,
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    maxWidth: 72,
                    textAlign: 'center',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {event.cameraId ?? cfg.label}
                </span>
              </div>

              {/* Connector line — animates growing left to right */}
              {!isLast && (
                <div
                  style={{
                    width: 32,
                    height: 1.5,
                    background: `linear-gradient(90deg, ${cfg.color}55, var(--color-border-default))`,
                    flexShrink: 0,
                    transformOrigin: 'left center',
                    animation: 'grow-line 0.3s ease both',
                    animationDelay: `${i * 0.18 + 0.18}s`,
                  }}
                />
              )}
            </div>
          )
        })}

        {/* "AI Processing" tail node with spinner */}
        <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, animation: `node-bounce-in 0.4s cubic-bezier(0.34,1.56,0.64,1) both`, animationDelay: `${events.length * 0.18}s` }}>
          <div style={{ width: 32, height: 1.5, background: 'linear-gradient(90deg, rgba(139,92,246,0.3), rgba(139,92,246,0.1))', transformOrigin: 'left center', animation: 'grow-line 0.3s ease both', animationDelay: `${(events.length - 1) * 0.18 + 0.18}s` }} />
          <div style={{ padding: '0 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            {/* Spinning ring indicator */}
            <div style={{ position: 'relative', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div
                style={{
                  position: 'absolute', inset: 0,
                  borderRadius: '50%',
                  border: '1.5px solid rgba(139,92,246,0.2)',
                  borderTopColor: 'var(--color-ai-primary)',
                  animation: 'spin 1.4s linear infinite',
                }}
              />
              <div
                style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: 'var(--color-ai-primary)',
                  opacity: 0.7,
                  animation: 'float-pulse 1.4s ease-in-out infinite',
                }}
              />
            </div>
            <span style={{ fontSize: 9, color: 'var(--color-ai-primary)', whiteSpace: 'nowrap', letterSpacing: '0.04em' }}>AI Processing…</span>
          </div>
        </div>
      </div>
    </div>
  )
}
