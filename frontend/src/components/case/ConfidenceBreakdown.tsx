'use client'

import { motion } from 'framer-motion'

export interface ConfidenceSignal {
  label: string
  value: number        // 0-100
  weight?: number      // contribution weight, used for bar sizing
  confirmed?: boolean
  icon?: string
}

interface Props {
  signals: ConfidenceSignal[]
  overall: number
  cameraId?: string
  azureModel?: string
  showOverall?: boolean
}

function barColor(v: number): string {
  if (v >= 85) return '#10B981'
  if (v >= 65) return '#F59E0B'
  if (v >= 40) return '#F97316'
  return '#EF4444'
}

export default function ConfidenceBreakdown({ signals, overall, cameraId, azureModel, showOverall = true }: Props) {
  return (
    <div>
      {(cameraId || azureModel) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          {cameraId && (
            <span style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 700, color: '#06B6D4', letterSpacing: '0.06em' }}>
              {cameraId}
            </span>
          )}
          {azureModel && (
            <span style={{ fontSize: 9, fontFamily: 'monospace', color: '#0078D4', padding: '1px 6px', borderRadius: 3, background: 'rgba(0,120,212,0.12)', border: '1px solid rgba(0,120,212,0.25)' }}>
              {azureModel}
            </span>
          )}
        </div>
      )}

      {signals.map((sig, i) => {
        const isUnconfirmed = !sig.confirmed && sig.value === 0
        const color = isUnconfirmed ? 'var(--color-text-muted)' : barColor(sig.value)
        return (
          <div key={sig.label} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{ fontSize: 11, color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: 5 }}>
                {sig.label}
              </span>
              <span style={{
                fontSize: 11, fontFamily: 'monospace', fontWeight: 700,
                color: isUnconfirmed ? 'var(--color-text-muted)' : color,
              }}>
                {isUnconfirmed ? '—' : `${sig.value}%`}
              </span>
            </div>
            <div style={{ height: 5, borderRadius: 99, background: 'var(--color-border-subtle)', overflow: 'hidden' }}>
              {!isUnconfirmed && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${sig.value}%` }}
                  transition={{ duration: 0.7, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] }}
                  style={{ height: '100%', borderRadius: 99, background: color }}
                />
              )}
            </div>
          </div>
        )
      })}

      {showOverall && (
        <div style={{
          marginTop: 12, paddingTop: 10,
          borderTop: '1px solid var(--color-border-subtle)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Overall confidence</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ fontSize: 20, fontFamily: 'monospace', fontWeight: 800, color: barColor(overall) }}>
              {overall}
            </span>
            <span style={{ fontSize: 12, fontFamily: 'monospace', color: barColor(overall) }}>%</span>
          </div>
        </div>
      )}
    </div>
  )
}
