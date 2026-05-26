import SectionCard from "./SectionCard";

export default function ExperienceSection({
  experience,
  selectedBullets,
  onToggleBullet,
  onEditBullet,
  getBulletContent,
  activeTag = null,
}) {
  const subheading = experience.title
    ? `${experience.title}${experience.type ? ` (${experience.type})` : ""}`
    : undefined;

  const meta = [
    `${experience.startDate} – ${experience.endDate}`,
    experience.location,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <SectionCard
      kind="Experience"
      heading={experience.company}
      subheading={subheading}
      meta={meta}
      bullets={experience.bullets}
      selectedBullets={selectedBullets}
      onToggleBullet={onToggleBullet}
      onEditBullet={onEditBullet}
      getBulletContent={getBulletContent}
      activeTag={activeTag}
    />
  );
}
