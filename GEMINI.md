# GEMINI.md - Tabi Grants Blueprint

## Directory Overview
This directory contains the foundational documentation and blueprints for the **Tabi Po Foundation Grant Management Dashboard**. It serves as the architectural and functional specification for a one-stop grant lifecycle system designed to manage around 20 active grants for a small team.

## Key Files
- **grant-dashboard-blueprint-v5-roots-rivers.md**: The primary source of truth for the project. It details:
    - **Tech Stack**: Next.js 14, Firebase (Firestore & Hosting), Google Workspace APIs (Calendar, Gmail, Drive), and Gemini API.
    - **Core Modules**: Grant Pipeline Tracker (Kanban/Table/Calendar views), FPIC Compliance Gate, and automated task management.
    - **Data Models**: Detailed fields for grant tracking, including community consent (FPIC) requirements.
    - **Integrations**: AI-powered data extraction and Google ecosystem connectivity.

## Project Context
The project aims to streamline the grant process from discovery ("Prospect") to "Closed" status, with a strong emphasis on compliance (Free, Prior and Informed Consent - FPIC) and AI-assisted workflows.

## Usage
- **Reference**: Use the blueprint file as the primary guide for any implementation or feature expansion.
- **Development**: When starting the implementation, refer to the "Tech Stack" and "Dashboard Architecture Overview" sections in the blueprint for technical requirements and UI/UX patterns.
