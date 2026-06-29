<div align="center">

# 🏛️ The Four Pillar System

### *Your Personal Life Operating System*

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-4--pillar--system.vercel.app-6366f1?style=for-the-badge&logo=vercel&logoColor=white)](https://4-pillar-system.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16.2.9-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)

<br/>

> **Not a task manager. A habit operating system.**
>
> The Four Pillar System automatically generates your daily tasks from master habits,
> keeps all historical records permanent, and makes everything measurable through analytics.

<br/>

![-----](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)

</div>

<br/>

## ✨ What Makes It Different

| Feature | Description |
|---------|-------------|
| 🤖 **Auto-Generated Daily Tasks** | Midnight cron job creates your habit checklist automatically — every day |
| 🗄️ **Permanent History** | Habits are **never deleted**, only archived. Every log is kept forever |
| 📊 **Life Score** | A single score (0–100) that reflects your entire habit history |
| 🔥 **Streak Tracking** | Current and longest streaks, both overall and per-habit |
| 📅 **GitHub-Style Heatmap** | A full-year calendar showing your daily completion intensity |
| 🌓 **Dark / Light Mode** | Notion-inspired UI that persists your theme preference |
| 📤 **CSV / Excel Export** | Full history export for offline analysis |
| 🔐 **Dual Auth** | Google OAuth + passwordless email sign-in |

<br/>

---

## 🏛️ The Four Pillars

Every human habit is classified under exactly one of four pillars:

<table>
  <thead>
    <tr>
      <th>Pillar</th>
      <th>Color</th>
      <th>Focus</th>
      <th>Examples</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>🔵 <strong>Mental</strong></td>
      <td><code>#529cca</code></td>
      <td>Cognitive growth</td>
      <td>Reading, learning, journaling</td>
    </tr>
    <tr>
      <td>🟢 <strong>Spiritual</strong></td>
      <td><code>#4dab9a</code></td>
      <td>Inner peace</td>
      <td>Meditation, prayer, gratitude</td>
    </tr>
    <tr>
      <td>🔴 <strong>Emotional</strong></td>
      <td><code>#e25553</code></td>
      <td>Relationships</td>
      <td>Social connection, self-care</td>
    </tr>
    <tr>
      <td>🟡 <strong>Physical</strong></td>
      <td><code>#ffc940</code></td>
      <td>Body health</td>
      <td>Workout, sleep, nutrition</td>
    </tr>
  </tbody>
</table>

<br/>

---

## 🚀 Live Demo

> **🌐 [https://4-pillar-system.vercel.app](https://4-pillar-system.vercel.app)**

No setup required — sign in with Google or your email and start tracking immediately.

<br/>

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Role |
|-----------|---------|------|
| **Next.js** | 16.2.9 | React framework (App Router) |
| **React** | 19.2.4 | UI library |
| **TypeScript** | ^5 | Type safety |
| **Tailwind CSS** | ^4 | Utility-first styling |
| **Lucide React** | ^1.21.0 | Icon library |
| **Recharts** | ^3.8.1 | Charts and analytics graphs |
| **TanStack Table** | ^8.21.3 | Advanced table with sorting/filtering |

### Backend

| Technology | Version | Role |
|-----------|---------|------|
| **Next.js Server Actions** | — | Business logic & mutations |
| **Next.js Route Handlers** | — | REST-like API endpoints |
| **MongoDB Atlas** | via Mongoose ^9.7.1 | Cloud database |

### Auth & Forms

| Technology | Version | Role |
|-----------|---------|------|
| **Auth.js (NextAuth)** | ^5.0.0-beta | Session management |
| **Google Provider** | — | OAuth via Google |
| **Credentials Provider** | — | Passwordless email login |
| **React Hook Form** | ^7.80.0 | Form state management |
| **Zod** | ^4.4.3 | Schema validation |
| **Zustand** | ^5.0.14 | Global client state |

### Deployment

| Technology | Role |
|-----------|------|
| **Vercel** | Hosting + Serverless Functions |
| **MongoDB Atlas** | Cloud database |
| **Vercel Cron Jobs** | Midnight automation trigger |

<br/>

---

## 📸 Pages & Features

| Route | Description |
|-------|-------------|
| `/` | Landing page — feature showcase & sign-in CTA |
| `/dashboard` | Life Score, streaks, pillar scores, progress charts |
| `/today` | Auto-generated daily habit checklist grouped by pillar |
| `/master-habits` | CRUD for master habits (add, rename, archive, reactivate) |
| `/calendar` | GitHub-style heatmap with daily drill-down modal |
| `/analytics` | Leaderboard, missed analysis, trend graphs |
| `/history` | Advanced filtered table of all logs + CSV/Excel export |
| `/settings` | Profile, timezone, theme, data export, delete account |

<br/>

---

## 🧠 How It Works

### Daily Automation Flow

```
12:01 AM UTC → Vercel triggers /api/cron
       │
       ▼
For each user in DB:
       ├── Determine local date (via user timezone)
       ├── Fetch all active MasterHabits
       ├── Create DailyLog for each habit (status: "Pending")
       └── Create DailySnapshot (completionRate: 0)
```

### Scoring System

```
Life Score     = average(completionRate of ALL DailySnapshots ever)
Pillar Score   = average(completion% of all DailyLogs for that pillar)
Streak         = consecutive days with completionRate >= 50%
Habit Rate     = (Completed logs / Total logs) x 100
```

### Completion Mapping

| Status | Completion % |
|--------|-------------|
| Pending | 0% |
| Missed | 0% |
| Partial | 50% |
| Completed | 100% |

### Life Score Categories

| Score | Category |
|-------|----------|
| 90 – 100 | 🏆 Elite |
| 75 – 89 | 💪 Strong |
| 60 – 74 | 📈 Improving |
| Below 60 | ⚠️ Needs Attention |

<br/>

---

## 📁 Project Structure

```
The 4 Pillar system/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Landing page (/)
│   │   ├── globals.css             # Global styles + CSS variables
│   │   ├── dashboard/page.tsx      # /dashboard (protected)
│   │   ├── today/page.tsx          # /today (protected)
│   │   ├── master-habits/page.tsx  # /master-habits (protected)
│   │   ├── calendar/page.tsx       # /calendar (protected)
│   │   ├── analytics/page.tsx      # /analytics (protected)
│   │   ├── history/page.tsx        # /history (protected)
│   │   ├── settings/page.tsx       # /settings (protected)
│   │   ├── login/page.tsx          # /login (public)
│   │   └── api/
│   │       ├── auth/[...nextauth]/ # NextAuth handler
│   │       └── cron/route.ts       # Midnight automation endpoint
│   │
│   ├── components/                 # Shared UI components
│   │   ├── AppLayout.tsx           # Root layout shell
│   │   ├── Sidebar.tsx             # Desktop sidebar navigation
│   │   ├── TopBar.tsx              # Top bar (search, theme, mobile menu)
│   │   ├── MobileDrawer.tsx        # Mobile slide-out drawer
│   │   ├── ThemeProvider.tsx       # Dark/light theme applicator
│   │   └── *Client.tsx             # Page-level client components
│   │
│   ├── actions/                    # Next.js Server Actions
│   │   ├── habitActions.ts         # Habit CRUD
│   │   ├── logActions.ts           # Daily log management
│   │   ├── dashboardActions.ts     # Dashboard stats & streaks
│   │   ├── analyticsActions.ts     # Analytics & leaderboard
│   │   ├── historyActions.ts       # History with pagination & filters
│   │   └── userActions.ts          # Profile & account management
│   │
│   ├── models/                     # Mongoose schemas
│   │   ├── User.ts
│   │   ├── MasterHabit.ts
│   │   ├── DailyLog.ts
│   │   └── DailySnapshot.ts
│   │
│   ├── lib/
│   │   ├── db.ts                   # MongoDB singleton connection
│   │   └── authHelpers.ts          # Session & auth helpers
│   │
│   ├── store/useStore.ts           # Zustand global store
│   └── auth.ts                     # NextAuth configuration
│
├── public/                         # Static assets
├── vercel.json                     # Vercel cron job config
├── next.config.ts
├── tsconfig.json
└── package.json
```

<br/>

---

## ⚙️ Local Development Setup

### Prerequisites

- Node.js `>=18`
- A MongoDB Atlas cluster (free tier works)
- A Google Cloud project with OAuth credentials

### 1. Clone the repository

```bash
git clone https://github.com/your-username/the-4-pillar-system.git
cd the-4-pillar-system
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/four_pillar_system
NEXTAUTH_SECRET=<random-32-char-string>
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=<from-google-console>
GOOGLE_CLIENT_SECRET=<from-google-console>
CRON_SECRET=<random-secret-for-cron>
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the app is running!

<br/>

---

## 🚢 Deployment Guide

### Step 1 — MongoDB Atlas

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a database user
3. Whitelist `0.0.0.0/0` (required for Vercel's dynamic IPs)
4. Copy the connection string

### Step 2 — Google OAuth

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Set Authorized Redirect URI:
   ```
   https://your-domain.vercel.app/api/auth/callback/google
   ```

### Step 3 — Deploy to Vercel

1. Push your project to GitHub
2. Import the repo in the [Vercel dashboard](https://vercel.com/new)
3. Add all environment variables from `.env.local`
4. Deploy — Vercel auto-configures cron jobs from `vercel.json`

### Step 4 — Verify Cron Job

Go to **Vercel Dashboard → Project → Cron Jobs** and confirm `/api/cron` is scheduled at `1 0 * * *`.

<br/>

---

## 🗃️ Database Schema

```
User ─────┬──── MasterHabit  (userId)
          │
          ├──── DailyLog      (userId, habitId → MasterHabit)
          │
          └──── DailySnapshot (userId)
```

> ⚠️ **Habits are NEVER deleted.** They are archived (`active: false`).
> This design guarantees that all historical `DailyLog` records remain valid and queryable forever.

<br/>

---

## 🔐 Authentication

Two sign-in methods are supported:

- **Google OAuth** — One-click sign-in via your Google account
- **Passwordless Email** — Enter your email to instantly sign in (or auto-register). No password needed — perfect for demos and local testing.

Session strategy is **JWT** (stateless, stored in a cookie). Every protected page and server action calls `requireSessionUser()` which redirects to `/login` if unauthenticated.

<br/>

---

## 🌓 Theme System

The UI supports full **Dark and Light modes**, inspired by Notion's clean aesthetic.

| CSS Variable | Light | Dark |
|-------------|-------|------|
| `--background` | `#ffffff` | `#191919` |
| `--foreground` | `#37352f` | `#e3e3e3` |
| `--sidebar-background` | `#f7f7f5` | `#202020` |
| `--border` | `#e9e9e6` | `#2c2c2c` |
| `--accent` | `#2383e2` | `#2eaadc` |

Theme preference is persisted to `localStorage` via Zustand and applied before React renders — **no white flash on load**.

<br/>

---

## 📄 License

This project is for personal use and portfolio purposes.

<br/>

---

<div align="center">

Built with ❤️ using **Next.js**, **MongoDB Atlas**, and **Vercel**

**[🌐 Visit the Live App](https://4-pillar-system.vercel.app)**

</div>
