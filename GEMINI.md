# GEMINI.md - Tabi Po Foundation Grant Dashboard

## Project Overview
The **Tabi Po Foundation Grant Management Dashboard** is a comprehensive grant lifecycle system designed for a small team managing ~20 active grants. It integrates field data collection (KoBoToolbox), impact monitoring, and AI-powered document generation to streamline the "Prospect to Closed" workflow with a strong emphasis on **FPIC (Free, Prior and Informed Consent)** compliance.

## Tech Stack
- **Framework**: Next.js 14/15 (App Router, TypeScript)
- **Database & Auth**: Firebase (Firestore, Auth, Hosting)
- **AI Engine**: Google Gemini API (1.5 Flash) for data extraction and document drafting
- **Integrations**: 
  - **Google Workspace**: Gmail, Calendar, and Drive (via custom CLI wrapper)
  - **Field Data**: KoBoToolbox (API v2)
  - **Monitoring**: Scrapers for live impact dashboards (`roots2river.vercel.app`)
- **Styling**: Tailwind CSS + GSAP for animations

## Core Modules & Features

### 1. Grant Pipeline Tracker
- **Kanban Board**: Drag-and-drop interface for tracking grants through 9 stages (Prospect to Closed).
- **FPIC Compliance Gate**: Mandatory documentation and consent logging required to move grants to "Active" status.
- **Priority Alerts**: Automated banners for key 2026 funding cycles.

### 2. KoBo Field Data Integration
- **Auto-Sync**: Connects to KoBoToolbox to fetch:
  - Tree Planting Logs (survival rates, species counts)
  - Watershed Monitoring (water quality, flow)
  - Bantay Bukid Patrol Reports (incidents, area covered)
  - Photo Stories (visual evidence)
- **Data Mapping**: Transforms raw field submissions into report-ready metrics.

### 3. AI-Powered Report & LOI Generator
- **Multi-Persona Drafting**: Tailors language for *Scientific*, *Humanitarian*, or *Innovation* donor personas.
- **Auto-Report Generator**: Combines KoBo data and scraped impact metrics into branded `.docx` reports and email narratives.
- **Glossary Engine**: Auto-appends definitions for Filipino cultural and technical terms (e.g., *Bantay Bukid*, *ANR*).

### 4. Impact Scraper
- **Live Sync**: Scrapes metrics from the public-facing Roots & Rivers impact dashboard to ensure reports use the latest field achievements.

### 5. Google Workspace CLI Wrapper
- **Unified Interface**: A custom library (`google-workspace-cli.ts`) that simplifies Gmail drafting, Calendar event creation, and Drive folder management.

## Directory Structure

```text
/
├── functions/              # Firebase Cloud Functions (Reminders, Sync)
├── public/                 # Branding & Assets
├── src/
│   ├── app/                # Next.js App Router (Dashboard & API)
│   │   ├── api/            # Integration Endpoints (Kobo, Gemini, Google)
│   │   └── dashboard/      # Main UI Views (Calendar, Field Data, Reports)
│   ├── components/         # Modular UI (Kanban, FPIC, Kobo Data, etc.)
│   ├── hooks/              # Custom React Hooks for data & integrations
│   ├── lib/                # Core Logic (Scrapers, Generators, CLI Wrappers)
│   │   ├── firebase/       # DB Configuration
│   │   └── google/         # Google Workspace Implementation
│   └── types/              # TypeScript Definitions for Grants & Metrics
```

## Key Workflows

### New Grant Extraction
1. Upload RFP PDF or paste Funder URL.
2. Gemini extracts deadlines, amounts, and focus areas.
3. Funder record and Prospect grant are auto-created.

### Monitoring Report Cycle
1. **Reminder**: 14 days before due date, system auto-syncs KoBo and Impact data.
2. **Drafting**: 7 days before, Gemini generates a draft report based on synced data.
3. **Review**: Team reviews the Word doc and cover email in the dashboard.
4. **Submission**: Send via Gmail and log to Drive with one click.

## Deployment
- **Frontend**: `firebase deploy --only hosting`
- **Backend**: `firebase deploy --only functions`
- **Rules**: `firebase deploy --only firestore:rules`

---
*For technical specifications, refer to `grant-dashboard-blueprint-v5-roots-rivers.md` and `blueprint-v6-additions.md`.*
