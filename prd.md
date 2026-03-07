# Product Requirements Document (PRD) 
## Tabi Po Foundation — Grant Management Dashboard

**Date:** March 6, 2026
**Status:** Draft / Blueprint Phase
**Product Name:** Tabi Po Grant Lifecycle System

---

## 1. Executive Summary
**Vision:** Provide a unified, "one-stop" grant lifecycle management system tailored for the Tabi Po Foundation to track grants from prospect to close-out. The platform simplifies tracking, automates follow-ups, streamlines compliance for projects like "Roots & Rivers", and heavily leverages AI to reduce manual data entry and draft communications tailored to specific donor personas.

**Target Audience:** 
Small foundation team (~2 core members) managing approximately 20 active/prospective grants simultaneously.

---

## 2. Functional Requirements By Core Module

### Module A: Grant Pipeline Tracker
- **Stage Tracking:** Grants flow through 9 stages (Prospect ➔ LOI Draft ➔ LOI Submitted ➔ Invited to Apply ➔ Proposal Submitted ➔ Awarded ➔ Declined ➔ Active Grant ➔ Closed).
- **Views:** Kanban (drag-and-drop), Table (spreadsheet view), Calendar (deadlines).
- **Compliance Gate (Mandatory):** Free, Prior and Informed Consent (FPIC) confirmation is required before setting a grant to "Active" status. This includes logging the consent date and linking evidence documentation.
- **Priority Cycle Alerts:** The system flags high-priority, pre-programmed deadline cycles based on foundation trends (e.g., California Environmental Foundations).

### Module B: Follow-Up Engine & AI Email Automation
- **Email Triggers:** Automated alerts and AI-generated drafts trigger based on elapsed time without response, upcoming deadlines, or completed lifecycle stages.
- **AI Classification via Gmail:** Monitors incoming emails from funder domains and automatically categorizes them (e.g., Invited, Awarded, Rejected, Needs Info), suggesting pipeline status changes.
- **Project Glossary:** AI automatically identifies technical/indigenous terms (e.g., *Bantay Bukid*, *FPIC*, *Shorea*) and appends concise definitions for US-based reviewers.
- **Donor Personas:** Email generation adapts to 3 personas (Scientific/Conservation, Humanitarian/Social, Innovation/Tech) to match the funder focus.

### Module C: Document Generator & Evidence Locker
- **Letterhead Auto-population:** Generates branded documents (LOIs, proposals) with organization credentials, merge fields, and standardized letterheads using `docx.js`.
- **Evidence Locker:** Centralized repository for impact data per grant (patrol logs, KoBo/ODK data, biodiversity photos).
- **AI Impact Statements:** Gemini automatically parses evidence metadata to generate data-backed progress statements suitable for donor updates.

### Module D: Calendar & Deadline Hub
- **Integration:** Two-way sync with Google Calendar for LOIs, proposal deadlines, reporting dates, and funder meetings.
- **Automated Scheduling:** Pipeline deadlines automatically inject scheduled events and pre-event reminders.

### Module E: Post-Award Compliance Tracker & Budgeting
- **Project Budgeting (e.g., Roots & Rivers):** Tracks actuals vs. budget across hard-coded categories (Direct Restoration, Field Protection, Science & Monitoring, Governance, Operations).
- **Multi-Currency:** Toggles between USD for donor reporting and PHP for local field expenses. Expense logging includes receipt uploads.
- **Compliance Checklist:** Tracks reporting cadences per funder type (Federal vs. Corporate vs. Foundation).

### Module F: Team & Permissions
- **Roles:** Admin, Grant Manager, Viewer.
- **Activity Log:** Comprehensive audit trail capturing user actions per grant (e.g., stage updates, emails sent).

### Module G: AI-Powered Funder Intelligence
- **Intelligent Parsing:** Gemini extracts structured metadata (deadlines, grant ranges, focus areas) directly from PDF RFPs or pasted website URLs.
- **Funder CRM:** Contains pre-loaded database of 50+ environment/conservation funders (e.g., Packard, Moore, National Geographic), manageable by the team.

---

## 3. Product Architecture

### 3.1 Tech Stack
- **Frontend / Framework:** Next.js 14 (App Router) with React 19, Tailwind CSS v3.4.17, and shadcn/ui.
- **Backend / Database:** Firebase Firestore (NoSQL) with Firebase Cloud Functions for background tasks.
- **Authentication:** Firebase Auth (Google OAuth 2.0).
- **Automations / Generative AI:** Google Gemini API (1.5 Flash) for parsing and text generation.
- **Integrations:** Google Workspace APIs (Gmail, Calendar, Drive).
- **File Document Generation:** `docx.js`, `file-saver`.

### 3.2 Key Data Entities (Firestore)
- `/grants/{grantId}`: Primary record handling state, dates, and related project links.
- `/grants/{grantId}/documents` and `/evidence`: Tied documents and impact proof.
- `/grants/{grantId}/expenses`: Budget actuals tracked against standard categories.
- `/funders/{funderId}`: CRM records of prospective and active foundations.
- `/settings`: Organization configurations, email signatures, the glossary, budget categories, and donor personas.

---

## 4. MVP Feature Rollout Timeline (7 Weeks)

* **Phase 1: Core Pipeline (Week 1-2):** Basic Kanban tracking, core grant/funder models, 50+ pre-seed funder list.
* **Phase 2: AI Extraction (Week 3):** Prompt-driven PDF/URL parsing to auto-fill grant and funder information.
* **Phase 3: Calendar & Follow-ups (Week 4):** Google Calendar integration, deadline alerts, logic rules for standard follow-ups.
* **Phase 4: Documents (Week 5):** `docx.js` letterhead generator and Drive document linking.
* **Phase 5: Gmail & Compliance (Week 6):** Cloud Function integration for Gmail webhook monitoring, FPIC gating, and budget tracking.
* **Phase 6: Polish & Launch (Week 7):** Analytics dashboard, mobile responsive tweaks, role access testing.

---

## 5. Security & Non-Functional Requirements
- **Performance:** App operates entirely serverless via Firebase Hosting & Next.js static asset delivery.
- **Security:** Strict Firestore rules (`admin` vs `manager` vs `viewer`), no SSNs stored, 2FA strictly enforced via Google Workspace, secrets maintained only via Firebase/Platform environments.
- **Cost Efficiency:** Targets entirely free tier utilization (under 50k DB reads/day, utilizing $0.000125/1k token cost of Gemini 1.5 Flash). Expected long-term operational cost: $2-$5/mo.
