'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Download, CheckCircle, Clock, User, Camera,
  Shield, AlertTriangle, Brain, Database, ChevronRight,
  FileText, Trash2, Eye, Activity,
} from 'lucide-react'

const REPORT = {
  caseId: 'CASE-A-001',
  date: '2026-06-11',
  venue: 'Sunway Pyramid Mall, Petaling Jaya',
  operator: 'Operator: Faridah bt Zainudin',
  childAlias: 'Case A-001',
  childAge: 7,
  clothing: 'Pink upper garment, black footwear, possible stuffed toy',
  lastSeenZone: 'Food Court — 12:01 PM',
  foundZone: 'Gate B Corridor — 12:11:12 PM',
  responseTime: '5 min 12 sec',
  outcome: 'FOUND — reunited with parent',

  timeline: [
    { time: '12:01:00', cam: null,    event: 'Case created by operator. Search activated on 12 cameras.' },
    { time: '12:01:45', cam: 'CAM-02', event: 'First detection at Food Court entrance. Confidence: 78%.', conf: 78 },
    { time: '12:03:12', cam: 'CAM-03', event: 'Re-ID confirmed same individual at Food Court East. Confidence: 94%.', conf: 94 },
    { time: '12:04:30', cam: null,    event: 'Prediction engine: Gate B 78% probability. Guard pre-positioning recommended.' },
    { time: '12:06:00', cam: 'CAM-06', event: 'HIGH RISK — child detected at Gate B Corridor. 14 min alone. Risk score: 85.', conf: 89, risk: true },
    { time: '12:06:30', cam: null,    event: 'Guard Reza dispatched to Gate B. ETA 2 min. Alert sent via in-app + Azure Communication Services.' },
    { time: '12:11:12', cam: null,    event: 'Guard Reza confirmed child located at Gate B. Case closed.' },
  ],

  aiMetrics: [
    { label: 'First detection time',    value: '45 seconds after case creation' },
    { label: 'Cameras scanned',         value: '12' },
    { label: 'Detections generated',    value: '3 confirmed matches' },
    { label: 'Peak match confidence',   value: '94% (CAM-03)' },
    { label: 'Re-ID chain accuracy',    value: '87% overall (3-camera chain)' },
    { label: 'Prediction accuracy',     value: 'Gate B — predicted 78%, child found at Gate B ✓' },
    { label: 'Risk score at escalation', value: '85 / 100 (HIGH)' },
    { label: 'AI model',                value: 'Azure OpenAI GPT-4 Vision · Torchreid OSNet (Azure ML)' },
  ],

  guardResponse: [
    { label: 'Guard assigned',   value: 'Guard Reza (GUARD-01)' },
    { label: 'Dispatch time',    value: '12:06:30 PM' },
    { label: 'Arrival time',     value: '12:08:44 PM (2 min 14 sec)' },
    { label: 'Confirmation time', value: '12:11:12 PM' },
    { label: 'Distance covered', value: '~180 m' },
    { label: 'Alert method',     value: 'In-app WebSocket + Azure Communication Services (simulated)' },
  ],

  privacy: {
    embeddingsDeleted: true,
    framesDeleted: false,
    photoScheduled: true,
    deletedAt: '2026-06-11T12:12:00Z',
    retentionNote: 'Child photo scheduled for deletion 72 hours post-case. Only audit log and anonymised report retained.',
  },

  aiSummary: 'Azure AI Foundry Coordinator Agent successfully tracked missing child across 3 cameras within 5 minutes of report. Movement prediction correctly identified Gate B as likely destination (78% probability — confirmed). Guard Reza dispatched and arrived within 2 minutes. Child reunited with parent. Re-identification chain maintained 87% same-person confidence across 3 cameras and approximately 160 metres of travel. No permanent identity profile was created. Temporary embeddings deleted at case closure.',
}

function SectionHeader({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid var(--color-border-subtle)' }}>
      <div style={{
        width: 32, height: 32, borderRadius: 7,
        background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={14} style={{ color: '#06B6D4' }} />
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)' }}>{title}</div>
        {subtitle && <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 1 }}>{subtitle}</div>}
      </div>
    </div>
  )
}

function DataRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, gap: 16 }}>
      <span style={{ fontSize: 12, color: 'var(--color-text-muted)', flexShrink: 0, minWidth: 180 }}>{label}</span>
      <span style={{ fontSize: 12, color: 'var(--color-text-secondary)', textAlign: 'right', fontFamily: mono ? 'monospace' : 'inherit' }}>{value}</span>
    </div>
  )
}

export default function IncidentReportDetailPage({ params }: { params: { id: string } }) {
  const sections = ['summary', 'child', 'timeline', 'ai-metrics', 'guard', 'outcome', 'privacy', 'reasoning']

  return (
    <div style={{ minHeight: '100%', background: 'var(--color-bg-base)', overflowY: 'auto' }}>

      {/* Top bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 24px',
        background: 'rgba(8,12,24,0.95)',
        borderBottom: '1px solid var(--color-border-subtle)',
        backdropFilter: 'blur(8px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link href="/incidents" style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--color-text-secondary)', fontSize: 13, textDecoration: 'none' }}>
            <ArrowLeft size={14} /> Incident Reports
          </Link>
          <span style={{ color: 'var(--color-border-default)' }}>·</span>
          <span style={{ fontSize: 13, fontFamily: 'monospace', color: 'var(--color-text-primary)', fontWeight: 700 }}>{REPORT.caseId}</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{
            padding: '4px 9px', borderRadius: 5,
            background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)',
            fontSize: 11, fontWeight: 700, color: '#10B981', fontFamily: 'monospace',
          }}>
            ● RESOLVED
          </div>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 5, cursor: 'pointer',
            background: 'rgba(0,120,212,0.15)', border: '1px solid rgba(0,120,212,0.3)',
            color: '#0078D4', fontSize: 12, fontWeight: 600,
          }}>
            <Download size={12} /> Export PDF
          </button>
        </div>
      </div>

      {/* Report body */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '24px 24px 48px' }}>

        {/* Report title */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 9, fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.12em', marginBottom: 6 }}>
                OFFICIAL INCIDENT REPORT · SPOTJR AI SECURITY SYSTEM
              </div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--color-text-primary)', margin: '0 0 4px' }}>
                Missing Child Recovery Report
              </h1>
              <div style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>{REPORT.date} · {REPORT.venue}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 22, fontFamily: 'monospace', fontWeight: 800, color: '#10B981' }}>{REPORT.responseTime}</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Total response time</div>
            </div>
          </div>
        </motion.div>

        {/* 1. Case Summary */}
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} style={{ marginBottom: 28, padding: 20, background: 'var(--color-bg-elevated)', borderRadius: 10, border: '1px solid var(--color-border-subtle)' }}>
          <SectionHeader icon={FileText} title="1. Case Summary" />
          <DataRow label="Case ID"          value={REPORT.caseId} mono />
          <DataRow label="Date / Time"      value={REPORT.date} />
          <DataRow label="Venue"            value={REPORT.venue} />
          <DataRow label="Reporting Operator" value={REPORT.operator} />
          <DataRow label="Outcome"          value={REPORT.outcome} />
          <DataRow label="Total Response Time" value={REPORT.responseTime} mono />
        </motion.section>

        {/* 2. Child Description */}
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ marginBottom: 28, padding: 20, background: 'var(--color-bg-elevated)', borderRadius: 10, border: '1px solid var(--color-border-subtle)' }}>
          <SectionHeader icon={User} title="2. Child Description" subtitle="No real child PII — synthetic demo data only" />
          <div style={{ display: 'flex', gap: 16 }}>
            {/* Photo placeholder */}
            <div style={{
              width: 80, height: 80, flexShrink: 0, borderRadius: 10,
              background: 'var(--color-bg-inset)', border: '1px solid var(--color-border-default)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
            }}>
              <User size={22} style={{ color: 'var(--color-text-muted)' }} />
              <span style={{ fontSize: 8, fontFamily: 'monospace', color: 'var(--color-text-muted)' }}>DEMO</span>
            </div>
            <div style={{ flex: 1 }}>
              <DataRow label="Alias"         value={REPORT.childAlias} />
              <DataRow label="Estimated age" value={`${REPORT.childAge} years`} />
              <DataRow label="Clothing"      value={REPORT.clothing} />
              <DataRow label="Last seen"     value={REPORT.lastSeenZone} />
              <DataRow label="Found at"      value={REPORT.foundZone} />
            </div>
          </div>
        </motion.section>

        {/* 3. Timeline */}
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} style={{ marginBottom: 28, padding: 20, background: 'var(--color-bg-elevated)', borderRadius: 10, border: '1px solid var(--color-border-subtle)' }}>
          <SectionHeader icon={Clock} title="3. Timeline of Events" subtitle="Chronological AI investigation log" />
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: 19, top: 0, bottom: 0, width: 1, background: 'var(--color-border-subtle)' }} />
            {REPORT.timeline.map((ev, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 8, position: 'relative' }}>
                <div style={{
                  width: 28, height: 28, flexShrink: 0, borderRadius: '50%', zIndex: 1,
                  background: ev.risk ? 'rgba(239,68,68,0.2)' : ev.cam ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.12)',
                  border: `2px solid ${ev.risk ? '#EF4444' : ev.cam ? '#F59E0B' : '#10B981'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginTop: 2,
                }}>
                  {ev.cam ? <Camera size={11} style={{ color: ev.risk ? '#EF4444' : '#F59E0B' }} />
                    : <Activity size={11} style={{ color: '#10B981' }} />}
                </div>
                <div style={{ flex: 1, paddingBottom: 8 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'baseline', marginBottom: 2 }}>
                    <span style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-text-muted)', flexShrink: 0 }}>{ev.time}</span>
                    {ev.cam && <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#06B6D4' }}>{ev.cam}</span>}
                    {ev.conf !== undefined && (
                      <span style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 700, color: ev.risk ? '#EF4444' : '#F59E0B', marginLeft: 'auto' }}>
                        {ev.conf}%
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }}>{ev.event}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* 4. AI Performance */}
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ marginBottom: 28, padding: 20, background: 'var(--color-bg-elevated)', borderRadius: 10, border: '1px solid var(--color-border-subtle)' }}>
          <SectionHeader icon={Brain} title="4. AI Performance Metrics" subtitle="Azure AI Foundry · GPT-4 Vision · Torchreid OSNet" />
          {REPORT.aiMetrics.map(m => <DataRow key={m.label} label={m.label} value={m.value} mono={m.label.includes('model')} />)}
        </motion.section>

        {/* 5. Guard Response */}
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} style={{ marginBottom: 28, padding: 20, background: 'var(--color-bg-elevated)', borderRadius: 10, border: '1px solid var(--color-border-subtle)' }}>
          <SectionHeader icon={User} title="5. Guard Response" />
          {REPORT.guardResponse.map(r => <DataRow key={r.label} label={r.label} value={r.value} />)}
        </motion.section>

        {/* 6. Outcome */}
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ marginBottom: 28, padding: 20, background: 'rgba(16,185,129,0.05)', borderRadius: 10, border: '1px solid rgba(16,185,129,0.25)' }}>
          <SectionHeader icon={CheckCircle} title="6. Outcome" />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 11,
              background: 'rgba(16,185,129,0.15)', border: '2px solid #10B981',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <CheckCircle size={22} style={{ color: '#10B981' }} />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#10B981' }}>{REPORT.outcome}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>
                Recovery location: {REPORT.foundZone} · Response time: {REPORT.responseTime}
              </div>
            </div>
          </div>
        </motion.section>

        {/* 7. Privacy Compliance */}
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} style={{ marginBottom: 28, padding: 20, background: 'var(--color-bg-elevated)', borderRadius: 10, border: '1px solid var(--color-border-subtle)' }}>
          <SectionHeader icon={Shield} title="7. Privacy Compliance" subtitle="Microsoft Privacy Principles · Temporary embeddings only" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
            {[
              { label: 'Temporary embeddings', done: REPORT.privacy.embeddingsDeleted, note: 'Deleted at 12:12:00' },
              { label: 'Cropped CCTV frames', done: REPORT.privacy.framesDeleted, note: 'Scheduled for deletion' },
              { label: 'Child photo', done: false, note: 'Deletion in 72 hours', scheduled: REPORT.privacy.photoScheduled },
              { label: 'Audit log retained', done: true, note: 'Anonymised metadata only' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', gap: 8, padding: '10px 12px', borderRadius: 7, background: 'var(--color-bg-inset)', border: `1px solid ${item.done ? 'rgba(16,185,129,0.25)' : item.scheduled ? 'rgba(245,158,11,0.25)' : 'var(--color-border-subtle)'}` }}>
                {item.done
                  ? <CheckCircle size={14} style={{ color: '#10B981', flexShrink: 0, marginTop: 1 }} />
                  : item.scheduled
                    ? <Clock size={14} style={{ color: '#F59E0B', flexShrink: 0, marginTop: 1 }} />
                    : <Trash2 size={14} style={{ color: 'var(--color-text-muted)', flexShrink: 0, marginTop: 1 }} />
                }
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-primary)' }}>{item.label}</div>
                  <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 1 }}>{item.note}</div>
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.6 }}>
            {REPORT.privacy.retentionNote}
          </p>
        </motion.section>

        {/* 8. AI Reasoning Trail */}
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ marginBottom: 28, padding: 20, background: 'var(--color-ai-trail)', borderRadius: 10, border: '1px solid rgba(139,92,246,0.2)' }}>
          <SectionHeader icon={Brain} title="8. AI Reasoning Summary" subtitle="Plain English explanation generated by Azure OpenAI" />
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.75, margin: 0, fontFamily: 'monospace' }}>
            {REPORT.aiSummary}
          </p>
          <div style={{ marginTop: 12, fontSize: 10, fontFamily: 'monospace', color: 'var(--color-ai-primary)' }}>
            Generated by Azure AI Foundry Coordinator Agent · Powered by Azure OpenAI GPT-4 · Case closure: 2026-06-11T12:11:12Z
          </div>
        </motion.section>

        {/* Footer */}
        <div style={{ textAlign: 'center', padding: '16px 0', borderTop: '1px solid var(--color-border-subtle)' }}>
          <div style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--color-text-muted)', letterSpacing: '0.08em' }}>
            SPOTJR AI SECURITY SYSTEM · POWERED BY MICROSOFT AZURE AI FOUNDRY · REPORT ID: RPT-{REPORT.caseId}-2026
          </div>
          <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 4 }}>
            This report was generated automatically. All AI outputs are recommendations — human verification was performed at each critical decision point.
          </div>
        </div>
      </div>
    </div>
  )
}
