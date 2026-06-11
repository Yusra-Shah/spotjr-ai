import { Settings } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div style={{ padding: 32 }}>
      <div className="flex items-center gap-3" style={{ marginBottom: 24 }}>
        <Settings size={20} style={{ color: 'var(--color-brand-cyan)' }} />
        <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>
          Settings
        </h1>
      </div>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}>
        Configure venue, operators, alerts, privacy, and Azure integrations.
      </p>
      <div
        style={{
          marginTop: 24,
          padding: 24,
          border: '1px dashed var(--color-border-default)',
          borderRadius: 8,
          color: 'var(--color-text-muted)',
          fontSize: 13,
          textAlign: 'center',
        }}
      >
        Settings panels coming in next build phase.
      </div>
    </div>
  )
}
