'use client'

import { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, CheckCircle, Camera, Shield, Wifi, X, Bell } from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────
export type AlertSeverity = 'critical' | 'warning' | 'success' | 'info'

export interface SpotAlert {
  id: string
  severity: AlertSeverity
  title: string
  body: string
  caseId?: string
  autoClose?: number   // ms — omit for persistent
  timestamp: Date
}

interface AlertContextValue {
  alerts: SpotAlert[]
  push: (a: Omit<SpotAlert, 'id' | 'timestamp'>) => void
  dismiss: (id: string) => void
}

// ── Context ───────────────────────────────────────────────────────────────────
const AlertCtx = createContext<AlertContextValue>({
  alerts: [],
  push: () => {},
  dismiss: () => {},
})

export function useAlerts() { return useContext(AlertCtx) }

// ── Provider ──────────────────────────────────────────────────────────────────
export function AlertProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<SpotAlert[]>([])
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const dismiss = useCallback((id: string) => {
    const t = timers.current.get(id)
    if (t) clearTimeout(t)
    timers.current.delete(id)
    setAlerts(prev => prev.filter(a => a.id !== id))
  }, [])

  const push = useCallback((a: Omit<SpotAlert, 'id' | 'timestamp'>) => {
    const id = `alert-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    const alert: SpotAlert = { ...a, id, timestamp: new Date() }
    setAlerts(prev => [alert, ...prev].slice(0, 5))

    if (a.autoClose) {
      const t = setTimeout(() => dismiss(id), a.autoClose)
      timers.current.set(id, t)
    }
  }, [dismiss])

  useEffect(() => {
    return () => timers.current.forEach(t => clearTimeout(t))
  }, [])

  return (
    <AlertCtx.Provider value={{ alerts, push, dismiss }}>
      {children}
      <AlertStack alerts={alerts} onDismiss={dismiss} />
    </AlertCtx.Provider>
  )
}

// ── Alert Stack UI ─────────────────────────────────────────────────────────────
const SEVERITY_CONFIG: Record<AlertSeverity, {
  icon: React.ElementType
  border: string
  background: string
  iconColor: string
  titleColor: string
  glow: string
}> = {
  critical: {
    icon: AlertTriangle,
    border: 'rgba(239,68,68,0.5)',
    background: 'linear-gradient(135deg, rgba(239,68,68,0.1) 0%, rgba(17,24,39,0.95) 60%)',
    iconColor: '#EF4444',
    titleColor: '#FCA5A5',
    glow: '0 0 20px rgba(239,68,68,0.25)',
  },
  warning: {
    icon: AlertTriangle,
    border: 'rgba(245,158,11,0.45)',
    background: 'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(17,24,39,0.95) 60%)',
    iconColor: '#F59E0B',
    titleColor: '#FDE68A',
    glow: '0 0 16px rgba(245,158,11,0.2)',
  },
  success: {
    icon: CheckCircle,
    border: 'rgba(16,185,129,0.4)',
    background: 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(17,24,39,0.95) 60%)',
    iconColor: '#10B981',
    titleColor: '#6EE7B7',
    glow: '0 0 14px rgba(16,185,129,0.18)',
  },
  info: {
    icon: Bell,
    border: 'rgba(6,182,212,0.35)',
    background: 'linear-gradient(135deg, rgba(6,182,212,0.07) 0%, rgba(17,24,39,0.95) 60%)',
    iconColor: '#06B6D4',
    titleColor: '#67E8F9',
    glow: '0 0 12px rgba(6,182,212,0.15)',
  },
}

function AlertToast({ alert, onDismiss }: { alert: SpotAlert; onDismiss: (id: string) => void }) {
  const cfg = SEVERITY_CONFIG[alert.severity]
  const Icon = cfg.icon
  const isCritical = alert.severity === 'critical'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80, scale: 0.92 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      style={{
        width: 340,
        borderRadius: 10,
        background: cfg.background,
        border: `1px solid ${cfg.border}`,
        borderLeft: `3px solid ${cfg.iconColor}`,
        boxShadow: `${cfg.glow}, 0 8px 24px rgba(0,0,0,0.4)`,
        overflow: 'hidden',
        position: 'relative',
        backdropFilter: 'blur(16px)',
      }}
    >
      {/* Pulsing left border for critical */}
      {isCritical && (
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
          background: '#EF4444',
          animation: 'critBorderPulse 1.4s ease-in-out infinite',
        }} />
      )}

      <div style={{ padding: '12px 12px 12px 14px', display: 'flex', gap: 10 }}>
        {/* Icon */}
        <div style={{
          width: 32, height: 32, borderRadius: 8, flexShrink: 0,
          background: `${cfg.iconColor}18`,
          border: `1px solid ${cfg.iconColor}44`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={15} style={{ color: cfg.iconColor }} />
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: cfg.titleColor, marginBottom: 3 }}>
            {alert.title}
          </div>
          <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
            {alert.body}
          </div>
          <div style={{ fontSize: 9, color: 'var(--color-text-muted)', marginTop: 5, fontFamily: 'monospace' }}>
            {alert.timestamp.toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
            {alert.caseId && ` · ${alert.caseId}`}
          </div>
        </div>

        {/* Dismiss */}
        <button
          onClick={() => onDismiss(alert.id)}
          style={{
            width: 20, height: 20, borderRadius: 4, flexShrink: 0,
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            alignSelf: 'flex-start', marginTop: 2,
          }}
        >
          <X size={12} />
        </button>
      </div>

      {/* Auto-close progress bar */}
      {alert.autoClose && (
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: alert.autoClose / 1000, ease: 'linear' }}
          style={{ height: 2, background: cfg.iconColor, opacity: 0.5 }}
        />
      )}
    </motion.div>
  )
}

function AlertStack({ alerts, onDismiss }: { alerts: SpotAlert[]; onDismiss: (id: string) => void }) {
  if (!alerts.length) return null
  return (
    <div
      style={{
        position: 'fixed', bottom: 20, right: 20, zIndex: 9999,
        display: 'flex', flexDirection: 'column', gap: 8,
        pointerEvents: 'none',
      }}
    >
      <AnimatePresence mode="popLayout">
        {alerts.slice(0, 4).map(a => (
          <div key={a.id} style={{ pointerEvents: 'auto' }}>
            <AlertToast alert={a} onDismiss={onDismiss} />
          </div>
        ))}
      </AnimatePresence>
      {alerts.length > 4 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            alignSelf: 'flex-end', fontSize: 10, fontFamily: 'monospace',
            color: 'var(--color-text-muted)', background: 'var(--color-bg-elevated)',
            padding: '3px 8px', borderRadius: 4, border: '1px solid var(--color-border-default)',
          }}
        >
          +{alerts.length - 4} more
        </motion.div>
      )}
    </div>
  )
}

// ── Demo trigger button (for showcase) ────────────────────────────────────────
export function AlertDemoButton() {
  const { push } = useAlerts()

  const DEMOS = [
    {
      severity: 'critical' as AlertSeverity,
      title: '⚠ RISK ESCALATED — HIGH',
      body: 'Child near Gate B exit. Risk score 85/100. Guard dispatch recommended.',
      caseId: 'CASE-A-001',
    },
    {
      severity: 'warning' as AlertSeverity,
      title: 'Match Found — CAM-03',
      body: 'AI detected possible match at Food Court East. Confidence: 94%. Review evidence.',
      caseId: 'CASE-A-001',
      autoClose: 6000,
    },
    {
      severity: 'success' as AlertSeverity,
      title: 'Child Recovered',
      body: 'Guard Reza confirmed child found at Gate B. Case CASE-A-001 closed. Response: 5m 12s.',
      caseId: 'CASE-A-001',
      autoClose: 8000,
    },
    {
      severity: 'info' as AlertSeverity,
      title: 'Camera 7 Offline',
      body: 'CAM-07 (Parking Entrance) lost connection. AI scanning paused on that feed.',
      autoClose: 5000,
    },
  ] as const

  let demoIdx = 0

  return (
    <button
      onClick={() => { push(DEMOS[demoIdx % DEMOS.length]); demoIdx++ }}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '6px 12px', borderRadius: 6, cursor: 'pointer',
        background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.35)',
        color: '#8B5CF6', fontSize: 12, fontWeight: 600,
      }}
    >
      <Bell size={12} /> Test Alert
    </button>
  )
}
