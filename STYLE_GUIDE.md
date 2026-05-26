# Resume Builder — Style Guide

**Version:** 1.0  
**Date:** May 2026  
**Status:** Active

This document is the single source of truth for all visual decisions in the app UI. Every component, color, and spacing choice should trace back to this guide. The resume format spec (typography, layout, spacing for the `.docx` output) lives separately in the PRD.

---

## 1. Design Philosophy

This is a **power-user workbench**, not a marketing page. The design prioritizes density, clarity, and speed — everything the user needs should be visible and accessible without navigation. Visual decoration is kept to a minimum. Every pixel earns its place.

Three principles guide every decision:

**Clarity over decoration.** No gradients, no shadows, no ornamental flourishes. Flat surfaces and clean borders.

**Dark and focused.** The dark shell keeps the user's attention on the content. The white preview panel pops as a natural focal point — it looks like paper on a desk.

**Indigo as the single accent.** One accent color, used consistently for all interactive and selected states. Nothing competes with it.

---

## 2. Color Tokens

All tokens are registered in `src/index.css` using Tailwind v4's `@theme` directive. Use the token names directly as Tailwind utility classes (e.g. `bg-base`, `text-primary`, `border-default`).

### Background

| Token              | Hex       | Tailwind base | Usage                            |
| ------------------ | --------- | ------------- | -------------------------------- |
| `--color-base`     | `#09090b` | zinc-950      | Toolbar, outermost chrome        |
| `--color-surface`  | `#18181b` | zinc-900      | Main workspace background        |
| `--color-elevated` | `#27272a` | zinc-800      | Cards, panels, section blocks    |
| `--color-overlay`  | `#3f3f46` | zinc-700      | Hover states on interactive rows |

### Accent (Indigo)

| Token                   | Hex       | Tailwind base | Usage                              |
| ----------------------- | --------- | ------------- | ---------------------------------- |
| `--color-accent`        | `#6366f1` | indigo-500    | Primary buttons, active indicators |
| `--color-accent-hover`  | `#4f46e5` | indigo-600    | Button hover state                 |
| `--color-accent-subtle` | `#1e1b4b` | indigo-950    | Selected item background           |
| `--color-accent-border` | `#4338ca` | indigo-700    | Selected item border               |
| `--color-accent-text`   | `#a5b4fc` | indigo-300    | Text on selected item background   |

### Text

| Token                    | Hex       | Tailwind base | Usage                               |
| ------------------------ | --------- | ------------- | ----------------------------------- |
| `--color-text-primary`   | `#e4e4e7` | zinc-200      | Primary text, headings              |
| `--color-text-secondary` | `#a1a1aa` | zinc-400      | Supporting labels, section headers  |
| `--color-text-tertiary`  | `#71717a` | zinc-500      | Unselected bullet text, placeholder |
| `--color-text-ghost`     | `#52525b` | zinc-600      | Metadata, counts, very subtle hints |

### Borders

| Token                    | Hex       | Tailwind base | Usage                              |
| ------------------------ | --------- | ------------- | ---------------------------------- |
| `--color-border-subtle`  | `#27272a` | zinc-800      | Internal dividers within panels    |
| `--color-border-default` | `#3f3f46` | zinc-700      | Card borders, section borders      |
| `--color-border-strong`  | `#52525b` | zinc-600      | Checkbox borders, emphasis borders |

### Semantic

| Token             | Hex       | Usage                        |
| ----------------- | --------- | ---------------------------- |
| `--color-success` | `#22c55e` | Positive confirmation states |
| `--color-danger`  | `#ef4444` | Destructive actions, errors  |

---

## 3. Typography

The app UI uses the system sans-serif stack (Inter → system-ui → sans-serif). This is Tailwind's default `font-sans` — no custom font import needed. The resume output uses **Garamond** (bold) for the name and section headings, and **Arial** for all other text — both handled separately by the docx renderer and the preview component.

### Scale

| Name        | Size | rem       | Usage                                    |
| ----------- | ---- | --------- | ---------------------------------------- |
| `text-xs`   | 10px | 0.625rem  | Metadata, counts, badges, skill chips    |
| `text-sm`   | 11px | 0.6875rem | Bullet text, secondary info, chip labels |
| `text-base` | 12px | 0.75rem   | General UI text                          |
| `text-md`   | 13px | 0.8125rem | Toolbar label, section pane headers      |
| `text-lg`   | 15px | 0.9375rem | Card titles, company names               |

### Weights

Two weights only — `font-normal` (400) and `font-medium` (500). Never `font-semibold` or `font-bold`; they read too heavy against the dark background.

### Letter spacing

Section headers in the composition pane use `tracking-widest` and `uppercase` to distinguish them from content text. Nowhere else.

---

## 4. Spacing

Tailwind's default 4px base scale is used throughout. The most common values:

| Tailwind class | Size | Usage                                 |
| -------------- | ---- | ------------------------------------- |
| `p-1`          | 4px  | Chip padding (vertical)               |
| `p-2`          | 8px  | Chip padding (horizontal), small gaps |
| `p-3`          | 12px | Bullet item padding                   |
| `p-4`          | 16px | Pane padding, card padding            |
| `gap-1`        | 4px  | Chip gap within a row                 |
| `gap-2`        | 8px  | Skill row gaps, bullet gaps           |
| `gap-4`        | 16px | Section gaps in composition pane      |

---

## 5. Border Radius

| Token         | Value               | Usage                          |
| ------------- | ------------------- | ------------------------------ |
| `--radius-sm` | 4px (`rounded`)     | Checkboxes, chips, badges      |
| `--radius-md` | 6px (`rounded-md`)  | Bullet items, interactive rows |
| `--radius-lg` | 8px (`rounded-lg`)  | Cards, section panels          |
| `--radius-xl` | 12px (`rounded-xl`) | Outer containers (if any)      |

---

## 6. Component Patterns

### 6.1 Toolbar

The topmost bar. Always `bg-base`. Contains the app name on the left and action buttons on the right. Height is fixed at `h-11` (44px).

```
bg-base | border-b border-default | px-4 | flex items-center justify-between
```

### 6.2 Card / Section Panel

The main container unit in the composition pane. Each experience, project, and the skills section lives in a card.

```
bg-elevated | border border-default | rounded-lg | overflow-hidden
```

Card header (label row):

```
px-4 py-2.5 | border-b border-default | flex items-center justify-between
```

Section label text:

```
text-xs font-medium uppercase tracking-widest text-secondary
```

Meta text (e.g. "2 of 5 selected"):

```
text-xs text-ghost
```

### 6.3 Experience / Project Header

Inside a card, above the bullet list. Shows the company/project name, title, and dates.

```
px-4 py-2.5 | border-b border-default
```

Company or project name:

```
text-lg font-medium text-primary
```

Job title / tech stack:

```
text-sm text-tertiary | italic (for job title only)
```

Date / location:

```
text-xs text-ghost
```

### 6.4 Bullet Item

The core interactive element. Click anywhere on the row to toggle selection.

**Default (unselected):**

```
flex items-start gap-2 | p-3 rounded-md | cursor-pointer
hover: bg-overlay
```

**Selected:**

```
bg-accent-subtle | border border-accent-border
```

Bullet text — unselected:

```
text-sm text-tertiary leading-relaxed
```

Bullet text — selected:

```
text-sm text-accent-text leading-relaxed
```

**Checkbox** (custom, 14×14px):

```
w-3.5 h-3.5 rounded flex-shrink-0 mt-0.5
unselected: border border-strong bg-transparent
selected:   bg-accent border-accent (no separate border needed)
```

**Inline edit mode** (appears when a selected bullet is clicked a second time, or on a dedicated edit icon):
The bullet text becomes a `<textarea>` that auto-resizes. Same padding and text style as the read state. A faint `border-b border-accent-border` underline indicates edit mode.

### 6.5 Skill Chip

Small toggleable pill for individual skills within a category row.

**Default:**

```
px-2 py-0.5 rounded text-xs | border border-default | text-tertiary | cursor-pointer
hover: border-strong text-secondary
```

**Selected:**

```
bg-accent-subtle border border-accent-border text-accent-text
```

### 6.6 Skill Category Row

A row within the skills panel. Label on the left, chips on the right.

```
flex items-start gap-3 | py-1
```

Category label:

```
w-24 flex-shrink-0 text-xs text-tertiary pt-0.5
```

Chips container:

```
flex flex-wrap gap-1
```

### 6.7 Buttons

**Primary — Export:**

```
bg-accent hover:bg-accent-hover | text-white text-xs font-medium
px-3 py-1.5 rounded-md | transition-colors
```

**Ghost — Reset:**

```
border border-default hover:bg-elevated | text-secondary text-xs
px-3 py-1.5 rounded-md | transition-colors
```

**Danger (future use):**

```
border border-danger/40 hover:bg-danger/10 | text-danger text-xs
px-3 py-1.5 rounded-md | transition-colors
```

### 6.8 Skills Empty State

Shown inside the skills panel when zero skills are selected across all categories. Replaces the normal skills output in the preview.

```
px-4 py-6 | text-center
```

Icon: a muted warning icon at 20px, `text-ghost`  
Message: `text-sm text-tertiary` — "No skills selected. Choose at least one category to continue."

---

## 7. Layout

### Split Pane

The workspace is divided into two fixed columns:

| Pane               | Width | Behavior                                |
| ------------------ | ----- | --------------------------------------- |
| Composition (left) | 55%   | Scrollable vertically                   |
| Preview (right)    | 45%   | Scrollable vertically, white background |

The split is divided by `border-r border-default`.

### Preview Panel

Always `bg-gray-100` as the panel background. The resume itself renders as a white card inside it with a subtle box shadow and padding that matches the docx margins.

### Toolbar

Always `sticky top-0 z-10`. Never scrolls away.

---

## 8. Interaction States

| State            | Visual treatment                                      |
| ---------------- | ----------------------------------------------------- |
| Default          | Base styles as described above                        |
| Hover            | Background lightens one step (`bg-overlay`)           |
| Selected         | Indigo subtle bg + indigo border + indigo text        |
| Edit mode        | Selected styles + bottom border underline on textarea |
| Disabled         | 40% opacity, `cursor-not-allowed`                     |
| Focus (keyboard) | `outline-2 outline-accent outline-offset-2`           |

---

## 9. Tailwind v4 Note

This project uses **Tailwind CSS v4** with `@tailwindcss/vite`. There is no `tailwind.config.js`. All custom tokens are declared in `src/index.css` using the `@theme` directive and are automatically available as utility classes throughout the app.

See `src/index.css` for the full token declarations.
