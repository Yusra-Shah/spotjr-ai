# SpotJr

AI-powered missing child detection system built on Microsoft Foundry and Foundry IQ.

Built for Microsoft Agents League Hackathon 2026 — Reasoning Agents track.

## What SpotJr Does

SpotJr turns existing CCTV cameras into an autonomous rescue intelligence network. When a child goes missing in a mall or public venue, SpotJr activates a multi-agent pipeline that reconstructs the child's movement, predicts their next location, scores the risk, and coordinates guard dispatch — all in under 2 minutes.

## Microsoft IQ Integration

SpotJr uses **Foundry IQ** as the core reasoning layer:
- Azure AI Foundry agents orchestrate the full multi-step reasoning pipeline
- Foundry IQ grounds the child description analysis and risk reasoning in structured knowledge
- Azure OpenAI generates plain-English explanations of every AI decision
- Azure AI Vision analyzes CCTV frames for person detection and attribute matching

## Multi-Agent Pipeline (Reasoning Chain)

1. **Case Intake Agent** — parses natural language child description into structured visual attributes
2. **Vision Search Agent** — scans CCTV clips using Azure AI Vision, matches against description
3. **Timeline Builder** — reconstructs chronological movement path across cameras
4. **Prediction Agent** — uses graph-based reasoning over mall zone graph to predict next location
5. **Risk Scorer** — calculates 0-100 risk score from 5 weighted factors (exit proximity, time alone, etc.)
6. **Guard Dispatcher** — generates actionable instructions and dispatches nearest available guard
7. **Report Generator** — produces full incident report via Azure OpenAI, deletes temporary embeddings

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Backend | FastAPI, Python 3.12 |
| AI Orchestration | Microsoft Foundry, Azure AI Foundry Agents |
| Microsoft IQ | Foundry IQ |
| Vision | Azure AI Vision |
| Language Model | Azure OpenAI GPT-4o |
| Graph Reasoning | NetworkX |
| Real-time | WebSockets |
| Deployment | Azure Container Apps |

## Setup

```bash
# Backend
cd backend
cp .env.example .env
# Fill in Azure credentials in .env
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend
cd frontend
cp ../.env.example .env.local
npm install
npm run dev
```

## Environment Variables

Copy `.env.example` to `.env` and fill in:
- `AZURE_AI_PROJECT_ENDPOINT` — your Azure AI Foundry project endpoint
- `AZURE_OPENAI_ENDPOINT` — Azure OpenAI endpoint
- `AZURE_OPENAI_API_KEY` — Azure OpenAI key
- `AZURE_AI_VISION_ENDPOINT` — Azure AI Vision endpoint
- `AZURE_AI_VISION_KEY` — Azure AI Vision key

All services fall back to synthetic demo data if credentials are not configured.

## Demo

The demo uses synthetic CCTV clips and pre-seeded detection data. No real child data, no PII, no real camera footage.

Demo accounts:
- Operator: `operator` / `spotjr2026`
- Guard: `guard` / `spotjr2026`

## Privacy and Safety

SpotJr is designed as a privacy-first system:
- Temporary embeddings only — deleted immediately after case closure
- No permanent facial recognition database
- Human-in-the-loop verification before case closure
- All AI outputs labeled as "possible match" not "confirmed"
- Full audit trail of all AI decisions

## Synthetic Data Notice

All data used in this demo is synthetic. No real missing child cases, no real CCTV footage, no real PII was used in building or demonstrating this system.
