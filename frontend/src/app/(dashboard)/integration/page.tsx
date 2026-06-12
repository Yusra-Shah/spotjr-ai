'use client'

import { useState } from 'react'
import {
  Wifi, Camera, Key, Film, Activity, Plus, X, Copy, RefreshCw,
  CheckCircle, Clock, Upload, Loader, type LucideIcon,
} from 'lucide-react'
import { mockCameras } from '@/lib/mock-data'

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ message, type = 'success' }: { message: string; type?: 'success' | 'info' }) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        background: 'var(--color-bg-elevated)',
        border: '1px solid var(--color-border-default)',
        borderLeft: `3px solid ${type === 'success' ? 'var(--color-status-online)' : 'var(--color-brand-cyan)'}`,
        borderRadius: 8,
        padding: '12px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        minWidth: 280,
      }}
    >
      <CheckCircle size={16} style={{ color: type === 'success' ? 'var(--color-status-online)' : 'var(--color-brand-cyan)', flexShrink: 0 }} />
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
        display: 'flex',
        alignItems: 'center',
        gap: 7,
        padding: '9px 18px',
        borderRadius: 0,
        border: 'none',
        borderBottom: active ? '2px solid var(--color-brand-cyan)' : '2px solid transparent',
        background: 'none',
        color: active ? 'var(--color-brand-cyan)' : 'var(--color-text-secondary)',
        fontSize: 13,
        fontWeight: active ? 600 : 400,
        cursor: 'pointer',
        transition: 'all 150ms',
        whiteSpace: 'nowrap',
      }}
    >
      <Icon size={14} />
      {label}
    </button>
  )
}

// ── Status dot ────────────────────────────────────────────────────────────────
type DotColor = 'green' | 'amber' | 'red' | 'grey'
function StatusDot({ color }: { color: DotColor }) {
  const map: Record<DotColor, string> = {
    green: '#10B981',
    amber: '#F59E0B',
    red:   '#EF4444',
    grey:  '#64748B',
  }
  return (
    <span
      style={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: map[color],
        display: 'inline-block',
        boxShadow: color === 'green' ? '0 0 5px rgba(16,185,129,0.5)' : 'none',
        flexShrink: 0,
      }}
    />
  )
}

// ── Section card ──────────────────────────────────────────────────────────────
function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        background: 'var(--color-bg-elevated)',
        border: '1px solid var(--color-border-subtle)',
        borderRadius: 8,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

// ── Camera status color ───────────────────────────────────────────────────────
function camDotColor(status: string): DotColor {
  if (status === 'live') return 'green'
  if (status === 'match') return 'amber'
  if (status === 'high_risk') return 'red'
  return 'grey'
}

function camStatusLabel(status: string) {
  if (status === 'live') return 'Live'
  if (status === 'match') return 'Match'
  if (status === 'high_risk') return 'High Risk'
  return 'Offline'
}

// ── Tab 1: Connected Cameras ──────────────────────────────────────────────────
const ZONES = ['Main Entrance', 'Food Court', 'Food Court East', 'Escalator North', 'Exit A', 'Gate B Corridor', 'Toy Zone', 'Parking Level 1']
const STREAM_TYPES = ['RTSP', 'Demo Video', 'Webcam']

function ConnectedCamerasTab() {
  const [showModal, setShowModal] = useState(false)
  const [camName, setCamName] = useState('')
  const [camZone, setCamZone] = useState(ZONES[0])
  const [camType, setCamType] = useState(STREAM_TYPES[0])
  const [camUrl, setCamUrl] = useState('')
  const [toast, setToast] = useState<string | null>(null)

  function handleSave() {
    setShowModal(false)
    setCamName('')
    setCamUrl('')
    setToast('Camera added successfully')
    setTimeout(() => setToast(null), 3000)
  }

  const COL = '90px 120px 130px 110px 80px 130px 80px'

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button
          onClick={() => setShowModal(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 16px', borderRadius: 6,
            border: 'none',
            background: 'var(--color-brand-blue)',
            color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer',
          }}
        >
          <Plus size={14} /> Add Camera
        </button>
      </div>

      <Card>
        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: COL, background: 'var(--color-bg-surface)', borderRadius: '8px 8px 0 0', borderBottom: '1px solid var(--color-border-subtle)' }}>
          {['Camera ID', 'Name', 'Zone', 'Stream Type', 'Status', 'Last Heartbeat', 'Actions'].map((h) => (
            <div key={h} style={{ padding: '10px 12px', fontSize: 10, fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</div>
          ))}
        </div>

        {mockCameras.map((cam, i) => (
          <div
            key={cam.id}
            style={{
              display: 'grid', gridTemplateColumns: COL, alignItems: 'center',
              borderTop: i > 0 ? '1px solid var(--color-border-subtle)' : 'none',
            }}
          >
            <div style={{ padding: '12px', fontSize: 11, fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-brand-cyan)' }}>{cam.id}</div>
            <div style={{ padding: '12px', fontSize: 12, color: 'var(--color-text-primary)' }}>{cam.name}</div>
            <div style={{ padding: '12px', fontSize: 11, color: 'var(--color-text-secondary)' }}>{cam.zone}</div>
            <div style={{ padding: '12px', fontSize: 11, color: 'var(--color-text-muted)' }}>Demo Video</div>
            <div style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <StatusDot color={camDotColor(cam.status)} />
              <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>{camStatusLabel(cam.status)}</span>
            </div>
            <div style={{ padding: '12px', fontSize: 11, fontFamily: 'monospace', color: 'var(--color-text-muted)' }}>just now</div>
            <div style={{ padding: '12px' }}>
              <button style={{ fontSize: 10, padding: '3px 8px', borderRadius: 4, border: '1px solid var(--color-border-default)', background: 'transparent', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>Edit</button>
            </div>
          </div>
        ))}
      </Card>

      {/* Add Camera Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 999,
            background: 'rgba(8,12,24,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <div
            style={{
              background: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border-default)',
              borderRadius: 12,
              padding: 24,
              width: 420,
              boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>Add Camera</h2>
              <button onClick={() => setShowModal(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Camera Name', value: camName, onChange: setCamName, type: 'text', placeholder: 'e.g. Gate C East' },
                { label: 'URL / Path', value: camUrl, onChange: setCamUrl, type: 'text', placeholder: 'rtsp://... or /clips/demo.mp4' },
              ].map(({ label, value, onChange, type, placeholder }) => (
                <div key={label}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 6 }}>{label}</label>
                  <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    style={{
                      width: '100%', padding: '9px 12px', borderRadius: 6,
                      border: '1px solid var(--color-border-default)',
                      background: 'var(--color-bg-surface)',
                      color: 'var(--color-text-primary)',
                      fontSize: 13, outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                </div>
              ))}

              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 6 }}>Zone</label>
                <select
                  value={camZone}
                  onChange={(e) => setCamZone(e.target.value)}
                  style={{
                    width: '100%', padding: '9px 12px', borderRadius: 6,
                    border: '1px solid var(--color-border-default)',
                    background: 'var(--color-bg-surface)',
                    color: 'var(--color-text-primary)',
                    fontSize: 13, outline: 'none',
                  }}
                >
                  {ZONES.map((z) => <option key={z} value={z}>{z}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 6 }}>Stream Type</label>
                <select
                  value={camType}
                  onChange={(e) => setCamType(e.target.value)}
                  style={{
                    width: '100%', padding: '9px 12px', borderRadius: 6,
                    border: '1px solid var(--color-border-default)',
                    background: 'var(--color-bg-surface)',
                    color: 'var(--color-text-primary)',
                    fontSize: 13, outline: 'none',
                  }}
                >
                  {STREAM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button
                onClick={() => setShowModal(false)}
                style={{ flex: 1, padding: '9px 0', borderRadius: 6, border: '1px solid var(--color-border-default)', background: 'transparent', color: 'var(--color-text-secondary)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                style={{ flex: 1, padding: '9px 0', borderRadius: 6, border: 'none', background: 'var(--color-brand-blue)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <Toast message={toast} type="success" />
      )}
    </div>
  )
}

// ── Tab 2: API Configuration ──────────────────────────────────────────────────
function ApiConfigTab() {
  const [toast, setToast] = useState<string | null>(null)
  const [webhookUrl, setWebhookUrl] = useState('')

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '14px 16px',
    borderBottom: '1px solid var(--color-border-subtle)',
  }

  return (
    <div>
      <Card>
        <div style={rowStyle}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.08em' }}>API Key</div>
            <div style={{ fontSize: 13, fontFamily: 'monospace', color: 'var(--color-text-primary)' }}>sk-spotjr-••••••••••••</div>
          </div>
          <button
            onClick={() => {
              navigator.clipboard?.writeText('sk-spotjr-demo-key-2026').catch(() => {})
              showToast('API key copied to clipboard')
            }}
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 5, border: '1px solid var(--color-border-default)', background: 'transparent', color: 'var(--color-text-secondary)', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
          >
            <Copy size={11} /> Copy
          </button>
          <button
            onClick={() => showToast('API key regenerated successfully')}
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 5, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)', color: '#EF4444', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
          >
            <RefreshCw size={11} /> Regenerate
          </button>
        </div>

        <div style={rowStyle}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.08em' }}>API Endpoint</div>
            <div style={{ fontSize: 13, fontFamily: 'monospace', color: 'var(--color-brand-cyan)' }}>http://localhost:8000</div>
          </div>
          <button style={{ padding: '6px 12px', borderRadius: 5, border: '1px solid var(--color-border-default)', background: 'transparent', color: 'var(--color-text-secondary)', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
            Edit
          </button>
        </div>

        <div style={rowStyle}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Webhook URL</div>
            <input
              type="text"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://your-endpoint.com/webhook"
              style={{
                width: '100%', padding: '8px 12px', borderRadius: 6,
                border: '1px solid var(--color-border-default)',
                background: 'var(--color-bg-surface)',
                color: 'var(--color-text-primary)',
                fontSize: 13, outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>
        </div>

        <div style={{ ...rowStyle, borderBottom: 'none' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.08em' }}>CORS Origins</div>
            <div style={{ fontSize: 13, fontFamily: 'monospace', color: 'var(--color-text-secondary)' }}>http://localhost:3000</div>
          </div>
        </div>
      </Card>

      <button
        onClick={() => showToast('Configuration saved successfully')}
        style={{
          marginTop: 16, padding: '10px 24px', borderRadius: 6,
          border: 'none', background: 'var(--color-brand-blue)',
          color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
        }}
      >
        Save Configuration
      </button>

      {toast && <Toast message={toast} />}
    </div>
  )
}

// ── Tab 3: Demo Data ──────────────────────────────────────────────────────────
const DEMO_CLIPS = [
  { file: 'clip-001.mp4', camera: 'Camera 2', zone: 'Food Court',      status: 'Loaded' as const },
  { file: 'clip-002.mp4', camera: 'Camera 5', zone: 'Food Court East',  status: 'Loaded' as const },
  { file: 'clip-003.mp4', camera: 'Camera 8', zone: 'Corridor',         status: 'Loaded' as const },
]

function DemoDataTab() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null)

  return (
    <div>
      <div
        style={{
          padding: '10px 14px',
          background: 'rgba(139,92,246,0.08)',
          border: '1px solid rgba(139,92,246,0.25)',
          borderLeft: '3px solid #8B5CF6',
          borderRadius: 6,
          marginBottom: 16,
          fontSize: 12,
          color: 'var(--color-text-secondary)',
        }}
      >
        All footage is synthetic. No real child data. For hackathon demonstration only.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {DEMO_CLIPS.map((clip) => (
          <Card key={clip.file}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px' }}>
              <Film size={20} style={{ color: 'var(--color-brand-cyan)', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'monospace', marginBottom: 3 }}>{clip.file}</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>{clip.camera} · {clip.zone}</div>
              </div>
              <span
                style={{
                  padding: '3px 10px', borderRadius: 10, fontSize: 10, fontWeight: 700,
                  background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)',
                  color: '#10B981', letterSpacing: '0.06em',
                }}
              >
                {clip.status}
              </span>
              <button style={{ padding: '5px 12px', borderRadius: 5, border: '1px solid var(--color-border-default)', background: 'transparent', color: 'var(--color-text-secondary)', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                Replace
              </button>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
        <label
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 18px', borderRadius: 6,
            border: '1px dashed var(--color-border-default)',
            color: 'var(--color-text-secondary)',
            fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}
        >
          <Upload size={14} /> Upload New Clip
          <input
            type="file"
            accept="video/*"
            style={{ display: 'none' }}
            onChange={(e) => setSelectedFile(e.target.files?.[0]?.name ?? null)}
          />
        </label>
        {selectedFile && (
          <span style={{ fontSize: 12, color: 'var(--color-brand-cyan)', fontFamily: 'monospace' }}>{selectedFile}</span>
        )}
      </div>
    </div>
  )
}

// ── Tab 4: System Health ──────────────────────────────────────────────────────
const INITIAL_SERVICES = [
  { name: 'Backend API',      status: 'online'   as const, latency: '12ms',   detail: 'last checked just now' },
  { name: 'AI Pipeline',      status: 'degraded' as const, latency: '—',       detail: 'Processing' },
  { name: 'Azure AI Vision',  status: 'checking' as const, latency: '—',       detail: 'credentials not configured' },
  { name: 'Azure OpenAI',     status: 'checking' as const, latency: '—',       detail: 'credentials not configured' },
  { name: 'Camera Feeds',     status: 'online'   as const, latency: '6/6',    detail: 'all online' },
  { name: 'WebSocket',        status: 'online'   as const, latency: '—',       detail: 'Connected' },
]

type SvcStatus = 'online' | 'degraded' | 'checking' | 'offline'

const STATUS_CONFIG: Record<SvcStatus, { dot: DotColor; label: string; labelColor: string }> = {
  online:   { dot: 'green', label: 'Online',     labelColor: '#10B981' },
  degraded: { dot: 'amber', label: 'Processing', labelColor: '#F59E0B' },
  checking: { dot: 'grey',  label: 'Checking...', labelColor: '#64748B' },
  offline:  { dot: 'red',   label: 'Offline',    labelColor: '#EF4444' },
}

function SystemHealthTab() {
  const [services, setServices] = useState(INITIAL_SERVICES)
  const [checking, setChecking] = useState(false)

  function runHealthCheck() {
    setChecking(true)
    setServices((prev) => prev.map((s) => ({ ...s, status: 'checking' as const })))
    setTimeout(() => {
      setServices(INITIAL_SERVICES)
      setChecking(false)
    }, 2000)
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        {services.map((svc) => {
          const cfg = STATUS_CONFIG[svc.status]
          return (
            <Card key={svc.name}>
              <div style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}>{svc.name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {svc.status === 'degraded' && checking === false && (
                      <Loader
                        size={10}
                        style={{
                          color: '#F59E0B',
                          animation: 'spin 1.2s linear infinite',
                        }}
                      />
                    )}
                    <StatusDot color={cfg.dot} />
                  </div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: cfg.labelColor, marginBottom: 3 }}>{cfg.label}</div>
                <div style={{ fontSize: 10, color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
                  {svc.latency !== '—' ? `${svc.latency} · ` : ''}{svc.detail}
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <button
        onClick={runHealthCheck}
        disabled={checking}
        style={{
          marginTop: 20,
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 24px', borderRadius: 6,
          border: 'none',
          background: checking ? 'rgba(36,99,235,0.5)' : 'var(--color-brand-blue)',
          color: '#fff', fontSize: 13, fontWeight: 700, cursor: checking ? 'not-allowed' : 'pointer',
        }}
      >
        <Activity size={14} /> {checking ? 'Running...' : 'Run Health Check'}
      </button>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
const TABS = [
  { label: 'Connected Cameras', icon: Camera },
  { label: 'API Configuration', icon: Key },
  { label: 'Demo Data',         icon: Film },
  { label: 'System Health',     icon: Activity },
]

export default function IntegrationPage() {
  const [activeTab, setActiveTab] = useState(0)

  const content = [
    <ConnectedCamerasTab key="cameras" />,
    <ApiConfigTab key="api" />,
    <DemoDataTab key="demo" />,
    <SystemHealthTab key="health" />,
  ]

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: 'var(--color-bg-base)' }}>
      <div style={{ padding: '24px 24px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <Wifi size={20} style={{ color: 'var(--color-brand-cyan)' }} />
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>
            CCTV Integration
          </h1>
        </div>
        <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: '0 0 16px' }}>
          Connect cameras, configure API keys, and manage demo data sources.
        </p>
      </div>

      {/* Tab bar */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid var(--color-border-subtle)',
          padding: '0 24px',
          overflowX: 'auto',
        }}
      >
        {TABS.map(({ label, icon }, i) => (
          <TabBtn
            key={label}
            label={label}
            icon={icon}
            active={activeTab === i}
            onClick={() => setActiveTab(i)}
          />
        ))}
      </div>

      {/* Tab content */}
      <div style={{ padding: 24 }}>
        {content[activeTab]}
      </div>
    </div>
  )
}
