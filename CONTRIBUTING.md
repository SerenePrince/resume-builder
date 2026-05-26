# Contributing

Thanks for your interest in contributing. This is a focused personal tool, so the scope is intentionally narrow — but bug fixes, quality improvements, and well-scoped features are very welcome.

## Getting started

```bash
# 1. Fork and clone
git clone https://github.com/YOUR_USERNAME/resume-builder.git
cd resume-builder

# 2. Install dependencies
npm install

# 3. Set up your resume data
cp src/data/resumeData.example.json src/data/resumeData.json
# Edit resumeData.json with your own content (it's gitignored)

# 4. Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Changes to source files hot-reload instantly.

## Before submitting a PR

- Run `npm run lint` — there should be zero warnings.
- Run `npm run build` — the production build must succeed without errors.
- Keep changes focused. One concern per PR makes review much faster.
- If you're adding a new feature, update `README.md` to document it.

## What's in scope

- Bug fixes
- Accessibility improvements
- Performance or code quality improvements
- Small, well-defined features that fit the existing design

## What's out of scope

- Backend / server-side functionality — this is intentionally a zero-backend tool
- Authentication or accounts
- Cloud storage of resume data
- Large dependency additions

## Code style

- React components in `.jsx`, utilities in `.js`
- Tailwind utility classes for layout; inline `style` objects only where Tailwind can't reach (e.g. CSS custom properties, dynamic `pt` font sizes)
- No default exports for utilities — named exports only
- Keep `resumeData.json` out of commits — it's gitignored for a reason

## Reporting bugs

Use the [Bug Report](.github/ISSUE_TEMPLATE/bug_report.md) template. Include your browser, OS, and the exact steps to reproduce.

## Suggesting features

Open a [Feature Request](.github/ISSUE_TEMPLATE/feature_request.md) issue before writing any code — it's much easier to align on scope before a PR exists.
