# Bullet Point Bank — Noah Park-Nguyen

A curated library of resume bullet variants organized by role and project. Each bullet is tagged for the job type it fits best, and the strongest bullets are marked **STRONG**.

---

## How to Use

Pick bullets based on the role you're applying for using the tags below. Lead with **STRONG** bullets — they're the most specific and impactful. Mix and match from different sections, but read the [strategy notes](#strategy-notes) at the bottom before finalizing any resume.

| Tag                | Best For                                           |
| ------------------ | -------------------------------------------------- |
| `[backend]`        | Java / API / server-side roles                     |
| `[frontend]`       | React / UI / web roles                             |
| `[fullstack]`      | General developer roles                            |
| `[testing]`        | QA / SDET / testing roles                          |
| `[power-platform]` | Power Apps / Automate / BI / MS ecosystem roles    |
| `[enterprise]`     | Large org, government, or process-automation roles |
| `[general]`        | Works in almost any developer role                 |

---

## Experience

### Department of National Defence

**Application Developer** · Feb 2025 – Dec 2025

#### Chatbot — React, Tailwind, Vite, Azure AI

> **STRONG** · `[frontend]` `[fullstack]` `[general]`
> Built a full-stack AI chatbot using React, Tailwind, and Vite, integrated against a backend Azure AI REST endpoint; demoed weekly to stakeholders and iterated on direct feedback.

> `[frontend]` `[fullstack]`
> Built the complete frontend for a document Q&A chatbot — React, Tailwind, Vite — handling everything the user sees and interacts with.

> `[frontend]` `[fullstack]` `[backend]`
> Connected a React frontend to an Azure AI REST endpoint via a single fetch request; designed around strict non-hallucination and page citation requirements.

> `[frontend]` `[fullstack]` `[enterprise]`
> Built a chat interface with three non-negotiable design principles: no hallucinations, strict page citations for every answer, and a persistent prompt for users to verify against the source document.

> `[fullstack]` `[general]`
> Contributed to a full-stack AI proof-of-concept at DND; handled all frontend work while a teammate owned the model integration and backend.

---

#### Initiative Tracker — Power Apps, Power Automate, SharePoint

> **STRONG** · `[power-platform]` `[enterprise]`
> Designed and developed a Power Apps initiative tracking system backed by SharePoint Lists, replacing scattered files with a single source of truth for ownership, status, and progress.

> **STRONG** · `[power-platform]` `[enterprise]`
> Built Power Automate flows to handle what used to be done manually — notifications on assignment, automatic channel creation for new initiatives.

> **STRONG** · `[power-platform]` `[enterprise]` `[backend]`
> Connected the initiative tracker to Azure DevOps so sprint data stayed current automatically, no manual updates required.

> `[power-platform]` `[enterprise]`
> Designed the SharePoint List structure to track client info, team roles, status flags, and initiative progress — built from user stories each sprint.

> `[power-platform]` `[enterprise]` `[general]`
> Demoed completed features weekly to a supervisor; incorporated feedback directly into the next sprint.

> `[power-platform]` `[enterprise]` `[general]`
> Built and shipped internal Power Platform tooling on a cross-functional Agile team — ran weekly demos, took feedback, and iterated each sprint.

> `[power-platform]` `[enterprise]`
> Delivered Power Apps, Power Automate, and SharePoint solutions as the sole developer on a sprint-based Agile team, working from user stories and BA flowcharts.

---

#### Training Dashboard — Power BI, Excel

> **STRONG** · `[power-platform]` `[enterprise]`
> Analyzed raw training completion data, identified and resolved a bilingual counting issue that was skewing reports, and built a Power BI dashboard leadership could read without a walkthrough.

> `[power-platform]` `[enterprise]`
> Built a Power BI training completion dashboard from a raw, unstructured export — decoded completion fields, added fiscal year and quarterly columns, and created separate pages for trends, demographics, and underlying data.

> `[power-platform]` `[enterprise]` `[general]`
> Caught and resolved a data quality issue — English and French versions of the same course were being tracked as separate completions — before it could affect downstream reporting.

> `[power-platform]` `[enterprise]`
> Built a self-explanatory Power BI dashboard for non-technical leadership; fiscal year and quarterly trends visible for the first time.

---

### Algonquin College

**Software Tester** · Sep 2024 – Dec 2024

> **STRONG** · `[testing]` `[general]`
> Wrote and executed 200+ test cases for a next-generation student information system.

> **STRONG** · `[testing]` `[general]`
> Logged and tracked defects directly in Azure DevOps throughout the full testing lifecycle.

> `[testing]` `[enterprise]`
> Practiced the full testing lifecycle — writing test cases, executing them, and logging defects — for a live enterprise system.

> `[testing]` `[general]`
> Worked as a software tester on a next-gen student information system at Algonquin College; wrote 200+ test cases and reported findings in Azure DevOps.

> `[testing]` `[fullstack]` `[general]`
> Gained experience on both sides of the quality process — as a developer writing JUnit tests at FINTRAC and as a dedicated tester at Algonquin — giving me a clear picture of what quality looks like end to end.
>
> ⚠️ _Use as a summary bullet or cover letter line — not in the experience section itself._

---

### FINTRAC

**Application Developer** · Jan 2024 – Apr 2024

> **STRONG** · `[backend]` `[fullstack]` `[general]`
> Built a Java application from scratch to automate REST API documentation checks across 20+ endpoints, cutting an 8-hour manual process to minutes.

> **STRONG** · `[backend]` `[fullstack]` `[enterprise]`
> Designed a config-driven architecture so endpoint definitions and expected fields could be updated without touching source code.

> **STRONG** · `[general]`
> Delivered the project independently — no existing codebase, limited guidance, first professional placement.

> **STRONG** · `[testing]` `[backend]`
> Wrote 50+ JUnit unit tests for a form-validation service.

> `[backend]` `[enterprise]`
> Built in support for notes and overrides in the config file so intentional exceptions could be recorded and wouldn't get flagged on every run.

> `[backend]` `[fullstack]`
> Built a Java REST API validation tool independently from scratch — no mentor, no codebase, no template. The tool ran a check that previously took 8 hours in under a minute.

> `[backend]` `[enterprise]`
> Automated a manual REST API documentation review process at FINTRAC, building a configurable Java tool that queried live endpoints and flagged drift from documented fields.

> `[backend]` `[enterprise]`
> Designed the system to be maintainable from day one — JSON config for endpoints, support for intentional overrides, no code changes required to add a new endpoint.

> `[testing]` `[backend]`
> Wrote 50+ JUnit unit tests for a form-validation service at FINTRAC — first exposure to test-driven discipline in a professional environment.

---

## Projects

### HubSpot Recommendation Tool — Node.js, React, Docker

> **STRONG** · `[fullstack]` `[backend]` `[general]`
> Built for Inbox Communications (HubSpot Platinum Partner) as an Algonquin College capstone — automates prospect tech stack detection and maps results to HubSpot product recommendations.

> `[backend]` `[fullstack]`
> Backend is a vanilla Node.js HTTP server with a technology detection pipeline fingerprinting URLs against a Wappalyzer-compatible dataset. No Express — minimal dependency footprint.

> `[backend]` `[enterprise]`
> CLI tooling lets the internal team manage the product recommendation taxonomy without touching source code.

> `[frontend]` `[fullstack]`
> Frontend built on CSS custom properties for full rebrandability; report table adapts to mobile; built to accessibility standards throughout.

> `[frontend]` `[fullstack]`
> Took over a teammate's frontend skeleton and built it out fully once the backend was in place.

> `[general]`
> Live at hubspot-recommendation-tool.onrender.com.

---

### Java Dictionary — Java, Spring Boot, PostgreSQL

> **STRONG** · `[backend]` `[fullstack]`
> Spring Boot application with server-side rendering via Thymeleaf for building a personal Java glossary; terms stored in PostgreSQL and grouped at the service layer using URL-safe slugs.

> `[backend]` `[enterprise]`
> Content managed through a YAML study guide config — adding new terms means editing a file, not touching code.

> `[backend]` `[fullstack]`
> Chose server-side rendering with Thymeleaf deliberately to demonstrate Spring Boot end to end, rather than reaching for a separate frontend framework.

---

### Statmon — React, Vite, Tailwind CSS, Cloudflare Pages

> **STRONG** · `[frontend]` `[fullstack]` `[backend]`
> All Pokémon data fetched from PokéAPI at build time via custom Node scripts and bundled as static JSON — zero API calls at runtime.

> `[frontend]` `[fullstack]`
> Built with React, Vite, and Tailwind CSS; deployed to Cloudflare Pages.

> `[frontend]` `[general]`
> Covers all 9 generations with authentic regional Pokédex order and Gen 1 original Special stat.

> `[backend]` `[general]`
> Node.js build scripts fetch in batches with delays and skip already-fetched data — designed not to hammer the third-party API unnecessarily.

---

## Skills Section Variants

Different orderings of the skills section depending on the role you're targeting. Pick one per resume — don't mix ordering strategies.

### Full-Stack (lead with backend)

| Category  | Technologies                                            |
| --------- | ------------------------------------------------------- |
| Backend   | Java, Spring Boot, Maven, Node.js, REST APIs            |
| Frontend  | React, JavaScript, Vite, Tailwind CSS, HTML/CSS         |
| Databases | PostgreSQL, SQL                                         |
| Tools     | Git, Docker, Azure DevOps, Linux/Ubuntu, Power Platform |

### Power Platform (lead with MS ecosystem)

| Category       | Technologies                                 |
| -------------- | -------------------------------------------- |
| Power Platform | Power Apps, Power Automate, Power BI         |
| Microsoft 365  | SharePoint, Azure DevOps                     |
| Backend        | Java, Spring Boot, Maven, Node.js, REST APIs |
| Frontend       | React, JavaScript, HTML/CSS                  |
| Databases      | PostgreSQL, SQL                              |
| Tools          | Git, Docker, Linux/Ubuntu                    |

### Testing-Forward

| Category  | Technologies                                  |
| --------- | --------------------------------------------- |
| Languages | Java, JavaScript                              |
| Testing   | JUnit, Azure DevOps, manual test case writing |
| Frontend  | React, Vite, Tailwind CSS, HTML/CSS           |
| Backend   | Spring Boot, Maven, Node.js, REST APIs        |
| Databases | PostgreSQL, SQL                               |
| Tools     | Git, Docker, Linux/Ubuntu, Power Platform     |

### Frontend-Forward

| Category  | Technologies                                    |
| --------- | ----------------------------------------------- |
| Frontend  | React, JavaScript, Vite, Tailwind CSS, HTML/CSS |
| Backend   | Java, Spring Boot, Maven, Node.js, REST APIs    |
| Databases | PostgreSQL, SQL                                 |
| Tools     | Git, Docker, Azure DevOps, Linux/Ubuntu         |

---

## Strategy Notes

**1. Always keep at least one "delivered independently" bullet.**
The FINTRAC "no existing codebase, first placement" bullet is one of your strongest differentiators as a new grad. Don't drop it.

**2. DND bullets are modular.**
The chatbot (frontend/fullstack), initiative tracker (power-platform), and training dashboard (power-platform/data) are three separate stories. Include all three, or drop one to make room for a stronger project story depending on the role.

**3. JUnit tests travel with FINTRAC.**
Whether the role cares about testing or not, keep the JUnit bullet when applying to any backend or testing role. It shows test discipline from day one.

**4. Power Platform jobs: lead DND with the tracker and dashboard.**
Put the chatbot last or drop it. The tracker and dashboard prove you can own a Power Platform project end-to-end.

**5. Frontend jobs: lead DND with the chatbot.**
The tracker can stay but focus on the React/Vite/Tailwind execution. The dashboard can usually be dropped.

**6. Backend jobs: lean heavily on FINTRAC.**
The API sync automation is your clearest backend story. Lead with it. The config-driven architecture bullet shows design thinking beyond just "I wrote code."

**7. Projects section is flexible.**

- Backend / Java roles → Java Dictionary moves up
- Full-stack roles → HubSpot Tool leads
- Frontend roles → Statmon and HubSpot Tool lead

You don't always need all three — pick the two that best match the job.
