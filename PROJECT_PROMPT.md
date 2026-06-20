# ROLE

You are a senior staff engineer and product designer.

Your task is to build a complete production-ready full-stack web application.

Do NOT create a demo, MVP, mockup, placeholder implementation, simplified version, or partial implementation.

Build the entire application end-to-end with clean architecture, scalability, and maintainability.

---

# TECH STACK

Frontend:

* Next.js 15 (App Router)
* TypeScript
* Tailwind CSS
* shadcn/ui
* Lucide Icons
* TanStack Table
* Recharts

Backend:

* Next.js Server Actions
* Next.js Route Handlers

Database:

* MongoDB
* Mongoose

Authentication:

* NextAuth/Auth.js
* Email + Google Login

Deployment:

* Vercel
* MongoDB Atlas

State Management:

* Zustand

Validation:

* Zod

Forms:

* React Hook Form

Scheduling:

* Vercel Cron Jobs

---

# PRODUCT NAME

The Four Pillar System

A personal life operating system inspired by Notion.

---

# CORE PHILOSOPHY

I do NOT want a task manager.

I want a habit operating system.

The system must automatically generate daily tasks from master habits.

Historical records must never be deleted.

Everything should be measurable through analytics.

---

# DESIGN REQUIREMENTS

UI should closely resemble Notion.

Characteristics:

* Minimal
* Clean
* Professional
* Dark Mode
* Light Mode
* Sidebar Navigation
* Top Search
* Database-like tables
* Tag pills
* Filters
* Sorting
* Inline editing

Responsive for:

* Mobile
* Tablet
* Desktop

Mobile UX must be first-class.

No horizontal scrolling.

Use drawer navigation on mobile.

---

# DATABASE DESIGN

## USERS

* _id
* name
* email
* image
* createdAt

---

## MASTER HABITS

Stores permanent habit templates.

Fields:

* _id
* userId
* name
* pillar
* active
* createdAt
* updatedAt

Pillar Enum:

* Mental
* Spiritual
* Emotional
* Physical

IMPORTANT:

User can edit:

* habit name

User can NOT edit:

* automation logic
* analytics calculations

---

## DAILY LOGS

Every habit occurrence is stored here.

Fields:

* _id
* userId
* habitId
* date
* status
* notes
* completionPercentage
* createdAt

Status:

* Pending
* Partial
* Completed
* Missed

---

## DAILY SNAPSHOTS

Stores daily summary data.

Fields:

* date
* completionRate
* pillarScores
* completedCount
* missedCount

---

# AUTOMATION REQUIREMENTS

This is the most important feature.

Every day at 12:01 AM local timezone:

For every ACTIVE habit:

Create a Daily Log record.

Example:

Master Habits:

Workout
Stretching
Good Sleep

At midnight:

Create:

Workout - Pending
Stretching - Pending
Good Sleep - Pending

for today's date.

No manual action required.

Use:

Vercel Cron Job

Requirements:

* Prevent duplicates
* Handle timezone correctly
* Idempotent execution
* Retry safe

---

# SIDEBAR NAVIGATION

Create:

Dashboard

Today's Tasks

Master Habits

Calendar

Analytics

History

Settings

---

# PAGE 1

DASHBOARD

Show:

Overall Life Score

Current Streak

Today's Progress

Weekly Progress

Monthly Progress

Quarterly Progress

Yearly Progress

Four Pillar Scores

Mental %

Spiritual %

Emotional %

Physical %

Display:

* Progress Rings
* Progress Bars
* Trend Graphs

---

# PAGE 2

TODAY'S TASKS

Default landing page.

Display all habits generated for today.

Group by:

Mental
Spiritual
Emotional
Physical

Actions:

Mark Completed

Mark Partial

Mark Missed

Add Notes

Realtime updates.

Progress should update instantly.

---

# PAGE 3

MASTER HABITS

User can:

Add Habit

Rename Habit

Archive Habit

Reactivate Habit

Columns:

Name

Pillar

Status

Created Date

IMPORTANT:

Renaming a habit should preserve all historical records.

Use references instead of text duplication.

---

# PAGE 4

CALENDAR

GitHub-style contribution calendar.

Show:

Daily completion score.

Color intensity based on completion percentage.

Clicking a day opens:

Completed habits

Missed habits

Notes

Statistics

---

# PAGE 5

ANALYTICS

Show:

Daily Completion %

Weekly Completion %

Monthly Completion %

Quarterly Completion %

Yearly Completion %

---

# STREAKS

For every habit calculate:

Current Streak

Longest Streak

---

# LEADERBOARD

Rank habits by:

Highest completion %

Show:

Habit Name

Completion Rate

Current Streak

Longest Streak

---

# MISSED ANALYSIS

Show:

Most Missed Habit

Most Missed Pillar

Habit Failure Trends

Weekly Failure Trends

Monthly Failure Trends

---

# FOUR PILLAR HEALTH SCORE

Formula:

(Mental +
Spiritual +
Emotional +
Physical) / 4

---

# LIFE SCORE

Formula:

Overall average completion %

Display:

90-100 = Elite

75-89 = Strong

60-74 = Improving

Below 60 = Needs Attention

---

# PAGE 6

HISTORY

Advanced table view.

Filters:

Date Range

Pillar

Status

Habit

Month

Year

Search

Export CSV

Export Excel

---

# PAGE 7

SETTINGS

Profile

Theme

Timezone

Data Export

Delete Account

---

# SEARCH

Global search across:

Habits

Logs

Notes

History

---

# PERFORMANCE

Requirements:

Server Components where possible

Pagination

Database Indexes

Optimized Queries

Caching

Lazy Loading

Code Splitting

No N+1 Queries

---

# SECURITY

Protected Routes

Session Validation

Input Validation

Rate Limiting

Sanitized Inputs

Secure APIs

---

# DELIVERABLES

Generate:

1. Complete folder structure
2. MongoDB schemas
3. API routes
4. Server actions
5. UI components
6. Dashboard components
7. Analytics engine
8. Cron job implementation
9. Authentication setup
10. Deployment guide

Generate actual production code.

Do not provide explanations.

Create the application step-by-step until the entire codebase is complete.
