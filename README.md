# SpotJr

AI-powered missing child detection system built on Microsoft Foundry and Foundry IQ.

Built for Microsoft Agents League Hackathon 2026 - Reasoning Agents track.

## Stack
- Frontend: Next.js 14, TypeScript, Tailwind CSS
- Backend: FastAPI, Python
- AI: Microsoft Foundry, Foundry IQ, Azure AI Vision, Azure OpenAI
- Database: Azure Cosmos DB
- Deployment: Azure Container Apps

## Setup
Copy `.env.example` to `.env` and fill in your Azure credentials.

## Architecture
Multi-agent pipeline: Case Intake > Vision Search > Timeline Builder > Risk Scorer > Guard Dispatcher > Report Generator

All data used in demos is synthetic. No real child data, no PII.
