/**
 * exportDocx.js
 *
 * Builds and downloads a .docx resume from the current session state.
 *
 * Typography spec (must stay in sync with ResumePreview.jsx):
 *   Font:  Georgia for name + section headings, Arial for all other text
 *   Sizes: name and body are session-configurable; section headings fixed at 12pt
 *   Bold:  name, section headings, entry header left-side, project name, skill labels
 *   Line:  lineSpacing multiplied by 240 gives the docx line value (240 = single)
 *
 * Layout:
 *   Margins: 0.5 in all around
 *   Dates / tech: right-aligned via tab stop at the right margin
 *   Bullets: hanging indent so wrapped lines align with text, not the dot
 */
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  TabStopType,
  BorderStyle,
  ExternalHyperlink,
  LineRuleType,
} from "docx";

// ─── Typography (half-points: 1pt = 2 units) ─────────────────────────────────
// PT.name and PT.body are overwritten at the start of each exportDocx call;
// PT.section is fixed. LINE_SPACING is also set per call (240 = single spacing).
const PT = {
  name: 36, // 18pt default — overwritten per call
  section: 24, // 12pt — section headings (Georgia, all caps), never changes
  body: 20, // 10pt default — overwritten per call
};
let LINE_SPACING = Math.round(1.3 * 240); // 312 — overwritten per call

const FONT_HEADING = "Georgia"; // name + section headings
const FONT = "Arial"; // all other text

// ─── Layout (twips: 1 inch = 1440 twips) ─────────────────────────────────────
// Margins: 0.5in all around (720 twips)
const MARGIN = { top: 720, bottom: 720, left: 720, right: 720 };
const TAB_RIGHT = 12240 - MARGIN.left - MARGIN.right; // 10800 twips — right-align tab
const BULLET_INDENT = 200; // twips — hanging indent for bullet lines

// ─── Helpers ─────────────────────────────────────────────────────────────────

function t(text, opts = {}) {
  return new TextRun({ text, font: FONT, size: PT.body, ...opts });
}

// Hyperlink run: clickable ExternalHyperlink wrapping a single TextRun
function link(displayText, url, opts = {}) {
  const href = url.startsWith("http") ? url : `https://${url}`;
  return new ExternalHyperlink({
    link: href,
    children: [
      new TextRun({ text: displayText, font: FONT, size: PT.body, ...opts }),
    ],
  });
}

// Interleave an array of runs with separator TextRuns
function joinRuns(items, separator, size) {
  const runs = [];
  items.forEach((item, i) => {
    if (i > 0) runs.push(new TextRun({ text: separator, font: FONT, size }));
    runs.push(item);
  });
  return runs;
}

// Section heading: Georgia bold uppercase with a bottom border rule
function sectionHeading(title) {
  return new Paragraph({
    children: [
      new TextRun({
        text: title.toUpperCase(),
        font: FONT_HEADING,
        size: PT.section,
        bold: true,
      }),
    ],
    spacing: {
      before: 160,
      after: 20,
      line: LINE_SPACING,
      lineRule: LineRuleType.AUTO,
    },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 6, color: "333333", space: 2 },
    },
  });
}

// Single bold line with right-tabbed date — left bold, date italic
function entryHeader(left, right) {
  return new Paragraph({
    children: [t(left, { bold: true }), t("\t"), t(right, { italics: true })],
    tabStops: [{ type: TabStopType.RIGHT, position: TAB_RIGHT }],
    spacing: {
      before: 100,
      after: 0,
      line: LINE_SPACING,
      lineRule: LineRuleType.AUTO,
    },
  });
}

// Project header: hyperlinked bold name + right-tabbed tech stack
function projectHeader(name, tech, githubUrl) {
  const nameRun = githubUrl
    ? link(name, githubUrl, { bold: true, color: "111111" })
    : t(name, { bold: true });

  return new Paragraph({
    children: [nameRun, t("\t"), t(tech)],
    tabStops: [{ type: TabStopType.RIGHT, position: TAB_RIGHT }],
    spacing: {
      before: 100,
      after: 0,
      line: LINE_SPACING,
      lineRule: LineRuleType.AUTO,
    },
  });
}

// Subtitle line: plain text (degree, etc.)
function subtitleLine(text, opts = {}) {
  return new Paragraph({
    children: [t(text, { color: "111111", ...opts })],
    spacing: {
      before: 0,
      after: 0,
      line: LINE_SPACING,
      lineRule: LineRuleType.AUTO,
    },
  });
}

// Subtitle line: clickable URLs separated by " · "
function linkSubtitleLine(urls) {
  const linkRuns = urls.map((url) => link(url, url, { color: "222222" }));
  return new Paragraph({
    children: joinRuns(linkRuns, " · ", PT.body),
    spacing: {
      before: 0,
      after: 0,
      line: LINE_SPACING,
      lineRule: LineRuleType.AUTO,
    },
  });
}

// Bullet line with proper hanging indent — second lines align with text, not dot
function bulletLine(text) {
  return new Paragraph({
    children: [t("•\t"), t(text)],
    tabStops: [{ type: TabStopType.LEFT, position: BULLET_INDENT }],
    indent: { left: BULLET_INDENT, hanging: BULLET_INDENT },
    spacing: {
      before: 0,
      after: 20,
      line: LINE_SPACING,
      lineRule: LineRuleType.AUTO,
    },
  });
}

// Skills bullet: "•  Label — skill1, skill2" with bold label
// first=true adds top spacing matching other section entries (entryHeader before: 100)
function skillBulletLine(label, skills, first = false) {
  return new Paragraph({
    children: [
      t("•\t"),
      t(`${label} `, { bold: true }),
      t(`— ${skills.join(", ")}`),
    ],
    tabStops: [{ type: TabStopType.LEFT, position: BULLET_INDENT }],
    indent: { left: BULLET_INDENT, hanging: BULLET_INDENT },
    spacing: {
      before: first ? 100 : 0,
      after: 20,
      line: LINE_SPACING,
      lineRule: LineRuleType.AUTO,
    },
  });
}

// ─── Main export ─────────────────────────────────────────────────────────────

/**
 * exportDocx — builds and downloads a .docx resume file.
 *
 * @param {object} options
 * @param {object} options.state          Raw session state (selectedBullets)
 * @param {object} options.data           Resume data (meta, education, experiences, projects)
 * @param {Function} options.getBulletContent  (bullet) => display string
 * @param {Function} options.getSelectedSkillRows  () => { label, skills[] }[]
 * @param {string} options.customTitle    Professional title shown in the contact line
 * @param {string} options.customLocation Location shown in the contact line
 * @param {number} options.nameSize       Name font size in pt (default 18)
 * @param {number} options.bodySize       Body font size in pt (default 10)
 * @param {number} options.lineSpacing    Line height multiplier (default 1.3)
 */
export async function exportDocx({
  state,
  data,
  getBulletContent,
  getSelectedSkillRows,
  customTitle,
  customLocation,
  nameSize = 18,
  bodySize = 10,
  lineSpacing = 1.3,
}) {
  // Apply session typography to the module-level format context
  PT.name = nameSize * 2;
  PT.body = bodySize * 2;
  LINE_SPACING = Math.round(lineSpacing * 240);

  try {
    const { selectedBullets } = state;
    const { meta, education, experiences, projects } = data;
    const skillRows = getSelectedSkillRows();
    const children = [];

    // ── Header ──────────────────────────────────────────────────────────────
    // Line 1: name
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: meta.name,
            font: FONT_HEADING,
            size: PT.name,
            bold: true,
          }),
        ],
        spacing: {
          before: 0,
          after: 30,
          line: LINE_SPACING,
          lineRule: LineRuleType.AUTO,
        },
      }),
    );

    // Line 2: title · location · email (mailto link) · phone
    children.push(
      new Paragraph({
        children: joinRuns(
          [
            customTitle &&
              new TextRun({ text: customTitle, font: FONT, size: PT.body }),
            new TextRun({
              text: customLocation || meta.location,
              font: FONT,
              size: PT.body,
            }),
            meta.email && link(meta.email, `mailto:${meta.email}`),
            meta.phone &&
              new TextRun({ text: meta.phone, font: FONT, size: PT.body }),
          ].filter(Boolean),
          " · ",
          PT.body,
        ),
        spacing: {
          before: 0,
          after: 0,
          line: LINE_SPACING,
          lineRule: LineRuleType.AUTO,
        },
      }),
    );

    // Line 3: linkedin · github · portfolio (all clickable)
    const socialUrls = [meta.linkedin, meta.github, meta.portfolio].filter(
      Boolean,
    );
    children.push(
      new Paragraph({
        children: joinRuns(
          socialUrls.map((url) => link(url, url)),
          " · ",
          PT.body,
        ),
        spacing: {
          before: 0,
          after: 60,
          line: LINE_SPACING,
          lineRule: LineRuleType.AUTO,
        },
      }),
    );

    // ── Skills ──────────────────────────────────────────────────────────────
    if (skillRows.length > 0) {
      children.push(sectionHeading("Skills"));
      skillRows.forEach((row, i) => {
        children.push(skillBulletLine(row.label, row.skills, i === 0));
      });
    }

    // ── Experience ──────────────────────────────────────────────────────────
    const activeExperiences = experiences.filter((exp) =>
      exp.bullets.some((b) => selectedBullets.has(b.id)),
    );

    if (activeExperiences.length > 0) {
      children.push(sectionHeading("Experience"));
      activeExperiences.forEach((exp) => {
        const activeBullets = exp.bullets.filter((b) =>
          selectedBullets.has(b.id),
        );
        children.push(
          entryHeader(
            `${exp.title}${exp.type ? ` (${exp.type})` : ""} — ${exp.company} · ${exp.location}`,
            `${exp.startDate} – ${exp.endDate}`,
          ),
          ...activeBullets.map((b) => bulletLine(getBulletContent(b))),
        );
      });
    }

    // ── Projects ────────────────────────────────────────────────────────────
    const activeProjects = projects.filter((proj) =>
      proj.bullets.some((b) => selectedBullets.has(b.id)),
    );

    if (activeProjects.length > 0) {
      children.push(sectionHeading("Projects"));
      activeProjects.forEach((proj) => {
        const activeBullets = proj.bullets.filter((b) =>
          selectedBullets.has(b.id),
        );
        const linkUrls = [proj.github, proj.live].filter(Boolean);

        children.push(
          projectHeader(proj.name, proj.tech, proj.github),
          ...(linkUrls.length > 0 ? [linkSubtitleLine(linkUrls)] : []),
          ...activeBullets.map((b) => bulletLine(getBulletContent(b))),
        );
      });
    }

    // ── Education ───────────────────────────────────────────────────────────
    children.push(
      sectionHeading("Education"),
      entryHeader(
        `${education.institution} · ${education.location}`,
        `${education.startDate} – ${education.endDate}`,
      ),
      subtitleLine(education.degree),
      bulletLine(`GPA: ${education.gpa} · ${education.honors}`),
    );

    // ── Build & save ────────────────────────────────────────────────────────
    const doc = new Document({
      sections: [{ properties: { page: { margin: MARGIN } }, children }],
    });

    const blob = await Packer.toBlob(doc);
    const today = new Date().toISOString().split("T")[0];
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Resume_${today}.docx`;
    // Must be in the DOM for Firefox and Safari to trigger the download.
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Export failed:", err);
    alert("Export failed. Please try again.\n\n" + (err?.message ?? err));
  }
}
