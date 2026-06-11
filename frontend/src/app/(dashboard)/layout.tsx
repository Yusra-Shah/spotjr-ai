import GlobalEmergencyBar from '@/components/layout/GlobalEmergencyBar'
import CommandSidebar from '@/components/layout/CommandSidebar'
import { mockCase } from '@/lib/mock-data'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
        background: 'var(--color-bg-base)',
      }}
    >
      <GlobalEmergencyBar activeCase={mockCase} />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <CommandSidebar />

        <main
          style={{
            flex: 1,
            overflow: 'auto',
            background: 'var(--color-bg-base)',
          }}
        >
          {children}
        </main>
      </div>
    </div>
  )
}
