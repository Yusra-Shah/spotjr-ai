'use client'

import { useState, useEffect } from 'react'
import {
  Settings, Users, Bell, Shield, Eye, CheckCircle, X, Plus, Save,
  type LucideIcon,
} from 'lucide-react'

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ message }: { message: string }) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        background: 'var(--color-bg-elevated)',
        border: '1px solid var(--color-border-default)',
        borderLeft: '3px solid var(--color-status-online)',
        borderRadius: 8,
        padding: '12px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        minWidth: 260,
      }}
    >
      <CheckCircle size={16} style={{ color: 'var(--color-status-online)', flexShrink: 0 }} />
      <span style={{ fontSize: 13, color: 'var(--color-text-primary)' }}>{message}</span>
    </div>
  )
}

// ── Tab button ────────────────────────────────────────────────────────────────
function TabBtn({
  label,
  icon: Icon,
  active,
  onClick,
}: {
  label: string
  icon: LucideIcon
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 7,
        padding: '9px 18px', border: 'none', borderRadius: 0,
        borderBottom: active ? '2px solid var(--color-brand-cyan)' : '2px solid transparent',
        background: 'none',
        color: active ? 'var(--color-brand-cyan)' : 'var(--color-text-secondary)',
        fontSize: 13, fontWeight: active ? 600 : 400,
        cursor: 'pointer', transition: 'all 150ms', whiteSpace: 'nowrap',
      }}
    >
      <Icon size={14} />
      {label}
    </button>
  )
}

// ── Field row ─────────────────────────────────────────────────────────────────
function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</label>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  padding: '9px 12px', borderRadius: 6,
  border: '1px solid var(--color-border-default)',
  background: 'var(--color-bg-surface)',
  color: 'var(--color-text-primary)',
  fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box',
}

const selectStyle = inputStyle

// ── Section card ──────────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-subtle)', borderRadius: 8, overflow: 'hidden' }}>
      <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--color-border-subtle)', background: 'var(--color-bg-surface)' }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{title}</span>
      </div>
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>{children}</div>
    </div>
  )
}

// ── Save button ───────────────────────────────────────────────────────────────
function SaveBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 7,
        padding: '10px 24px', borderRadius: 6,
        border: 'none', background: 'var(--color-brand-blue)',
        color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
        alignSelf: 'flex-start',
      }}
    >
      <Save size={14} /> Save
    </button>
  )
}

// ── Toggle switch ─────────────────────────────────────────────────────────────
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div
      onClick={() => onChange(!checked)}
      style={{
        width: 44, height: 24, borderRadius: 12,
        background: checked ? 'var(--color-status-online)' : 'var(--color-border-default)',
        position: 'relative', cursor: 'pointer', transition: 'background 200ms', flexShrink: 0,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 2, left: checked ? 22 : 2,
          width: 20, height: 20,
          borderRadius: '50%', background: '#fff',
          transition: 'left 200ms',
        }}
      />
    </div>
  )
}

// ── Radio option ──────────────────────────────────────────────────────────────
function RadioOption({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '8px 12px', borderRadius: 6, cursor: 'pointer',
        border: `1px solid ${selected ? 'rgba(6,182,212,0.4)' : 'var(--color-border-subtle)'}`,
        background: selected ? 'rgba(6,182,212,0.06)' : 'transparent',
      }}
    >
      <div
        style={{
          width: 16, height: 16, borderRadius: '50%',
          border: `2px solid ${selected ? 'var(--color-brand-cyan)' : 'var(--color-border-default)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {selected && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-brand-cyan)' }} />}
      </div>
      <span style={{ fontSize: 13, color: selected ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}>{label}</span>
    </div>
  )
}

// ── Tab 1: General ────────────────────────────────────────────────────────────
function GeneralTab({ onSave }: { onSave: () => void }) {
  const [venueName, setVenueName] = useState('Demo Mall')
  const [timezone, setTimezone] = useState('UTC+5 Karachi')
  const [language, setLanguage] = useState('English')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Section title="Venue">
        <FieldRow label="Venue Name">
          <input style={inputStyle} value={venueName} onChange={(e) => setVenueName(e.target.value)} />
        </FieldRow>
        <FieldRow label="Timezone">
          <select style={selectStyle} value={timezone} onChange={(e) => setTimezone(e.target.value)}>
            <option>UTC+5 Karachi</option>
            <option>UTC+0 London</option>
            <option>UTC-5 New York</option>
            <option>UTC+8 Singapore</option>
          </select>
        </FieldRow>
        <FieldRow label="Language">
          <select style={selectStyle} value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option>English</option>
            <option>Malay</option>
            <option>Urdu</option>
          </select>
        </FieldRow>
      </Section>
      <SaveBtn onClick={onSave} />
    </div>
  )
}

// ── Tab 2: Operators ──────────────────────────────────────────────────────────
const INITIAL_OPERATORS = [
  { name: 'Security Operator', role: 'Operator', status: 'Active', lastLogin: 'today' },
  { name: 'Guard Reza',        role: 'Guard',    status: 'Active', lastLogin: 'today' },
  { name: 'Guard Laila',       role: 'Guard',    status: 'Standby', lastLogin: 'today' },
]

function OperatorsTab({ onSave }: { onSave: () => void }) {
  const [operators] = useState(INITIAL_OPERATORS)
  const [showModal, setShowModal] = useState(false)
  const [newName, setNewName] = useState('')
  const [newRole, setNewRole] = useState('Operator')
  const [newPass, setNewPass] = useState('')

  const COL = '1fr 100px 90px 100px 80px'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={() => setShowModal(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 16px', borderRadius: 6,
            border: 'none', background: 'var(--color-brand-blue)',
            color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer',
          }}
        >
          <Plus size={14} /> Add Operator
        </button>
      </div>

      <div style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-subtle)', borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: COL, background: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border-subtle)' }}>
          {['Name', 'Role', 'Status', 'Last Login', 'Actions'].map((h) => (
            <div key={h} style={{ padding: '10px 12px', fontSize: 10, fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</div>
          ))}
        </div>
        {operators.map((op, i) => (
          <div key={op.name} style={{ display: 'grid', gridTemplateColumns: COL, alignItems: 'center', borderTop: i > 0 ? '1px solid var(--color-border-subtle)' : 'none' }}>
            <div style={{ padding: '12px', fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}>{op.name}</div>
            <div style={{ padding: '12px', fontSize: 11, color: 'var(--color-text-secondary)' }}>{op.role}</div>
            <div style={{ padding: '12px' }}>
              <span style={{
                padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 700,
                background: op.status === 'Active' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                border: `1px solid ${op.status === 'Active' ? 'rgba(16,185,129,0.4)' : 'rgba(245,158,11,0.4)'}`,
                color: op.status === 'Active' ? '#10B981' : '#F59E0B',
              }}>{op.status}</span>
            </div>
            <div style={{ padding: '12px', fontSize: 11, color: 'var(--color-text-muted)' }}>{op.lastLogin}</div>
            <div style={{ padding: '12px' }}>
              <button style={{ fontSize: 10, padding: '3px 8px', borderRadius: 4, border: '1px solid var(--color-border-default)', background: 'transparent', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>Edit</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(8,12,24,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-default)', borderRadius: 12, padding: 24, width: 380, boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>Add Operator</h2>
              <button onClick={() => setShowModal(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}><X size={16} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <FieldRow label="Name">
                <input style={inputStyle} value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Full name" />
              </FieldRow>
              <FieldRow label="Role">
                <select style={selectStyle} value={newRole} onChange={(e) => setNewRole(e.target.value)}>
                  <option>Operator</option>
                  <option>Guard</option>
                  <option>Supervisor</option>
                  <option>Admin</option>
                </select>
              </FieldRow>
              <FieldRow label="Password">
                <input style={inputStyle} type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} placeholder="Set initial password" />
              </FieldRow>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '9px 0', borderRadius: 6, border: '1px solid var(--color-border-default)', background: 'transparent', color: 'var(--color-text-secondary)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => { setShowModal(false); onSave() }} style={{ flex: 1, padding: '9px 0', borderRadius: 6, border: 'none', background: 'var(--color-brand-blue)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Tab 3: Alerts ─────────────────────────────────────────────────────────────
function AlertsTab({ onSave }: { onSave: () => void }) {
  const [alertMethod, setAlertMethod] = useState('In-App Only')
  const [soundAlerts, setSoundAlerts] = useState(true)
  const [threshold, setThreshold] = useState('Medium')

  const alertMethods = ['In-App Only', 'In-App + SMS', 'In-App + Email']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Section title="Alert Method">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {alertMethods.map((method) => (
            <RadioOption key={method} label={method} selected={alertMethod === method} onClick={() => setAlertMethod(method)} />
          ))}
        </div>
      </Section>

      <Section title="Alert Preferences">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 3 }}>Sound Alerts</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Play audio when alerts are triggered</div>
          </div>
          <Toggle checked={soundAlerts} onChange={setSoundAlerts} />
        </div>

        <FieldRow label="Alert Threshold">
          <select style={{ ...selectStyle, maxWidth: 240 }} value={threshold} onChange={(e) => setThreshold(e.target.value)}>
            <option>Medium</option>
            <option>High</option>
            <option>Critical</option>
          </select>
        </FieldRow>
      </Section>

      <SaveBtn onClick={onSave} />
    </div>
  )
}

// ── Tab 4: Privacy ────────────────────────────────────────────────────────────
function PrivacyTab({ onSave }: { onSave: () => void }) {
  const [embedding, setEmbedding]   = useState('Delete immediately after case closure')
  const [photo, setPhoto]           = useState('24 hours')
  const [audit, setAudit]           = useState('90 days')
  const [showConfirm, setShowConfirm] = useState(false)
  const [cleanupDone, setCleanupDone] = useState(false)

  const embeddingOptions = ['Delete immediately after case closure', '24 hours', '72 hours']
  const photoOptions     = ['24 hours', '72 hours', '7 days']
  const auditOptions     = ['30 days', '90 days', '1 year']

  function runCleanup() {
    setShowConfirm(false)
    setTimeout(() => {
      setCleanupDone(true)
      setTimeout(() => setCleanupDone(false), 3000)
    }, 500)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Section title="Embedding Retention">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {embeddingOptions.map((opt) => (
            <RadioOption key={opt} label={opt} selected={embedding === opt} onClick={() => setEmbedding(opt)} />
          ))}
        </div>
      </Section>

      <Section title="Photo Retention">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {photoOptions.map((opt) => (
            <RadioOption key={opt} label={opt} selected={photo === opt} onClick={() => setPhoto(opt)} />
          ))}
        </div>
      </Section>

      <Section title="Audit Log Retention">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {auditOptions.map((opt) => (
            <RadioOption key={opt} label={opt} selected={audit === opt} onClick={() => setAudit(opt)} />
          ))}
        </div>
      </Section>

      <div
        style={{
          padding: '12px 16px',
          background: 'rgba(139,92,246,0.08)',
          border: '1px solid rgba(139,92,246,0.25)',
          borderLeft: '3px solid #8B5CF6',
          borderRadius: 6,
          fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.6,
        }}
      >
        SpotJr stores only temporary embeddings during active cases. No permanent facial recognition database is maintained.
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <SaveBtn onClick={onSave} />
        <button
          onClick={() => setShowConfirm(true)}
          style={{
            padding: '10px 20px', borderRadius: 6,
            border: '1px solid rgba(239,68,68,0.4)',
            background: 'rgba(239,68,68,0.08)',
            color: '#EF4444', fontSize: 13, fontWeight: 700, cursor: 'pointer',
          }}
        >
          Run Data Cleanup Now
        </button>
      </div>

      {showConfirm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(8,12,24,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--color-bg-elevated)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: 24, width: 360, boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#EF4444', margin: '0 0 12px' }}>Confirm Data Cleanup</h2>
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: '0 0 20px', lineHeight: 1.6 }}>
              This will permanently delete all temporary embeddings and data scheduled for removal. This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowConfirm(false)} style={{ flex: 1, padding: '9px 0', borderRadius: 6, border: '1px solid var(--color-border-default)', background: 'transparent', color: 'var(--color-text-secondary)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <button onClick={runCleanup} style={{ flex: 1, padding: '9px 0', borderRadius: 6, border: 'none', background: 'rgba(239,68,68,0.8)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Confirm Delete</button>
            </div>
          </div>
        </div>
      )}

      {cleanupDone && <Toast message="Data cleanup completed successfully" />}
    </div>
  )
}

// ── Tab 5: Appearance ─────────────────────────────────────────────────────────
function AppearanceTab({ onSave }: { onSave: () => void }) {
  const [density, setDensity] = useState('Comfortable')
  const [nightVision, setNightVision] = useState(false)

  useEffect(() => {
    if (nightVision) {
      document.body.classList.add('night-vision-mode')
    } else {
      document.body.classList.remove('night-vision-mode')
    }
    return () => {
      document.body.classList.remove('night-vision-mode')
    }
  }, [nightVision])

  const densityOptions = ['Comfortable', 'Compact', 'Spacious']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Section title="Theme">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 36, height: 36, borderRadius: 8,
              background: 'var(--color-bg-surface)',
              border: '2px solid var(--color-brand-cyan)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--color-brand-cyan)' }} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}>Dark Command Center</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>The only theme — optimized for control room use</div>
          </div>
          <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--color-text-muted)', padding: '2px 8px', border: '1px solid var(--color-border-subtle)', borderRadius: 4 }}>Locked</span>
        </div>
      </Section>

      <Section title="Display Density">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {densityOptions.map((opt) => (
            <RadioOption key={opt} label={opt} selected={density === opt} onClick={() => setDensity(opt)} />
          ))}
        </div>
      </Section>

      <Section title="Night Vision Mode">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 4 }}>Night Vision Mode</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
              Reduces all interface colors to near-monochrome red. Designed for use in fully dark control rooms where preserving night vision is critical.
            </div>
          </div>
          <Toggle checked={nightVision} onChange={setNightVision} />
        </div>
        {nightVision && (
          <div style={{ padding: '8px 12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6, fontSize: 11, color: '#EF4444' }}>
            Night vision mode active — colors reduced to monochrome red
          </div>
        )}
      </Section>

      <style>{`
        .night-vision-mode { filter: saturate(0) sepia(1) hue-rotate(320deg) brightness(0.8); }
      `}</style>

      <SaveBtn onClick={onSave} />
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
const TABS = [
  { label: 'General',    icon: Settings },
  { label: 'Operators',  icon: Users },
  { label: 'Alerts',     icon: Bell },
  { label: 'Privacy',    icon: Shield },
  { label: 'Appearance', icon: Eye },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState(0)
  const [toast, setToast] = useState<string | null>(null)

  function handleSave() {
    setToast('Settings saved successfully')
    setTimeout(() => setToast(null), 3000)
  }

  const content = [
    <GeneralTab    key="general"    onSave={handleSave} />,
    <OperatorsTab  key="operators"  onSave={handleSave} />,
    <AlertsTab     key="alerts"     onSave={handleSave} />,
    <PrivacyTab    key="privacy"    onSave={handleSave} />,
    <AppearanceTab key="appearance" onSave={handleSave} />,
  ]

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: 'var(--color-bg-base)' }}>
      <div style={{ padding: '24px 24px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <Settings size={20} style={{ color: 'var(--color-brand-cyan)' }} />
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>
            Settings
          </h1>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border-subtle)', padding: '0 24px', overflowX: 'auto' }}>
        {TABS.map(({ label, icon }, i) => (
          <TabBtn key={label} label={label} icon={icon} active={activeTab === i} onClick={() => setActiveTab(i)} />
        ))}
      </div>

      {/* Tab content */}
      <div style={{ padding: 24, maxWidth: 680 }}>
        {content[activeTab]}
      </div>

      {toast && <Toast message={toast} />}
    </div>
  )
}
