# Production-Grade Interactive Calendar Component — Master Engineering Specification

> **Document Purpose:** This is a comprehensive engineering specification for building a production-grade, interactive calendar component. It is designed to eliminate ambiguity, enforce best practices across every dimension of frontend engineering, and guide the implementation toward a top 1% outcome in a competitive evaluation with 5000+ submissions.

---

## Table of Contents

1. [Context & Evaluation Philosophy](#1-context--evaluation-philosophy)
2. [Technology Stack & Constraints](#2-technology-stack--constraints)
3. [Architecture & Project Structure](#3-architecture--project-structure)
4. [Design System & Visual Language](#4-design-system--visual-language)
5. [Component Design Specifications](#5-component-design-specifications)
6. [Functional Requirements](#6-functional-requirements)
7. [State Management Architecture](#7-state-management-architecture)
8. [Data Model & Type System](#8-data-model--type-system)
9. [Animation System](#9-animation-system)
10. [Responsiveness Strategy](#10-responsiveness-strategy)
11. [Accessibility (a11y)](#11-accessibility-a11y)
12. [Performance Engineering](#12-performance-engineering)
13. [Code Quality Standards](#13-code-quality-standards)
14. [Evaluation Alignment & Differentiation](#14-evaluation-alignment--differentiation)
15. [Engineering Quality Checklist](#15-engineering-quality-checklist)

---

## 1. Context & Evaluation Philosophy

### 1.1 What This Project Is

This is a **competitive frontend engineering evaluation** where the deliverable is a single, highly polished, interactive calendar component. It is judged against thousands of other submissions by senior engineers and design-aware reviewers.

### 1.2 What Reviewers Are Looking For

| Dimension | What "Good" Looks Like | What "Great" Looks Like |
|---|---|---|
| **Code Architecture** | Clean separation of concerns | Hooks encapsulate logic; components are pure renderers; zero prop-drilling |
| **UI/UX** | Functional and decent-looking | Feels like a shipped product feature at a top-tier company |
| **Interactions** | Click handlers work | Hover previews, smooth transitions, satisfying micro-feedback |
| **Responsiveness** | No overflow on mobile | Layout adapts intelligently; touch targets are generous; UX is preserved |
| **State Management** | useState works | Predictable state machine; derived state is computed, not stored; no stale closures |
| **Code Readability** | Readable | Self-documenting with clear intent; strategic comments explain *why*, not *what* |

### 1.3 Core Engineering Philosophy

- **Clarity over Cleverness** — Every abstraction must earn its existence. If a simpler approach achieves the same result, prefer it.
- **UX over Feature Count** — A polished core experience beats a buggy feature-rich one. Nail the fundamentals before extending.
- **Intentionality** — Every design choice, animation, color, and abstraction must have a clear *reason*. Be prepared to defend any decision.
- **Production Mindset** — Write code as if another engineer will maintain it next quarter. No hacks, no TODO comments left behind, no dead code.

---

## 2. Technology Stack & Constraints

### 2.1 Required Stack

| Layer | Technology | Purpose |
|---|---|---|
| Framework | **Next.js 14+** (App Router) | Page routing, SSR/SSG capabilities, project scaffolding |
| Language | **TypeScript** (strict mode) | Type safety, self-documenting interfaces, refactor confidence |
| Styling | **Tailwind CSS** | Utility-first styling, consistent design tokens, responsive utilities |
| UI Primitives | **shadcn/ui** | Accessible, unstyled component primitives (Dialog, Popover, etc.) |
| Animations | **Framer Motion** | Declarative animations, layout animations, gesture support |
| Date Utilities | **date-fns** | Lightweight, tree-shakeable date manipulation (NOT moment.js, NOT dayjs) |
| Persistence | **localStorage** | Client-side data persistence for notes |

### 2.2 Hard Constraints

- ❌ **No backend, API, or database** — This is a purely client-side application.
- ❌ **No heavy/unnecessary libraries** — No Three.js, no D3, no Redux, no Zustand, no CSS-in-JS libraries.
- ❌ **No `any` types** — Every value must be explicitly typed. Use `unknown` with type guards where necessary.
- ❌ **No `// @ts-ignore` or `// @ts-expect-error`** — Fix the types, don't suppress them.
- ✅ **Use `"use client"` directives** only on components that require client-side interactivity.

### 2.3 TypeScript Configuration

Enable the following in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

---

## 3. Architecture & Project Structure

### 3.1 Folder Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with metadata, fonts, global providers
│   ├── page.tsx            # Main page — composes the full calendar view
│   └── globals.css         # Tailwind directives + custom CSS variables
│
├── components/
│   ├── calendar/
│   │   ├── Calendar.tsx        # Top-level calendar container (orchestrator)
│   │   ├── CalendarHeader.tsx  # Month/year display + navigation arrows
│   │   ├── CalendarGrid.tsx    # 7-column grid rendering day cells
│   │   ├── DayCell.tsx         # Single day — handles click, hover, visual states
│   │   └── RangeHighlight.tsx  # Visual connector between start and end dates
│   │
│   ├── notes/
│   │   ├── NotesPanel.tsx      # Panel for viewing/adding/editing notes
│   │   └── NoteIndicator.tsx   # Small visual marker on dates with notes
│   │
│   └── hero/
│       └── HeroImage.tsx       # Hero/banner image with gradient overlay
│
├── hooks/
│   ├── useCalendar.ts          # Month navigation, grid generation
│   ├── useDateRange.ts         # Date selection state machine
│   ├── useNotes.ts             # Notes CRUD + localStorage sync
│   └── useLocalStorage.ts      # Generic typed localStorage wrapper
│
├── lib/
│   ├── calendar.ts             # Pure functions: grid generation, week alignment
│   └── dateHelpers.ts          # Pure functions: formatting, comparison, range utils
│
└── types/
    └── index.ts                # All shared TypeScript types and interfaces
```

### 3.2 Architecture Principles

| Principle | Implementation |
|---|---|
| **Single Responsibility** | Each component does exactly one thing. `DayCell` renders a day; it does not manage range selection logic. |
| **Smart/Dumb Split** | Hooks are "smart" (contain logic). Components are "dumb" (receive props, render UI). |
| **Zero Prop-Drilling** | If data must pass through more than 2 levels, extract it into a hook or use React Context. |
| **Pure Utilities** | Functions in `lib/` must be pure — no side effects, no React dependencies, fully testable. |
| **Colocation** | Component-specific styles (if any beyond Tailwind) are colocated with the component. |
| **Composition over Configuration** | Prefer composing smaller components rather than passing configuration objects to monolithic ones. |

### 3.3 Component Dependency Graph

```
page.tsx
  └── Calendar.tsx (orchestrator)
        ├── HeroImage.tsx
        ├── CalendarHeader.tsx
        ├── CalendarGrid.tsx
        │     ├── DayCell.tsx (×42)
        │     │     └── NoteIndicator.tsx
        │     └── RangeHighlight.tsx
        └── NotesPanel.tsx
```

**Rule:** Dependencies flow downward only. No child component should import from or directly communicate with a sibling. All cross-component communication flows through the parent orchestrator via props.

---

## 4. Design System & Visual Language

### 4.1 Design Intent

The calendar should evoke a **premium physical wall calendar** — clean, tactile, warm. Think Muji meets Apple Calendar. The hero image grounds the design emotionally; the calendar grid is crisp and functional; the notes panel is minimal and supportive.

**Anti-patterns to avoid:**
- Neon colors or excessive gradients
- Heavy drop shadows that feel dated
- Overly rounded "bubbly" aesthetics
- Dense, cramped layouts
- Default browser fonts or unstyled form elements

### 4.2 Typography Scale

Use a **single font family** loaded via `next/font` for performance. Recommended: **Inter**, **Plus Jakarta Sans**, or **Geist**.

| Token | Size | Weight | Usage |
|---|---|---|---|
| `text-display` | 28–32px | 700 | Month/year title in header |
| `text-heading` | 18–20px | 600 | Section labels (e.g., "Notes") |
| `text-body` | 14–15px | 400 | Note content, day labels |
| `text-caption` | 12px | 500 | Weekday headers, metadata |
| `text-micro` | 10px | 500 | Indicators, badges |

### 4.3 Spacing System

Use Tailwind's default 4px base unit consistently. Define a spatial rhythm:

| Token | Value | Usage |
|---|---|---|
| `--space-xs` | 4px | Icon padding, indicator spacing |
| `--space-sm` | 8px | Inner cell padding, compact gaps |
| `--space-md` | 16px | Section padding, grid gap |
| `--space-lg` | 24px | Panel padding, major gaps |
| `--space-xl` | 32px | Layout margin, hero padding |
| `--space-2xl` | 48px | Page-level margins |

**Rule:** If spacing feels "off" anywhere, it's likely because the spatial rhythm is broken. Every spacing value should be a multiple of 4px.

### 4.4 Color Palette

Define colors as CSS custom properties in `globals.css` for easy theming:

| Token | Role | Guidance |
|---|---|---|
| `--color-bg` | Page background | Warm off-white (`#FAFAF8`) or soft gray (`#F5F5F3`) |
| `--color-surface` | Card/panel background | White or very light neutral |
| `--color-text-primary` | Primary text | Near-black (`#1A1A1A`) |
| `--color-text-secondary` | Secondary/muted text | Medium gray (`#6B7280`) |
| `--color-accent` | Interactive elements, selection | A single confident accent (e.g., warm blue `#3B82F6`, terracotta `#C2775E`, or deep green `#2D6A4F`) |
| `--color-accent-soft` | Range highlight background | 10–15% opacity version of accent |
| `--color-border` | Subtle dividers | Very light gray (`#E5E7EB`) |
| `--color-hover` | Day cell hover state | 5% opacity of accent |

**Rule:** Use **one accent color** and derive all interactive states from it. Multiple accent colors create visual noise and look amateur.

### 4.5 Elevation & Depth

| Level | Box-Shadow | Usage |
|---|---|---|
| `elevation-0` | None | Flat elements, grid cells |
| `elevation-1` | `0 1px 3px rgba(0,0,0,0.08)` | Cards, notes panel |
| `elevation-2` | `0 4px 12px rgba(0,0,0,0.1)` | Floating elements, active panels |

**Rule:** Use elevation sparingly. Over-shadowed UIs feel cluttered. The hero image gradient and subtle borders should provide most of the visual separation.

### 4.6 Border Radius & Shape

| Element | Radius |
|---|---|
| Day cells | `6–8px` |
| Cards/panels | `12px` |
| Buttons/inputs | `8px` |
| Hero image | `16px` (or edge-to-edge with internal rounding) |

### 4.7 Layout Composition

**Desktop (≥1024px):**

```
┌─────────────────────────────────────────────┐
│                  HERO IMAGE                 │
│           (with gradient overlay)           │
├──────────────────────┬──────────────────────┤
│                      │                      │
│   CALENDAR HEADER    │     NOTES PANEL      │
│   CALENDAR GRID      │     (scrollable)     │
│                      │                      │
└──────────────────────┴──────────────────────┘
```

Calendar grid takes ~60% width; notes panel takes ~40%. Hero spans full width above.

**Alternative desktop layout** (side-by-side variant):

```
┌────────────┬────────────────────────────────┐
│            │       CALENDAR HEADER          │
│    HERO    │       CALENDAR GRID            │
│   IMAGE    ├────────────────────────────────┤
│            │       NOTES PANEL              │
└────────────┴────────────────────────────────┘
```

Choose ONE layout. Do not mix. The choice should complement the hero image aspect ratio.

---

## 5. Component Design Specifications

### 5.1 `HeroImage.tsx`

| Aspect | Specification |
|---|---|
| Content | A high-quality, calming image (nature, abstract, architecture) |
| Overlay | Bottom-gradient overlay fading to the page background color for seamless blending |
| Aspect Ratio | 16:9 on desktop, 2:1 on mobile |
| Behavior | Static; purely decorative. No interaction. |
| Implementation | Use `next/image` with `priority` for LCP optimization |

### 5.2 `CalendarHeader.tsx`

| Aspect | Specification |
|---|---|
| Content | Current month name + year (e.g., "April 2026") |
| Navigation | Left/right arrows for month navigation. Optional: "Today" button to return to current month |
| Typography | `text-display` weight and size |
| Animation | Month text should animate on change (crossfade or slide) |
| A11y | Navigation buttons must have `aria-label` (e.g., "Go to previous month") |

### 5.3 `CalendarGrid.tsx`

| Aspect | Specification |
|---|---|
| Header Row | 7 weekday labels (Sun–Sat or Mon–Sun based on locale). Use `text-caption`. |
| Grid | 6 rows × 7 columns (42 cells). Use CSS Grid (`grid-template-columns: repeat(7, 1fr)`) |
| Padding Days | Days from previous/next month shown with reduced opacity (`text-secondary` color) |
| Current Day | Subtle visual indicator (e.g., a small dot below the number, or a bold ring) — distinct from selection state |

### 5.4 `DayCell.tsx`

This is the most interaction-heavy component. It must handle the following visual states cleanly:

| State | Visual Treatment |
|---|---|
| **Default** | Number only, transparent background |
| **Today** | Subtle distinguishing mark (underline, dot, or weight change) |
| **Hovered** | Light background tint (`--color-hover`) with `scale(1.02)` micro-animation |
| **Start Date** | Filled circle/rounded-square in accent color, white text |
| **End Date** | Same as start date |
| **In Range** | Soft accent background (`--color-accent-soft`), connected visually left-to-right |
| **Hover Preview** (before end date selected) | Lighter version of "In Range" state, visually distinct from confirmed range |
| **Has Note** | Small dot indicator below the date number |
| **Outside Current Month** | Reduced opacity, non-interactive OR interactive with dimmed styling |

**Implementation Rule:** Use a single `getDayCellState()` utility function that takes `(date, selectionState, hoveredDate, notes)` and returns a deterministic state enum. The component should render purely based on this state. Do NOT use nested conditionals inside JSX.

### 5.5 `RangeHighlight.tsx`

The visual "bridge" between start and end dates across rows.

| Aspect | Specification |
|---|---|
| Behavior | Renders a continuous highlight band across the row behind day cells |
| Edge Treatment | Rounded on the start/end date ends; straight edges on mid-range cells |
| Row Wrapping | When range spans multiple weeks, each row gets its own highlight band |
| Z-index | Rendered behind day cell content but above the grid background |

### 5.6 `NotesPanel.tsx`

| Aspect | Specification |
|---|---|
| Trigger | Appears when a date or range is selected |
| Content | Text input/textarea for adding a note; list of existing notes for the selected date(s) |
| Empty State | Clear prompt: "Select a date to view or add notes" (not a blank panel) |
| Persistence | Save to localStorage on every change (debounced — see Performance section) |
| Delete | Each note should have a delete action with confirmation or undo |
| Animation | Panel slides/fades in from the right (desktop) or bottom (mobile) |

---

## 6. Functional Requirements

### 6.1 Calendar Grid Generation

- Use `date-fns` functions: `startOfMonth`, `endOfMonth`, `startOfWeek`, `endOfWeek`, `eachDayOfInterval`, `format`, `isSameMonth`, `isSameDay`, `isWithinInterval`.
- Always generate a full 6-week (42-day) grid to prevent layout shifts when months have different row counts.
- Week start day should be configurable (default: Sunday).

### 6.2 Month Navigation

- Clicking left arrow navigates to the previous month.
- Clicking right arrow navigates to the next month.
- Navigation must NOT reset the current date selection or notes.
- Current month/year display updates with animation (see Section 9).

### 6.3 Date Range Selection — State Machine

This is the **most critical interaction** in the entire application. It must be implemented as a **deterministic state machine**, not ad-hoc conditionals.

```
State Machine: DateRangeSelection
─────────────────────────────────

States:
  IDLE        → No selection active
  START_SET   → Start date selected, awaiting end date
  RANGE_SET   → Both start and end dates selected

Transitions:
  IDLE → click(date) → START_SET
    • Set startDate = date
    • Clear endDate

  START_SET → click(date) →
    • IF date === startDate → IDLE (deselect)
    • IF date < startDate → START_SET (reset start to this date)
    • IF date > startDate → RANGE_SET (set endDate = date)
    • IF date === startDate → IDLE (toggle off)

  RANGE_SET → click(date) → IDLE (reset all, then START_SET with new date)
    • Clear startDate, endDate
    • Set startDate = date
    • Transition to START_SET

  START_SET → hover(date) →
    • IF date > startDate → show preview range
    • IF date ≤ startDate → no preview (or show reverse preview)
```

**Rule:** The `useDateRange` hook must expose the current state name (IDLE, START_SET, or RANGE_SET) for debugging and testing clarity.

### 6.4 Hover Preview

When in `START_SET` state:

- Hovering over any date **after** the start date should show a **preview highlight** on all dates between startDate and hoveredDate.
- The preview must be visually distinct from the confirmed selection (use lower opacity or a different shade).
- Preview must update **instantly** on hover — no debounce, no delay.
- When the cursor leaves the grid, the preview must clear immediately.

### 6.5 Notes System

**Creating Notes:**

- When a date or range is selected, the NotesPanel shows an input.
- User types a note and presses Enter or clicks a save button.
- Note is saved to localStorage immediately.
- A visual indicator (dot) appears on all dates associated with the note.

**Viewing Notes:**

- Clicking a date with existing notes shows them in the NotesPanel.
- If a range is selected, show all notes within that range, grouped by date.

**Deleting Notes:**

- Each note has a delete button.
- Deletion removes the note from localStorage and updates the UI instantly.

**Edge Cases:**

- A note created for a range should appear on every date within that range.
- If a note exists for a range "Apr 8–12" and the user clicks just "Apr 10", that note should still appear.
- Empty notes (whitespace only) must not be saved.

---

## 7. State Management Architecture

### 7.1 State Ownership Map

| State | Owner Hook | Source of Truth | Derived? |
|---|---|---|---|
| Current month/year | `useCalendar` | `currentDate: Date` (1st of displayed month) | No |
| Calendar grid (42 days) | `useCalendar` | Computed from `currentDate` | Yes — derived via `date-fns` |
| Selection state | `useDateRange` | `{ state, startDate, endDate }` | No |
| Hovered date | `useDateRange` | `hoveredDate: Date \| null` | No |
| Hover preview range | `useDateRange` | Computed from `startDate` + `hoveredDate` | Yes — derived |
| Notes data | `useNotes` | `Record<string, Note[]>` from localStorage | No |
| Active panel content | Derived | From selection + notes | Yes — derived |

### 7.2 Hook Contracts

#### `useCalendar()`

```typescript
interface UseCalendarReturn {
  currentDate: Date;                    // 1st day of displayed month
  calendarDays: CalendarDay[];          // 42-element array
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
  goToToday: () => void;
}
```

#### `useDateRange()`

```typescript
type SelectionState = 'IDLE' | 'START_SET' | 'RANGE_SET';

interface UseDateRangeReturn {
  selectionState: SelectionState;
  startDate: Date | null;
  endDate: Date | null;
  hoveredDate: Date | null;
  previewRange: Date[];                 // Derived: dates between start and hovered
  handleDateClick: (date: Date) => void;
  handleDateHover: (date: Date) => void;
  handleMouseLeave: () => void;
  resetSelection: () => void;
}
```

#### `useNotes()`

```typescript
interface UseNotesReturn {
  notes: Record<string, Note[]>;        // Keyed by date string
  addNote: (dateKey: string, text: string) => void;
  deleteNote: (dateKey: string, noteId: string) => void;
  getNotesForDate: (date: Date) => Note[];
  getNotesForRange: (start: Date, end: Date) => Map<string, Note[]>;
  hasNotes: (date: Date) => boolean;
}
```

#### `useLocalStorage<T>(key: string, initialValue: T)`

```typescript
interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (value: T | ((prev: T) => T)) => void;
  removeValue: () => void;
}
```

### 7.3 State Flow Rules

1. **No duplicated state.** If something can be derived, compute it. Never store `previewRange` separately — compute it from `startDate` + `hoveredDate`.
2. **No state in child components.** `DayCell` receives its state via props. It calls handler functions passed from above. It never calls `useState`.
3. **Single direction.** Data flows down (props). Events flow up (callbacks). No exceptions.
4. **Batched updates.** When a click triggers both a selection change and a notes panel update, both should happen in the same React render cycle.

---

## 8. Data Model & Type System

### 8.1 Core Types

```typescript
// types/index.ts

/** Represents a single day cell in the calendar grid */
interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
}

/** Visual state of a day cell — used for rendering decisions */
type DayCellState =
  | 'default'
  | 'today'
  | 'start'
  | 'end'
  | 'in-range'
  | 'preview'
  | 'outside-month';

/** A single note entry */
interface Note {
  id: string;                // UUID — use crypto.randomUUID()
  text: string;
  createdAt: string;         // ISO 8601 timestamp
}

/** The shape of notes stored in localStorage */
type NotesStore = Record<string, Note[]>;
// Key format: "2026-04-08" for single dates
// Notes for ranges are stored under each individual date in the range

/** Date range selection state */
interface DateRangeState {
  state: 'IDLE' | 'START_SET' | 'RANGE_SET';
  startDate: Date | null;
  endDate: Date | null;
}
```

### 8.2 Date Key Strategy

- **Format:** `"YYYY-MM-DD"` (ISO 8601 date portion) via `format(date, 'yyyy-MM-dd')`.
- **Range Storage:** When a note is added to a range (e.g., Apr 8–12), store the note under **each individual date** in the range. This ensures:
  - Clicking any single date within the range retrieves the note.
  - Deletion is straightforward (remove from each key, or use a reference ID for bulk delete).
- **Alternative (if memory is a concern):** Store the note once under a range key `"2026-04-08_to_2026-04-12"` and resolve it during lookup. This is more complex but more storage-efficient. Choose one approach and be consistent.

### 8.3 localStorage Schema

```json
{
  "calendar-notes": {
    "2026-04-08": [
      {
        "id": "a1b2c3d4-...",
        "text": "Team standup",
        "createdAt": "2026-04-08T10:30:00.000Z"
      }
    ],
    "2026-04-09": [],
    "2026-04-10": [
      {
        "id": "e5f6g7h8-...",
        "text": "Sprint review",
        "createdAt": "2026-04-07T14:00:00.000Z"
      }
    ]
  }
}
```

### 8.4 Edge Cases to Handle

| Edge Case | Expected Behavior |
|---|---|
| Empty localStorage | Initialize with empty object `{}` |
| Corrupted/invalid JSON in localStorage | Reset to default state with console warning |
| Note with only whitespace | Reject — do not save |
| Range where start > end | Swap dates silently (user selects Apr 12 first, then Apr 8 — treat Apr 8 as start) |
| Date key collision | Append to existing array, never overwrite |
| Month with 28/29/30/31 days | Handled by `date-fns` — no manual calculation |
| February 29 (leap year) | Handled by `date-fns` — ensure no hardcoded month lengths |

---

## 9. Animation System

### 9.1 Animation Philosophy

> Animations should feel like **natural physical responses**, not decorative flourishes. Every animation must serve a purpose: provide feedback, indicate state change, guide attention, or smooth a transition.

### 9.2 Animation Inventory

| Trigger | Animation | Duration | Easing | Purpose |
|---|---|---|---|---|
| Month navigation | Slide left/right with crossfade | 250–300ms | `easeInOut` | Spatial metaphor — months are "next to" each other |
| Day cell hover | `scale(1.03)` + background tint | 120ms | `easeOut` | Immediate tactile feedback |
| Date selection | Background fill with slight bounce | 200ms | `spring(stiffness: 300, damping: 25)` | Confirms action |
| Range highlight expansion | Width/opacity animation across cells | 150ms stagger | `easeOut` | Shows range "growing" from start date |
| Hover preview | Opacity pulse (0 → 0.3) | 100ms | `linear` | Fast, non-distracting preview |
| Notes panel open | Slide in from right + fade | 200ms | `easeOut` | Panel "appears" from logical position |
| Notes panel close | Fade out + slide right | 150ms | `easeIn` | Slightly faster dismiss (feels responsive) |
| Note added | Slide down into list | 200ms | `easeOut` | New item "arrives" |
| Note deleted | Fade out + collapse height | 200ms | `easeIn` | Item "leaves" |

### 9.3 Animation Rules

1. **Never animate layout on initial render.** No entrance animations when the page first loads (except the hero image fade-in if desired).
2. **Never block interaction.** All animations must use `pointer-events: auto` throughout. The user should never have to "wait" for an animation.
3. **Respect `prefers-reduced-motion`.** Wrap all Framer Motion animations in a check:
   ```tsx
   const prefersReducedMotion = useReducedMotion();
   ```
   If true, skip animations or use instant transitions.
4. **Use `layout` prop sparingly.** Framer Motion's `layout` animations can cause reflows. Only use on elements where spatial position actually changes.
5. **GPU-accelerated properties only.** Animate `transform` and `opacity`. Never animate `width`, `height`, `top`, `left`, `margin`, or `padding` directly.

### 9.4 Framer Motion Best Practices

- Use `AnimatePresence` for mount/unmount transitions (e.g., NotesPanel).
- Use `motion.div` with `whileHover` for micro-interactions.
- Use `variants` to define reusable animation states for day cells.
- Use `key` prop on month container to trigger re-animation on month change:
  ```tsx
  <motion.div key={format(currentDate, 'yyyy-MM')}>
  ```

---

## 10. Responsiveness Strategy

### 10.1 Breakpoint System

| Token | Width | Layout |
|---|---|---|
| `mobile` | < 640px | Single column; stacked; fullscreen grid |
| `tablet` | 640px – 1023px | Single column; wider grid; side panel as overlay |
| `desktop` | ≥ 1024px | Multi-column; side-by-side calendar + notes |

### 10.2 Mobile-First Implementation

Write base styles for mobile, then layer on complexity with `sm:`, `md:`, `lg:` breakpoints. This ensures:

- The simplest layout is the default.
- Mobile is not an afterthought.
- CSS is additive, not override-heavy.

### 10.3 Layout Adaptations

| Element | Mobile | Desktop |
|---|---|---|
| Hero Image | Full width, 2:1 aspect ratio | Full width, 16:9 or side panel |
| Calendar Grid | Full width, compact padding | 60% width |
| Day Cell | Min 40×40px touch target | 48×48px or larger |
| Notes Panel | Full-width bottom sheet or overlay | Side panel (40% width) |
| Header Navigation | Centered, inline arrows | Left-aligned with more space |
| Font Sizes | Scale down 10–15% on mobile | Use base scale |

### 10.4 Touch Interaction Considerations

- Day cells must have a **minimum 44×44px touch target** (WCAG 2.5.5).
- Hover previews don't exist on touch devices — provide alternative feedback (e.g., press-and-hold preview, or skip preview entirely and show selection immediately).
- Swipe gestures for month navigation (optional but impressive): use Framer Motion's `drag` prop with `dragConstraints`.

### 10.5 Responsive Testing Checklist

- [ ] iPhone SE (375px) — no overflow, no clipped text
- [ ] iPhone 14 Pro (393px) — grid cells are comfortably tappable
- [ ] iPad (768px) — layout transitions cleanly
- [ ] MacBook Air (1280px) — full layout renders correctly
- [ ] Ultrawide (1920px) — content is max-width constrained, centered

---

## 11. Accessibility (a11y)

### 11.1 Keyboard Navigation

| Key | Action |
|---|---|
| `Tab` | Move focus between major sections (header → grid → notes) |
| `Arrow Keys` | Navigate between day cells within the grid |
| `Enter` / `Space` | Select the focused date |
| `Escape` | Clear current selection / close notes panel |

### 11.2 ARIA Requirements

- Calendar grid: `role="grid"` with `aria-label="Calendar"`.
- Each row: `role="row"`.
- Each day cell: `role="gridcell"` with `aria-label` (e.g., "April 8, 2026, selected, has 2 notes").
- Navigation buttons: `aria-label="Previous month"` / `"Next month"`.
- Selected dates: `aria-selected="true"`.
- Notes panel: `aria-live="polite"` for dynamic content updates.

### 11.3 Focus Management

- When the notes panel opens, move focus to the text input.
- When the notes panel closes, return focus to the last selected date.
- Focus ring must be visible and styled (not the browser default — use a custom Tailwind ring utility).

### 11.4 Color Contrast

- All text must meet **WCAG AA** contrast ratios (4.5:1 for normal text, 3:1 for large text).
- Selection states must be distinguishable without relying solely on color (use shape, weight, or icon differences).

---

## 12. Performance Engineering

### 12.1 Rendering Optimization

| Strategy | Where | How |
|---|---|---|
| `React.memo` | `DayCell.tsx` | 42 cells re-render on every state change. Memoize with shallow comparison of props. |
| `useMemo` | Grid generation | Recompute the 42-day grid only when `currentDate` changes. |
| `useMemo` | Day cell state | Compute `getDayCellState()` results only when relevant inputs change. |
| `useCallback` | Event handlers | `handleDateClick`, `handleDateHover` — stabilize references for memoized children. |
| Avoid inline objects/arrays | JSX props | Never pass `style={{...}}` or `onClick={() => fn(date)}` inline in memoized components. |

### 12.2 localStorage Performance

- **Debounce writes.** Do not write to localStorage on every keystroke. Debounce note saves by 300ms.
- **Read once.** Load notes from localStorage on mount, then keep in React state. Do not read localStorage on every render.
- **Stringify carefully.** `JSON.stringify` is synchronous and blocks the main thread. For very large notes objects, consider using `requestIdleCallback` for writes.

### 12.3 Image Optimization

- Use `next/image` with `priority` attribute for the hero image (it's the LCP element).
- Serve the image in modern formats (WebP/AVIF) via Next.js's built-in optimization.
- Set explicit `width` and `height` to prevent layout shift (CLS).

### 12.4 Bundle Size Awareness

- Import `date-fns` functions individually: `import { format } from 'date-fns'` — not `import * as dateFns`.
- Import only the shadcn/ui components you actually use.
- Framer Motion is ~30kb gzipped. This is acceptable but do not add additional animation libraries.

---

## 13. Code Quality Standards

### 13.1 Naming Conventions

| Entity | Convention | Example |
|---|---|---|
| Components | PascalCase | `CalendarHeader`, `DayCell` |
| Hooks | camelCase with `use` prefix | `useDateRange`, `useCalendar` |
| Utility functions | camelCase, verb-first | `generateCalendarDays`, `formatDateKey` |
| Types/Interfaces | PascalCase | `CalendarDay`, `Note`, `DayCellState` |
| Constants | UPPER_SNAKE_CASE | `DAYS_IN_WEEK`, `STORAGE_KEY` |
| Event handlers | `handle`-prefixed | `handleDateClick`, `handleNoteSubmit` |
| Boolean variables | `is`/`has`/`should` prefix | `isToday`, `hasNotes`, `isInRange` |
| CSS custom properties | `--kebab-case` | `--color-accent`, `--space-md` |

### 13.2 Comment Philosophy

- **Do not comment what the code does.** The code should be self-explanatory.
- **Do comment WHY** something is done a non-obvious way:
  ```typescript
  // We generate 42 days (6 rows) even for months that fit in 5 rows
  // to prevent layout shifts when navigating between months.
  ```
- **Do comment edge cases:**
  ```typescript
  // If the user selects a date before the start date, we treat it
  // as a new start date rather than creating a reversed range.
  ```

### 13.3 File Length Guidelines

- Components: < 150 lines ideally. If longer, extract sub-components.
- Hooks: < 100 lines. If longer, the hook may have too many responsibilities.
- Utility files: < 80 lines. Keep them focused.

### 13.4 Import Order

```typescript
// 1. React/Next.js
import { useState, useCallback, useMemo } from 'react';
import Image from 'next/image';

// 2. Third-party libraries
import { format, isSameDay } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

// 3. Internal modules (absolute paths)
import { useDateRange } from '@/hooks/useDateRange';
import { CalendarDay } from '@/types';

// 4. Relative imports (components, styles)
import { DayCell } from './DayCell';
```

---

## 14. Evaluation Alignment & Differentiation

### 14.1 What Separates Top 1% From Top 10%

| Area | Top 10% Does | Top 1% Also Does |
|---|---|---|
| **Architecture** | Clean components | State machine for selection; deterministic state; hook contracts |
| **Interactions** | Click to select works | Hover preview, range visualization, micro-animations, deselect behavior |
| **Visual** | Looks decent | Cohesive design system; consistent spacing; premium typography; elevation logic |
| **Responsive** | Doesn't break on mobile | Touch-optimized; deliberate layout adaptation; preserved UX across breakpoints |
| **Code** | Runs without errors | Memoized renders; debounced I/O; self-documenting naming; pure utilities |
| **Edge Cases** | Happy path works | Handles corrupted localStorage, empty states, leap years, range wrapping across months |
| **a11y** | Some alt text | Full keyboard navigation, ARIA grid roles, focus management, `prefers-reduced-motion` |

### 14.2 Signals That Impress Reviewers

1. **State machine diagram** in comments or documentation — shows you think in systems, not patches.
2. **Custom hook contracts** that read like an API spec — shows interface-first thinking.
3. **Consistent design tokens** across every component — shows design discipline.
4. **Meaningful empty states** — "Select a date to see notes" instead of a blank panel.
5. **Graceful degradation** — works without JavaScript for basic display (SSR/SSG initial render).
6. **Reduced motion support** — shows empathy and WCAG awareness.
7. **Strategic memoization** with comments explaining why — shows performance awareness, not premature optimization.

### 14.3 Common Mistakes to Avoid

| Mistake | Why It Hurts |
|---|---|
| Inline styles everywhere | Shows lack of design system thinking |
| `any` types scattered in code | Shows TypeScript immaturity |
| Giant monolithic component files | Shows inability to decompose |
| Animations on every element | Shows lack of restraint and purpose |
| No empty states or loading states | Shows incomplete thinking |
| Notes stored as a flat string | Shows weak data modeling |
| No keyboard support | Shows accessibility blindness |
| Console warnings or errors left in | Shows carelessness |
| Hardcoded colors not using tokens | Shows inconsistency |
| No `key` prop on month navigation causing animation flicker | Shows lack of Framer Motion understanding |

---

## 15. Engineering Quality Checklist

Before submitting, verify every item:

### Architecture
- [ ] Every component has a single, clear responsibility
- [ ] All business logic lives in hooks, not in components
- [ ] Utility functions are pure (no side effects, no React imports)
- [ ] No prop-drilling beyond 2 levels
- [ ] Component dependency flows one direction (top-down)

### TypeScript
- [ ] `strict: true` in tsconfig with no suppressions
- [ ] All props have explicit interfaces (no inline types)
- [ ] No `any` types anywhere
- [ ] Union types used for state machines (not booleans)
- [ ] `date-fns` functions used for all date logic (no manual math)

### UI/UX
- [ ] Visual hierarchy is clear (hero → calendar → notes)
- [ ] One accent color used consistently
- [ ] Spacing follows 4px grid with no exceptions
- [ ] Typography uses defined scale (no arbitrary sizes)
- [ ] Empty states are designed, not blank
- [ ] Current day is distinguishable from selection

### Interactions
- [ ] Date range selection follows the state machine exactly
- [ ] Hover preview works and is visually distinct from selection
- [ ] Third click resets selection cleanly
- [ ] Notes indicator dots visible on dates with notes
- [ ] Notes persist across page reloads (localStorage)

### Animations
- [ ] Month navigation has slide/crossfade transition
- [ ] Day cells have subtle hover feedback
- [ ] Range selection animates smoothly
- [ ] Notes panel has enter/exit animation
- [ ] `prefers-reduced-motion` is respected
- [ ] No animation blocks user interaction

### Responsiveness
- [ ] Mobile layout is single-column and usable
- [ ] Touch targets are ≥ 44px
- [ ] No horizontal overflow at 375px width
- [ ] Desktop layout is multi-column and proportional
- [ ] Font sizes adapt appropriately

### Accessibility
- [ ] Full keyboard navigation within the grid
- [ ] All interactive elements have visible focus indicators
- [ ] ARIA roles and labels on grid, cells, and navigation
- [ ] Color contrast meets WCAG AA
- [ ] `aria-live` on dynamic content regions

### Performance
- [ ] `DayCell` is wrapped in `React.memo`
- [ ] Calendar grid is memoized (`useMemo`)
- [ ] Event handlers are stabilized (`useCallback`)
- [ ] localStorage writes are debounced
- [ ] Hero image uses `next/image` with `priority`
- [ ] No unnecessary re-renders on hover (verify with React DevTools)

### Code Quality
- [ ] Consistent naming conventions throughout
- [ ] Import order is standardized
- [ ] Comments explain "why", not "what"
- [ ] No dead code, no commented-out blocks
- [ ] No console.log statements in final code
- [ ] Files are under length guidelines

---

## Bonus: Differentiation Features (Time Permitting)

These are NOT required, but implementing even one will set the submission apart:

| Feature | Difficulty | Impact |
|---|---|---|
| **Page-flip animation** — calendar pages "turn" like a real wall calendar on month navigation | Medium | Very High — memorable and thematic |
| **Dynamic theme colors** — extract dominant color from the hero image and apply as accent | Medium | High — shows creativity and technical range |
| **Keyboard shortcuts** — `T` for today, `←`/`→` for months, `Esc` to clear | Low | Medium — shows power-user awareness |
| **Swipe navigation** — swipe left/right on mobile to change months | Low | Medium — shows mobile-native thinking |
| **Multi-month view** — show 3 months side-by-side on ultrawide screens | Medium | Medium — shows responsive thinking beyond breakpoints |
| **Note categories/colors** — assign colors to notes for visual categorization | Medium | Medium — shows extensible data modeling |

---

> **Final Reminder:** This specification is your contract with the reviewer. Every section represents a dimension on which your submission will be evaluated. Completeness, polish, and intentionality will separate the exceptional from the adequate. Build something you'd be proud to ship.
