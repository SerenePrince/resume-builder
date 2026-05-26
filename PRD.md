# Resume Builder — Product Requirements Document

**Version:** 1.2  
**Date:** May 2026  
**Author:** Noah Park-Nguyen  
**Status:** Active

---

## Revision History

| Version | Date     | Summary                                                                                                                                                                                                                            |
| ------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.0     | May 2026 | Initial draft — MVP scope                                                                                                                                                                                                          |
| 1.1     | May 2026 | Projects bullet bank; resolved open questions                                                                                                                                                                                      |
| 1.2     | May 2026 | Updated to reflect shipped features: role filter, skill presets, in-app skill editor, customizable header, page boundary indicator; corrected typography spec (Georgia); updated data schema, non-goals, user stories, and roadmap |

---

## 1. Overview

Resume Builder is a personal, single-user web application for composing and exporting tailored resumes. The app eliminates the friction of manually editing Word documents for each job application by providing a structured composition interface backed by a static content bank.

The core insight is simple: resume content is reusable, but the selection and emphasis changes per application. This app separates those two concerns — the content bank lives in a JSON file, and the composition happens in the UI each session.

---

## 2. Problem Statement

Tailoring a resume for each job application requires opening Word, hunting for the right bullet points, making micro-edits, and then fighting formatting inconsistencies that compound over time. The result is a process that is slow, error-prone, and produces output that drifts further from the intended format with every edit.

---

## 3. Goals

- Always produce a perfectly consistent, deterministic `.docx` resume regardless of what content is selected.
- Reduce the time to produce a tailored resume to under 5 minutes.
- Make bullet point selection and light editing the primary interaction — not document editing.
- Keep the tool dead simple: no accounts, no server, no state to manage between sessions.

---

## 4. Non-Goals

The following are out of scope and will not influence the architecture:

- No backend or server
- No user authentication or accounts
- No persistence of session state between reloads (page reload resets all selections)
- No bulk bullet/experience CRUD — content management for experiences and projects is done by editing `resumeData.json` directly
- No dynamic section reordering

> **Note:** In-app skill management (adding and removing categories and individual skills within a session) was originally a non-goal but has since been shipped. It remains session-only — changes are not persisted and do not modify the source JSON.

---

## 5. User Stories

| #   | As Noah, I want to...                                                      | So that...                                                                                    |
| --- | -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| 1   | Open the app and immediately see all my experiences and their bullet banks | I can start composing without any setup                                                       |
| 2   | Select the bullet points most relevant to the job I'm applying for         | My resume is targeted without rewriting from scratch                                          |
| 3   | Make minor wording edits to selected bullets                               | I can match keywords in a job posting without changing my source bank                         |
| 4   | Select skills from categorized banks                                       | My skills section reflects the role I'm applying for                                          |
| 5   | Apply a role-aligned skill preset with one click                           | I can load a full skill set for a given role without selecting chips manually                 |
| 6   | Add or remove skill categories and individual skills within a session      | I can fine-tune a preset or build a custom skill set on the fly                               |
| 7   | Filter bullet points by role tag                                           | I can focus on the most relevant bullets for a specific job type without deselecting anything |
| 8   | Set a professional title and location for the header                       | The resume targets the specific role and city I'm applying in                                 |
| 9   | See a live preview of my resume as I compose                               | I know what the final output looks like before exporting                                      |
| 10  | See a clear indicator when my content will overflow a single page          | I know to trim before exporting instead of discovering it in the document                     |
| 11  | Export a perfectly formatted `.docx` with one click                        | I get a consistent, professional resume every time                                            |

---

## 6. Functional Requirements

### 6.1 Data Layer

- All resume content is stored in a single `resumeData.json` file in the project.
- The JSON file is the source of truth for experiences, projects, education, and the default skill categories. Edits to the content bank are made by editing this file directly.
- The app reads from JSON on load. It never writes back to it.

### 6.2 Content Bank

- **Experiences:** Each entry has a company name, job title, date range, location, an optional type (e.g. "Co-op"), and an array of bullet points.
- **Bullet points:** Each has a unique ID, a content string, and an array of role tags that control role-filter visibility.
- **Projects:** Each entry has a name, tech stack, optional GitHub/live URLs, and an array of bullet points. Projects follow the same bullet bank mechanic as experiences.
- **Skills:** Organized into named categories. Each category has a label and an array of skill strings. The categories defined in JSON are the defaults loaded on startup and after Reset; they can be modified within a session via the skill editor.
- **Static content:** Header name, contact info, and Education are fixed — they always appear in full.

### 6.3 Composition Session

- The user selects bullet points per experience and per project. There is no enforced minimum or maximum.
- Selected bullets can be edited inline. Edits are session-only and do not modify the source bank.
- The user selects individual skills per category. Categories with zero selections are omitted from the output. If no skills are selected across all categories, the skills section shows an empty state to signal a likely missing selection.
- The user can apply a role-aligned skill preset, which replaces all current skill categories and pre-selects every skill in the loaded set.
- The user can enter skill edit mode to add or remove skill categories and individual skills within a session. These changes are session-only.
- The user can set a professional title and location via preset pickers. The selected values appear on the header line in both the preview and the exported document.
- A **Reset** button clears all bullet selections, skill selections, inline edits, and returns the title and location to their defaults. Session state is not persisted — a page reload also resets everything.

### 6.4 Role Filter

- Each bullet in the JSON can be tagged with one or more role tags (e.g. `backend`, `frontend`, `fullstack`, `testing`, `power-platform`, `enterprise`, `general`).
- A role filter bar in the composition pane lets the user activate a single tag.
- When a tag is active, bullets that do not carry that tag are dimmed (not hidden), so the user can still see and select them but is visually guided toward the most relevant ones.
- The filter affects only experience and project bullet display — it does not affect skills.

### 6.5 Live Preview

- The resume renders as styled HTML inside the browser as the user makes selections.
- The preview mirrors the `.docx` output as closely as possible — same layout, font, spacing, and structure.
- The preview updates in real time as selections and edits change.
- A page boundary indicator marks the 11-inch mark. The indicator turns amber and shows a warning when content overflows past that line.

### 6.6 Export

- A single "Export" button generates and downloads a `.docx` file.
- The output is deterministic: the same selections always produce identical formatting.
- The file is named `Resume_YYYY-MM-DD.docx`.

---

## 7. Resume Format Specification

This spec is the single source of truth for both the live preview renderer and the `.docx` export. Both outputs must conform to it exactly.

### 7.1 Typography

| Element         | Font    | Size | Weight                     |
| --------------- | ------- | ---- | -------------------------- |
| Name            | Georgia | 18pt | Bold                       |
| Section heading | Georgia | 12pt | Bold, all caps             |
| All other text  | Arial   | 10pt | Regular (bold where noted) |

"All other text" covers the header contact line, entry headers, dates, project names, tech stacks, bullet text, and skill lines — all Arial 10pt. Bold is applied within body text for entry header left sides (experience title–company line, project name, education institution).

### 7.2 Layout

- **Orientation:** Single column, portrait
- **Page margins:** 0.5in all around (720 twips)
- **Section headings:** Followed by a full-width horizontal rule
- **Bullet indent:** Standard hanging indent, no sub-bullets

### 7.3 Section Order

1. Header
2. Skills
3. Experience
4. Projects
5. Education

### 7.4 Header

```
Noah Park-Nguyen
Full Stack Developer · Ottawa, ON
noahparknguyen@gmail.com · (778) 388-8144
linkedin.com/in/noahpark-nguyen · github.com/SerenePrince · sereneprince.github.io/noahpn
```

- Name on its own line, bold
- Professional title and location on the second line, separated by ·
- Email and phone on the third line, separated by ·
- Social/portfolio links on the fourth line, separated by ·
- Title and location are set by the header preset pickers in the composition pane; they are not hardcoded

### 7.5 Skills Section

- Each selected category renders as a bullet: `• **Label** — Skill 1, Skill 2, Skill 3`
- Category label is bold; skills follow an em dash, comma-separated
- Categories with no selected skills are completely hidden
- Each category on its own line

### 7.6 Experience Section

- Single line: `title (type) — company · location` left-aligned (bold), date range right-aligned (italic)
- `type` is optional — omitted from the line when not present in the JSON
- Bullet points follow immediately with standard indent
- Experiences are rendered in the order defined in the JSON

### 7.7 Projects Section

- Project name (bold, hyperlinked to GitHub if available) left-aligned, tech stack right-aligned on the first line
- GitHub and live URLs on the second line if present — dark color, underlined
- Bullet points follow with standard indent

### 7.8 Education Section

- Institution name and location (bold) left-aligned, date range right-aligned on the same line
- Degree on the line below
- GPA and honors as a bullet point

---

## 8. Data Schema

```jsonc
{
  "meta": {
    "name": "string",
    "location": "string", // default location (overridable in the UI)
    "email": "string",
    "phone": "string",
    "linkedin": "string",
    "github": "string",
    "portfolio": "string", // optional
  },
  "education": {
    "institution": "string",
    "location": "string",
    "degree": "string",
    "startDate": "string",
    "endDate": "string",
    "gpa": "string",
    "honors": "string",
  },
  "skillCategories": [
    // default categories; loaded on startup and after Reset
    {
      "id": "string",
      "label": "string",
      "skills": ["string"],
    },
  ],
  "experiences": [
    {
      "id": "string",
      "company": "string",
      "title": "string",
      "type": "string", // optional — e.g. "Co-op"
      "startDate": "string",
      "endDate": "string",
      "location": "string",
      "bullets": [
        {
          "id": "string",
          "content": "string",
          "tags": ["string"], // role tags — see §6.4 for valid values
        },
      ],
    },
  ],
  "projects": [
    {
      "id": "string",
      "name": "string",
      "tech": "string",
      "github": "string", // optional
      "live": "string", // optional
      "bullets": [
        {
          "id": "string",
          "content": "string",
          "tags": ["string"], // role tags — see §6.4 for valid values
        },
      ],
    },
  ],
}
```

Valid role tag values: `backend`, `frontend`, `fullstack`, `testing`, `power-platform`, `enterprise`, `general`.

---

## 9. Technical Stack

| Concern             | Choice             | Notes                                        |
| ------------------- | ------------------ | -------------------------------------------- |
| Framework           | React 19 + Vite 8  |                                              |
| Styling             | Tailwind CSS v4    | Custom dark theme via `@theme` CSS variables |
| Document generation | docx (npm)         |                                              |
| Data                | Static JSON        | Single file, manually edited                 |
| State management    | React `useReducer` | Session-only; no external library            |
| Language            | JavaScript         | No TypeScript                                |

---

## 10. Feature Roadmap

### Shipped

- Static JSON as data source
- Bullet point selection per experience and per project
- Inline bullet editing (session-only, non-destructive)
- Skills selection from categorized bank
- Empty state for skills section when nothing is selected
- Reset button to clear all selections and return to initial state
- Live browser preview (HTML) with real-time updates
- Deterministic `.docx` export
- Static header (name, contact info, education) always rendered in full
- Role tags on bullets with a role filter bar (dims non-matching bullets)
- Five role-aligned skill presets (Full Stack, Frontend, Backend, Power Platform, Testing)
- In-app skill editor — add/remove categories and individual skills within a session
- Customizable header title and location via preset pickers
- Page boundary indicator at the 11-inch mark in the preview

### Future

- Dynamic section ordering per session (drag-and-drop or up/down controls)
- Page constraint controls — line spacing, font size, or margin adjustments to help content fit
- Multiple named resume templates or themes

---

## 11. Open Questions

| #   | Question                                                                                                                    | Status      | Decision                                                                                                                                                         |
| --- | --------------------------------------------------------------------------------------------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Should projects also have a selectable bullet bank, or are they always rendered in full?                                    | ✅ Resolved | Projects follow the same bullet bank mechanic as experiences.                                                                                                    |
| 2   | What is the desired behavior when no skills are selected in any category — hide the section entirely or show a placeholder? | ✅ Resolved | Show an empty state — zero selections is likely a mistake, not intent.                                                                                           |
| 3   | Should the app support a "reset to defaults" action within a session?                                                       | ✅ Resolved | Yes — a Reset button clears all selections and returns to initial state.                                                                                         |
| 4   | Should bullets support role-based filtering?                                                                                | ✅ Resolved | Yes — bullets carry one or more role tags; a filter bar dims non-matching bullets without hiding them.                                                           |
| 5   | Should the header title and location be hardcoded or configurable per session?                                              | ✅ Resolved | Configurable via preset pickers; title has 3 options, location has 2. Changes are session-only.                                                                  |
| 6   | Should skill categories be editable in-app, or JSON-only?                                                                   | ✅ Resolved | Both — JSON defines the defaults; an in-app edit mode allows session-only add/remove of categories and skills. Presets provide a fast full-replacement shortcut. |
