/**
 * SectionCard.jsx
 *
 * Shared card shell used by both ExperienceSection and ProjectSection.
 * Renders a labelled card with a three-line entry header and a scrollable
 * bullet bank. The two section components are thin wrappers that map their
 * domain data onto this component's generic props.
 *
 * Props:
 *   kind             "Experience" | "Project"  — label shown in the card header
 *   heading          string   — primary bold line (company or project name)
 *   subheading?      string   — secondary line (job title + type, or tech stack)
 *   meta?            string   — tertiary line (dates · location, or project links)
 *   bullets          { id, content, tags[] }[]
 *   selectedBullets  Set<string>
 *   onToggleBullet   (id: string) => void
 *   onEditBullet     (id: string, content: string) => void
 *   getBulletContent (bullet) => string
 *   activeTag?       string | null — passed through to BulletItem for dimming
 */
import BulletItem from "./BulletItem";

export default function SectionCard({
  kind,
  heading,
  subheading,
  meta,
  bullets,
  selectedBullets,
  onToggleBullet,
  onEditBullet,
  getBulletContent,
  activeTag = null,
}) {
  const selectedCount = bullets.filter((b) => selectedBullets.has(b.id)).length;

  return (
    <div className="bg-elevated border border-border-default rounded-lg overflow-hidden">
      {/* Kind label + count */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border-default">
        <span className="text-xs font-medium uppercase tracking-widest text-text-secondary">
          {kind}
        </span>
        <span className="text-xs text-text-ghost">
          {selectedCount > 0 ? `${selectedCount} selected` : "none selected"}
        </span>
      </div>

      {/* Entry header */}
      <div className="px-4 py-2.5 border-b border-border-subtle">
        <p className="text-sm font-semibold text-text-primary leading-snug">
          {heading}
        </p>
        {subheading && (
          <p className="text-sm text-text-secondary mt-0.5">{subheading}</p>
        )}
        {meta && <p className="text-xs text-text-ghost mt-0.5">{meta}</p>}
      </div>

      {/* Bullet bank */}
      <div className="p-1.5 flex flex-col gap-1">
        {bullets.map((bullet) => (
          <BulletItem
            key={bullet.id}
            bullet={bullet}
            isSelected={selectedBullets.has(bullet.id)}
            content={getBulletContent(bullet)}
            onToggle={onToggleBullet}
            onEdit={onEditBullet}
            activeTag={activeTag}
          />
        ))}
      </div>
    </div>
  );
}
