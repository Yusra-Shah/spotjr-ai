import { FileText } from 'lucide-react'

export default function IncidentsPage() {
  return (
    <div style={{ padding: 32 }}>
      <div className="flex items-center gap-3" style={{ marginBottom: 24 }}>
        <FileText size={20} style={{ color: 'var(--color-brand-cyan)' }} />
        <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>
          Incident Reports
        </h1>
      </div>

      <div
        style={{
          padding: 48,
          border: '1px dashed var(--color-border-default)',
          borderRadius: 8,
          textAlign: 'center',
        }}
      >
        <FileText size={32} style={{ color: 'var(--color-text-muted)', margin: '0 auto 12px' }} />
        <div style={{ color: 'var(--color-text-secondary)', fontSize: 14, fontWeight: 500 }}>
          No resolved cases yet
        </div>
        <div style={{ color: 'var(--color-text-muted)', fontSize: 12, marginTop: 4 }}>
          Incident reports appear here after cases are closed.
        </div>
      </div>
    </div>
  )
}
