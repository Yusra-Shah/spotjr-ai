import { ArrowLeft, Upload } from 'lucide-react'
import Link from 'next/link'

export default function NewCasePage() {
  return (
    <div style={{ padding: 32, maxWidth: 720, margin: '0 auto' }}>
      <Link
        href="/cases"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          color: 'var(--color-text-secondary)',
          textDecoration: 'none',
          fontSize: 13,
          marginBottom: 24,
        }}
      >
        <ArrowLeft size={14} /> Back to Cases
      </Link>

      <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-text-primary)', margin: '0 0 4px' }}>
        New Missing Child Case
      </h1>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: 13, margin: '0 0 32px' }}>
        Complete this form quickly — every second matters.
      </p>

      {/* Step indicator */}
      <div className="flex items-center gap-3" style={{ marginBottom: 32 }}>
        {['Child Information', 'Clothing & Features', 'Review & Activate'].map((step, i) => (
          <div key={step} className="flex items-center gap-3">
            {i > 0 && (
              <div style={{ width: 32, height: 1, background: 'var(--color-border-default)' }} />
            )}
            <div className="flex items-center gap-2">
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: i === 0 ? 'var(--color-brand-cyan)' : 'var(--color-border-default)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 700,
                  color: i === 0 ? '#000' : 'var(--color-text-muted)',
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </div>
              <span
                style={{
                  fontSize: 12,
                  color: i === 0 ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                  fontWeight: i === 0 ? 600 : 400,
                  whiteSpace: 'nowrap',
                }}
              >
                {step}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        {/* Photo upload */}
        <div
          style={{
            border: '2px dashed var(--color-border-default)',
            borderRadius: 8,
            padding: 32,
            textAlign: 'center',
            marginBottom: 20,
            cursor: 'pointer',
          }}
        >
          <Upload size={24} style={{ color: 'var(--color-text-muted)', margin: '0 auto 8px' }} />
          <div style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}>
            Drag &amp; drop child photo or click to upload
          </div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: 11, marginTop: 4 }}>
            JPG, PNG, WEBP — max 10MB
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            { label: 'Age Estimate', placeholder: 'e.g. 7', type: 'number' },
            { label: 'Last Seen Time', placeholder: 'Select time', type: 'time' },
          ].map(({ label, placeholder, type }) => (
            <div key={label}>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 6, fontWeight: 500 }}>
                {label}
              </label>
              <input
                type={type}
                placeholder={placeholder}
                style={{
                  width: '100%',
                  background: 'var(--color-bg-inset)',
                  border: '1px solid var(--color-border-default)',
                  borderRadius: 6,
                  padding: '10px 12px',
                  color: 'var(--color-text-primary)',
                  fontSize: 13,
                  outline: 'none',
                }}
              />
            </div>
          ))}
        </div>

        <div style={{ marginTop: 16 }}>
          <label style={{ display: 'block', fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 6, fontWeight: 500 }}>
            Description
          </label>
          <textarea
            placeholder="Describe the child: age, clothing, hair, accessories, anything you remember."
            rows={3}
            style={{
              width: '100%',
              background: 'var(--color-bg-inset)',
              border: '1px solid var(--color-border-default)',
              borderRadius: 6,
              padding: '10px 12px',
              color: 'var(--color-text-primary)',
              fontSize: 13,
              resize: 'vertical',
              outline: 'none',
              fontFamily: 'inherit',
            }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Link href="/cases" style={{ color: 'var(--color-text-secondary)', fontSize: 13, textDecoration: 'none' }}>
          Cancel
        </Link>
        <button
          style={{
            background: 'var(--gradient-btn-success)',
            color: '#fff',
            fontSize: 14,
            fontWeight: 700,
            padding: '12px 32px',
            borderRadius: 6,
            border: 'none',
            cursor: 'pointer',
            letterSpacing: '0.05em',
          }}
        >
          Next: Clothing →
        </button>
      </div>
    </div>
  )
}
