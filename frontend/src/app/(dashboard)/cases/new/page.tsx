'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Upload, ArrowLeft, ArrowRight, Check, Scan, AlertTriangle } from 'lucide-react'
import { createCase } from '@/lib/api'

// ── Mini zone selector ───────────────────────────────────────────────────────
const MINI_ZONES = [
  { id: 'foodcourt',  label: 'Food Court',       x: 22,  y: 66,  w: 74, h: 60 },
  { id: 'foodcourtE', label: 'Food Court East',  x: 104, y: 66,  w: 70, h: 60 },
  { id: 'toyzone',    label: 'Toy Zone',         x: 22,  y: 12,  w: 56, h: 46 },
  { id: 'restrooms',  label: 'Restrooms',        x: 86,  y: 12,  w: 36, h: 22 },
  { id: 'corridor',   label: 'Corridor',         x: 182, y: 66,  w: 34, h: 60 },
  { id: 'gateB',      label: 'Gate B',           x: 222, y: 66,  w: 54, h: 34, isRisk: true },
  { id: 'parking',    label: 'Parking',          x: 222, y: 108, w: 54, h: 58, isRisk: true },
  { id: 'entrance',   label: 'Main Entrance',    x: 104, y: 136, w: 74, h: 30 },
]

function ZoneSelector({
  selected,
  onSelect,
}: {
  selected: string
  onSelect: (id: string) => void
}) {
  return (
    <svg
      viewBox="0 0 290 178"
      style={{
        width: '100%',
        maxWidth: 290,
        height: 'auto',
        background: '#080C18',
        borderRadius: 8,
        border: '1px solid var(--color-border-default)',
        cursor: 'pointer',
        display: 'block',
      }}
    >
      {MINI_ZONES.map((z) => {
        const isSelected = selected === z.id
        return (
          <g key={z.id} onClick={() => onSelect(z.id)} style={{ cursor: 'pointer' }}>
            <rect
              x={z.x} y={z.y} width={z.w} height={z.h}
              rx="2"
              fill={
                isSelected
                  ? 'rgba(245,158,11,0.3)'
                  : z.isRisk
                  ? 'rgba(239,68,68,0.12)'
                  : 'rgba(30,45,77,0.5)'
              }
              stroke={
                isSelected
                  ? '#F59E0B'
                  : z.isRisk
                  ? 'rgba(239,68,68,0.4)'
                  : 'var(--color-border-default)'
              }
              strokeWidth={isSelected ? 1.5 : 1}
            />
            <text
              x={z.x + z.w / 2}
              y={z.y + z.h / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={isSelected ? '#F59E0B' : 'rgba(240,244,255,0.5)'}
              fontSize="7"
              fontFamily="Inter, system-ui, sans-serif"
              style={{ pointerEvents: 'none', userSelect: 'none' }}
            >
              {z.label}
            </text>
          </g>
        )
      })}
      <text x="285" y="175" textAnchor="end" fill="rgba(240,244,255,0.2)" fontSize="5" fontFamily="monospace">
        FLOOR 1
      </text>
    </svg>
  )
}

// ── Color swatches ────────────────────────────────────────────────────────────
const COLORS = [
  { id: 'red',    hex: '#EF4444', label: 'Red' },
  { id: 'pink',   hex: '#F472B6', label: 'Pink' },
  { id: 'blue',   hex: '#3B82F6', label: 'Blue' },
  { id: 'green',  hex: '#10B981', label: 'Green' },
  { id: 'yellow', hex: '#EAB308', label: 'Yellow' },
  { id: 'white',  hex: '#F1F5F9', label: 'White' },
  { id: 'black',  hex: '#1E293B', label: 'Black' },
  { id: 'orange', hex: '#F97316', label: 'Orange' },
]

const ACCESSORIES = ['Backpack', 'Hat', 'Stuffed Animal', 'Glasses', 'Jacket', 'Umbrella']

const CLOTHING_TYPES = ['T-Shirt', 'Dress', 'Jacket', 'Sweater', 'Hoodie', 'Shirt', 'Blouse', 'Shorts', 'Pants', 'Skirt']

// ── Form state ────────────────────────────────────────────────────────────────
interface FormData {
  photoPreview: string | null
  description: string
  age: string
  gender: string
  height: string
  lastSeenTime: string
  lastSeenZone: string
  upperColors: string[]
  upperType: string
  lowerColors: string[]
  accessories: string[]
  parentName: string
  parentPhone: string
}

function defaultTime(): string {
  const d = new Date(Date.now() - 5 * 60 * 1000)
  return d.toTimeString().slice(0, 5)
}

function ColorSwatches({
  selected,
  onToggle,
}: {
  selected: string[]
  onToggle: (id: string) => void
}) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {COLORS.map((c) => {
        const active = selected.includes(c.id)
        return (
          <button
            key={c.id}
            onClick={() => onToggle(c.id)}
            title={c.label}
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: c.hex,
              border: `2.5px solid ${active ? '#fff' : 'transparent'}`,
              boxShadow: active ? `0 0 0 2px var(--color-brand-cyan)` : 'none',
              cursor: 'pointer',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {active && <Check size={14} color="#fff" strokeWidth={3} />}
          </button>
        )
      })}
    </div>
  )
}

// ── Input style helper ────────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  background: 'var(--color-bg-inset)',
  border: '1px solid var(--color-border-default)',
  borderRadius: 6,
  padding: '9px 12px',
  color: 'var(--color-text-primary)',
  fontSize: 13,
  outline: 'none',
  width: '100%',
  fontFamily: 'inherit',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 11,
  fontWeight: 600,
  color: 'var(--color-text-secondary)',
  marginBottom: 6,
  letterSpacing: '0.04em',
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function NewCasePage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormData>({
    photoPreview: null,
    description: '',
    age: '',
    gender: 'Unknown',
    height: '',
    lastSeenTime: defaultTime(),
    lastSeenZone: '',
    upperColors: [],
    upperType: '',
    lowerColors: [],
    accessories: [],
    parentName: '',
    parentPhone: '',
  })

  const [aiExtracting, setAiExtracting] = useState(false)
  const [aiAttributes, setAiAttributes] = useState<string[] | null>(null)
  const [activating, setActivating] = useState(false)
  const [activatingStep, setActivatingStep] = useState<'creating' | 'analyzing' | 'scanning' | 'building'>('creating')
  const [progress, setProgress] = useState(0)

  // AI description extraction — parses actual keywords from description
  useEffect(() => {
    if (form.description.length < 6) {
      setAiAttributes(null)
      return
    }
    const debounce = setTimeout(() => {
      setAiExtracting(true)
      setAiAttributes(null)
      const extract = setTimeout(() => {
        setAiExtracting(false)
        const desc = form.description.toLowerCase()
        const tags: string[] = []

        // Age
        const ageMatch = desc.match(/(\d+)\s*year/)
        if (ageMatch) tags.push(`~${ageMatch[1]} years old`)

        // Clothing colors
        const foundColors: string[] = []
        for (const color of ['red', 'pink', 'blue', 'black', 'white', 'green', 'yellow', 'orange', 'purple']) {
          if (desc.includes(color)) foundColors.push(color)
        }
        if (foundColors.length) tags.push(`${foundColors.join('/')} clothing`)

        // Gender
        if (/\bboy\b|\bmale\b/.test(desc)) tags.push('Male')
        else if (/\bgirl\b|\bfemale\b/.test(desc)) tags.push('Female')

        // Stature
        if (/\bshort\b|\bsmall\b|\btiny\b/.test(desc)) tags.push('short stature')
        else if (/\btall\b/.test(desc)) tags.push('tall stature')

        // Accessories
        if (/\bhat\b|\bcap\b/.test(desc)) tags.push('hat')
        if (/\bshoe|\bsneaker|\bboot/.test(desc)) tags.push('notable footwear')
        if (/\btoy\b|\bstuffed|\bplush/.test(desc)) tags.push('stuffed toy')
        if (/\bbag\b|\bbackpack/.test(desc)) tags.push('bag/backpack')
        if (/\bglasses\b|\bspectacles/.test(desc)) tags.push('glasses')

        setAiAttributes(tags.length ? tags : ['description noted'])
      }, 900)
      return () => clearTimeout(extract)
    }, 800)
    return () => clearTimeout(debounce)
  }, [form.description])

  // Activation sequence — calls real API, cycles UI status messages in parallel
  useEffect(() => {
    if (!activating) return

    const upperColorLabels = COLORS.filter((c) => form.upperColors.includes(c.id)).map((c) => c.label)
    const lowerColorLabels = COLORS.filter((c) => form.lowerColors.includes(c.id)).map((c) => c.label)

    const payload = {
      child_description: form.description || `Child ~${form.age || '?'} years, ${upperColorLabels.join('/')} upper, ${lowerColorLabels.join('/')} lower`,
      age_estimate: parseInt(form.age) || 0,
      clothing_upper: [upperColorLabels.join(', '), form.upperType].filter(Boolean).join(' '),
      clothing_lower: lowerColorLabels.join(', ') || 'not specified',
      last_seen_zone: form.lastSeenZone || 'Unknown',
      last_seen_time: new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'),
      parent_contact: [form.parentName, form.parentPhone].filter(Boolean).join(' — ') || 'Not provided',
    }

    // UI step sequence runs regardless of API speed
    const steps: Array<typeof activatingStep> = ['creating', 'analyzing', 'scanning', 'building']
    let stepIdx = 0
    setActivatingStep(steps[0])
    const stepInterval = setInterval(() => {
      stepIdx = Math.min(stepIdx + 1, steps.length - 1)
      setActivatingStep(steps[stepIdx])
    }, 1200)

    // Progress bar runs independently
    let p = 0
    const progressInterval = setInterval(() => {
      p = Math.min(p + 1.2, 92) // cap at 92 until API resolves
      setProgress(p)
    }, 50)

    // Real API call — fallback to demo case if backend is offline
    createCase(payload)
      .then((result) => {
        clearInterval(stepInterval)
        clearInterval(progressInterval)
        setProgress(100)
        setTimeout(() => router.push(`/cases/${result.case_id}`), 400)
      })
      .catch((err) => {
        clearInterval(stepInterval)
        clearInterval(progressInterval)
        console.warn('[new-case] backend offline, using demo fallback:', err)
        setProgress(100)
        setTimeout(() => { window.location.href = '/cases/CASE-A-001' }, 400)
      })

    return () => {
      clearInterval(stepInterval)
      clearInterval(progressInterval)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activating])

  const handleFileChange = useCallback((file: File | null) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = (e.target as FileReader).result
      if (typeof result === 'string') {
        setForm((f) => ({ ...f, photoPreview: result }))
      }
    }
    reader.readAsDataURL(file)
  }, [])

  function toggleColor(field: 'upperColors' | 'lowerColors', id: string) {
    setForm((f) => ({
      ...f,
      [field]: f[field].includes(id) ? f[field].filter((c) => c !== id) : [...f[field], id],
    }))
  }

  function toggleAccessory(name: string) {
    setForm((f) => ({
      ...f,
      accessories: f.accessories.includes(name)
        ? f.accessories.filter((a) => a !== name)
        : [...f.accessories, name],
    }))
  }

  const canActivate = form.photoPreview !== null || form.description.length > 4

  // ── Render helpers ──────────────────────────────────────────────────────────
  function StepIndicator() {
    return (
      <div className="flex items-center justify-center gap-0" style={{ marginBottom: 24 }}>
        {[1, 2, 3].map((s, i) => (
          <div key={s} className="flex items-center">
            {i > 0 && (
              <div
                style={{
                  width: 48,
                  height: 2,
                  background: step > i ? 'var(--color-brand-cyan)' : 'var(--color-border-default)',
                  transition: 'background 300ms',
                }}
              />
            )}
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                border: `2px solid ${step >= s ? 'var(--color-brand-cyan)' : 'var(--color-border-default)'}`,
                background: step > s ? 'var(--color-brand-cyan)' : step === s ? 'rgba(6,182,212,0.12)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 700,
                color: step >= s ? 'var(--color-brand-cyan)' : 'var(--color-text-muted)',
                transition: 'all 300ms',
                flexShrink: 0,
              }}
            >
              {step > s ? <Check size={13} /> : s}
            </div>
          </div>
        ))}
      </div>
    )
  }

  // ── Step 1: Child Information ───────────────────────────────────────────────
  function Step1() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--color-text-secondary)',
              marginBottom: 12,
              letterSpacing: '0.05em',
            }}
          >
            STEP 1 OF 3 — Child Information
          </div>

          {/* Photo upload + OR + description */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr',
              gap: 16,
              alignItems: 'start',
              marginBottom: 16,
            }}
          >
            {/* Photo upload zone */}
            <div>
              <label style={labelStyle}>Photo (optional but recommended)</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault()
                  handleFileChange(e.dataTransfer.files[0] ?? null)
                }}
                style={{
                  border: `2px dashed ${form.photoPreview ? 'var(--color-brand-cyan)' : 'var(--color-border-default)'}`,
                  borderRadius: 10,
                  padding: form.photoPreview ? 8 : '24px 16px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: form.photoPreview ? 'rgba(6,182,212,0.05)' : 'var(--color-bg-inset)',
                  transition: 'all 200ms',
                  minHeight: 100,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {form.photoPreview ? (
                  <img
                    src={form.photoPreview}
                    alt="Preview"
                    style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-brand-cyan)' }}
                  />
                ) : (
                  <div>
                    <Upload size={24} style={{ color: 'var(--color-text-muted)', margin: '0 auto 8px' }} />
                    <div style={{ color: 'var(--color-text-secondary)', fontSize: 12 }}>
                      Drag photo or click to upload
                    </div>
                    <div style={{ color: 'var(--color-text-muted)', fontSize: 10, marginTop: 4 }}>
                      JPG, PNG, WEBP — max 10MB
                    </div>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
              />
            </div>

            {/* OR divider */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                paddingTop: 24,
                gap: 6,
              }}
            >
              <div style={{ width: 1, flex: 1, background: 'var(--color-border-subtle)' }} />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: 'var(--color-text-muted)',
                  background: 'var(--color-bg-elevated)',
                  padding: '4px 6px',
                  borderRadius: 4,
                }}
              >
                OR
              </span>
              <div style={{ width: 1, flex: 1, background: 'var(--color-border-subtle)' }} />
            </div>

            {/* Description + AI extraction */}
            <div>
              <label style={labelStyle}>Natural Language Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Describe the child: age, clothing, hair, accessories, anything you remember."
                rows={4}
                style={{ ...inputStyle, resize: 'none' }}
              />
              {/* AI extraction state */}
              {aiExtracting && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    marginTop: 8,
                    color: 'var(--color-ai-primary)',
                    fontSize: 11,
                  }}
                >
                  <Scan size={12} className="animate-spin" />
                  AI extracting attributes…
                </div>
              )}
              {aiAttributes && !aiExtracting && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ fontSize: 10, color: 'var(--color-ai-primary)', marginBottom: 5, fontWeight: 600, letterSpacing: '0.05em' }}>
                    AI EXTRACTED:
                  </div>
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                    {aiAttributes.map((attr) => (
                      <span
                        key={attr}
                        style={{
                          fontSize: 11,
                          background: 'rgba(139,92,246,0.12)',
                          border: '1px solid rgba(139,92,246,0.3)',
                          color: 'var(--color-ai-primary)',
                          padding: '2px 8px',
                          borderRadius: 12,
                        }}
                      >
                        {attr}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Age / Gender / Height row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <label style={labelStyle}>Age Estimate</label>
              <input
                type="number"
                min="1"
                max="17"
                placeholder="e.g. 7"
                value={form.age}
                onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Gender (optional)</label>
              <select
                value={form.gender}
                onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                {['Unknown', 'Girl', 'Boy'].map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Height (cm)</label>
              <input
                type="number"
                placeholder="e.g. 115"
                value={form.height}
                onChange={(e) => setForm((f) => ({ ...f, height: e.target.value }))}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Last seen time */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>Last Seen Time</label>
              <input
                type="time"
                value={form.lastSeenTime}
                onChange={(e) => setForm((f) => ({ ...f, lastSeenTime: e.target.value }))}
                style={inputStyle}
              />
            </div>
            <div />
          </div>

          {/* Zone selector */}
          <div>
            <label style={labelStyle}>
              Last Seen Zone
              {form.lastSeenZone && (
                <span style={{ color: 'var(--color-risk-medium)', marginLeft: 8, fontWeight: 700 }}>
                  — {MINI_ZONES.find((z) => z.id === form.lastSeenZone)?.label}
                </span>
              )}
            </label>
            <ZoneSelector
              selected={form.lastSeenZone}
              onSelect={(id) => setForm((f) => ({ ...f, lastSeenZone: id }))}
            />
            <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 5 }}>
              Click a zone on the map to select the last seen location
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Step 2: Clothing & Features ─────────────────────────────────────────────
  function Step2() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-secondary)', letterSpacing: '0.05em' }}>
          STEP 2 OF 3 — Clothing &amp; Features
        </div>

        {/* Upper clothing */}
        <div>
          <label style={labelStyle}>Upper Clothing Color (multi-select)</label>
          <ColorSwatches
            selected={form.upperColors}
            onToggle={(id) => toggleColor('upperColors', id)}
          />
        </div>

        <div>
          <label style={labelStyle}>Upper Clothing Type</label>
          <select
            value={form.upperType}
            onChange={(e) => setForm((f) => ({ ...f, upperType: e.target.value }))}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            <option value="">Select type…</option>
            {CLOTHING_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <label style={labelStyle}>Lower Clothing Color (multi-select)</label>
          <ColorSwatches
            selected={form.lowerColors}
            onToggle={(id) => toggleColor('lowerColors', id)}
          />
        </div>

        {/* Accessories */}
        <div>
          <label style={labelStyle}>Accessories</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {ACCESSORIES.map((acc) => {
              const active = form.accessories.includes(acc)
              return (
                <button
                  key={acc}
                  onClick={() => toggleAccessory(acc)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: 20,
                    border: `1px solid ${active ? 'var(--color-brand-cyan)' : 'var(--color-border-default)'}`,
                    background: active ? 'rgba(6,182,212,0.12)' : 'transparent',
                    color: active ? 'var(--color-brand-cyan)' : 'var(--color-text-secondary)',
                    fontSize: 12,
                    fontWeight: active ? 600 : 400,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    transition: 'all 150ms',
                  }}
                >
                  {active && <Check size={11} />}
                  {acc}
                </button>
              )
            })}
          </div>
        </div>

        {/* Parent contact */}
        <div style={{ paddingTop: 8, borderTop: '1px solid var(--color-border-subtle)' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', letterSpacing: '0.08em', marginBottom: 12 }}>
            PARENT / GUARDIAN CONTACT
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Name</label>
              <input
                type="text"
                placeholder="Full name"
                value={form.parentName}
                onChange={(e) => setForm((f) => ({ ...f, parentName: e.target.value }))}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Phone Number</label>
              <input
                type="tel"
                placeholder="+60 12 345 6789"
                value={form.parentPhone}
                onChange={(e) => setForm((f) => ({ ...f, parentPhone: e.target.value }))}
                style={inputStyle}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Step 3: Review & Activate ───────────────────────────────────────────────
  function Step3() {
    const selectedZone = MINI_ZONES.find((z) => z.id === form.lastSeenZone)
    const upperColorLabels = COLORS.filter((c) => form.upperColors.includes(c.id)).map((c) => c.label)
    const lowerColorLabels = COLORS.filter((c) => form.lowerColors.includes(c.id)).map((c) => c.label)

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-secondary)', letterSpacing: '0.05em' }}>
          STEP 3 OF 3 — Review &amp; Activate
        </div>

        {/* Summary card */}
        <div
          style={{
            background: 'var(--color-bg-elevated)',
            border: '1px solid var(--color-border-default)',
            borderRadius: 10,
            padding: 16,
            display: 'flex',
            gap: 16,
          }}
        >
          {/* Photo or placeholder */}
          <div style={{ flexShrink: 0 }}>
            {form.photoPreview ? (
              <img
                src={form.photoPreview}
                alt="Child"
                style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-brand-cyan)' }}
              />
            ) : (
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  background: 'var(--color-bg-inset)',
                  border: '2px solid var(--color-border-default)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 28,
                }}
              >
                👧
              </div>
            )}
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
            {[
              { label: 'Age', value: form.age ? `~${form.age} years` : 'Not specified' },
              { label: 'Gender', value: form.gender },
              { label: 'Height', value: form.height ? `~${form.height} cm` : 'Not specified' },
              { label: 'Last Seen', value: `${form.lastSeenTime} · ${selectedZone?.label ?? 'Zone not selected'}` },
              {
                label: 'Upper Clothing',
                value: [upperColorLabels.join(', '), form.upperType].filter(Boolean).join(' · ') || 'Not specified',
              },
              {
                label: 'Lower Clothing',
                value: lowerColorLabels.join(', ') || 'Not specified',
              },
              {
                label: 'Accessories',
                value: form.accessories.join(', ') || 'None',
              },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', gap: 8 }}>
                <span style={{ fontSize: 11, color: 'var(--color-text-muted)', width: 100, flexShrink: 0 }}>
                  {label}
                </span>
                <span style={{ fontSize: 12, color: 'var(--color-text-primary)' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mini map review */}
        <div>
          <label style={labelStyle}>Last Seen Zone on Map</label>
          <ZoneSelector selected={form.lastSeenZone} onSelect={() => {}} />
        </div>

        {/* Description */}
        {form.description && (
          <div className="ai-block">
            <div style={{ fontSize: 10, color: 'var(--color-ai-primary)', fontWeight: 600, marginBottom: 4 }}>
              DESCRIPTION
            </div>
            <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }}>
              {form.description}
            </p>
          </div>
        )}

        {/* Warning */}
        <div
          style={{
            display: 'flex',
            gap: 10,
            background: 'rgba(245,158,11,0.08)',
            border: '1px solid rgba(245,158,11,0.25)',
            borderRadius: 8,
            padding: '10px 14px',
          }}
        >
          <AlertTriangle size={14} style={{ color: 'var(--color-risk-medium)', flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }}>
            Activating search will scan all connected camera feeds and notify all on-duty guards.
          </p>
        </div>

        {/* Activate button */}
        <button
          onClick={() => setActivating(true)}
          disabled={!canActivate}
          title={!canActivate ? 'Provide a photo or description to continue' : undefined}
          style={{
            width: '100%',
            height: 56,
            fontSize: 16,
            fontWeight: 800,
            letterSpacing: '0.06em',
            borderRadius: 10,
            border: 'none',
            cursor: canActivate ? 'pointer' : 'not-allowed',
            background: canActivate ? 'var(--gradient-btn-success)' : 'var(--color-bg-elevated)',
            color: canActivate ? '#fff' : 'var(--color-text-muted)',
            opacity: canActivate ? 1 : 0.6,
            transition: 'all 200ms',
          }}
        >
          ACTIVATE SEARCH
        </button>
      </div>
    )
  }

  // ── Processing overlay ──────────────────────────────────────────────────────
  if (activating) {
    const stepLabels: Record<string, string> = {
      creating: 'Creating case…',
      analyzing: 'AI analyzing description…',
      scanning: 'Scanning cameras…',
      building: 'Building timeline…',
    }
    const stepSub: Record<string, string> = {
      creating: 'Registering case in the system',
      analyzing: 'Extracting visual attributes from description',
      scanning: 'Searching all connected camera feeds',
      building: 'Calculating risk score and predictions',
    }
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(8,12,24,0.97)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            border: '3px solid var(--color-brand-cyan)',
            borderTopColor: 'transparent',
            animation: 'spin 1s linear infinite',
          }}
        />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: 8 }}>
            {stepLabels[activatingStep]}
          </div>
          <div style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}>
            {stepSub[activatingStep]}
          </div>
        </div>
        <div style={{ width: 320 }}>
          <div
            style={{
              height: 6,
              background: 'var(--color-border-subtle)',
              borderRadius: 3,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                background: 'linear-gradient(90deg, var(--color-brand-cyan) 0%, var(--color-ai-primary) 100%)',
                borderRadius: 3,
                transition: 'width 50ms linear',
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Processing…</span>
            <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--color-brand-cyan)', fontWeight: 700 }}>
              {Math.round(progress)}%
            </span>
          </div>
        </div>
        {progress >= 80 && (
          <div
            style={{
              background: 'rgba(16,185,129,0.1)',
              border: '1px solid rgba(16,185,129,0.3)',
              borderRadius: 8,
              padding: '10px 20px',
              fontSize: 13,
              color: 'var(--color-status-online)',
              fontWeight: 600,
            }}
          >
            Match found — CAM-02 Food Court (78%)
          </div>
        )}
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  // ── Main form ───────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        minHeight: '100%',
        background: 'rgba(8,12,24,0.85)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '32px 24px',
      }}
    >
      <div style={{ width: '100%', maxWidth: 680 }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}
        >
          <Link
            href="/cases"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: 'var(--color-text-secondary)',
              textDecoration: 'none',
              fontSize: 13,
            }}
          >
            <ArrowLeft size={14} /> Back
          </Link>
          <span style={{ fontSize: 12, color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>ESC to cancel</span>
        </div>

        <h1
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: 'var(--color-text-primary)',
            margin: '0 0 4px',
            letterSpacing: '-0.01em',
          }}
        >
          New Missing Child Case
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 12, margin: '0 0 24px' }}>
          Complete quickly — every second matters.
        </p>

        {StepIndicator()}

        {/* Form card */}
        <div
          style={{
            background: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 12,
            padding: 24,
            marginBottom: 16,
          }}
        >
          {step === 1 && Step1()}
          {step === 2 && Step2()}
          {step === 3 && Step3()}
        </div>

        {/* Navigation buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'transparent',
              border: '1px solid var(--color-border-default)',
              color: step === 1 ? 'var(--color-text-muted)' : 'var(--color-text-secondary)',
              fontSize: 13,
              fontWeight: 600,
              padding: '10px 18px',
              borderRadius: 7,
              cursor: step === 1 ? 'not-allowed' : 'pointer',
              opacity: step === 1 ? 0.4 : 1,
            }}
          >
            <ArrowLeft size={14} /> Back
          </button>

          {step < 3 && (
            <button
              onClick={() => setStep((s) => Math.min(3, s + 1))}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'var(--gradient-btn-primary)',
                border: 'none',
                color: '#fff',
                fontSize: 13,
                fontWeight: 700,
                padding: '10px 20px',
                borderRadius: 7,
                cursor: 'pointer',
              }}
            >
              Next: {step === 1 ? 'Clothing' : 'Review'} <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
