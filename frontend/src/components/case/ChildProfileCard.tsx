'use client'

import { User, Clock, MapPin } from 'lucide-react'

interface ChildProfile {
  alias: string
  age: number
  gender?: string
  photoUrl?: string
  upperClothingColor: string
  upperClothingType: string
  lowerClothingColor?: string
  accessories: string[]
  lastSeenTime: string
  lastSeenZone: string
}

interface Props {
  child: ChildProfile
  size?: 'compact' | 'full'
  showTimestamp?: boolean
  elapsedMs?: number
}

const COLOR_MAP: Record<string, string> = {
  pink: '#F9A8D4', blue: '#93C5FD', red: '#FCA5A5', green: '#86EFAC',
  white: '#F1F5F9', black: '#1E293B', yellow: '#FDE68A', purple: '#C4B5FD',
  orange: '#FDBA74', grey: '#94A3B8',
}

function ElapsedBadge({ ms }: { ms: number }) {
  const mins = Math.floor(ms / 60000)
  const secs = Math.floor((ms % 60000) / 1000)
  const isUrgent = mins >= 10
  return (
    <span style={{
      fontSize: 11, fontFamily: 'monospace', fontWeight: 700,
      color: isUrgent ? '#EF4444' : '#F59E0B',
      padding: '1px 6px', borderRadius: 4,
      background: isUrgent ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)',
      border: `1px solid ${isUrgent ? 'rgba(239,68,68,0.3)' : 'rgba(245,158,11,0.3)'}`,
    }}>
      {mins}m {String(secs).padStart(2, '0')}s
    </span>
  )
}

export default function ChildProfileCard({ child, size = 'full', showTimestamp = true, elapsedMs }: Props) {
  const isCompact = size === 'compact'
  const photoSize = isCompact ? 36 : 72

  const colorDot = (colorName: string) => (
    <div
      key={colorName}
      title={colorName}
      style={{
        width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
        background: COLOR_MAP[colorName.toLowerCase()] ?? '#94A3B8',
        border: '1px solid rgba(255,255,255,0.15)',
      }}
    />
  )

  return (
    <div style={{
      display: 'flex',
      gap: isCompact ? 10 : 14,
      alignItems: isCompact ? 'center' : 'flex-start',
    }}>
      {/* Photo / silhouette */}
      <div style={{
        width: photoSize, height: photoSize, borderRadius: photoSize,
        background: child.photoUrl ? 'transparent' : 'var(--color-bg-inset)',
        border: '2px solid var(--color-border-default)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, overflow: 'hidden',
        position: 'relative',
      }}>
        {child.photoUrl
          ? <img src={child.photoUrl} alt="Child" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <User size={photoSize * 0.45} style={{ color: 'var(--color-text-muted)' }} />
        }
      </div>

      {/* Details */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{
            fontSize: isCompact ? 13 : 15, fontWeight: 700,
            color: 'var(--color-text-primary)',
          }}>
            {child.alias}
          </span>
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
            ~{child.age}yr{child.gender ? ` · ${child.gender}` : ''}
          </span>
          {elapsedMs !== undefined && <ElapsedBadge ms={elapsedMs} />}
        </div>

        {/* Clothing colors */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 5 }}>
          {colorDot(child.upperClothingColor)}
          <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>
            {child.upperClothingType}
          </span>
          {child.lowerClothingColor && (
            <>
              <span style={{ color: 'var(--color-text-muted)', fontSize: 10 }}>·</span>
              {colorDot(child.lowerClothingColor)}
            </>
          )}
        </div>

        {/* Accessories */}
        {!isCompact && child.accessories.length > 0 && (
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 6 }}>
            {child.accessories.map(acc => (
              <span key={acc} style={{
                fontSize: 10, padding: '2px 7px', borderRadius: 99,
                background: 'var(--color-bg-inset)',
                border: '1px solid var(--color-border-default)',
                color: 'var(--color-text-muted)',
              }}>
                {acc}
              </span>
            ))}
          </div>
        )}

        {showTimestamp && (
          <div style={{ display: 'flex', gap: 12, marginTop: 7 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={10} style={{ color: 'var(--color-text-muted)' }} />
              <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>
                {new Date(child.lastSeenTime).toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit', hour12: false })}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <MapPin size={10} style={{ color: 'var(--color-text-muted)' }} />
              <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>{child.lastSeenZone}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
