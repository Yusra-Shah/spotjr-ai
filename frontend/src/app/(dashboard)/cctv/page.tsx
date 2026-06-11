import { Video } from 'lucide-react'
import { mockCameras } from '@/lib/mock-data'
import CameraFeedCard from '@/components/case/CameraFeedCard'

export default function CCTVPage() {
  return (
    <div style={{ padding: 32 }}>
      <div className="flex items-center justify-between" style={{ marginBottom: 24 }}>
        <div className="flex items-center gap-3">
          <Video size={20} style={{ color: 'var(--color-brand-cyan)' }} />
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>
            CCTV Wall
          </h1>
        </div>
        <div style={{ color: 'var(--color-text-secondary)', fontSize: 12 }}>
          {mockCameras.length} cameras · {mockCameras.filter(c => c.status !== 'offline').length} online
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 12,
        }}
      >
        {mockCameras.map((camera) => (
          <CameraFeedCard key={camera.id} camera={camera} />
        ))}
      </div>
    </div>
  )
}
