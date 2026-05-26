// ResumePreview renders the live HTML preview, mirroring the docx format spec.
// Georgia for name + section headings; Arial for everything else.
// Font sizes: name and body are session-configurable; section headings fixed at 12pt.
// Bold: name, section headings, entry headers (title/company line), project names.
// Experience: single-line entry — title — company · location, date right-aligned.
// Two-line project layout: hyperlinked name + tech on line 1, links subtitle on line 2.
//
// CSS variables --fs-body and --lh are set on the container so sub-components
// inherit the current body size and line spacing without receiving props.
//
// Page boundary: a dashed indicator sits at top: 11in (1056px at 96dpi = one US Letter
// page). It stays gray while content fits; turns amber the moment content overflows.

import { useRef, useState, useEffect } from "react";

const FONT_HEADING = "'Georgia', serif";
const FONT = "'Arial', sans-serif";

// US Letter height in CSS pixels (1in = 96px by CSS spec, device-independent)
const PAGE_HEIGHT_PX = 1056;

// Word processors compute "single" line spacing from the font's OS/2 metrics
// (sTypoAscender + sTypoDescender + sTypoLineGap), which for Arial is ~1.15×
// the CSS em square. Without this correction the preview renders ~15% shorter
// than the exported docx, causing the overflow indicator to fire too late.
const DOCX_LH_FACTOR = 1.15;

export default function ResumePreview({ session }) {
  const {
    data,
    selectedBullets,
    getBulletContent,
    getSelectedSkillRows,
    hasNoSkills,
    customTitle,
    customLocation,
    nameSize,
    bodySize,
    lineSpacing,
  } = session;
  const { meta, education } = data;

  // Track whether resume content overflows one US Letter page
  const containerRef = useRef(null);
  const [isOverflow, setIsOverflow] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const check = () =>
      setIsOverflow((prev) => {
        const next = el.scrollHeight > PAGE_HEIGHT_PX;
        return prev !== next ? next : prev;
      });
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Scale line spacing to match docx rendering (see DOCX_LH_FACTOR above)
  const cssLineHeight = lineSpacing * DOCX_LH_FACTOR;

  const skillRows = getSelectedSkillRows();
  const noSkills = hasNoSkills();

  const activeExperiences = data.experiences.filter((exp) =>
    exp.bullets.some((b) => selectedBullets.has(b.id)),
  );
  const activeProjects = data.projects.filter((proj) =>
    proj.bullets.some((b) => selectedBullets.has(b.id)),
  );

  const isEmpty =
    noSkills && activeExperiences.length === 0 && activeProjects.length === 0;

  return (
    <div
      ref={containerRef}
      style={{
        background: "white",
        fontFamily: FONT,
        fontSize: `${bodySize}pt`,
        color: "#111",
        lineHeight: String(cssLineHeight),
        padding: "0.5in",
        // Fixed US Letter dimensions — content always reflows identically to the
        // exported docx, so the page boundary indicator reflects the real page fit.
        width: "8.5in",
        boxSizing: "border-box",
        minHeight: "11in",
        margin: "0 auto",
        position: "relative",
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        borderRadius: "3px",
        // CSS variables inherited by all sub-components
        "--fs-body": `${bodySize}pt`,
        "--lh": String(cssLineHeight),
      }}
    >
      {/* ── Header ── */}
      <p
        style={{
          fontFamily: FONT_HEADING,
          fontSize: `${nameSize}pt`,
          fontWeight: "bold",
          margin: "0 0 3px",
        }}
      >
        {meta.name}
      </p>

      {/* Line 2: title · location · email (mailto link) · phone */}
      <p
        style={{
          fontFamily: FONT,
          fontSize: "var(--fs-body)",
          color: "#222",
          margin: "0 0 1px",
        }}
      >
        {customTitle}
        {" · "}
        {customLocation}
        {meta.email && (
          <>
            {" · "}
            <a
              href={`mailto:${meta.email}`}
              style={{ color: "#222", textDecoration: "none" }}
            >
              {meta.email}
            </a>
          </>
        )}
        {meta.phone && ` · ${meta.phone}`}
      </p>

      {/* Line 3: linkedin · github · portfolio — all clickable */}
      <p
        style={{
          fontFamily: FONT,
          fontSize: "var(--fs-body)",
          color: "#222",
          margin: "0 0 8px",
        }}
      >
        {[meta.linkedin, meta.github, meta.portfolio]
          .filter(Boolean)
          .map((url, i) => {
            const href = url.startsWith("http") ? url : `https://${url}`;
            return (
              <span key={url}>
                {i > 0 && " · "}
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#222", textDecoration: "none" }}
                >
                  {url}
                </a>
              </span>
            );
          })}
      </p>

      {/* ── Empty state ── */}
      {isEmpty && (
        <p
          style={{
            fontFamily: FONT,
            fontSize: "var(--fs-body)",
            color: "#aaa",
            fontStyle: "italic",
            marginTop: "24px",
            textAlign: "center",
          }}
        >
          Select skills and bullets from the left pane to build your resume.
        </p>
      )}

      {/* ── Skills (omitted when empty, matching docx behaviour) ── */}
      {!noSkills && (
        <>
          <SectionHeading title="Skills" />
          <div style={{ marginTop: "7px" }}>
            {skillRows.map((row) => (
              <SkillBulletLine
                key={row.label}
                label={row.label}
                skills={row.skills}
              />
            ))}
          </div>
        </>
      )}

      {/* ── Experience ── */}
      {activeExperiences.length > 0 && (
        <>
          <SectionHeading title="Experience" />
          {activeExperiences.map((exp) => {
            const activeBullets = exp.bullets.filter((b) =>
              selectedBullets.has(b.id),
            );
            return (
              <div key={exp.id} style={{ marginTop: "7px" }}>
                <EntryHeader
                  left={`${exp.title}${exp.type ? ` (${exp.type})` : ""} — ${exp.company} · ${exp.location}`}
                  right={`${exp.startDate} – ${exp.endDate}`}
                />
                {activeBullets.map((b) => (
                  <BulletLine key={b.id} text={getBulletContent(b)} />
                ))}
              </div>
            );
          })}
        </>
      )}

      {/* ── Projects ── */}
      {activeProjects.length > 0 && (
        <>
          <SectionHeading title="Projects" />
          {activeProjects.map((proj) => {
            const activeBullets = proj.bullets.filter((b) =>
              selectedBullets.has(b.id),
            );
            const links = [proj.github, proj.live].filter(Boolean);
            return (
              <div key={proj.id} style={{ marginTop: "7px" }}>
                <ProjectHeader
                  name={proj.name}
                  tech={proj.tech}
                  githubUrl={proj.github}
                />
                {links.length > 0 && <LinkSubtitleLine links={links} />}
                {activeBullets.map((b) => (
                  <BulletLine key={b.id} text={getBulletContent(b)} />
                ))}
              </div>
            );
          })}
        </>
      )}

      {/* ── Page boundary indicator ── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "11in",
          left: 0,
          right: 0,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            borderTop: `1px dashed ${isOverflow ? "#f59e0b" : "#d1d5db"}`,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <span
            style={{
              fontSize: "7pt",
              fontFamily: FONT,
              color: isOverflow ? "#f59e0b" : "#9ca3af",
              background: "white",
              padding: "1px 6px 2px",
              borderRadius: "0 0 3px 3px",
              userSelect: "none",
            }}
          >
            {isOverflow ? "⚠ overflow" : "page 1"}
          </span>
        </div>
      </div>

      {/* ── Education ── */}
      <SectionHeading title="Education" />
      <div style={{ marginTop: "7px" }}>
        <EntryHeader
          left={`${education.institution} · ${education.location}`}
          right={`${education.startDate} – ${education.endDate}`}
        />
        <SubtitleLine text={education.degree} />
        <BulletLine text={`GPA: ${education.gpa} · ${education.honors}`} />
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionHeading({ title }) {
  return (
    <div style={{ marginTop: "12px", marginBottom: "1px" }}>
      <p
        style={{
          fontFamily: FONT_HEADING,
          fontSize: "12pt",
          fontWeight: "bold",
          textTransform: "uppercase",
          margin: "0 0 2px",
        }}
      >
        {title}
      </p>
      <hr style={{ border: "none", borderTop: "1px solid #333", margin: 0 }} />
    </div>
  );
}

function EntryHeader({ left, right }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
      }}
    >
      <span
        style={{
          fontFamily: FONT,
          fontSize: "var(--fs-body)",
          fontWeight: "bold",
          flex: 1,
          paddingRight: "12px",
        }}
      >
        {left}
      </span>
      <span
        style={{
          fontFamily: FONT,
          fontSize: "var(--fs-body)",
          color: "#333",
          fontStyle: "italic",
          whiteSpace: "nowrap",
        }}
      >
        {right}
      </span>
    </div>
  );
}

// Project header: hyperlinked bold name + right-aligned tech
function ProjectHeader({ name, tech, githubUrl }) {
  const href = githubUrl
    ? githubUrl.startsWith("http")
      ? githubUrl
      : `https://${githubUrl}`
    : null;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
      }}
    >
      <span
        style={{
          fontFamily: FONT,
          fontSize: "var(--fs-body)",
          fontWeight: "bold",
          flex: 1,
          paddingRight: "12px",
        }}
      >
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            style={{ color: "#111", textDecoration: "none" }}
          >
            {name}
          </a>
        ) : (
          name
        )}
      </span>
      <span
        style={{
          fontFamily: FONT,
          fontSize: "var(--fs-body)",
          color: "#333",
          whiteSpace: "nowrap",
        }}
      >
        {tech}
      </span>
    </div>
  );
}

// Subtitle line for plain text (degree, etc.)
function SubtitleLine({ text }) {
  return (
    <p
      style={{
        fontFamily: FONT,
        fontSize: "var(--fs-body)",
        color: "#111",
        margin: "0 0 1px",
      }}
    >
      {text}
    </p>
  );
}

// Subtitle line for project links — renders each URL as a clickable anchor
function LinkSubtitleLine({ links }) {
  return (
    <p
      style={{
        fontFamily: FONT,
        fontSize: "var(--fs-body)",
        color: "#222",
        margin: "0 0 1px",
      }}
    >
      {links.map((url, i) => {
        const href = url.startsWith("http") ? url : `https://${url}`;
        return (
          <span key={url}>
            {i > 0 && " · "}
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              style={{ color: "#222", textDecoration: "underline" }}
            >
              {url}
            </a>
          </span>
        );
      })}
    </p>
  );
}

// Bullet line: flex layout keeps wrapped lines flush under the text, not the dot.
function BulletLine({ text }) {
  return (
    <div
      style={{
        display: "flex",
        gap: "0.4em",
        fontFamily: FONT,
        fontSize: "var(--fs-body)",
        lineHeight: "var(--lh)",
        margin: "1px 0",
      }}
    >
      <span style={{ flexShrink: 0 }}>•</span>
      <span>{text}</span>
    </div>
  );
}

// Skill bullet: "• Label — skill1, skill2" with bold label.
// Flex layout matches BulletLine so wrapped lines align correctly.
function SkillBulletLine({ label, skills }) {
  return (
    <div
      style={{
        display: "flex",
        gap: "0.4em",
        fontFamily: FONT,
        fontSize: "var(--fs-body)",
        lineHeight: "var(--lh)",
        margin: "1px 0",
      }}
    >
      <span style={{ flexShrink: 0 }}>•</span>
      <span>
        <strong style={{ fontWeight: "bold" }}>{label}</strong>
        {" — "}
        {skills.join(", ")}
      </span>
    </div>
  );
}
