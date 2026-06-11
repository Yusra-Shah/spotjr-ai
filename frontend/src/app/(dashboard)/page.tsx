import MallDigitalTwin from '@/components/map/MallDigitalTwin'
import ActiveCasePanel from '@/components/case/ActiveCasePanel'
import CCTVGrid from '@/components/cctv/CCTVGrid'
import AIReasoningTimeline from '@/components/ai/AIReasoningTimeline'
import SystemHealthMonitor from '@/components/layout/SystemHealthMonitor'
import { mockCase, mockCameras, mockTimeline } from '@/lib/mock-data'

export default function CommandCenterPage() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        background: 'var(--color-bg-base)',
      }}
    >
      {/* ── Main Content Row ── */}
      <div
        style={{
          display: 'flex',
          flex: 1,
          overflow: 'hidden',
          minHeight: 0,
        }}
      >
        {/* Left: CCTV Grid (320px) */}
        <CCTVGrid cameras={mockCameras} activeCase={mockCase} />

        {/* Center: Mall Digital Twin (fills remaining space) */}
        <div
          style={{
            flex: 1,
            overflow: 'hidden',
            position: 'relative',
            background: 'var(--color-bg-base)',
          }}
        >
          <MallDigitalTwin />
        </div>

        {/* Right: Active Case Intelligence (380px) */}
        <ActiveCasePanel activeCase={mockCase} />
      </div>

      {/* ── Bottom Strip (160px) ── */}
      <div
        style={{
          height: 160,
          flexShrink: 0,
          display: 'flex',
          borderTop: '1px solid var(--color-border-subtle)',
          overflow: 'hidden',
        }}
      >
        {/* AI Timeline: 60% */}
        <div style={{ flex: '0 0 60%', overflow: 'hidden' }}>
          <AIReasoningTimeline events={mockTimeline} />
        </div>

        {/* System Health: 40% */}
        <div style={{ flex: '0 0 40%', overflow: 'hidden' }}>
          <SystemHealthMonitor />
        </div>
      </div>
    </div>
  )
}
