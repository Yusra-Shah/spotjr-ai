import Link from 'next/link'

export default function GuardNavigatePage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg-base)',
        maxWidth: 390,
        margin: '0 auto',
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--color-text-primary)' }}>
        Navigating to Gate B
      </div>
      <div style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}>ETA: 2 min 30 sec · Distance: 190m</div>

      <div
        style={{
          height: 260,
          background: 'var(--color-bg-inset)',
          border: '1px solid var(--color-border-subtle)',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-text-muted)',
          fontSize: 13,
        }}
      >
        [ Indoor Navigation Map ]
      </div>

      <div style={{ fontSize: 16, color: 'var(--color-text-primary)', fontWeight: 600, lineHeight: 1.5 }}>
        ↑ Head straight, then left at the escalator bank
      </div>

      <div
        className="ai-block"
        style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}
      >
        <strong style={{ color: 'var(--color-ai-primary)' }}>Child status update:</strong> Last confirmed 45 sec ago, Camera 8, moving your direction
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Link href="/guard/verify" style={{ textDecoration: 'none' }}>
          <button
            style={{
              width: '100%',
              background: 'var(--gradient-btn-success)',
              color: '#fff',
              fontSize: 16,
              fontWeight: 800,
              padding: '18px',
              borderRadius: 10,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            I&apos;VE ARRIVED
          </button>
        </Link>
        <div className="flex gap-2">
          <button
            style={{
              flex: 1,
              background: 'var(--color-bg-elevated)',
              color: 'var(--color-text-primary)',
              fontSize: 13,
              fontWeight: 600,
              padding: '12px',
              borderRadius: 8,
              border: '1px solid var(--color-border-default)',
              cursor: 'pointer',
            }}
          >
            Update Status
          </button>
          <button
            style={{
              flex: 1,
              background: 'rgba(239, 68, 68, 0.15)',
              color: 'var(--color-risk-critical)',
              fontSize: 13,
              fontWeight: 600,
              padding: '12px',
              borderRadius: 8,
              border: '1px solid rgba(239, 68, 68, 0.3)',
              cursor: 'pointer',
            }}
          >
            SOS
          </button>
        </div>
      </div>
    </div>
  )
}
