# Medivoy Frontend

AI-powered preventive healthcare dashboard built with **Nuxt 3**, **Tailwind CSS v4**, and **Pinia**.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Login / Landing |
| `/dashboard` | Health Dashboard with scores, charts, markers |
| `/reports` | List all uploaded reports |
| `/reports/upload` | Drag-drop report upload with AI progress |
| `/reports/[id]` | Single report detail — AI summary, markers, recommendations |
| `/family` | Family health history & hereditary risk |
| `/nutrition` | AI nutrition & supplement guidance |

## Tech Stack

- Nuxt 3 (SSR/SPA hybrid)
- Tailwind CSS v4 (`@tailwindcss/vite`)
- Pinia (state management)
- ECharts + vue-echarts (trend charts)
- Google Fonts (Inter)

## Quick Start

```bash
npm install
npm run dev
```

## Project Structure

```
app/
├── assets/css/main.css      # Tailwind v4 theme config
├── components/
│   ├── health/              # ReportUploader, MarkerCard, RiskBadge
│   └── dashboard/           # TrendChart
├── composables/             # useHealthScore, useReportParser
├── layouts/
│   ├── default.vue          # Sidebar + topbar layout
│   └── auth.vue             # Dark gradient login layout
├── pages/                   # All route pages
├── stores/
│   ├── auth.ts              # User auth & roles
│   ├── reports.ts           # Report data (demo data included)
│   └── dashboard.ts         # Dashboard stats & trends
└── types/health.ts          # TypeScript interfaces
```

## Features

- Premium Apple Health / WHOOP-inspired design
- Responsive sidebar navigation
- ECharts trend visualizations
- Demo data pre-loaded for immediate preview
- Role-based auth (Patient / Doctor / Admin / Lab)
- Drag-and-drop report upload simulation
- Medical disclaimer compliance
- Bio-age vs chronological age tracking
- Hereditary risk visualization
- Supplement & nutrition engine UI

## Notes

- This is the **frontend only**. Connect to your NestJS backend API for real OCR + AI pipeline.
- The upload page simulates AI processing with a progress bar for demo purposes.
- Replace demo data in `stores/reports.ts` and `stores/dashboard.ts` with API calls.
