import SectionCard from "./SectionCard";

export default function ProjectSection({
  project,
  selectedBullets,
  onToggleBullet,
  onEditBullet,
  getBulletContent,
  activeTag = null,
}) {
  const links = [project.github, project.live].filter(Boolean).join(" · ");

  return (
    <SectionCard
      kind="Project"
      heading={project.name}
      subheading={project.tech}
      meta={links || undefined}
      bullets={project.bullets}
      selectedBullets={selectedBullets}
      onToggleBullet={onToggleBullet}
      onEditBullet={onEditBullet}
      getBulletContent={getBulletContent}
      activeTag={activeTag}
    />
  );
}
