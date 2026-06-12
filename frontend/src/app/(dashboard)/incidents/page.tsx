'use client'

import { useState } from 'react'
import {
  FileText, ArrowLeft, Download, Shield, Check, ChevronRight, Clock,
  Camera, User, CheckCircle, MapPin, type LucideIcon,
} from 'lucide-react'
import { mockTimeline } from '@/lib/mock-data'
import type { TimelineEvent } from '@/lib/types'

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ message }: { message: string }) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        background: 'var(--color-bg-elevated)',
        border: '1px solid var(--color-border-default)',
        borderLeft: '3px solid var(--color-status-online)',
        borderRadius: 8,
        padding: '12px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        animation: 'slideInFromRight 200ms ease',
      }}
    >
      <CheckCircle size={16} style={{ color: 'var(--color-status-online)', flexShrink: 0 }} />
      <span style={{ fontSize: 13, color: 'var(--color-text-primary)' }}>{message}</span>
    </div>
  )
}

// ── Risk badge ────────────────────────────────────────────────────────────────
function RiskBadge({ level }: { level: 'HIGH' | 'MEDIUM' | 'LOW' }) {
  const map = {
    HIGH:   { bg: 'rgba(239,68,68,0.15)',    border: 'rgba(239,68,68,0.4)',    color: '#EF4444' },
    MEDIUM: { bg: 'rgba(245,158,11,0.15)',   border: 'rgba(245,158,11,0.4)',   color: '#F59E0B' },
    LOW:    { bg: 'rgba(16,185,129,0.15)',   border: 'rgba(16,185,129,0.4)',   color: '#10B981' },
  }
  const s = map[level]
  return (
    <span
      style={{
        padding: '2px 8px',
        borderRadius: 10,
        fontSize: 10,
        fontWeight: 700,
        background: s.bg,
        border: `1px solid ${s.border}`,
        color: s.color,
        letterSpacing: '0.06em',
        fontFamily: 'monospace',
      }}
    >
      {level}
    </span>
  )
}

// ── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ label, color }: { label: string; color: 'green' | 'amber' }) {
  const s = color === 'green'
    ? { bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.4)', text: '#10B981' }
    : { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.4)', text: '#F59E0B' }
  return (
    <span
      style={{
        padding: '2px 8px',
        borderRadius: 10,
        fontSize: 10,
        fontWeight: 700,
        background: s.bg,
        border: `1px solid ${s.border}`,
        color: s.text,
        letterSpacing: '0.06em',
      }}
    >
      {label}
    </span>
  )
}

// ── Section card ──────────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: 'var(--color-bg-elevated)',
        border: '1px solid var(--color-border-subtle)',
        borderRadius: 8,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '10px 16px',
          borderBottom: '1px solid var(--color-border-subtle)',
          background: 'var(--color-bg-surface)',
        }}
      >
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          {title}
        </span>
      </div>
      <div style={{ padding: '16px' }}>
        {children}
      </div>
    </div>
  )
}

// ── Vertical timeline event card ──────────────────────────────────────────────
const EVENT_ICONS: Record<TimelineEvent['type'], LucideIcon> = {
  detection:       Camera,
  prediction:      ChevronRight,
  risk_change:     Shield,
  guard_dispatched: User,
  case_created:    FileText,
  case_closed:     CheckCircle,
}
const EVENT_COLORS: Record<TimelineEvent['type'], string> = {
  detection:       '#F59E0B',
  prediction:      '#8B5CF6',
  risk_change:     '#EF4444',
  guard_dispatched:'#10B981',
  case_created:    '#F0F4FF',
  case_closed:     '#10B981',
}

function VerticalTimelineEvent({ event, isLast }: { event: TimelineEvent; isLast: boolean }) {
  const Icon = EVENT_ICONS[event.type]
  const color = EVENT_COLORS[event.type]
  return (
    <div style={{ display: 'flex', gap: 12, position: 'relative' }}>
      {/* Line */}
      {!isLast && (
        <div
          style={{
            position: 'absolute',
            left: 15,
            top: 32,
            width: 1.5,
            height: 'calc(100% + 8px)',
            background: 'var(--color-border-subtle)',
          }}
        />
      )}
      {/* Icon */}
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: `${color}18`,
          border: `1.5px solid ${color}55`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          zIndex: 1,
        }}
      >
        <Icon size={14} style={{ color }} />
      </div>
      {/* Content */}
      <div style={{ paddingBottom: 16, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-primary)' }}>{event.title}</span>
          {event.confidence && (
            <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#F59E0B', fontWeight: 700 }}>
              {event.confidence}%
            </span>
          )}
        </div>
        <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: 3 }}>
          {event.description}
        </div>
        <div style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--color-text-muted)' }}>
          {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          {event.cameraId && ` · ${event.cameraId}`}
        </div>
      </div>
    </div>
  )
}

// ── Report detail view ────────────────────────────────────────────────────────
function ReportDetailView({ onBack, onExport }: { onBack: () => void; onExport: () => void }) {
  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      {/* Report header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--color-text-secondary)', fontSize: 13,
          }}
        >
          <ArrowLeft size={14} /> Back to Reports
        </button>
        <div style={{ flex: 1 }} />
        <button
          onClick={onExport}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '7px 16px', borderRadius: 6,
            border: '1px solid var(--color-border-default)',
            background: 'transparent',
            color: 'var(--color-text-secondary)',
            fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}
        >
          <Download size={13} /> Export PDF
        </button>
      </div>

      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-text-primary)', margin: '0 0 4px' }}>
          Incident Report — Case A-001
        </h1>
        <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: 0 }}>
          Demo Mall · June 14 2026 · Generated by SpotJr AI
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Section 1: Case Summary */}
        <Section title="Case Summary">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              ['Case ID', 'A-001'],
              ['Date', 'June 14 2026'],
              ['Venue', 'Demo Mall'],
              ['Reporting Operator', 'Security Operator'],
            ].map(([label, value]) => (
              <div key={label}>
                <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}>{value}</div>
              </div>
            ))}
            <div>
              <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Status</div>
              <StatusBadge label="RESOLVED" color="green" />
            </div>
          </div>
        </Section>

        {/* Section 2: Child Description */}
        <Section title="Child Description">
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div
              style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'var(--color-bg-surface)',
                border: '2px solid var(--color-border-default)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <User size={28} style={{ color: 'var(--color-text-muted)' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                'Female, approximately 7 years old',
                'Pink upper clothing',
                'Dark lower clothing',
                'May carry stuffed animal',
              ].map((line) => (
                <div key={line} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Check size={12} style={{ color: 'var(--color-status-online)', flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{line}</span>
                </div>
              ))}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <MapPin size={12} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                  Last seen: Food Court at 12:01 PM
                </span>
              </div>
            </div>
          </div>
        </Section>

        {/* Section 3: AI Investigation Timeline */}
        <Section title="AI Investigation Timeline">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {mockTimeline.map((event, i) => (
              <VerticalTimelineEvent key={event.id} event={event} isLast={i === mockTimeline.length - 1} />
            ))}
          </div>
        </Section>

        {/* Section 4: AI Performance Metrics */}
        <Section title="AI Performance Metrics">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { label: 'Detection Time',     value: '6 minutes',      icon: Clock },
              { label: 'Average Confidence', value: '87%',            icon: Shield },
              { label: 'Prediction Accuracy',value: 'Gate B (Correct)', icon: CheckCircle },
              { label: 'Cameras Searched',   value: '6',              icon: Camera },
            ].map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                style={{
                  background: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: 8,
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <Icon size={18} style={{ color: 'var(--color-brand-cyan)', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'monospace', color: 'var(--color-text-primary)' }}>{value}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Section 5: Guard Response */}
        <Section title="Guard Response">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[
              { time: '12:08', event: 'Guard 1 Reza dispatched to Gate B', color: '#F59E0B' },
              { time: '12:10', event: 'Guard 1 arrived at Gate B', color: '#06B6D4' },
              { time: '12:13', event: 'Child confirmed found', color: '#10B981' },
            ].map((item, i, arr) => (
              <div key={item.time} style={{ display: 'flex', gap: 12, position: 'relative' }}>
                {i < arr.length - 1 && (
                  <div style={{ position: 'absolute', left: 15, top: 28, width: 1.5, height: 'calc(100% - 4px)', background: 'var(--color-border-subtle)' }} />
                )}
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${item.color}18`, border: `1.5px solid ${item.color}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1 }}>
                  <User size={13} style={{ color: item.color }} />
                </div>
                <div style={{ paddingBottom: 16 }}>
                  <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--color-text-muted)', marginRight: 8 }}>{item.time}</span>
                  <span style={{ fontSize: 13, color: 'var(--color-text-primary)' }}>{item.event}</span>
                </div>
              </div>
            ))}
            <div style={{ marginTop: 4, padding: '8px 12px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 6 }}>
              <span style={{ fontSize: 12, color: 'var(--color-status-online)', fontWeight: 600 }}>
                Total response time: 5 min 12 sec
              </span>
            </div>
          </div>
        </Section>

        {/* Section 6: Outcome */}
        <Section title="Outcome">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '8px 0' }}>
            <div
              style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'rgba(16,185,129,0.15)',
                border: '2px solid rgba(16,185,129,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Check size={28} style={{ color: '#10B981' }} />
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#10B981' }}>Child Recovered</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, width: '100%', marginTop: 8 }}>
              {[
                ['Recovery Location', 'Gate B Parking Level 1'],
                ['Recovery Time',     '12:13 PM'],
                ['Reunited With',     'Parent/guardian on-site'],
              ].map(([label, value]) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-primary)' }}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Section 7: Privacy Compliance */}
        <Section title="Privacy Compliance">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Temporary embeddings', status: 'DELETED (immediately after case closure)' },
              { label: 'Child photo',          status: 'Scheduled deletion in 24 hours' },
              { label: 'Audit log',            status: 'Retained per venue policy' },
            ].map((row) => (
              <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <CheckCircle size={15} style={{ color: 'var(--color-status-online)', flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: 'var(--color-text-secondary)', minWidth: 160 }}>{row.label}:</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}>{row.status}</span>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 14,
              padding: '10px 14px',
              background: 'rgba(139,92,246,0.08)',
              border: '1px solid rgba(139,92,246,0.25)',
              borderLeft: '3px solid #8B5CF6',
              borderRadius: 6,
            }}
          >
            <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              SpotJr uses temporary embeddings only. No permanent child identity database is maintained.
            </p>
          </div>
        </Section>
      </div>
    </div>
  )
}

// ── List view ─────────────────────────────────────────────────────────────────
type FilterMode = 'all' | 'resolved' | 'active'

const INCIDENTS = [
  {
    caseId: 'A-001',
    date: 'June 14 2026',
    child: 'Female 7yr pink shirt',
    risk: 'HIGH' as const,
    responseTime: '5m 12s',
    outcome: 'Found' as const,
    confidence: '89%',
  },
  {
    caseId: 'A-002',
    date: 'June 14 2026',
    child: 'Male 5yr blue jacket',
    risk: 'MEDIUM' as const,
    responseTime: 'Ongoing',
    outcome: 'Active' as const,
    confidence: '72%',
  },
]

function ListView({
  filter,
  setFilter,
  onViewReport,
}: {
  filter: FilterMode
  setFilter: (f: FilterMode) => void
  onViewReport: () => void
}) {
  const FILTERS: { label: string; value: FilterMode }[] = [
    { label: 'All', value: 'all' },
    { label: 'Resolved', value: 'resolved' },
    { label: 'Active', value: 'active' },
  ]

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <FileText size={20} style={{ color: 'var(--color-brand-cyan)' }} />
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>
            Incident Reports
          </h1>
        </div>
        <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: 0 }}>
          Resolved and active case records
        </p>
      </div>

      {/* Filter row */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        {FILTERS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            style={{
              padding: '6px 16px',
              borderRadius: 6,
              border: `1px solid ${filter === value ? 'rgba(6,182,212,0.5)' : 'var(--color-border-default)'}`,
              background: filter === value ? 'rgba(6,182,212,0.1)' : 'transparent',
              color: filter === value ? 'var(--color-brand-cyan)' : 'var(--color-text-secondary)',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div
        style={{
          background: 'var(--color-bg-elevated)',
          border: '1px solid var(--color-border-subtle)',
          borderRadius: 8,
          overflow: 'hidden',
        }}
      >
        {/* Table header */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '80px 100px 1fr 80px 90px 90px 80px 100px',
            gap: 0,
            background: 'var(--color-bg-surface)',
            borderBottom: '1px solid var(--color-border-subtle)',
          }}
        >
          {['Case ID', 'Date', 'Child', 'Risk', 'Response', 'Outcome', 'Conf.', 'Actions'].map((col) => (
            <div key={col} style={{ padding: '10px 12px', fontSize: 10, fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {col}
            </div>
          ))}
        </div>

        {/* Table rows */}
        {INCIDENTS.map((row, i) => (
          <div
            key={row.caseId}
            style={{
              display: 'grid',
              gridTemplateColumns: '80px 100px 1fr 80px 90px 90px 80px 100px',
              alignItems: 'center',
              borderTop: i > 0 ? '1px solid var(--color-border-subtle)' : 'none',
            }}
          >
            <div style={{ padding: '12px 12px', fontSize: 12, fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-brand-cyan)' }}>
              {row.caseId}
            </div>
            <div style={{ padding: '12px 12px', fontSize: 11, color: 'var(--color-text-secondary)' }}>
              {row.date}
            </div>
            <div style={{ padding: '12px 12px', fontSize: 12, color: 'var(--color-text-primary)' }}>
              {row.child}
            </div>
            <div style={{ padding: '12px 12px' }}>
              <RiskBadge level={row.risk} />
            </div>
            <div style={{ padding: '12px 12px', fontSize: 12, fontFamily: 'monospace', color: 'var(--color-text-secondary)' }}>
              {row.responseTime}
            </div>
            <div style={{ padding: '12px 12px' }}>
              <StatusBadge
                label={row.outcome}
                color={row.outcome === 'Found' ? 'green' : 'amber'}
              />
            </div>
            <div style={{ padding: '12px 12px', fontSize: 12, fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-text-secondary)' }}>
              {row.confidence}
            </div>
            <div style={{ padding: '12px 12px' }}>
              <button
                onClick={onViewReport}
                style={{
                  padding: '5px 12px',
                  borderRadius: 5,
                  border: '1px solid var(--color-border-default)',
                  background: 'transparent',
                  color: 'var(--color-text-secondary)',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <FileText size={11} /> View Report
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function IncidentsPage() {
  const [view, setView] = useState<'list' | 'detail'>('list')
  const [filter, setFilter] = useState<FilterMode>('all')
  const [toast, setToast] = useState<string | null>(null)

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: 'var(--color-bg-base)' }}>
      {view === 'list' ? (
        <ListView filter={filter} setFilter={setFilter} onViewReport={() => setView('detail')} />
      ) : (
        <ReportDetailView
          onBack={() => setView('list')}
          onExport={() => showToast('PDF export available in production deployment')}
        />
      )}
      {toast && <Toast message={toast} />}
    </div>
  )
}
