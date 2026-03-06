# Grant Management Dashboard Blueprint
## Tabi Po Foundation — One-Stop Grant Lifecycle System

**Target Users:** 2 team members  
**Volume:** ~20 grants tracked at any time  
**Tech Stack:** Next.js 14 + Firebase (Firestore) + Google Workspace APIs + Gemini API  
**Hosting:** Firebase Hosting (CLI deployment)  
**Integrations:** Google Calendar, Gmail, Drive + AI-powered extraction  

---

## 1. Dashboard Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        MAIN DASHBOARD                                │
├──────────────┬──────────────┬───────────────┬──────────────────────┤
│   PIPELINE   │   CALENDAR   │   DOCUMENTS   │   COMPLIANCE         │
│   TRACKER    │   & TASKS    │   & TEMPLATES │   TRACKER            │
├──────────────┴──────────────┴───────────────┴──────────────────────┤
│                     QUICK ACTIONS BAR                               │
│  [+ New LOI]  [+ Log Follow-up]  [📅 Deadlines]  [🔔 Alerts]       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Modules

### Module A: Grant Pipeline Tracker

**Purpose:** Track every grant from discovery to close-out

**Pipeline Stages:**
| Stage | Status Colors | Key Actions |
|-------|---------------|-------------|
| 1. Prospect | 🔵 Blue | Research funder, check fit |
| 2. LOI Draft | 🟡 Yellow | Generate LOI from template |
| 3. LOI Submitted | 🟠 Orange | Log submission, set follow-up |
| 4. Invited to Apply | 🟣 Purple | Full proposal mode |
| 5. Proposal Submitted | 🟠 Orange | Track review timeline |
| 6. Awarded | 🟢 Green | Activate compliance tracker |
| 7. Declined | ⚫ Gray | Log reason, archive learnings |
| 8. Active Grant | 🟢 Green | Reports, drawdowns, monitoring |
| 9. Closed | ⬜ White | Final report submitted |

**Data Fields per Grant:**
```
- Funder Name
- Grant Program
- Amount Requested (USD)
- Project Linked (e.g., "Roots & Rivers")
- Primary Contact (Name, Email, Phone)
- Current Stage
- LOI Deadline
- Full Proposal Deadline
- Decision Expected Date
- Last Contact Date
- Next Follow-up Date ← AUTO-CALCULATED
- Days Since Last Contact ← REAL-TIME
- Notes/Activity Log
- Linked Documents (Drive)
- Assigned Team Member
- FPIC Consent Date ← REQUIRED BEFORE ACTIVE (see below)
- Donor Persona (Scientific/Humanitarian/Innovation)
```

**Kanban View:** Drag-and-drop cards between stages  
**Table View:** Sortable/filterable spreadsheet view  
**Calendar View:** Deadline-focused timeline

---

#### A2: FPIC Compliance Gate (Mandatory)

**Requirement:** Cannot move grant from "Prospect" → "Active Grant" without logging FPIC

**FPIC = Free, Prior and Informed Consent**
Required community approval for projects affecting indigenous/local lands

**UI Blocker:**
```
┌─────────────────────────────────────────────────────────────┐
│  ⚠️ FPIC COMPLIANCE REQUIRED                                │
│  ─────────────────────────────────────────────────────────  │
│  Before activating this grant, you must confirm:            │
│                                                             │
│  ☐ Community consultation completed                        │
│  ☐ Consent documented (meeting minutes, signatures)        │
│  ☐ FPIC date logged                                        │
│                                                             │
│  FPIC Consent Date: [Select Date]                          │
│  Documentation:     [Upload or Link to Drive]              │
│                                                             │
│  [Confirm FPIC Compliance]                                  │
└─────────────────────────────────────────────────────────────┘
```

**Stored:** `fpicConsentDate` and `fpicDocumentUrl` in grant record

---

#### A3: 2026 Priority Deadline Alerts

**Pre-Programmed High-Priority Cycles (California Environmental Foundations):**

| Month | Cycle | Foundations | Alert Type |
|-------|-------|-------------|------------|
| **March 2026** | Spring LOI | Packard, Moore, Hewlett | 🔴 30 days before |
| **June 2026** | Summer/Fall Proposal | Christensen, ClimateWorks | 🔴 30 days before |
| **September 2026** | Year-End Planning | Patagonia, REI, Corporate | 🔴 30 days before |

**Dashboard Alert Banner:**
```
┌─────────────────────────────────────────────────────────────┐
│  🔔 PRIORITY CYCLE ALERT                                    │
│  ─────────────────────────────────────────────────────────  │
│  March 2026 is a high-priority LOI cycle for California    │
│  environmental foundations.                                 │
│                                                             │
│  📋 Recommended Actions:                                    │
│  • Finalize Roots & Rivers LOI for Packard (due Mar 15)    │
│  • Research Moore Foundation spring priorities             │
│  • Update project metrics for Q1 reporting                 │
│                                                             │
│  [View All March Deadlines]  [Dismiss]                      │
└─────────────────────────────────────────────────────────────┘
```

**Stored in Firestore:** `/settings/priorityCycles`

---

### Module B: Follow-up Engine & Email Automation

**Purpose:** Never miss a follow-up; AI-generated emails with your review

**Follow-up Logic Rules:**
| Condition | Action |
|-----------|--------|
| LOI submitted + 14 days, no response | Auto-draft Follow-up #1 |
| LOI submitted + 30 days, no response | Auto-draft Follow-up #2 (urgent) |
| Proposal submitted + 60 days | Auto-draft status check |
| Last contact > 45 days (any stage) | Re-engagement prompt |
| Calendar meeting ends | Auto-draft Meeting Follow-up |
| Quarterly (active grants) | Auto-draft Mid-Grant Check-in |
| 60 days before grant close | Auto-draft Continuing Relationship |

**Follow-up Queue (Daily View):**
- Shows all grants needing action TODAY
- One-click "Draft Email" → AI generates personalized email
- One-click "Open in Gmail" → sends from your account
- You always review before sending

---

### Module B2: AI Email Generation System

**12 Email Types (AI-Generated, Context-Aware):**

| # | Template | Trigger | Auto-Draft? |
|---|----------|---------|-------------|
| 1 | LOI Cover Email | Manual | ✅ |
| 2 | Follow-up #1 | 14 days, no response | ✅ |
| 3 | Follow-up #2 | 30 days, no response | ✅ |
| 4 | Meeting Request | Manual | ✅ |
| 5 | Meeting Follow-up | After calendar event | ✅ |
| 6 | Information Request Response | AI detects "need more info" | ✅ |
| 7 | Thank You (Invited to Apply) | AI detects invitation | ✅ |
| 8 | Thank You (Awarded) | Stage → Awarded | ✅ |
| 9 | Gracious Decline Response | AI detects rejection | ✅ |
| 10 | Report Submitted Confirmation | After report marked complete | ✅ |
| 11 | Mid-Grant Check-in | Quarterly (active grants) | ✅ |
| 12 | Continuing Relationship | 60 days before grant close | ✅ |

**Gmail AI Classification (Auto-Detect Responses):**

| AI Detects | Response Type | Auto-Action |
|------------|---------------|-------------|
| "pleased to invite", "submit full proposal" | **Invited** | Stage → Invited, draft Thank You |
| "approved", "award", "grant agreement" | **Awarded** | Stage → Awarded, draft Thank You |
| "unfortunately", "not able to fund" | **Rejected** | Stage → Declined, draft Gracious Response |
| "additional information", "please provide" | **Needs Info** | Flag urgent, draft Info Response |
| "meeting", "call", "schedule" | **Meeting** | Create calendar task |

---

#### B2.1: Glossary Integration Engine (Auto-Terminology)

**Purpose:** Ensure US-based reviewers understand Filipino/technical terms

**How It Works:**
1. AI scans generated email/document for glossary terms
2. Auto-appends parenthetical definitions on first use
3. Maintains readability while educating funder

**Project Glossary (Hard-Coded):**

| Term | Definition (auto-appended) |
|------|----------------------------|
| Tabi Po | Filipino phrase meaning "excuse me, spirits" — a cultural expression of respect for nature |
| Bantay Bukid | Community forest guards; local stewards who patrol and protect watershed areas |
| Engkanto | Nature spirits in Filipino folklore; referenced to honor indigenous ecological wisdom |
| ANR | Assisted Natural Regeneration — a low-cost forest restoration method that enhances natural seedling growth |
| Sitio | A small village or sub-district within a barangay |
| Barangay | The smallest administrative division in the Philippines |
| NNNP | Northern Negros Natural Park — a protected area and biodiversity hotspot |
| PAMB | Protected Area Management Board |
| PAO | Protected Area Office |
| FPIC | Free, Prior and Informed Consent — required community approval for projects affecting indigenous lands |
| DENR | Department of Environment and Natural Resources (Philippines) |
| LGU | Local Government Unit |
| Shorea | A genus of hardwood trees native to Southeast Asia; key reforestation species |
| Negros Bleeding-heart | *Gallicolumba keayi* — a critically endangered dove endemic to Negros and Panay islands |
| Rufous-headed Hornbill | *Rhabdotorrhinus waldeni* — a critically endangered hornbill endemic to the Visayas |
| Visayan Warty Pig | *Sus cebifrons* — a critically endangered pig species endemic to the Visayan islands |
| KoBo/ODK | KoBoToolbox / Open Data Kit — mobile data collection platforms for field surveys |

**Example Output:**
```
Before: "Our Bantay Bukid patrol the watershed weekly."

After:  "Our Bantay Bukid (community forest guards) patrol the watershed weekly."
```

**Settings:** Toggle glossary on/off per document type

---

#### B2.2: Donor Persona Filter

**Purpose:** Tailor language to funder priorities

**Select Persona Before Generating:**

| Persona | Language Focus | Best For |
|---------|----------------|----------|
| 🔬 **Scientific/Conservation** | Shorea species, carbon sequestration metrics, Negros Bleeding-heart Dove, IUCN status, biodiversity indices | Moore, Packard, National Geographic, WWF |
| 🤝 **Humanitarian/Social** | Aluyan Caduha-an Farmers Association, poverty alleviation, community leadership, livelihood uplift, women participation | Ford, Christensen, Open Society |
| 💡 **Innovation/Tech** | KoBo/ODK data pipelines, drone monitoring, real-time dashboards, camera trap AI, GIS mapping | Google.org, Microsoft AI for Earth, tech foundations |

**UI Flow:**
```
┌─────────────────────────────────────────────────────────────┐
│  📝 GENERATE LOI                                            │
│  ─────────────────────────────────────────────────────────  │
│  Funder: Moore Foundation                                   │
│  Project: Roots & Rivers                                    │
│                                                             │
│  SELECT DONOR PERSONA:                                      │
│  ┌─────────────────┐ ┌─────────────────┐ ┌───────────────┐ │
│  │ 🔬 Scientific   │ │ 🤝 Humanitarian │ │ 💡 Innovation │ │
│  │   [SELECTED]    │ │                 │ │               │ │
│  └─────────────────┘ └─────────────────┘ └───────────────┘ │
│                                                             │
│  ☑️ Include Glossary Definitions                            │
│                                                             │
│  [Generate Draft]                                           │
└─────────────────────────────────────────────────────────────┘
```

**Stored per Funder:** Default persona saved to funder record for future use

---

**Tone:** Professional but warm ("Hi Sarah" style)

**AI Email Generation Flow:**
```
1. Trigger fires (e.g., 14 days since LOI)
2. System gathers context:
   - Funder name, contact name
   - Project details (Roots & Rivers)
   - Communication history
   - Your custom instructions
   - Selected Donor Persona
3. Gemini generates personalized email
4. Glossary scan: auto-append definitions
5. You review in dashboard
6. Click "Open in Gmail" to send
```

**Customizable Email Settings (Settings Page):**
```
┌─────────────────────────────────────────────────────────────┐
│  ⚙️ EMAIL GENERATION SETTINGS                               │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  ORGANIZATION CREDENTIALS (auto-included)                   │
│  ☑️ 501(c)(3) status                                        │
│  ☑️ EIN                                                     │
│  ☑️ Years of operation                                      │
│  ☐ Total grants received to date                           │
│                                                             │
│  GLOSSARY SETTINGS                                          │
│  ☑️ Auto-append definitions for Filipino terms              │
│  ☑️ Auto-append definitions for technical terms             │
│  ☐ Include definitions on every mention (vs. first only)  │
│                                                             │
│  CUSTOM AI INSTRUCTIONS                                     │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Always mention our partnership with Aluyan Caduha-an  │ │
│  │ Farmers Association. Emphasize community-led approach.│ │
│  │ Reference our track record in Northern Negros.        │ │
│  │ Keep tone humble but confident.                       │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  SIGNATURE BLOCK                                            │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ {{your_name}}                                         │ │
│  │ {{your_title}}                                        │ │
│  │ Tabi Po Foundation                                    │ │
│  │ 501(c)(3) Tax-Exempt | EIN: XX-XXXXXXX               │ │
│  │ www.tabipo.org                                        │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Stored in Firestore:** `/settings/emailConfig`

---

### Module C: Document Generator & Templates

**Purpose:** Generate branded documents instantly with auto-populated letterhead

**Letterhead Auto-Population:**
Your documents will automatically include:
```
┌─────────────────────────────────────────────────────────────┐
│  [TABI PO LOGO]                                             │
│                                                             │
│  TABI PO FOUNDATION                                         │
│  A 501(c)(3) Tax-Exempt Organization | EIN: XX-XXXXXXX     │
│                                                             │
│  [US Address Line 1]                                        │
│  [City, State ZIP]                                          │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  [DOCUMENT CONTENT HERE]                                    │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  📧 email@tabipo.org | 🌐 www.tabipo.org | 📞 (XXX) XXX-XXXX│
└─────────────────────────────────────────────────────────────┘
```

**Stored in Firestore (`/settings/letterhead`):**
- Logo URL (uploaded to Firebase Storage or Drive)
- Organization name
- 501(c)(3) statement with EIN
- US mailing address
- Contact email, phone, website

**Auto-Fill Merge Fields (per document type):**
| Field | Source |
|-------|--------|
| `{{funder_name}}` | Grant record |
| `{{funder_contact}}` | Contact record |
| `{{project_name}}` | Project record |
| `{{amount_requested}}` | Grant record |
| `{{date}}` | Current date (formatted) |
| `{{deadline}}` | Grant deadline |
| `{{your_name}}` | Current user |
| `{{your_title}}` | User profile |

**Template Library:**
| Document Type | Auto-Fill Fields |
|---------------|------------------|
| Letter of Inquiry (LOI) | Funder name, project, amount, date |
| Full Proposal | All project data + budget |
| Budget Narrative | Line-item justifications |
| Cover Letter | Funder contact, submission date |
| Thank You Letter | Grant amount, project name |
| Progress Report | KPIs, milestones, photos |
| Final Report | Outcomes, financials, lessons |

**Document Generation Flow:**
```
1. User clicks "Generate LOI" on grant record
2. System pulls:
   - Letterhead from /settings/letterhead
   - Grant data from /grants/{id}
   - Funder/contact from /funders/{id}
   - Project from /projects/{id}
3. docx.js builds Word document with:
   - Header: Logo + org name + 501(c)(3) line
   - Body: Template with merged fields
   - Footer: Contact info
4. Auto-save to Google Drive: /Grants/[Funder]/[Year]/
5. Link document back to grant record
```

**Document Storage:**
- Auto-save to Google Drive: `/Grants/[Funder Name]/[Year]/`
- Version control via Drive's native versioning
- Quick-link from dashboard to all grant documents

---

#### C2: Evidence Locker (Impact Documentation)

**Purpose:** Centralized proof repository for progress reports and donor updates

**Per-Grant Evidence Locker:**
```
┌─────────────────────────────────────────────────────────────┐
│  📁 EVIDENCE LOCKER: Moore Foundation - Roots & Rivers      │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  🔗 LINKED SOURCES                                          │
│  ├── Google Drive: /Grants/Moore/2026/Evidence/            │
│  └── Impact Dashboard: roots2river.vercel.app/impact        │
│                                                             │
│  📂 EVIDENCE CATEGORIES                                     │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ 🌳 Restoration Photos (23 files)              [View] │ │
│  │ 📋 Patrol Logs (12 files)                     [View] │ │
│  │ 🐦 Biodiversity Sightings (8 files)           [View] │ │
│  │ 🗺️ Drone Survey Maps (3 files)                [View] │ │
│  │ 📊 KoBo/ODK Data Exports (6 files)            [View] │ │
│  │ 📹 Video Documentation (2 files)              [View] │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ✨ AI IMPACT STATEMENTS (Auto-Generated from Evidence)    │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ "As of March 2026, Bantay Bukid patrols have logged  │ │
│  │  47 incidents across 12 weekly reports. Biodiversity │ │
│  │  monitoring captured 3 sightings of Negros Bleeding- │ │
│  │  heart Dove, exceeding baseline expectations."        │ │
│  │                                        [Copy] [Edit] │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  [+ Upload Evidence]  [🔄 Sync from Drive]  [📝 Generate Statement] │
└─────────────────────────────────────────────────────────────┘
```

**Evidence Types:**
| Type | Source | AI Reads |
|------|--------|----------|
| Patrol Logs | PDF/Photos from Bantay Bukid | Dates, incidents, locations |
| Biodiversity Photos | Camera traps, field photos | Species, GPS, timestamps |
| Restoration Progress | Drone images, plot photos | Area covered, tree counts |
| KoBo/ODK Exports | Field survey data | Survival rates, measurements |
| Community Records | Meeting notes, attendance | Participation numbers, FPIC |

**AI "Impact Proof" Generation:**
```
1. User clicks "Generate Impact Statement"
2. Gemini scans Evidence Locker metadata:
   - File names, dates, counts
   - Extracted text from PDFs
   - Photo EXIF data (GPS, dates)
   - KoBo survey summaries
3. Generates donor-ready paragraph
4. User reviews and edits
5. Insert into Progress Report
```

**Integration with roots2river.vercel.app:**
- Pulls live metrics from impact dashboard
- Auto-updates evidence counts
- Links to public-facing visualizations

**Stored in Firestore:** `/grants/{grantId}/evidence/{evidenceId}`

---

### Module D: Calendar & Deadline Hub

**Purpose:** Unified view of all critical dates

**Synced with Google Calendar:**
- LOI Deadlines
- Proposal Deadlines
- Report Due Dates
- Funder Meetings
- Board Meetings (grant-related)
- Follow-up Reminders

**Calendar Views:**
1. **Month View:** All deadlines at a glance
2. **Week View:** Detailed task planning
3. **Agenda View:** Chronological list

**Auto-Created Events:**
- When you set a deadline in the pipeline → creates Google Calendar event
- 7-day and 1-day reminders auto-added
- Assignee gets calendar invite

---

### Module E: Compliance Tracker (Post-Award)

**Purpose:** Stay compliant with every awarded grant — with Roots & Rivers budget precision

**Per-Grant Compliance Dashboard:**
```
┌─────────────────────────────────────────────────────────────┐
│  GRANT: XYZ Foundation - Roots & Rivers 2026               │
│  Amount: $50,000  |  Period: Jan 2026 - Dec 2028           │
├─────────────────────────────────────────────────────────────┤
│  COMPLIANCE CHECKLIST                           STATUS      │
│  ─────────────────────────────────────────────────────────  │
│  ☑️ FPIC Consent Logged (Required)              ✅ Done     │
│  □ MOA/Agreement Signed                         ✅ Done     │
│  □ Restricted Fund Account Set Up               ✅ Done     │
│  □ Budget Tracking Sheet Created                ✅ Done     │
│  □ Quarterly Report Q1 (Apr 2026)               ⏳ Upcoming │
│  □ Quarterly Report Q2 (Jul 2026)               ○ Not Due  │
│  □ Mid-Year Site Visit Scheduled                ○ Not Due  │
│  □ Annual Narrative Report (Jan 2027)           ○ Not Due  │
│  □ Annual Financial Report (Jan 2027)           ○ Not Due  │
│  □ Final Report (Mar 2029)                      ○ Not Due  │
└─────────────────────────────────────────────────────────────┘
```

---

#### E2: Roots & Rivers Budget Tracker (Project-Specific)

**Hard-Coded Budget Categories from Roots2River Budget:**

```
┌─────────────────────────────────────────────────────────────┐
│  💰 ROOTS & RIVERS SPENDING TRACKER                         │
│  ─────────────────────────────────────────────────────────  │
│  Currency: [USD ▼] / PHP    Exchange Rate: ₱56.50 = $1     │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  🌳 DIRECT RESTORATION                    Budget    Spent   │
│  ├── Native Seedling Enrichment           $4,500   $1,200  │
│  ├── Agroforestry Edges                   $2,500     $500  │
│  └── Biodiversity Islands & Watershed     $2,500     $800  │
│                              Subtotal:    $9,500   $2,500  │
│                              [██████░░░░░░░░░░░░░░] 26%    │
│                                                             │
│  🛡️ FIELD PROTECTION                      Budget    Spent   │
│  ├── Bantay Bukid Support                $13,900   $4,634  │
│  ├── Fire Breaks & Equipment              $1,600     $800  │
│  └── Patrol Logs & Reporting                $900     $300  │
│                              Subtotal:   $16,400   $5,734  │
│                              [████████░░░░░░░░░░░░] 35%    │
│                                                             │
│  🔬 SCIENCE & MONITORING                  Budget    Spent   │
│  ├── Drone Flights                        $2,400     $800  │
│  ├── Camera Traps & Biodiversity          $1,500     $700  │
│  ├── Soil/Stream Monitoring                 $900     $300  │
│  └── KoBo/ODK Tools                         $700     $500  │
│                              Subtotal:    $5,500   $2,300  │
│                              [█████████░░░░░░░░░░░] 42%    │
│                                                             │
│  🏛️ GOVERNANCE & CAPACITY                 Budget    Spent   │
│  ├── Trainings & IEC                      $3,000   $1,200  │
│  ├── FPIC & Planning                      $1,000     $500  │
│  └── Co-management MOUs                     $300       $0  │
│                              Subtotal:    $4,300   $1,700  │
│                              [████████░░░░░░░░░░░░] 40%    │
│                                                             │
│  ⚙️ OPERATIONS                            Budget    Spent   │
│  ├── Local Staff (Coordination & M&E)    $14,000   $4,600  │
│  ├── Admin & Financial Reporting          $3,000   $1,000  │
│  └── Inflation/Contingency Buffer         $7,100       $0  │
│                              Subtotal:   $24,100   $5,600  │
│                              [█████░░░░░░░░░░░░░░░] 23%    │
│                                                             │
│  ═══════════════════════════════════════════════════════   │
│  TOTAL PROJECT                           $59,800  $17,834  │
│                              [██████░░░░░░░░░░░░░░] 30%    │
│                                                             │
│  [+ Log Expense]  [📊 Export Report]  [🔄 Sync PHP→USD]    │
└─────────────────────────────────────────────────────────────┘
```

**Multi-Currency Toggle (USD/PHP):**
- Default display: USD (for US donor reporting)
- Toggle to PHP for local expense entry
- Exchange rate: manually set or auto-fetch
- All expenses logged in original currency, converted for reports

**Expense Entry:**
```
┌─────────────────────────────────────────────────────────────┐
│  + LOG EXPENSE                                              │
│  ─────────────────────────────────────────────────────────  │
│  Category:    [Bantay Bukid Support ▼]                      │
│  Amount:      ₱ 15,000                                      │
│  USD Equiv:   $265.49 (auto-calculated)                     │
│  Date:        2026-03-15                                    │
│  Description: March patrol stipends (10 guards)             │
│  Receipt:     [Upload] patrol_march_receipt.pdf             │
│  ─────────────────────────────────────────────────────────  │
│  [Save Expense]                                             │
└─────────────────────────────────────────────────────────────┘
```

**Budget Alerts:**
| Condition | Alert |
|-----------|-------|
| Category >80% spent | ⚠️ Approaching limit |
| Category >100% spent | 🔴 Over budget |
| <25% spent at mid-year | ⚠️ Underspent - review burn rate |
| Contingency accessed | 📋 Log justification required |

**Compliance Requirements by Grant Type:**
| Requirement | Foundation | Federal | Corporate |
|-------------|------------|---------|-----------|
| Quarterly Reports | Sometimes | Usually | Rarely |
| Annual Narrative | Yes | Yes | Yes |
| Annual Financial | Yes | Yes (audited if >$750K) | Sometimes |
| Site Visits | Sometimes | Often | Rarely |
| Expense Documentation | Summary | Line-item | Summary |
| Indirect Cost Limits | Varies | NICRA or 10% | Often 0-10% |

---

### Module F: Team & Permissions

**Purpose:** Multi-user access with role-based permissions

**Roles:**
| Role | Access |
|------|--------|
| Admin | Full access, settings, delete |
| Grant Manager | Pipeline, docs, compliance, edit |
| Viewer | Read-only dashboard access |

**Activity Log:**
- Tracks who did what, when
- "Sarah moved XYZ Grant to 'Awarded'" with timestamp

---

### Module G: AI-Powered Funder Intelligence (Gemini)

**Purpose:** Reduce manual data entry with smart extraction

#### G1: PDF/RFP Parsing
```
┌─────────────────────────────────────────────────────────────┐
│  📄 UPLOAD RFP / GUIDELINES                                 │
│  ─────────────────────────────────────────────────────────  │
│  [Drop PDF here or click to upload]                         │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│  ✨ EXTRACTED INFO (Review before saving)                   │
│  ─────────────────────────────────────────────────────────  │
│  Funder:        Moore Foundation                            │
│  Program:       Marine Conservation Initiative              │
│  Amount:        $50,000 - $150,000                         │
│  LOI Deadline:  March 15, 2026                             │
│  Full Deadline: May 1, 2026                                │
│  Eligibility:   501(c)(3), international projects OK       │
│  Focus Areas:   Marine biodiversity, coastal restoration   │
│  Match Required: No                                         │
│  ─────────────────────────────────────────────────────────  │
│  [✏️ Edit]  [✅ Save as New Funder]  [❌ Discard]           │
└─────────────────────────────────────────────────────────────┘
```

**Flow:**
1. Upload PDF (grant guidelines, RFP, program announcement)
2. Gemini 1.5 Flash extracts structured data
3. Shows preview for your review
4. You confirm → creates funder record + optional grant prospect

#### G2: Website URL Scraping
```
┌─────────────────────────────────────────────────────────────┐
│  🔗 PASTE FUNDER URL                                        │
│  ─────────────────────────────────────────────────────────  │
│  https://www.packard.org/grants-and-investments/           │
│  [🔍 Extract Info]                                          │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│  ✨ EXTRACTED INFO (Review before saving)                   │
│  ─────────────────────────────────────────────────────────  │
│  Funder:        David and Lucile Packard Foundation        │
│  Focus Areas:   Climate, ocean, land, reproductive health  │
│  Grant Range:   $100K - $2M                                │
│  Accepts LOI:   Yes (online portal)                        │
│  Deadline:      Rolling                                     │
│  Geography:     Global, emphasis on Western US             │
│  ─────────────────────────────────────────────────────────  │
│  [✏️ Edit]  [✅ Save as New Funder]  [❌ Discard]           │
└─────────────────────────────────────────────────────────────┘
```

**Flow:**
1. Paste funder website URL
2. System fetches page content
3. Gemini extracts key info
4. You review and confirm

#### G3: Gmail Inbox Monitoring
```
┌─────────────────────────────────────────────────────────────┐
│  📬 DETECTED FUNDER EMAIL                                   │
│  ─────────────────────────────────────────────────────────  │
│  From: grants@moore.org                                     │
│  Subject: RE: Tabi Po Foundation - LOI Submission           │
│  Received: 2 hours ago                                      │
│  ─────────────────────────────────────────────────────────  │
│  🤖 AI Summary:                                             │
│  "Invitation to submit full proposal. Deadline May 1.       │
│   Budget cap $75,000. Attachments: proposal template."      │
│  ─────────────────────────────────────────────────────────  │
│  Matched Grant: Moore Foundation - Roots & Rivers           │
│  Suggested Action: Move to "Invited to Apply" stage         │
│  ─────────────────────────────────────────────────────────  │
│  [✅ Apply Changes]  [👁️ View Email]  [❌ Dismiss]          │
└─────────────────────────────────────────────────────────────┘
```

**Flow:**
1. Gmail API watches inbox (via Cloud Functions)
2. Detects emails from known funder domains
3. Gemini summarizes + suggests action
4. You confirm → updates grant record

#### G4: Pre-Loaded Funder Database

**50+ Conservation/Environment Funders Pre-Seeded:**

| Category | Examples |
|----------|----------|
| **US Foundations** | Moore, Packard, Ford, MacArthur, Hewlett, Christensen, Wyss, Doris Duke, Margaret A. Cargill, Walton Family, ClimateWorks |
| **Corporate** | Patagonia, REI, Salesforce, Google.org, Microsoft AI for Earth, Starbucks Foundation, Levi Strauss |
| **Environment-Specific** | National Geographic, Conservation Fund, Wildlife Conservation Society, Ocean Foundation, Rainforest Trust |

**Each record includes:**
- Funder name, website, focus areas
- Typical grant range
- Application type (LOI, full proposal, portal)
- Deadline pattern (rolling, annual, quarterly)
- Geographic focus
- Notes on fit with Tabi Po

**You can:**
- Browse database → click "Start Application" → creates prospect grant
- Edit/add funders as you discover new ones
- Mark funders as "Not a Fit" to hide them

---

## 3. Google Workspace Integration Details

### Gmail Integration
- **Send emails from dashboard** (via Gmail API)
- **Auto-log sent emails** to grant activity feed
- **Email templates** with merge fields
- **Thread tracking** → see full conversation history per funder

### Google Calendar Integration
- **Two-way sync:** Dashboard deadlines ↔ Google Calendar
- **Meeting scheduling:** Create meetings with funder links
- **Reminders:** Push notifications to team

### Google Drive Integration
- **Auto-folder creation:** `/Grants/[Funder]/[Year]/[Stage]/`
- **Document linking:** Attach any Drive file to a grant
- **Template storage:** Master templates in shared Drive
- **Version history:** Native Drive versioning

### Google Sheets Integration (Optional)
- **Budget tracking:** Link live budget sheets per grant
- **Data export:** One-click export pipeline to Sheets
- **Import:** Bulk import grants from existing spreadsheets

---

## 4. Data Model (Firestore Collections)

```
/grants/{grantId}
  - funderName: string
  - programName: string
  - amountRequested: number
  - projectId: string (reference)
  - stage: string (enum)
  - loiDeadline: timestamp
  - proposalDeadline: timestamp
  - decisionDate: timestamp
  - lastContactDate: timestamp
  - nextFollowupDate: timestamp
  - primaryContactId: string (reference)
  - assignedTo: string (userId)
  - notes: string
  - donorPersona: string (scientific | humanitarian | innovation)
  - fpicConsentDate: timestamp | null (REQUIRED before Active)
  - fpicDocumentUrl: string | null
  - createdAt: timestamp
  - updatedAt: timestamp

/grants/{grantId}/activities/{activityId}
  - userId: string
  - actionType: string
  - description: string
  - timestamp: timestamp

/grants/{grantId}/documents/{docId}
  - type: string (LOI, Proposal, Report, etc.)
  - title: string
  - driveUrl: string
  - driveFileId: string
  - version: number
  - createdAt: timestamp

/grants/{grantId}/compliance/{itemId}
  - requirementType: string
  - dueDate: timestamp
  - status: string (pending, complete, overdue)
  - completedDate: timestamp | null
  - notes: string

/grants/{grantId}/evidence/{evidenceId}
  - type: string (patrol_log, biodiversity_photo, drone_survey, kobo_export, video)
  - title: string
  - driveUrl: string
  - driveFileId: string
  - metadata: {
      date: timestamp
      location: string | null
      species: array<string> | null
      description: string | null
    }
  - uploadedAt: timestamp

/grants/{grantId}/expenses/{expenseId}
  - category: string (enum - see budget categories below)
  - subcategory: string
  - amountOriginal: number
  - currencyOriginal: string (USD | PHP)
  - amountUSD: number
  - exchangeRate: number
  - date: timestamp
  - description: string
  - receiptUrl: string | null
  - createdAt: timestamp

/funders/{funderId}
  - name: string
  - type: string (foundation, federal, corporate)
  - website: string
  - focusAreas: array<string>
  - typicalGrantSize: string
  - applicationCycle: string
  - defaultPersona: string (scientific | humanitarian | innovation)
  - notes: string

/funders/{funderId}/contacts/{contactId}
  - name: string
  - title: string
  - email: string
  - phone: string
  - notes: string

/projects/{projectId}
  - name: string
  - description: string
  - startDate: timestamp
  - endDate: timestamp
  - totalBudget: number
  - status: string

/users/{userId}
  - email: string
  - displayName: string
  - role: string (admin, manager, viewer)
  - photoUrl: string

/settings/letterhead
  - logoUrl: string
  - organizationName: string
  - taxStatus: string (e.g., "501(c)(3) Tax-Exempt Organization")
  - ein: string
  - usAddress: {
      street: string
      city: string
      state: string
      zip: string
    }
  - contactEmail: string
  - contactPhone: string
  - website: string

/settings/emailConfig
  - includeCredentials: {
      taxStatus: boolean
      ein: boolean
      yearsActive: boolean
      totalGrantsReceived: boolean
    }
  - customInstructions: string (AI instructions, e.g., "Always mention partnership with Aluyan Caduha-an Farmers Association...")
  - signatureBlock: string
  - tone: string (e.g., "professional but warm")
  - defaultGreeting: string (e.g., "Hi {{first_name}}")

/grants/{grantId}/emails/{emailId}
  - type: string (LOI, follow_up_1, follow_up_2, thank_you_invited, etc.)
  - subject: string
  - body: string
  - status: string (draft, sent, failed)
  - recipientEmail: string
  - recipientName: string
  - generatedAt: timestamp
  - sentAt: timestamp | null
  - gmailMessageId: string | null

/emailQueue/{queueId}
  - grantId: string
  - emailType: string
  - triggerDate: timestamp
  - status: string (pending, generated, dismissed)
  - generatedEmailId: string | null

/settings/glossary
  - terms: [
      { term: "Tabi Po", definition: "Filipino phrase meaning 'excuse me, spirits'..." },
      { term: "Bantay Bukid", definition: "Community forest guards..." },
      { term: "ANR", definition: "Assisted Natural Regeneration..." },
      // ... all 17+ terms
    ]
  - autoAppendEnabled: boolean
  - firstMentionOnly: boolean

/settings/budgetCategories
  - categories: [
      {
        id: "direct_restoration",
        name: "Direct Restoration",
        subcategories: [
          { id: "seedlings", name: "Native Seedling Enrichment", budgetUSD: 4500 },
          { id: "agroforestry", name: "Agroforestry Edges", budgetUSD: 2500 },
          { id: "biodiversity_islands", name: "Biodiversity Islands & Watershed", budgetUSD: 2500 }
        ]
      },
      {
        id: "field_protection",
        name: "Field Protection",
        subcategories: [
          { id: "bantay_bukid", name: "Bantay Bukid Support", budgetUSD: 13900 },
          { id: "fire_breaks", name: "Fire Breaks & Equipment", budgetUSD: 1600 },
          { id: "patrol_logs", name: "Patrol Logs & Reporting", budgetUSD: 900 }
        ]
      },
      {
        id: "science_monitoring",
        name: "Science & Monitoring",
        subcategories: [
          { id: "drones", name: "Drone Flights", budgetUSD: 2400 },
          { id: "camera_traps", name: "Camera Traps & Biodiversity", budgetUSD: 1500 },
          { id: "soil_stream", name: "Soil/Stream Monitoring", budgetUSD: 900 },
          { id: "kobo_odk", name: "KoBo/ODK Tools", budgetUSD: 700 }
        ]
      },
      {
        id: "governance",
        name: "Governance & Capacity",
        subcategories: [
          { id: "trainings", name: "Trainings & IEC", budgetUSD: 3000 },
          { id: "fpic", name: "FPIC & Planning", budgetUSD: 1000 },
          { id: "mous", name: "Co-management MOUs", budgetUSD: 300 }
        ]
      },
      {
        id: "operations",
        name: "Operations",
        subcategories: [
          { id: "local_staff", name: "Local Staff (Coordination & M&E)", budgetUSD: 14000 },
          { id: "admin", name: "Admin & Financial Reporting", budgetUSD: 3000 },
          { id: "contingency", name: "Inflation/Contingency Buffer", budgetUSD: 7100 }
        ]
      }
    ]
  - defaultExchangeRate: 56.50  // PHP per USD

/settings/priorityCycles
  - cycles: [
      { month: 3, year: 2026, name: "Spring LOI", priority: "high", 
        foundations: ["Packard", "Moore", "Hewlett"] },
      { month: 6, year: 2026, name: "Summer/Fall Proposal", priority: "high",
        foundations: ["Christensen", "ClimateWorks"] },
      { month: 9, year: 2026, name: "Year-End Planning", priority: "high",
        foundations: ["Patagonia", "REI"] }
    ]
  - alertDaysBefore: 30

/settings/donorPersonas
  - personas: [
      {
        id: "scientific",
        name: "Scientific/Conservation",
        icon: "🔬",
        focusTerms: ["Shorea species", "carbon sequestration", "Negros Bleeding-heart Dove", 
                     "IUCN Red List", "biodiversity indices", "endemic species"],
        bestFor: ["Moore", "Packard", "National Geographic", "WWF"]
      },
      {
        id: "humanitarian",
        name: "Humanitarian/Social",
        icon: "🤝",
        focusTerms: ["Aluyan Caduha-an Farmers Association", "poverty alleviation", 
                     "community leadership", "livelihood uplift", "women participation"],
        bestFor: ["Ford", "Christensen", "Open Society"]
      },
      {
        id: "innovation",
        name: "Innovation/Tech",
        icon: "💡",
        focusTerms: ["KoBo/ODK", "drone monitoring", "real-time dashboards", 
                     "camera trap AI", "GIS mapping", "remote sensing"],
        bestFor: ["Google.org", "Microsoft AI for Earth", "tech foundations"]
      }
    ]
```

**Firestore Security Rules (starter):**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write if authenticated
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // Stricter rules for production:
    match /grants/{grantId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'manager'];
    }
    
    match /settings/{doc} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

---

## 5. AI Extraction Implementation (Gemini)

### Gemini Prompts

**PDF Extraction Prompt:**
```typescript
const PDF_EXTRACTION_PROMPT = `
You are a grant research assistant. Extract key information from this grant guidelines document.

Return ONLY valid JSON with these fields (use null if not found):
{
  "funder_name": "string",
  "program_name": "string",
  "amount_min": number,
  "amount_max": number,
  "loi_deadline": "YYYY-MM-DD or null",
  "proposal_deadline": "YYYY-MM-DD or null",
  "eligibility": ["501(c)(3)", "international OK", etc],
  "focus_areas": ["conservation", "biodiversity", etc],
  "geographic_focus": "string",
  "match_required": boolean,
  "application_type": "LOI" | "Full Proposal" | "Online Portal",
  "contact_email": "string or null",
  "website": "string or null",
  "notes": "any important details"
}
`;
```

**URL Extraction Prompt:**
```typescript
const URL_EXTRACTION_PROMPT = `
You are a grant research assistant. Extract funder information from this webpage content.

Return ONLY valid JSON with these fields (use null if not found):
{
  "funder_name": "string",
  "focus_areas": ["string"],
  "grant_range": "string (e.g., '$50K-$200K')",
  "deadline_pattern": "Rolling" | "Annual" | "Quarterly" | "specific date",
  "application_type": "LOI" | "Full Proposal" | "Online Portal",
  "geographic_focus": "string",
  "website": "string",
  "notes": "any relevant details"
}
`;
```

**Email Classification Prompt:**
```typescript
const EMAIL_CLASSIFICATION_PROMPT = `
Analyze this email from a potential grant funder. Classify and summarize.

Return ONLY valid JSON:
{
  "is_grant_related": boolean,
  "email_type": "invitation" | "rejection" | "question" | "info_request" | "report_reminder" | "other",
  "summary": "1-2 sentence summary",
  "suggested_action": "string (e.g., 'Move to Invited to Apply stage')",
  "deadline_mentioned": "YYYY-MM-DD or null",
  "amount_mentioned": number or null
}
`;
```

### Extraction API Routes

**`/api/extract/pdf/route.ts`**
```typescript
// Pseudocode flow
1. Receive PDF file upload
2. Convert PDF to text (pdf-parse library)
3. Send text + PDF_EXTRACTION_PROMPT to Gemini 1.5 Flash
4. Parse JSON response
5. Return extracted data for user review
```

**`/api/extract/url/route.ts`**
```typescript
// Pseudocode flow
1. Receive URL
2. Fetch page content (cheerio or puppeteer for JS sites)
3. Clean HTML to text
4. Send text + URL_EXTRACTION_PROMPT to Gemini
5. Parse JSON response
6. Return extracted data for user review
```

### Gmail Watch Setup (Cloud Function)

```typescript
// functions/src/gmail-watch.ts
// Triggered by Pub/Sub when new email arrives

1. Gmail API push notification received
2. Fetch email content
3. Check sender against known funder domains
4. If match: send to Gemini for classification
5. If grant-related: create Firestore notification
6. Dashboard polls for new notifications
```

**Known Funder Domains (auto-detected):**
```
moore.org, packard.org, fordfoundation.org, macfound.org,
hewlett.org, patagonia.com, salesforce.org, ...
```

| Trigger | Action |
|---------|--------|
| New grant created | Create Drive folder structure |
| Stage changes to "LOI Submitted" | Set follow-up date +14 days |
| Stage changes to "Awarded" | Generate compliance checklist |
| Follow-up date = today | Send team notification |
| Compliance item due in 7 days | Calendar + email reminder |
| Report deadline passed | Escalation alert |

---

## 6. Tech Stack & CLI Setup

### Stack Overview
| Component | Technology | Why |
|-----------|------------|-----|
| Frontend | Next.js 14 (App Router) | Fast, React-based, SSR support |
| Styling | Tailwind CSS + shadcn/ui | Clean, accessible components |
| Database | Firebase Firestore | NoSQL, realtime, scales well |
| Auth | Firebase Auth (Google OAuth) | Seamless Google login |
| File Storage | Google Drive API | You're already using it |
| Calendar | Google Calendar API | Native integration |
| Email | Gmail API | Send from dashboard |
| Hosting | Firebase Hosting | Single CLI, global CDN |
| Document Gen | docx.js | Programmatic .docx with letterhead |

### CLI Setup Commands

**1. Initialize Project:**
```bash
# Create Next.js app
npx create-next-app@latest tabi-grants --typescript --tailwind --app --src-dir

cd tabi-grants

# Install dependencies
npm install firebase firebase-admin
npm install @google-cloud/firestore
npm install googleapis
npm install docx file-saver
npm install @tanstack/react-query
npm install date-fns
npm install lucide-react
npm install zustand  # lightweight state management

# Install shadcn/ui
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card dialog input label select table tabs toast
```

**2. Firebase Setup:**
```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in project
firebase init

# Select:
# ✓ Firestore
# ✓ Hosting (configure as single-page app: Yes)
# ✓ Functions (optional, for background jobs)

# Set hosting public directory to: out (for static export)
# Or use: .next (if using SSR with Cloud Functions)
```

**3. Google Cloud Console Setup:**
```bash
# Enable these APIs in Google Cloud Console:
# - Google Calendar API
# - Gmail API
# - Google Drive API

# Create OAuth 2.0 credentials:
# 1. Go to APIs & Services > Credentials
# 2. Create OAuth Client ID (Web application)
# 3. Add authorized redirect URIs:
#    - http://localhost:3000/api/auth/callback/google
#    - https://your-app.web.app/api/auth/callback/google

# Download credentials JSON and save as:
# /config/google-credentials.json (add to .gitignore!)
```

**4. Environment Variables (.env.local):**
```bash
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Google APIs (server-side)
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback/google

# Gemini API
GEMINI_API_KEY=your_gemini_api_key

# App
NEXTAUTH_SECRET=generate_a_random_secret
NEXTAUTH_URL=http://localhost:3000
```

**5. Gemini API Setup:**
```bash
# Get API key from Google AI Studio:
# https://aistudio.google.com/app/apikey

# Install Gemini SDK
npm install @google/generative-ai

# Test connection (optional)
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'
```

**5. Deploy Commands:**
```bash
# Build for production
npm run build

# Export static (if not using SSR)
npm run export

# Deploy to Firebase Hosting
firebase deploy --only hosting

# Deploy everything (hosting + firestore rules + functions)
firebase deploy
```

### Project Structure
```
tabi-grants/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx              # Main dashboard
│   │   │   ├── pipeline/page.tsx     # Kanban view
│   │   │   ├── grants/[id]/page.tsx  # Grant detail
│   │   │   ├── funders/page.tsx      # Funder database browser
│   │   │   ├── documents/page.tsx    # Document library
│   │   │   ├── calendar/page.tsx     # Calendar view
│   │   │   ├── inbox/page.tsx        # Gmail monitoring + email queue
│   │   │   └── settings/
│   │   │       ├── page.tsx          # General settings
│   │   │       ├── letterhead/page.tsx
│   │   │       └── email/page.tsx    # Email config (AI instructions)
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── gmail/
│   │   │   │   ├── send/route.ts
│   │   │   │   ├── watch/route.ts    # Inbox monitoring
│   │   │   │   └── classify/route.ts # AI classify response
│   │   │   ├── email/
│   │   │   │   ├── generate/route.ts # AI email generation
│   │   │   │   └── queue/route.ts    # Email queue management
│   │   │   ├── calendar/sync/route.ts
│   │   │   ├── drive/upload/route.ts
│   │   │   ├── documents/generate/route.ts
│   │   │   └── extract/
│   │   │       ├── pdf/route.ts      # PDF parsing with Gemini
│   │   │       └── url/route.ts      # URL scraping with Gemini
│   │   └── layout.tsx
│   ├── components/
│   │   ├── grants/
│   │   │   ├── GrantCard.tsx
│   │   │   ├── GrantKanban.tsx
│   │   │   ├── GrantTable.tsx
│   │   │   └── GrantForm.tsx
│   │   ├── funders/
│   │   │   ├── FunderBrowser.tsx
│   │   │   ├── FunderCard.tsx
│   │   │   └── FunderForm.tsx
│   │   ├── emails/
│   │   │   ├── EmailDraftPreview.tsx # Review AI-generated email
│   │   │   ├── EmailQueue.tsx        # List of pending emails
│   │   │   ├── EmailHistory.tsx      # Sent emails per grant
│   │   │   └── EmailConfigForm.tsx   # Settings form
│   │   ├── extraction/
│   │   │   ├── PDFUploader.tsx
│   │   │   ├── URLExtractor.tsx
│   │   │   ├── ExtractionPreview.tsx
│   │   │   └── EmailAlert.tsx        # Inbox notification
│   │   ├── documents/
│   │   │   ├── LOIGenerator.tsx
│   │   │   └── LetterheadPreview.tsx
│   │   ├── compliance/
│   │   │   └── ComplianceChecklist.tsx
│   │   └── ui/  # shadcn components
│   ├── lib/
│   │   ├── firebase.ts           # Firebase init
│   │   ├── firestore.ts          # Firestore helpers
│   │   ├── google-apis.ts        # Calendar, Gmail, Drive
│   │   ├── gemini.ts             # Gemini API wrapper
│   │   ├── email-generator.ts    # AI email generation logic
│   │   ├── email-classifier.ts   # AI response classification
│   │   ├── extraction.ts         # PDF/URL extraction logic
│   │   ├── document-generator.ts # docx.js logic
│   │   └── utils.ts
│   ├── hooks/
│   │   ├── useGrants.ts
│   │   ├── useFunders.ts
│   │   ├── useFollowups.ts
│   │   ├── useEmails.ts          # Email queue + generation
│   │   ├── useExtraction.ts
│   │   └── useGoogleAuth.ts
│   ├── prompts/
│   │   ├── email-generation.ts   # Gemini prompts for emails
│   │   ├── email-classification.ts
│   │   └── extraction.ts
│   └── types/
│       └── index.ts
├── functions/                     # Firebase Cloud Functions
│   ├── src/
│   │   ├── gmail-watch.ts        # Pub/Sub trigger for inbox
│   │   ├── email-queue-check.ts  # Daily: generate pending emails
│   │   └── scheduled-checks.ts   # Daily follow-up reminders
│   └── package.json
├── public/
│   └── logo.png                  # Tabi Po logo for letterhead
├── firebase.json
├── firestore.rules
├── firestore.indexes.json
└── .env.local
```

---

## 7. MVP Feature Prioritization

### Phase 1: Core Pipeline (Week 1-2)
- [ ] Grant pipeline with stages (Kanban + Table)
- [ ] Add/Edit/Archive grants
- [ ] Basic funder & contact management
- [ ] Activity log per grant
- [ ] Pre-load 50+ funders from seed data

### Phase 2: AI Extraction (Week 3)
- [ ] PDF upload + Gemini parsing
- [ ] URL paste + Gemini extraction
- [ ] Review/confirm before save UI
- [ ] Funder database browser

### Phase 3: Calendar & Follow-ups (Week 4)
- [ ] Google Calendar sync
- [ ] Follow-up reminder system
- [ ] Deadline alerts

### Phase 4: Documents (Week 5)
- [ ] LOI template generator with letterhead
- [ ] Google Drive auto-linking
- [ ] Document type tagging

### Phase 5: Gmail & Compliance (Week 6)
- [ ] Gmail inbox monitoring (Cloud Function)
- [ ] Email detection + AI summary
- [ ] Post-award compliance checklist
- [ ] Report deadline tracking

### Phase 6: Polish & Launch (Week 7)
- [ ] Dashboard analytics
- [ ] Email send from dashboard
- [ ] Mobile responsiveness
- [ ] User onboarding flow

---

## 8. Dashboard Wireframe (Home View)

```
┌─────────────────────────────────────────────────────────────────────┐
│  🌱 TABI PO GRANTS                          [Sarah ▼] [⚙️ Settings] │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │
│  │ PIPELINE    │ │ DUE THIS    │ │ FOLLOW-UPS  │ │ ACTIVE      │   │
│  │ 12 Grants   │ │ WEEK: 3     │ │ NEEDED: 5   │ │ GRANTS: 4   │   │
│  │ $340K total │ │ 🔴 2 urgent │ │ 🟡 Overdue  │ │ $127K value │   │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘   │
│                                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  📋 ACTION ITEMS TODAY                                              │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 🔴 Follow up: Moore Foundation (LOI sent 21 days ago)       │   │
│  │ 🟡 Draft LOI: Packard Foundation (due in 5 days)            │   │
│  │ 🟢 Submit Q1 Report: XYZ Foundation (due in 10 days)        │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  📅 UPCOMING DEADLINES                                              │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Mar 15 │ LOI - Packard Foundation (Roots & Rivers)          │   │
│  │ Mar 22 │ Full Proposal - GEF SGP (Watershed Protection)     │   │
│  │ Apr 01 │ Q1 Report - XYZ Foundation                         │   │
│  │ Apr 15 │ LOI - Christensen Fund (Biodiversity)              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  [+ New Grant]  [+ New LOI]  [📊 Reports]  [📁 Documents]          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 9. Security & Best Practices

1. **Data Backup:** Firestore auto-backups + weekly Drive export
2. **Access Control:** Role-based permissions via Firestore rules
3. **Audit Trail:** Full activity logging for compliance
4. **Encryption:** Firebase handles encryption at rest
5. **Two-Factor:** Require 2FA via Google OAuth
6. **Sensitive Data:** Never store full SSNs, bank details in dashboard
7. **API Keys:** Store in environment variables, never in code

---

## 10. Cost Estimate (Monthly)

| Service | Free Tier | Paid Usage |
|---------|-----------|------------|
| Firebase Hosting | 10GB storage, 360MB/day | $0.026/GB |
| Firestore | 1GB, 50K reads/day | $0.06/100K reads |
| Firebase Auth | 50K MAU free | Free |
| Gemini 1.5 Flash | 15 RPM free | ~$0.000125/1K tokens |
| Google Workspace | Already have | — |

**Estimated Total:**
- **Starting:** $0/mo (free tiers)
- **At scale (20 grants, ~50 extractions/mo):** ~$2-5/mo

*Gemini 1.5 Flash is extremely cheap — parsing 50 PDFs/month costs ~$0.50*

---

## Next Steps

1. **Confirm blueprint** — Does this cover your needs?
2. **Prioritize features** — What's most urgent?
3. **I can build the MVP** — Say the word and I'll generate the codebase
4. **Or refine further** — Add/remove modules as needed

---

*Blueprint prepared for Tabi Po Foundation Grant Management System*
