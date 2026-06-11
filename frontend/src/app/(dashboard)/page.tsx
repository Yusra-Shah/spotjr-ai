import { LayoutDashboard } from 'lucide-react'

export default function CommandCenterPage() {
  return (
    <div style={{ padding: 32 }}>
      <div className="flex items-center gap-3" style={{ marginBottom: 8 }}>
        <LayoutDashboard size={20} style={{ color: 'var(--color-brand-cyan)' }} />
        <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>
          Command Center
        </h1>
      </div>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: 13, margin: 0 }}>
        Real-time overview of active cases, camera feeds, guard positions, and AI intelligence.
      </p>

      <div
        style={{
          marginTop: 32,
          padding: 24,
          border: '1px dashed var(--color-border-default)',
          borderRadius: 8,
          color: 'var(--color-text-muted)',
          fontSize: 13,
          textAlign: 'center',
        }}
      >
        Dashboard panels coming in next build phase.
      </div>
    </div>
  )
}
