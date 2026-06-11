import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { mockCase, mockTimeline } from '@/lib/mock-data'
import RiskBadge from '@/components/ui/RiskBadge'

export default function CaseDetailPage({ params }: { params: { id: string } }) {
  const activeCase = mockCase

  return (
    <div style={{ padding: 32 }}>
      <Link
        href="/cases"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          color: 'var(--color-text-secondary)',
          textDecoration: 'none',
          fontSize: 13,
          marginBottom: 20,
        }}
      >
        <ArrowLeft size={14} /> All Cases
      </Link>

      {/* Case Header */}
      <div
        className="card"
        style={{ marginBottom: 20, borderLeft: '3px solid var(--color-risk-critical)' }}
      >
        <div className="flex items-center gap-4 flex-wrap">
          <span style={{ color: 'var(--color-text-muted)', fontFamily: 'monospace', fontSize: 11 }}>
            #{params.id}
          </span>
          <span style={{ color: 'var(--color-text-primary)', fontWeight: 700, fontSize: 16 }}>
            {activeCase.childAlias}
          </span>
          <span style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}>
            Age ~{activeCase.childAge}
          </span>
          <RiskBadge level={activeCase.riskLevel} score={activeCase.riskScore} />
          <span style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}>
            {activeCase.clothingDescription}
          </span>
          <span style={{ marginLeft: 'auto', color: 'var(--color-text-secondary)', fontSize: 12 }}>
            Confidence: {activeCase.matchConfidence}%
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        {/* Timeline */}
        <div className="card">
          <h2 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-secondary)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 16px' }}>
            AI Investigation Timeline
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {mockTimeline.map((event, i) => (
              <div key={event.id} style={{ display: 'flex', gap: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: event.type === 'risk_change' ? 'var(--color-risk-critical)'
                        : event.type === 'guard_dispatched' ? 'var(--color-status-online)'
                        : event.type === 'detection' ? 'var(--color-risk-medium)'
                        : 'var(--color-brand-cyan)',
                      flexShrink: 0,
                      marginTop: 4,
                    }}
                  />
                  {i < mockTimeline.length - 1 && (
                    <div style={{ width: 1, flex: 1, background: 'var(--color-border-subtle)', minHeight: 24 }} />
                  )}
                </div>
                <div style={{ paddingBottom: 16 }}>
                  <div className="flex items-center gap-2" style={{ marginBottom: 2 }}>
                    <span style={{ color: 'var(--color-text-primary)', fontWeight: 600, fontSize: 13 }}>
                      {event.title}
                    </span>
                    {event.confidence && (
                      <span style={{ color: 'var(--color-risk-medium)', fontSize: 11, fontFamily: 'monospace' }}>
                        {event.confidence}%
                      </span>
                    )}
                  </div>
                  <div style={{ color: 'var(--color-text-secondary)', fontSize: 12, lineHeight: 1.5 }}>
                    {event.description}
                  </div>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: 11, fontFamily: 'monospace', marginTop: 3 }}>
                    {new Date(event.timestamp).toLocaleTimeString()}
                    {event.cameraId && ` · ${event.cameraId}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Intelligence panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
              Risk Score
            </div>
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <div
                style={{
                  fontSize: 48,
                  fontWeight: 800,
                  fontFamily: 'monospace',
                  color: 'var(--color-risk-critical)',
                  lineHeight: 1,
                }}
              >
                {activeCase.riskScore}
              </div>
              <div style={{ color: 'var(--color-risk-critical)', fontWeight: 700, fontSize: 12, letterSpacing: '0.1em', marginTop: 4 }}>
                {activeCase.riskLevel.toUpperCase()}
              </div>
            </div>
          </div>

          <div className="card ai-block">
            <div style={{ fontSize: 11, color: 'var(--color-ai-primary)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
              AI Reasoning
            </div>
            <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Child detected near exit corridor. Moving toward Gate B. No adult accompaniment for 14+ minutes.
              Risk increasing due to exit proximity.
            </p>
          </div>

          <div className="card">
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
              Quick Actions
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button
                style={{
                  background: 'var(--gradient-btn-primary)',
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 600,
                  padding: '10px',
                  borderRadius: 6,
                  border: 'none',
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                Dispatch Guard
              </button>
              <button
                style={{
                  background: 'var(--gradient-btn-success)',
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 600,
                  padding: '10px',
                  borderRadius: 6,
                  border: 'none',
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                Mark as Found
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
