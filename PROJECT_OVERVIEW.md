# 🏛️ The Four Pillar System — Complete Project Overview

> **A personal life operating system.** Not a task manager — a habit operating system. The system automatically generates daily tasks from master habits, keeps all historical records permanent, and makes everything measurable through analytics.

---

## Table of Contents

1. [Product Vision](#1-product-vision)
2. [Tech Stack](#2-tech-stack)
3. [Directory Structure](#3-directory-structure)
4. [Database Design](#4-database-design)
5. [Authentication](#5-authentication)
6. [Pages & Routes](#6-pages--routes)
7. [Components](#7-components)
8. [Server Actions](#8-server-actions)
9. [API Routes](#9-api-routes)
10. [State Management](#10-state-management)
11. [Theme System](#11-theme-system)
12. [Automation (Cron Job)](#12-automation-cron-job)
13. [Core Business Logic](#13-core-business-logic)
14. [Scoring & Formulas](#14-scoring--formulas)
15. [Deployment Guide](#15-deployment-guide)
16. [Environment Variables](#16-environment-variables)
17. [Local Development Setup](#17-local-development-setup)
18. [Data Flow Diagrams](#18-data-flow-diagrams)
19. [Key Design Decisions](#19-key-design-decisions)
20. [Performance Optimizations](#20-performance-optimizations)
21. [Progressive Web App (PWA)](#21-progressive-web-app-pwa)

---

## 1. Product Vision

**The Four Pillar System** divides every human habit into exactly four pillars:

| Pillar | Color | Purpose |
|---|---|---|
| 🔵 **Mental** | Blue `#529cca` | Cognitive growth — learning, reading, journaling |
| 🟢 **Spiritual** | Teal `#4dab9a` | Inner peace — meditation, prayer, gratitude |
| 🔴 **Emotional** | Red `#e25553` | Relationships — social connection, self-care |
| 🟡 **Physical** | Yellow `#ffc940` | Body — workout, sleep, nutrition |

### Core Philosophy

- ❌ NOT a task manager
- ✅ A **habit operating system**
- 🤖 Daily tasks are **auto-generated** from master habits at midnight
- 🗄️ **Historical records are NEVER deleted** (habits are archived, not deleted)
- 📊 **Everything is measurable** through analytics and scoring

### Design Inspiration

The UI is heavily inspired by **Notion**:
- Minimal, clean, professional
- Sidebar navigation with collapsible state
- Database-like table views
- Tag pills for pillars
- Inline editing
- Dark / Light mode toggle

---

## 2. Tech Stack

### Frontend

| Technology | Version | Role |
|---|---|---|
| **Next.js** | 16.2.9 | React framework (App Router) |
| **React** | 19.2.4 | UI library |
| **TypeScript** | ^5 | Type safety |
| **Tailwind CSS** | ^4 | Utility-first CSS |
| **Lucide React** | ^1.21.0 | Icon library |
| **Recharts** | ^3.8.1 | Charts and graphs |
| **TanStack Table** | ^8.21.3 | Advanced table with sorting/filtering |

### Backend

| Technology | Version | Role |
|---|---|---|
| **Next.js Server Actions** | — | Business logic (mutations) |
| **Next.js Route Handlers** | — | REST-like API endpoints |

### Database

| Technology | Version | Role |
|---|---|---|
| **MongoDB** | via Atlas | Primary database |
| **Mongoose** | ^9.7.1 | ODM (schema, validation, queries) |

### Auth

| Technology | Version | Role |
|---|---|---|
| **NextAuth / Auth.js** | ^5.0.0-beta.25 | Session management |
| **Google Provider** | — | OAuth via Google |
| **Credentials Provider** | — | Email-based passwordless login |
| **bcryptjs** | ^3.0.3 | Password hashing (future use) |

### Forms & Validation

| Technology | Version | Role |
|---|---|---|
| **React Hook Form** | ^7.80.0 | Form state management |
| **Zod** | ^4.4.3 | Schema validation |
| **@hookform/resolvers** | ^5.4.0 | Bridges RHF and Zod |

### State Management

| Technology | Version | Role |
|---|---|---|
| **Zustand** | ^5.0.14 | Global client state (sidebar, theme) |

### PWA (Progressive Web App)

| Technology | Role |
|---|---|
| **Web App Manifest** | PWA identity, theme customization, display settings |
| **Service Worker** | Client-side caching, offline support, push notifications |

### Deployment

| Technology | Role |
|---|---|
| **Vercel** | Hosting + Serverless Functions |
| **MongoDB Atlas** | Cloud database |
| **Vercel Cron Jobs** | Midnight automation trigger |

### Fonts

- **Geist Sans** (loaded via `next/font/google`) — body text
- **Geist Mono** (loaded via `next/font/google`) — code/mono elements
- **Inter** (fallback stack in CSS) — system font

---

## 3. Directory Structure

```
The 4 Pillar system/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── layout.tsx              # Root layout (wraps all pages, loads manifest)
│   │   ├── page.tsx                # Landing page route (/)
│   │   ├── globals.css             # Global styles + CSS variables
│   │   ├── global-error.tsx        # Global error boundary
│   │   ├── not-found.tsx           # 404 page
│   │   ├── manifest.json           # PWA Web App Manifest settings
│   │   │
│   │   ├── dashboard/
│   │   │   └── page.tsx            # /dashboard — Dashboard page (protected)
│   │   ├── today/
│   │   │   └── page.tsx            # /today — Today's Tasks (protected)
│   │   ├── master-habits/
│   │   │   └── page.tsx            # /master-habits — Habit manager (protected)
│   │   ├── calendar/
│   │   │   └── page.tsx            # /calendar — GitHub-style calendar (protected)
│   │   ├── analytics/
│   │   │   └── page.tsx            # /analytics — Analytics page (protected)
│   │   ├── history/
│   │   │   └── page.tsx            # /history — History with filters (protected)
│   │   ├── settings/
│   │   │   └── page.tsx            # /settings — User settings (protected)
│   │   ├── login/
│   │   │   └── page.tsx            # /login — Login/Signup page (public)
│   │   │
│   │   └── api/
│   │       ├── auth/
│   │       │   └── [...nextauth]/
│   │       │       └── route.ts    # NextAuth handler
│   │       └── cron/
│   │           └── route.ts        # Midnight cron job endpoint
│   │
│   ├── components/                 # Shared UI components
│   │   ├── AppLayout.tsx           # Root layout shell (Sidebar + TopBar + main)
│   │   ├── Sidebar.tsx             # Desktop sidebar navigation
│   │   ├── TopBar.tsx              # Top bar (search, theme toggle, mobile menu)
│   │   ├── MobileDrawer.tsx        # Mobile slide-out navigation drawer
│   │   ├── ThemeProvider.tsx       # Dark/light theme applicator
│   │   ├── SessionProvider.tsx     # NextAuth session context wrapper
│   │   ├── LandingPageClient.tsx   # Landing page UI (public)
│   │   ├── DashboardClient.tsx     # Dashboard UI (charts, scores, streaks)
│   │   ├── TodayTasksClient.tsx    # Today's Tasks UI (habit checklist)
│   │   ├── MasterHabitsClient.tsx  # Master Habits CRUD UI
│   │   ├── CalendarClient.tsx      # Calendar heatmap UI
│   │   ├── AnalyticsClient.tsx     # Analytics charts + leaderboard
│   │   ├── HistoryClient.tsx       # History table with filters + export
│   │   ├── SettingsClient.tsx      # Settings form (profile, theme, timezone)
│   │   └── ServiceWorkerRegister.tsx # Client-side registration of PWA Service Worker
│   │
│   ├── actions/                    # Next.js Server Actions
│   │   ├── habitActions.ts         # getMasterHabits, createHabit, renameHabit, toggleHabitStatus
│   │   ├── logActions.ts           # getTodayLogs, updateLogStatus, updateLogNotes, getLogsForDate
│   │   ├── dashboardActions.ts     # getDashboardStats, calculateStreak
│   │   ├── analyticsActions.ts     # getAnalyticsData (leaderboard, missed analysis, trends)
│   │   ├── historyActions.ts       # getHistoryLogs, getAllHistoryLogsForExport
│   │   └── userActions.ts          # updateProfile, deleteAccount
│   │
│   ├── models/                     # Mongoose schemas
│   │   ├── User.ts                 # User model
│   │   ├── MasterHabit.ts          # MasterHabit model
│   │   ├── DailyLog.ts             # DailyLog model
│   │   └── DailySnapshot.ts        # DailySnapshot model
│   │
│   ├── lib/                        # Shared utilities
│   │   ├── db.ts                   # MongoDB connection (singleton with caching)
│   │   └── authHelpers.ts          # getSessionUser, requireSessionUser helpers
│   │
│   ├── store/
│   │   └── useStore.ts             # Zustand global store (theme, sidebar state)
│   │
│   ├── auth.ts                     # NextAuth configuration (providers, callbacks)
│   └── proxy.ts                    # (utility proxy)
│
├── public/                         # Static assets
│   └── sw.js                       # PWA Custom Service Worker script
├── .env.local                      # Environment variables (NOT committed to git)
├── vercel.json                     # Vercel cron job configuration
├── next.config.ts                  # Next.js configuration
├── tsconfig.json                   # TypeScript configuration
├── postcss.config.mjs              # PostCSS (required by Tailwind v4)
├── eslint.config.mjs               # ESLint configuration
├── package.json                    # Dependencies
└── PROJECT_IDEA.md                 # Original product spec
```

---

## 4. Database Design

### 4.1 User

```ts
// src/models/User.ts
{
  name?:     String,           // Display name
  email:     String (unique),  // Auth identifier
  image?:    String,           // Avatar URL (DiceBear or Google)
  timezone?: String,           // e.g. "Asia/Kolkata" — default: "UTC"
  createdAt: Date,             // Auto-managed by timestamps
  updatedAt: Date,
}
```

**Indexes:**
- `email` — unique index

---

### 4.2 MasterHabit

```ts
// src/models/MasterHabit.ts
{
  userId:    ObjectId → User,       // Owner reference
  name:      String,                // Habit name (user can rename)
  pillar:    "Mental" | "Spiritual" | "Emotional" | "Physical",
  active:    Boolean (default: true), // true = active, false = archived
  createdAt: Date,
  updatedAt: Date,
}
```

**Indexes:**
- `{ userId: 1, active: 1 }` — compound index for fast fetch of active habits per user
- `userId` — single index

> ⚠️ **IMPORTANT:** Habits are **NEVER deleted**. They are archived (`active: false`). This preserves all historical records. Renaming works by storing a reference (ObjectId) in DailyLog — the habit name is fetched via `.populate()`.

---

### 4.3 DailyLog

Every habit occurrence (per user, per day) is stored here.

```ts
// src/models/DailyLog.ts
{
  userId:               ObjectId → User,
  habitId:              ObjectId → MasterHabit,
  date:                 String ("YYYY-MM-DD"),   // Local date string
  status:               "Pending" | "Partial" | "Completed" | "Missed",
  notes:                String (default: ""),
  completionPercentage: Number,  // 0 (Pending/Missed), 50 (Partial), 100 (Completed)
  createdAt:            Date,
  updatedAt:            Date,
}
```

**Indexes:**
- `{ userId: 1, habitId: 1, date: 1 }` — **unique** compound (prevents duplicates)
- `{ userId: 1, date: 1 }` — for fetching all logs for a given day
- `userId`, `habitId`, `date`, `status` — individual indexes

---

### 4.4 DailySnapshot

A daily summary record computed and updated whenever any log on that day changes.

```ts
// src/models/DailySnapshot.ts
{
  userId:         ObjectId → User,
  date:           String ("YYYY-MM-DD"),
  completionRate: Number,   // 0–100 (average of all habit completion % that day)
  pillarScores: {
    Mental:    Number,  // 0–100 average for this pillar
    Spiritual: Number,
    Emotional: Number,
    Physical:  Number,
  },
  completedCount: Number,   // Count of habits with status = "Completed"
  missedCount:    Number,   // Count of habits with status = "Missed"
  createdAt:      Date,
  updatedAt:      Date,
}
```

**Indexes:**
- `{ userId: 1, date: 1 }` — **unique** compound (one snapshot per user per day)

---

### Entity Relationship

```
User ─────┬──── MasterHabit (userId)
          │
          ├──── DailyLog (userId, habitId → MasterHabit)
          │
          └──── DailySnapshot (userId)
```

---

## 5. Authentication

**File:** `src/auth.ts`

### Providers

#### 1. Google OAuth
- Requires `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` env vars
- On first sign-in, creates a new User document in MongoDB
- Attaches the MongoDB `_id` to the session for all future actions

#### 2. Email Credentials (Passwordless)
- Enter email (and optional name) → auto-login / auto-register
- If user doesn't exist → creates one with a DiceBear avatar
- **No password required** — designed for frictionless local testing and demos

### Session Strategy
- **JWT strategy** — stateless, stored in a cookie
- JWT payload carries: `id` (MongoDB user `_id`), `timezone`, `name`, `picture`
- Session update is supported (e.g., when user changes name/timezone in Settings)

### Route Protection Pattern

```ts
// src/lib/authHelpers.ts
export async function getSessionUser()    // Returns user or null (public pages)
export async function requireSessionUser() // Returns user or throws redirect (protected pages)
```

Every protected Server Component / Server Action calls `requireSessionUser()` at the top.

### Auth Configuration

```
Sign-in page: /login
Session strategy: JWT
Trust host: true
```

---

## 6. Pages & Routes

| Route | Protection | Component | Description |
|---|---|---|---|
| `/` | Public | `LandingPageClient` | Landing page — shows CTA if logged out, quick links if logged in |
| `/login` | Public | Login page | Email + Google sign-in |
| `/dashboard` | Protected | `DashboardClient` | Life score, streaks, pillar scores, progress charts |
| `/today` | Protected | `TodayTasksClient` | Today's auto-generated habit checklist, grouped by pillar |
| `/master-habits` | Protected | `MasterHabitsClient` | CRUD for master habits (add, rename, archive, reactivate) |
| `/calendar` | Protected | `CalendarClient` | GitHub-style heatmap calendar with daily drill-down |
| `/analytics` | Protected | `AnalyticsClient` | Leaderboard, missed analysis, trend graphs |
| `/history` | Protected | `HistoryClient` | Advanced filtered table of all logs, CSV/Excel export |
| `/settings` | Protected | `SettingsClient` | Profile, timezone, theme, data export, delete account |

### Layout Logic

`AppLayout.tsx` automatically detects public vs. protected pages:

- `/` and `/login` → renders children with **no sidebar** (just a clean background)
- All other routes → renders **Sidebar + TopBar + MobileDrawer + main content**

---

## 7. Components

### Layout Components

#### `AppLayout.tsx`
- Top-level layout shell that wraps all pages
- Detects `pathname` to decide whether to show the app shell (sidebar/topbar) or not
- Handles a `mounted` guard to prevent hydration flash (SSR mismatch)

#### `Sidebar.tsx`
- Desktop only (`hidden md:flex`)
- Collapsible: full-width (240px) ↔ icon-only (48px)
- Shows user avatar and name at the top
- Active link highlighted with a left accent border
- Sign out button at the bottom
- State managed via Zustand `sidebarOpen`

#### `TopBar.tsx`
- Always visible on protected pages
- Global search bar
- Theme toggle (Dark/Light)
- Mobile hamburger menu button

#### `MobileDrawer.tsx`
- Slide-in drawer on mobile
- Same nav links as Sidebar
- Triggered by Zustand `mobileSidebarOpen`

### Provider Components

#### `ThemeProvider.tsx`
- On mount: reads `localStorage` key `four-pillar-store` and applies the saved theme
  immediately (before React renders) to prevent light-flash on dark-mode preference
- `ThemeLoader` inner component: subscribes to Zustand `theme` and applies/removes
  the `dark` class on `<html>` when theme changes at runtime

#### `SessionProvider.tsx`
- Thin wrapper around NextAuth's `SessionProvider`
- Required for `useSession()` to work in Client Components

### Page Client Components

All page logic lives in `*Client.tsx` files in `/src/components/`. The Server Component
in `/src/app/[route]/page.tsx` fetches initial data and passes it as props.

| Component | Key Features |
|---|---|
| `LandingPageClient` | Hero section, feature highlights, CTA buttons, user-aware nav |
| `DashboardClient` | Life Score card, streak cards, progress bars per time period, trend line chart, pillar ring charts |
| `TodayTasksClient` | Habit cards grouped by pillar, inline status toggle (Completed/Partial/Missed), notes input, real-time progress bar |
| `MasterHabitsClient` | Table of all habits, add-habit form, inline rename, archive/reactivate toggle |
| `CalendarClient` | 12-month heatmap grid, color intensity by completion rate, day click → habit breakdown modal |
| `AnalyticsClient` | Completion line chart, pillar breakdown chart, habit leaderboard table, missed analysis cards, failure trend chart |
| `HistoryClient` | TanStack Table with server-side filtering (pillar, status, date range, month, year, search), CSV/Excel export |
| `SettingsClient` | Profile form (name, timezone), theme toggle, data export, delete account with confirmation dialog |

---

## 8. Server Actions

All actions live in `src/actions/`. They are called directly from Client Components
using the `"use server"` directive. They handle authentication, DB queries, and
`revalidatePath()` for cache invalidation.

### `habitActions.ts`

| Action | Description |
|---|---|
| `getMasterHabits()` | Fetch all habits for current user (sorted by createdAt desc) |
| `createHabit(name, pillar)` | Creates a new MasterHabit, immediately creates a DailyLog for today, and ensures a DailySnapshot exists for today |
| `renameHabit(id, newName)` | Updates habit name. All historical DailyLogs preserve their reference via habitId ObjectId — no data loss |
| `toggleHabitStatus(id, active)` | Archives (`active: false`) or reactivates (`active: true`) a habit |

### `logActions.ts`

| Action | Description |
|---|---|
| `getTodayLogs()` | Auto-closes stale Pending logs from previous days (marks as Missed), fetches today's logs; if none exist, runs Cold Start to generate them |
| `updateLogStatus(logId, status)` | Sets status + completion %, then recalculates DailySnapshot |
| `updateLogNotes(logId, notes)` | Updates free-text notes on a log entry |
| `getLogsForDate(date)` | Fetches all logs for a specific date (used by Calendar drill-down) |
| `updateDailySnapshot(userId, date)` | Recalculates and upserts the DailySnapshot for a given day |

### `dashboardActions.ts`

| Action | Description |
|---|---|
| `getDashboardStats()` | Aggregates life score, streak data, pillar scores, and time-period progress (today/weekly/monthly/quarterly/yearly) |
| `calculateStreak(userId, timezone)` | Computes current streak and longest streak from DailySnapshot history |

### `analyticsActions.ts`

| Action | Description |
|---|---|
| `getAnalyticsData()` | Returns: leaderboard (completion % + streaks per habit), most missed habit, most missed pillar, failure trends (past 30 days), trend chart data (past 30 snapshots) |

### `historyActions.ts`

| Action | Description |
|---|---|
| `getHistoryLogs(params)` | Paginated, filtered log history. Filters: pillar, status, habitId, search (by habit name or notes), startDate, endDate, month, year |
| `getAllHistoryLogsForExport()` | Returns all logs (no pagination) for CSV/Excel export |

### `userActions.ts`

| Action | Description |
|---|---|
| `updateProfile(name, timezone)` | Updates user name and timezone in DB, triggers session update |
| `deleteAccount()` | Deletes all DailyLogs, DailySnapshots, MasterHabits, and User document in order |

---

## 9. API Routes

### `GET/POST /api/cron`

**File:** `src/app/api/cron/route.ts`

This is the automation endpoint called by Vercel Cron at `00:01` every day.

**What it does:**
1. Fetches all users from DB
2. For each user, determines their **local date** using their saved timezone
3. Fetches all active MasterHabits for that user
4. For each active habit, creates a `DailyLog` with `status: "Pending"` — **only if one doesn't exist** (idempotent)
5. Creates a `DailySnapshot` for that user's local date — **only if one doesn't exist**

**Security:**
- In production, validates `Authorization: Bearer <CRON_SECRET>` header
- In development, the check is bypassed if `CRON_SECRET` is not set

**Response:**
```json
{
  "success": true,
  "message": "Generated logs and snapshots successfully",
  "details": {
    "logsCreated": 5,
    "snapshotsCreated": 2
  }
}
```

### `GET/POST /api/auth/[...nextauth]`

**File:** `src/app/api/auth/[...nextauth]/route.ts`

Standard NextAuth handler — manages sign-in, sign-out, session, and callbacks.

---

## 10. State Management

**File:** `src/store/useStore.ts`

Zustand store with `persist` middleware (localStorage key: `four-pillar-store`).

```ts
interface AppState {
  sidebarOpen:       boolean   // Desktop sidebar expanded/collapsed
  mobileSidebarOpen: boolean   // Mobile drawer open/closed
  searchQuery:       string    // Global search bar value
  theme:             'light' | 'dark'  // Current theme
}
```

**What is persisted to localStorage:** Only `theme` (via `partialize`)

**Actions:**
- `toggleSidebar()` — collapses/expands desktop sidebar
- `setSidebarOpen(open)` — directly set sidebar state
- `toggleMobileSidebar()` — toggles mobile drawer
- `setMobileSidebarOpen(open)` — directly set mobile drawer state
- `setSearchQuery(query)` — update search query
- `setTheme(theme)` — change and persist theme

---

## 11. Theme System

### Approach

- Theme class (`dark`) is applied to the `<html>` element
- CSS custom properties (`var(--...)`) switch values based on the presence of `.dark`
- Theme preference is stored in Zustand (`persist` middleware → `localStorage`)
- `ThemeProvider` applies the saved theme immediately on mount (before React renders) to eliminate the white flash

### CSS Variables

| Variable | Light | Dark | Usage |
|---|---|---|---|
| `--background` | `#ffffff` | `#191919` | Page background |
| `--foreground` | `#37352f` | `#e3e3e3` | Primary text |
| `--sidebar-background` | `#f7f7f5` | `#202020` | Sidebar background |
| `--border` | `#e9e9e6` | `#2c2c2c` | Borders |
| `--hover-bg` | `#f1f1ee` | `#262626` | Hover states |
| `--active-bg` | `#efefe3` | `#2d2d2d` | Active nav item background |
| `--muted` | `#787774` | `#9b9b9b` | Secondary text |
| `--accent` | `#2383e2` | `#2eaadc` | Links, highlights, active indicators |

### Pillar Colors

| Pillar | Light | Dark |
|---|---|---|
| Mental | `#2383e2` | `#529cca` |
| Spiritual | `#0f7b6c` | `#4dab9a` |
| Emotional | `#d4402a` | `#e25553` |
| Physical | `#c18800` | `#ffc940` |

### Tailwind Integration (v4)

Tailwind v4 uses the `@theme` block to register CSS variables as Tailwind color tokens:

```css
@theme {
  --color-background: var(--background);
  --color-mental: var(--pillar-mental);
  /* ... etc */
}
```

This means you can use classes like `bg-background`, `text-mental`, `border-border` directly in JSX.

---

## 12. Automation (Cron Job)

**Vercel Cron Schedule:** `1 0 * * *` = every day at **12:01 AM UTC**

**File:** `vercel.json`
```json
{
  "crons": [
    {
      "path": "/api/cron",
      "schedule": "1 0 * * *"
    }
  ]
}
```

### How It Works (Step by Step)

```
12:01 AM UTC
     │
     ▼
Vercel triggers GET /api/cron
     │
     ├─ Validate Authorization header (production only)
     │
     ▼
For EACH USER in DB:
     │
     ├─ Determine user's local date (using user.timezone + Intl.DateTimeFormat)
     │
     ├─ Fetch all ACTIVE MasterHabits
     │
     ├─ For each active habit:
     │     └─ findOne({ userId, habitId, date })
     │           ├─ EXISTS → skip (idempotent)
     │           └─ NOT EXISTS → insertMany({ status: "Pending", completionPercentage: 0 })
     │
     └─ For today's DailySnapshot:
           ├─ EXISTS → skip
           └─ NOT EXISTS → create({ completionRate: 0, pillarScores: {0,0,0,0} })
```

### Cold Start Fallback

If the cron job missed (e.g., user has no logs for today), `getTodayLogs()` detects this
and **generates the logs on demand** — ensuring users always see their tasks even if
the cron job didn't run.

### Stale Log Auto-Close

When `getTodayLogs()` runs, it also looks for any **Pending** logs from **previous days** and
automatically marks them as **Missed** — keeping data accurate without manual intervention.

---

## 13. Core Business Logic

### Snapshot Recalculation

Every time a log's status changes (`updateLogStatus`), `updateDailySnapshot()` is called:

```
All DailyLogs for (userId, date)
     │
     ├─ completionRate = average(completionPercentage across all logs)
     │
     ├─ pillarScores.Mental = average(completionPercentage for logs where habit.pillar === "Mental")
     │   (same for Spiritual, Emotional, Physical)
     │
     ├─ completedCount = count of logs where status === "Completed"
     │
     └─ missedCount = count of logs where status === "Missed"
```

### Streak Calculation

A "successful day" = `completionRate >= 50%`

**Current Streak:**
1. Start from today (or yesterday if today's rate < 50%)
2. Walk backwards day by day
3. Stop when a day has `rate < 50%` or no snapshot

**Longest Streak:**
1. Walk through all snapshots in ascending date order
2. Track consecutive successful days
3. Record the maximum run

Per-habit streaks use the same logic but check `status === "Completed"` on individual DailyLog records.

### Completion Percentage Mapping

| Status | Completion % |
|---|---|
| Pending | 0% |
| Missed | 0% |
| Partial | 50% |
| Completed | 100% |

---

## 14. Scoring & Formulas

### Life Score

```
Life Score = average(completionRate of ALL DailySnapshots ever)

Categories:
  90–100  → "Elite"
  75–89   → "Strong"
  60–74   → "Improving"
  Below 60 → "Needs Attention"
```

### Four Pillar Health Score

```
Pillar Score = average(completionPercentage of all DailyLogs for that pillar, across all time)

Overall Pillar Health = (Mental + Spiritual + Emotional + Physical) / 4
```

### Period Progress

```
Weekly Progress    = average(completionRate of snapshots in last 7 days)
Monthly Progress   = average(completionRate of snapshots in last 30 days)
Quarterly Progress = average(completionRate of snapshots in last 90 days)
Yearly Progress    = average(completionRate of snapshots in last 365 days)
```

### Habit Completion Rate (Analytics Leaderboard)

```
Habit Completion Rate = (count of Completed logs / total logs for that habit) × 100
```

---

## 15. Deployment Guide

### Prerequisites

1. A **Vercel** account
2. A **MongoDB Atlas** cluster (free tier works)
3. A **Google Cloud** project with OAuth credentials

### Step 1 — MongoDB Atlas

1. Create a new cluster on [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a database user
3. Whitelist `0.0.0.0/0` (all IPs, Vercel uses dynamic IPs)
4. Copy the **connection string**: `mongodb+srv://<user>:<password>@cluster.mongodb.net/four_pillar_system`

### Step 2 — Google OAuth

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Set Authorized Redirect URI: `https://your-domain.vercel.app/api/auth/callback/google`
4. Copy `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

### Step 3 — Vercel Deployment

1. Push the project to GitHub
2. Import the repo in Vercel
3. Add the following environment variables in Vercel dashboard:

```
MONGODB_URI          = mongodb+srv://...
NEXTAUTH_SECRET      = <random 32-char string>
NEXTAUTH_URL         = https://your-domain.vercel.app
GOOGLE_CLIENT_ID     = <from Google Console>
GOOGLE_CLIENT_SECRET = <from Google Console>
CRON_SECRET          = <random secret for cron security>
```

4. Deploy — Vercel will automatically configure cron jobs from `vercel.json`

### Step 4 — Verify Cron

- Go to Vercel Dashboard → Project → Cron Jobs
- You should see `/api/cron` scheduled for `1 0 * * *`
- You can trigger it manually for testing

---

## 16. Environment Variables

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | ✅ | MongoDB connection string. Defaults to `mongodb://127.0.0.1:27017/four_pillar_system` in dev |
| `NEXTAUTH_SECRET` | ✅ | Random secret for JWT signing. Must be long and random in production |
| `NEXTAUTH_URL` | ✅ (prod) | Full URL of your app (e.g., `https://yourapp.vercel.app`). Not needed in dev |
| `GOOGLE_CLIENT_ID` | ⚠️ Optional | Required for Google OAuth. Defaults to mock value in dev |
| `GOOGLE_CLIENT_SECRET` | ⚠️ Optional | Required for Google OAuth |
| `CRON_SECRET` | ⚠️ Optional | Secret for securing the `/api/cron` endpoint. Bypass is automatic in dev |

**Local dev file:** `.env.local` (never commit this to git — it's in `.gitignore`)

---

## 17. Local Development Setup

### Requirements

- Node.js 18+
- MongoDB running locally OR a MongoDB Atlas connection string

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Create your .env.local file
cp .env.local.example .env.local
# Then fill in your values

# 3. Start the dev server
npm run dev

# App runs at http://localhost:3000
```

### Key npm Scripts

| Script | Command | Description |
|---|---|---|
| `dev` | `next dev` | Start development server with hot reload |
| `build` | `next build` | Build production bundle |
| `start` | `next start` | Start production server (requires build first) |
| `lint` | `eslint` | Run ESLint |

### Testing the Cron Locally

```bash
# Trigger the cron endpoint manually
curl http://localhost:3000/api/cron
```

---

## 18. Data Flow Diagrams

### User Marks a Habit as Completed

```
User clicks "Completed" on TodayTasksClient
     │
     ▼
updateLogStatus(logId, "Completed")  ← Server Action
     │
     ├─ requireSessionUser() → validates session
     │
     ├─ DailyLog.findOneAndUpdate({_id, userId}, { status, completionPercentage: 100 })
     │
     ├─ updateDailySnapshot(userId, log.date)
     │     └─ Recalculates DailySnapshot (completionRate, pillarScores, counts)
     │
     └─ revalidatePath('/today', '/calendar', '/analytics', '/history')
          │
          └─ Next.js invalidates cache → pages refetch fresh data
```

### New Day — Cron Job

```
12:01 AM UTC
     │
     ▼
Vercel → GET /api/cron (with Authorization header)
     │
     ├─ connectToDatabase()
     │
     ├─ User.find({}) → all users
     │
     └─ For each user:
           │
           ├─ getLocalDateString(user.timezone) → "2026-06-24"
           │
           ├─ MasterHabit.find({ userId, active: true })
           │
           ├─ For each habit:
           │     DailyLog.findOne({ userId, habitId, date }) → if null → insert Pending log
           │
           └─ DailySnapshot.findOne({ userId, date }) → if null → create empty snapshot
```

### First Time User Opens /today (Cold Start)

```
User navigates to /today
     │
     ▼
TodayPage (Server Component)
     │
     ├─ requireSessionUser() — redirect to /login if not authenticated
     │
     └─ getTodayLogs()
           │
           ├─ Close stale Pending logs from past days → mark as Missed
           │
           ├─ DailyLog.find({ userId, date: today })
           │
           └─ If empty (cron hasn't run or first day):
                 ├─ MasterHabit.find({ userId, active: true })
                 ├─ DailyLog.insertMany([...Pending logs])
                 └─ Return populated logs
```

---

## 19. Key Design Decisions

### 1. No Hard Deletes
Habits are never deleted from the database. They are archived (`active: false`). This ensures:
- Historical analytics remain accurate
- Old DailyLog records still resolve their habit name via `.populate()`
- Users can reactivate habits without losing history

### 2. Date Strings Instead of Date Objects
Dates in DailyLog and DailySnapshot are stored as `YYYY-MM-DD` strings (e.g., `"2026-06-23"`), not UTC Date objects. This avoids timezone offset bugs when filtering by date.

### 3. Snapshot Pattern (Denormalized Summary)
Rather than aggregating all logs in real-time on the dashboard/analytics pages, a `DailySnapshot` is maintained as a pre-computed summary. This is recalculated on every status change and by the cron job, keeping reads fast.

### 4. Server-First Architecture
- Data fetching happens in **Server Components** (no client-side `useEffect` for initial data)
- Mutations use **Server Actions** (no custom REST API endpoints needed)
- Only the cron job uses a Route Handler (`/api/cron`)

### 5. Idempotent Cron
The cron job uses `findOne + insertMany` with a unique index guard. Running the cron multiple times on the same day is completely safe — it will skip any logs that already exist.

### 6. Cold Start Fallback
If the cron missed (server downtime, first-time user), `getTodayLogs()` acts as a fallback and generates the logs on first page load. Users never see an empty Today page.

### 7. Hydration-Safe Theme
The `ThemeProvider` reads `localStorage` synchronously on mount (before React's first paint) and applies the `.dark` class to `<html>` immediately. This prevents the white flash on dark-mode users.

### 8. Zustand with Selective Persistence
Only the `theme` field is persisted to `localStorage` (via `partialize`). Sidebar state and search query reset on page reload — this is intentional to keep behavior predictable.

---

## 20. Performance Optimizations

To address page-loading latency (previously taking ~1–1.5s per route transition due to remote database network latency), the following database and rendering optimizations were implemented:

### 1. In-Memory Calculations (Elimination of N+1 Queries)
- **Problem**: When loading analytics, the server was querying the database in a loop for each habit to compute streaks.
- **Solution**: Habits and logs are loaded in a single parallel query. Habit streaks are calculated entirely in-memory using `calculateHabitStreaksFromLogs`, dropping database round-trips from `N+1` to `2`.

### 2. Single-Query Snapshot Reuse
- **Problem**: `getDashboardStats()` performed multiple separate fetches for the same historical `DailySnapshot` documents to calculate streaks and scores.
- **Solution**: Snapshots are fetched exactly once, sorted descending, and passed to a pure, synchronous helper `calculateStreakFromSnapshots()` to compute streaks and averages in-memory.

### 3. Parallelized Page Loading
- **Problem**: The root dashboard page resolved `getDashboardStats()` and `getAnalyticsData()` sequentially.
- **Solution**: Initiated both fetches concurrently using `Promise.all` inside the `/dashboard` Server Component, reducing initial render wait times by ~50%.

### 4. Bulk snapshot updates for Stale Logs
- **Problem**: When a user hadn't visited the app for several days, `getTodayLogs()` would close pending logs and run a parallel loop of `updateDailySnapshot` queries for each date, creating dozens of database read and write operations.
- **Solution**: Replaced the loop with `updateDailySnapshotsBulk()`, which queries all daily logs for the affected dates in one call, computes the snapshot states in-memory, and writes them back to the database in a single round-trip using MongoDB's `bulkWrite` operation.

---

## 21. Progressive Web App (PWA)

To make **The Four Pillar System** a fully installable, mobile-friendly personal life operating system, a custom Progressive Web App (PWA) layer was implemented.

### PWA Components

1. **Web App Manifest (`src/app/manifest.json`)**:
   - Configures the app name (`The Four Pillar System`), short name (`4 Pillars`), theme color (`#191919`), and start URL (`/`).
   - Configures the app to run in `standalone` display mode, hiding the browser UI for a native-app-like experience.
   - Points to standard PWA icons (`192x192` and `512x512`).

2. **Service Worker (`public/sw.js`)**:
   - **Pre-caching**: Caches critical application shells (`/` page, icons) during installation.
   - **Cache-first for Static Assets**: Intercepts requests for static resources (`_next/static/*`) and serves them from cache to minimize database/network overhead.
   - **Network-first with Offline Fallback**: Intercepts navigation requests, attempts to fetch a fresh version from the network, caches the result, and falls back to cached resources or a custom offline warning if there is no internet connection.
   - **Bypass Rule**: Automatically bypasses caching for API calls (`/api/*`), Webpack HMR, and other non-GET mutations.
   - **Push Notifications**: Listeners for `push` events and displays background system notifications.
   - **Notification Click Handler**: Dynamically focuses existing application windows or opens new ones to match the notification context.

3. **Service Worker Register (`src/components/ServiceWorkerRegister.tsx`)**:
   - A client-side wrapper component that executes inside the browser to register `sw.js` under the root (`/`) scope, ensuring updates check on mount.
   - Registered once in `src/app/layout.tsx` to wrap the client-side lifecycle.

4. **Public Route Access (`src/proxy.ts`)**:
   - Allows standard PWA paths such as `/manifest.json`, `/sw.js`, and icon images to bypass standard authentication gates, ensuring the service worker installs and loads without redirects.

---

*Last updated: June 30, 2026*
*Project: The Four Pillar System — Personal Habit Operating System*
