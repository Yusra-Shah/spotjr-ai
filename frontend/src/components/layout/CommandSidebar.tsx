'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, FolderOpen, Video, Send, FileText,
  Settings, Wifi, Map, Clock, Camera, ChevronRight,
} from 'lucide-react'
import { AlertDemoButton } from '@/components/system/AlertSystem'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  section?: string
  sub?: { label: string; href: string; icon: React.ElementType }[]
}

const navItems: NavItem[] = [
  { label: 'Dashboard',   href: '/dashboard',    icon: LayoutDashboard, section: 'OPERATIONS' },
  {
    label: 'Cases',       href: '/cases',        icon: FolderOpen,
    sub: [
      { label: 'AI Timeline', href: '/cases/CASE-A-001/timeline', icon: Clock  },
      { label: 'Map View',    href: '/cases/CASE-A-001/map',      icon: Map    },
    ],
  },
  {
    label: 'CCTV Wall',   href: '/cctv',         icon: Video, section: 'SURVEILLANCE',
    sub: [
      { label: 'CAM-06 (Active)', href: '/cctv/cam-06', icon: Camera },
    ],
  },
  { label: 'Dispatch',    href: '/dispatch',     icon: Send,      section: 'RESPONSE'    },
  { label: 'Reports',     href: '/incidents',    icon: FileText,  section: 'RECORDS'     },
  { label: 'Integration', href: '/integration',  icon: Wifi,      section: 'SYSTEM'      },
  { label: 'Settings',    href: '/settings',     icon: Settings   },
]

export default function CommandSidebar() {
  const pathname = usePathname()

  function isActive(href: string): boolean {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  let lastSection = ''

  return (
    <aside
      style={{
        width: 220,
        background: 'var(--color-bg-surface)',
        borderRight: '1px solid var(--color-border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        overflowY: 'auto',
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: '20px 20px 16px',
          borderBottom: '1px solid var(--color-border-subtle)',
        }}
      >
        <div className="flex items-center gap-2">
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: 'linear-gradient(135deg, var(--color-brand-cyan) 0%, var(--color-ai-primary) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 13, lineHeight: 1 }}>S</span>
          </div>
          <div>
            <div style={{ color: 'var(--color-text-primary)', fontWeight: 700, fontSize: 15, lineHeight: 1 }}>
              SpotJr
            </div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: 10, letterSpacing: '0.08em', marginTop: 2 }}>
              COMMAND CENTER
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '12px 8px', flex: 1 }}>
        {navItems.map((item) => {
          const showSection = item.section && item.section !== lastSection
          if (item.section) lastSection = item.section

          const active = isActive(item.href)
          const Icon = item.icon

          return (
            <div key={item.href}>
              {showSection && (
                <div style={{ color: 'var(--color-text-muted)', fontSize: 10, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', padding: '12px 12px 4px' }}>
                  {item.section}
                </div>
              )}
              <Link
                href={item.href}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 12px', borderRadius: 6, marginBottom: 2,
                  textDecoration: 'none',
                  background: active ? 'rgba(6,182,212,0.08)' : 'transparent',
                  border: active ? '1px solid rgba(6,182,212,0.2)' : '1px solid transparent',
                  color: active ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                  fontSize: 13, fontWeight: active ? 600 : 400,
                  transition: 'all 150ms',
                }}
              >
                <Icon size={16} style={{ color: active ? 'var(--color-brand-cyan)' : 'var(--color-text-secondary)', flexShrink: 0 }} />
                {item.label}
              </Link>
              {/* Sub-items — shown when parent is active */}
              {active && item.sub && (
                <div style={{ marginLeft: 28, marginBottom: 4 }}>
                  {item.sub.map(sub => {
                    const SubIcon = sub.icon
                    const subActive = pathname === sub.href
                    return (
                      <Link key={sub.href} href={sub.href} style={{
                        display: 'flex', alignItems: 'center', gap: 7,
                        padding: '5px 10px', borderRadius: 5, marginBottom: 1,
                        textDecoration: 'none',
                        background: subActive ? 'rgba(139,92,246,0.12)' : 'transparent',
                        border: subActive ? '1px solid rgba(139,92,246,0.25)' : '1px solid transparent',
                        color: subActive ? '#8B5CF6' : 'var(--color-text-muted)',
                        fontSize: 11, fontWeight: subActive ? 600 : 400,
                        transition: 'all 120ms',
                      }}>
                        <SubIcon size={12} style={{ flexShrink: 0 }} />
                        {sub.label}
                        <ChevronRight size={10} style={{ marginLeft: 'auto', opacity: 0.5 }} />
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '10px 12px', borderTop: '1px solid var(--color-border-subtle)' }}>
        {/* Alert demo button */}
        <div style={{ marginBottom: 8 }}>
          <AlertDemoButton />
        </div>
        {/* Azure AI Foundry badge */}
        <div style={{ padding: '7px 10px', borderRadius: 6, background: 'rgba(0,120,212,0.08)', border: '1px solid rgba(0,120,212,0.2)', marginBottom: 8 }}>
          <div style={{ fontSize: 9, fontFamily: 'monospace', fontWeight: 700, color: '#0078D4', letterSpacing: '0.08em', marginBottom: 2 }}>AZURE AI FOUNDRY</div>
          <div style={{ fontSize: 9, color: 'var(--color-text-muted)' }}>Coordinator Agent active</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-muted)', fontSize: 11 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-status-online)', display: 'inline-block', flexShrink: 0 }} />
          System Online
        </div>
      </div>
    </aside>
  )
}
