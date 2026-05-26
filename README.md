# Resume Builder

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)](https://vite.dev)
[![CI](https://github.com/SerenePrince/resume-builder/actions/workflows/ci.yml/badge.svg)](https://github.com/SerenePrince/resume-builder/actions/workflows/ci.yml)

A personal resume composition tool built with React and Vite. Select the bullets and skills you want to include, tweak any wording inline, and export a clean, consistently formatted `.docx` file — no fussing with Word templates.

---

## How it works

The app is split into two panes:

**Left — Composition:** Browse your full set of experience entries, projects, and skill tags. Click a bullet to select it (it appears in the preview); click it again to edit the text inline. Escape or click away to exit editing. Skill chips work as toggles — pick the ones relevant to the role you're applying for.

**Right — Preview:** A live HTML rendering of exactly what the exported document will look like. Same fonts (Georgia headings, Arial body), same layout, same sections — so what you see is what you get. A page boundary indicator marks the 11-inch mark so you can tell at a glance whether your content will fit on a single page.

When you're happy, hit **Export .docx** in the toolbar. The file downloads immediately.

---

## Features

### Customizable header

Two preset pickers at the top of the composition pane let you tailor the header line that appears directly below your name:

- **Title** — Full Stack Developer, Application Developer, or Software Developer
- **Location** — Ottawa, ON or Coquitlam, BC

The selected title and location are rendered in both the preview and the exported `.docx`.

### Format controls

Three rows of preset chips let you tune the document typography without touching any files:

| Control      | Options                             |
| ------------ | ----------------------------------- |
| Name size    | 16 pt, 18 pt, 20 pt                 |
| Body size    | 9 pt, 9.5 pt, 10 pt, 10.5 pt, 11 pt |
| Line spacing | 1.0, 1.1, 1.2, 1.3                  |

Section headings are fixed at 12 pt. The preview updates live so you can see exactly how the spacing affects page fit before exporting.

### Skill presets

Five role-aligned presets instantly replace all skill categories and pre-select every skill in the set, ready to export with no further clicks:

| Preset         | Categories                                                |
| -------------- | --------------------------------------------------------- |
| Full Stack     | Frontend, Backend, Databases, Developer Tools             |
| Frontend       | Frontend, Databases, Developer Tools                      |
| Backend        | Backend, Testing, Databases, Developer Tools              |
| Power Platform | Power Platform, Microsoft 365, Databases, Developer Tools |
| Testing        | Testing, Languages, Developer Tools                       |

### Custom skill categories

The **Edit** button on the Skills section unlocks edit mode:

- Add a new category by typing a name and pressing Enter or clicking **Add**
- Remove any category with the × button next to its label
- Add individual skills to any category via the inline "Add skill…" input (commits on Enter or blur)
- Remove individual skills with the × button attached to each chip

### Role filter

The role filter bar (below the Skills section) dims bullets that don't match the selected tag, so you can quickly see which bullets are most relevant for a given role without deselecting anything. Bullets can carry multiple tags and will only be dimmed when none of their tags match.

### Page boundary indicator

A dashed line at the 11-inch mark in the preview shows exactly where a printed page ends. The indicator turns amber and shows a ⚠ overflow warning when content extends past that line.

---

## Tech stack

| Layer        | Choice                              |
| ------------ | ----------------------------------- |
| UI framework | React 19                            |
| Build tool   | Vite 8                              |
| Styling      | Tailwind CSS v4 (custom dark theme) |
| Word export  | [docx](https://docxjs.vercel.app/)  |

No backend. No accounts. Runs entirely in the browser.

---

## Local setup

```bash
# 1. Clone the repo
git clone https://github.com/SerenePrince/resume-builder.git
cd resume-builder

# 2. Install dependencies
npm install

# 3. Set up your resume data
cp src/data/resumeData.example.json src/data/resumeData.json
# Edit resumeData.json with your own content (the file is gitignored)

# 4. Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

```bash
# Build for production
npm run build

# Preview the production build
npm run preview
```

---

## Customising the content

All resume content lives in one file:

```
src/data/resumeData.json
```

This file is gitignored to protect personal information. Copy the example file to get started:

```bash
cp src/data/resumeData.example.json src/data/resumeData.json
```

The structure is:

```jsonc
{
  "meta": {
    "name": "...",
    "location": "...",      // default location (overridable in the UI)
    "email": "...",
    "phone": "...",
    "linkedin": "...",      // displayed as-is; https:// prepended if missing
    "github": "...",
    "portfolio": "..."
  },
  "education": { ... },
  "skillCategories": [      // default categories loaded on first run / after Reset
    {
      "id": "unique-id",
      "label": "Category Name",
      "skills": ["Skill A", "Skill B"]
    }
  ],
  "experiences": [
    {
      "id": "unique-id",
      "company": "...",
      "title": "...",
      "type": "Co-op",      // optional — shown in parentheses after the title
      "startDate": "Jan 2024",
      "endDate": "Apr 2024",
      "location": "...",
      "bullets": [
        {
          "id": "unique-bullet-id",
          "content": "Bullet text.",
          "tags": ["backend", "fullstack"]  // controls role-filter visibility
        }
      ]
    }
  ],
  "projects": [
    {
      "id": "unique-id",
      "name": "...",
      "tech": "React, Node.js, ...",
      "github": "github.com/...",    // optional
      "live": "yoursite.com",        // optional
      "bullets": [
        {
          "id": "unique-bullet-id",
          "content": "Bullet text.",
          "tags": ["frontend"]       // valid tags listed below
        }
      ]
    }
  ]
}
```

Bullet IDs just need to be unique strings — `"exp-1"`, `"proj-hub-3"`, whatever works for you. Education is always shown in full and is not selectable.

The `skillCategories` array defines the default skill layout loaded on startup and after a Reset. Categories and skills can also be added, removed, or replaced via skill presets entirely within the UI — changes are session-only and reset when you hit **↺ Reset**.

Valid tag values for the role filter:

| Tag              | Meaning                                            |
| ---------------- | -------------------------------------------------- |
| `backend`        | Java / API / server-side roles                     |
| `frontend`       | React / UI / web roles                             |
| `fullstack`      | General developer roles                            |
| `testing`        | QA / SDET / testing roles                          |
| `power-platform` | Power Apps / Automate / BI / MS ecosystem roles    |
| `enterprise`     | Large org, government, or process-automation roles |
| `general`        | Works in almost any developer role                 |

A bullet with no matching tags will be dimmed (not hidden) when a role filter is active. Bullets can have multiple tags.

> **Note on overlapping skill categories:** Some skills intentionally appear in more than one category (e.g. Java in both `languages` and `backend`; Azure DevOps in both `microsoft` and `testing`). If you select skills from two categories that share a skill, that skill will appear in two separate bullet lines in the output. To avoid this, treat the skill categories as alternative orderings — pick one set that fits the role rather than selecting from all of them. The built-in skill presets are already designed to avoid this overlap.

---

## Document format

The exported `.docx` mirrors the preview exactly:

- **Fonts:** Georgia for the name and section headings, Arial for everything else
- **Sizes:** Configurable via the Format controls (defaults: 18 pt name, 12 pt headings fixed, 10 pt body)
- **Margins:** 0.5 in all around
- **Bullets:** Hanging indent so wrapped lines align with text, not the dot
- **Links:** Email is a `mailto:` link; social URLs and project links are clickable hyperlinks
- **Header line:** The selected title and location appear on the contact line directly below your name
- **Line spacing:** Exported using proportional mode so values like 1.1 or 1.2 render correctly in LibreOffice as well as Microsoft Word

---

## Project structure

```
src/
├── data/
│   ├── resumeData.example.json  # Fictional placeholder — copy to resumeData.json
│   └── resumeData.json          # Your content (gitignored)
├── hooks/
│   └── useResumeSession.js      # Central state (bullets, skills, title, location, format, edits)
├── utils/
│   ├── exportDocx.js            # Builds and downloads the .docx file
│   ├── skillPresets.js          # Five role-aligned skill category presets
│   └── tags.js                  # Role filter tag definitions and display labels
├── components/
│   ├── layout/
│   │   ├── Toolbar.jsx          # Top bar with Reset and Export buttons
│   │   ├── CompositionPane.jsx  # Left pane (header editor, format controls, skills, filter, bullets)
│   │   └── PreviewPane.jsx      # Right pane
│   ├── composition/
│   │   ├── SectionCard.jsx      # Shared card shell for experience and project entries
│   │   ├── ExperienceSection.jsx
│   │   ├── ProjectSection.jsx
│   │   ├── SkillsSection.jsx    # Skill toggles, presets, and edit mode
│   │   └── BulletItem.jsx       # Selectable / editable bullet row
│   └── preview/
│       └── ResumePreview.jsx    # Live HTML preview with page boundary indicator
├── App.jsx
├── main.jsx
└── index.css                    # Tailwind v4 theme tokens + global styles
```

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE) © Noah Park-Nguyen
