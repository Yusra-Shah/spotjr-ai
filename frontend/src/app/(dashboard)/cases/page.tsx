import Link from 'next/link'
import { FolderOpen, Plus } from 'lucide-react'
import { mockCase } from '@/lib/mock-data'
import RiskBadge from '@/components/ui/RiskBadge'

export default function CasesPage() {
  const cases = [mockCase]

  return (
    <div style={{ padding: 32 }}>
      <div className="flex items-center justify-between" style={{ marginBottom: 24 }}>
        <div className="flex items-center gap-3">
          <FolderOpen size={20} style={{ color: 'var(--color-brand-cyan)' }} />
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>
            Active Cases
          </h1>
        </div>
        <Link
          href="/cases/new"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'var(--gradient-btn-primary)',
            color: '#fff',
            fontSize: 13,
            fontWeight: 600,
            padding: '8px 16px',
            borderRadius: 6,
            textDecoration: 'none',
          }}
        >
          <Plus size={14} />
          New Case
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {cases.map((c) => (
          <Link
            key={c.id}
            href={`/cases/${c.id}`}
            style={{ textDecoration: 'none' }}
          >
            <div
              className="card"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                cursor: 'pointer',
                transition: 'border-color 150ms',
              }}
            >
              <div style={{ flex: 1 }}>
                <div className="flex items-center gap-2" style={{ marginBottom: 4 }}>
                  <span style={{ color: 'var(--color-text-muted)', fontFamily: 'monospace', fontSize: 11 }}>
                    #{c.id}
                  </span>
                  <RiskBadge level={c.riskLevel} />
                </div>
                <div style={{ color: 'var(--color-text-primary)', fontWeight: 600, fontSize: 14 }}>
                  {c.childAlias} — Age ~{c.childAge}
                </div>
                <div style={{ color: 'var(--color-text-secondary)', fontSize: 12, marginTop: 2 }}>
                  {c.clothingDescription}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ color: 'var(--color-text-secondary)', fontSize: 12 }}>
                  Last seen: {c.lastSeenZone}
                </div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: 11, marginTop: 2 }}>
                  Confidence: {c.matchConfidence}%
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
