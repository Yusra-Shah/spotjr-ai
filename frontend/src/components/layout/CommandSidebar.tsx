'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FolderOpen,
  Video,
  Send,
  FileText,
  Settings,
  Wifi,
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  section?: string
}

const navItems: NavItem[] = [
  { label: 'Dashboard',  href: '/',          icon: LayoutDashboard, section: 'OPERATIONS' },
  { label: 'Cases',      href: '/cases',     icon: FolderOpen },
  { label: 'CCTV Wall',  href: '/cctv',      icon: Video,           section: 'SURVEILLANCE' },
  { label: 'Dispatch',   href: '/dispatch',  icon: Send,            section: 'RESPONSE' },
  { label: 'Reports',    href: '/incidents', icon: FileText,        section: 'RECORDS' },
  { label: 'Integration',href: '/integration',icon: Wifi,           section: 'SYSTEM' },
  { label: 'Settings',   href: '/settings',  icon: Settings },
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
                <div
                  style={{
                    color: 'var(--color-text-muted)',
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    padding: '12px 12px 4px',
                  }}
                >
                  {item.section}
                </div>
              )}
              <Link
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 12px',
                  borderRadius: 6,
                  marginBottom: 2,
                  textDecoration: 'none',
                  background: active ? 'rgba(6, 182, 212, 0.08)' : 'transparent',
                  border: active ? '1px solid rgba(6, 182, 212, 0.2)' : '1px solid transparent',
                  color: active ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                  fontSize: 13,
                  fontWeight: active ? 600 : 400,
                  transition: 'all 150ms var(--ease-standard)',
                }}
              >
                <Icon
                  size={16}
                  style={{
                    color: active ? 'var(--color-brand-cyan)' : 'var(--color-text-secondary)',
                    flexShrink: 0,
                  }}
                />
                {item.label}
              </Link>
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div
        style={{
          padding: '12px 20px',
          borderTop: '1px solid var(--color-border-subtle)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            color: 'var(--color-text-muted)',
            fontSize: 11,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'var(--color-status-online)',
              display: 'inline-block',
              flexShrink: 0,
            }}
          />
          System Online
        </div>
      </div>
    </aside>
  )
}
