'use client'

import { motion } from 'framer-motion'
import { Camera, ChevronRight, Link2, CheckCircle } from 'lucide-react'

export interface ReIDNode {
  cameraId: string
  zoneName: string
  timestamp: string
  confidence: number
  reIdConfidence?: number  // same-person link confidence FROM previous node
}

interface Props {
  nodes: ReIDNode[]
  overallConfidence?: number
  showAzureBadge?: boolean
}

function confidenceColor(v: number): string {
  if (v >= 85) return '#10B981'
  if (v >= 70) return '#F59E0B'
  return '#EF4444'
}

export default function ReIDChainVisualizer({ nodes, overallConfidence, showAzureBadge = true }: Props) {
  if (!nodes.length) return null

  return (
    <div style={{
      padding: '14px 16px',
      background: 'rgba(139,92,246,0.06)',
      borderRadius: 10,
      border: '1px solid rgba(139,92,246,0.2)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <Link2 size={13} style={{ color: 'var(--color-ai-primary)' }} />
          <span style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-ai-primary)', letterSpacing: '0.08em' }}>
            RE-IDENTIFICATION CHAIN
          </span>
        </div>
        {showAzureBadge && (
          <span style={{
            fontSize: 9, fontFamily: 'monospace', color: '#0078D4',
            padding: '2px 7px', borderRadius: 3,
            background: 'rgba(0,120,212,0.12)', border: '1px solid rgba(0,120,212,0.25)',
          }}>
            Azure ML · Torchreid OSNet
          </span>
        )}
      </div>

      {/* Chain nodes */}
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', rowGap: 10 }}>
        {nodes.map((node, i) => (
          <div key={node.cameraId} style={{ display: 'flex', alignItems: 'center' }}>
            {/* Node card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.12 }}
              style={{
                padding: '8px 12px',
                background: 'rgba(6,182,212,0.08)',
                border: `1.5px solid rgba(6,182,212,0.3)`,
                borderRadius: 8,
                textAlign: 'center',
                minWidth: 100,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, marginBottom: 4 }}>
                <Camera size={10} style={{ color: '#06B6D4' }} />
                <span style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 800, color: '#06B6D4' }}>
                  {node.cameraId}
                </span>
              </div>
              <div style={{ fontSize: 9, color: 'var(--color-text-muted)', marginBottom: 4, lineHeight: 1.3 }}>
                {node.zoneName}
              </div>
              <div style={{
                fontSize: 15, fontFamily: 'monospace', fontWeight: 800,
                color: confidenceColor(node.confidence),
              }}>
                {node.confidence}%
              </div>
              <div style={{ fontSize: 8, fontFamily: 'monospace', color: 'var(--color-text-muted)', marginTop: 1 }}>
                {node.timestamp}
              </div>
            </motion.div>

            {/* Arrow + re-ID confidence */}
            {i < nodes.length - 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.12 + 0.08 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 8px', gap: 3 }}
              >
                <ChevronRight size={16} style={{ color: 'var(--color-ai-primary)' }} />
                {nodes[i + 1].reIdConfidence !== undefined && (
                  <span style={{
                    fontSize: 8, fontFamily: 'monospace',
                    color: confidenceColor(nodes[i + 1].reIdConfidence!),
                    fontWeight: 700,
                  }}>
                    {nodes[i + 1].reIdConfidence}% same
                  </span>
                )}
              </motion.div>
            )}
          </div>
        ))}

        {/* Overall result */}
        {overallConfidence !== undefined && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: nodes.length * 0.12 }}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <ChevronRight size={16} style={{ color: 'var(--color-text-muted)' }} />
            <div style={{
              padding: '8px 12px',
              background: 'rgba(16,185,129,0.1)',
              border: '1.5px solid rgba(16,185,129,0.35)',
              borderRadius: 8, textAlign: 'center', minWidth: 80,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 3 }}>
                <CheckCircle size={10} style={{ color: '#10B981' }} />
                <span style={{ fontSize: 9, fontFamily: 'monospace', fontWeight: 700, color: '#10B981' }}>OVERALL</span>
              </div>
              <div style={{ fontSize: 17, fontFamily: 'monospace', fontWeight: 800, color: '#10B981' }}>
                {overallConfidence}%
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer explanation */}
      <p style={{ fontSize: 10, color: 'var(--color-text-muted)', margin: '12px 0 0', lineHeight: 1.5 }}>
        Re-identification uses clothing embeddings, height estimation, and gait analysis to confirm the same individual across camera transitions. Percentages show same-person probability between adjacent cameras.
      </p>
    </div>
  )
}
