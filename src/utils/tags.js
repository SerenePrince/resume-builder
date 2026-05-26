/**
 * tags.js
 *
 * Shared tag definitions used by the filter bar and bullet tag chips.
 * Order here determines the order chips appear in the UI.
 *
 * Each tag maps to a role type described in the bullet bank notes:
 *   backend        Java/API/server-side roles
 *   frontend       React/UI/web roles
 *   fullstack      General developer roles
 *   testing        QA/SDET/testing roles
 *   power-platform Power Apps/Automate/BI/MS ecosystem roles
 *   enterprise     Large org, government, or process-automation roles
 *   general        Works in almost any developer role
 */

export const TAGS = [
  { id: "backend", label: "Backend" },
  { id: "frontend", label: "Frontend" },
  { id: "fullstack", label: "Full-stack" },
  { id: "testing", label: "Testing" },
  { id: "power-platform", label: "Power Platform" },
  { id: "enterprise", label: "Enterprise" },
  { id: "general", label: "General" },
];

/** Quick lookup: tag id → display label */
export const TAG_LABEL = Object.fromEntries(TAGS.map((t) => [t.id, t.label]));
