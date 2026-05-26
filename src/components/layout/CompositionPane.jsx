import { useState } from "react";
import SkillsSection from "../composition/SkillsSection";
import ExperienceSection from "../composition/ExperienceSection";
import ProjectSection from "../composition/ProjectSection";
import { TAGS } from "../../utils/tags";

const TITLE_PRESETS = [
  "Full Stack Developer",
  "Application Developer",
  "Software Developer",
];

const LOCATION_PRESETS = ["Ottawa, ON", "Coquitlam, BC"];

function GroupLabel({ children }) {
  return (
    <div className="flex items-center gap-3 px-1">
      <span className="text-xs font-medium uppercase tracking-widest text-text-secondary select-none">
        {children}
      </span>
      <div className="flex-1 h-px bg-border-subtle" aria-hidden="true" />
    </div>
  );
}

const CHIP_BASE =
  "px-2 py-0.5 rounded text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-elevated";
const CHIP_ACTIVE =
  "bg-accent-subtle border border-accent-border text-accent-text";
const CHIP_INACTIVE =
  "border border-border-default text-text-secondary hover:border-border-strong hover:text-text-primary";

function chipClass(active) {
  return [CHIP_BASE, active ? CHIP_ACTIVE : CHIP_INACTIVE].join(" ");
}

function HeaderEditor({
  customTitle,
  customLocation,
  onTitleChange,
  onLocationChange,
}) {
  return (
    <div className="bg-elevated border border-border-default rounded-lg px-4 py-3 flex flex-col gap-2">
      <div className="flex items-center gap-x-3 gap-y-2 flex-wrap">
        <span className="text-xs text-text-ghost shrink-0 select-none w-14">
          Title
        </span>
        {TITLE_PRESETS.map((title) => (
          <button
            type="button"
            key={title}
            onClick={() => onTitleChange(title)}
            aria-pressed={customTitle === title}
            className={chipClass(customTitle === title)}
          >
            {title}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-x-3 gap-y-2 flex-wrap">
        <span className="text-xs text-text-ghost shrink-0 select-none w-14">
          Location
        </span>
        {LOCATION_PRESETS.map((loc) => (
          <button
            type="button"
            key={loc}
            onClick={() => onLocationChange(loc)}
            aria-pressed={customLocation === loc}
            className={chipClass(customLocation === loc)}
          >
            {loc}
          </button>
        ))}
      </div>
    </div>
  );
}

const NAME_SIZES = [16, 18, 20];
const BODY_SIZES = [9, 9.5, 10, 10.5, 11];
const LINE_SPACINGS = [1.0, 1.1, 1.2, 1.3];

function FormatEditor({
  nameSize,
  bodySize,
  lineSpacing,
  onNameSizeChange,
  onBodySizeChange,
  onLineSpacingChange,
}) {
  return (
    <div className="bg-elevated border border-border-default rounded-lg px-4 py-3 flex flex-col gap-2">
      <div className="flex items-center gap-x-3 gap-y-2 flex-wrap">
        <span className="text-xs text-text-ghost shrink-0 select-none w-14">
          Name
        </span>
        {NAME_SIZES.map((size) => (
          <button
            type="button"
            key={size}
            onClick={() => onNameSizeChange(size)}
            aria-pressed={nameSize === size}
            className={chipClass(nameSize === size)}
          >
            {size}pt
          </button>
        ))}
      </div>
      <div className="flex items-center gap-x-3 gap-y-2 flex-wrap">
        <span className="text-xs text-text-ghost shrink-0 select-none w-14">
          Body
        </span>
        {BODY_SIZES.map((size) => (
          <button
            type="button"
            key={size}
            onClick={() => onBodySizeChange(size)}
            aria-pressed={bodySize === size}
            className={chipClass(bodySize === size)}
          >
            {size}pt
          </button>
        ))}
      </div>
      <div className="flex items-center gap-x-3 gap-y-2 flex-wrap">
        <span className="text-xs text-text-ghost shrink-0 select-none w-14">
          Spacing
        </span>
        {LINE_SPACINGS.map((ls) => (
          <button
            type="button"
            key={ls}
            onClick={() => onLineSpacingChange(ls)}
            aria-pressed={lineSpacing === ls}
            className={chipClass(lineSpacing === ls)}
          >
            {ls}
          </button>
        ))}
      </div>
    </div>
  );
}

function TagFilterBar({ activeTag, onTagChange }) {
  return (
    <div className="bg-elevated border border-border-default rounded-lg px-4 py-3">
      <div className="flex items-center gap-x-3 gap-y-2 flex-wrap">
        <span className="text-xs text-text-ghost shrink-0 select-none">
          Role filter
        </span>
        {/* "All" clears the filter */}
        <button
          type="button"
          onClick={() => onTagChange(null)}
          aria-pressed={activeTag === null}
          className={chipClass(activeTag === null)}
        >
          All
        </button>
        {TAGS.map((tag) => (
          <button
            type="button"
            key={tag.id}
            onClick={() => onTagChange(activeTag === tag.id ? null : tag.id)}
            aria-pressed={activeTag === tag.id}
            className={chipClass(activeTag === tag.id)}
          >
            {tag.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function CompositionPane({ session }) {
  const [activeTag, setActiveTag] = useState(null);

  const {
    data,
    selectedBullets,
    selectedSkills,
    skillCategories,
    toggleBullet,
    editBullet,
    toggleSkill,
    applyPreset,
    addCategory,
    removeCategory,
    addSkill,
    removeSkill,
    getBulletContent,
    customTitle,
    customLocation,
    setCustomTitle,
    setCustomLocation,
    nameSize,
    bodySize,
    lineSpacing,
    setNameSize,
    setBodySize,
    setLineSpacing,
  } = session;

  return (
    <section
      aria-label="Resume composition"
      className="w-[55%] min-h-0 overflow-y-auto border-r border-border-default"
    >
      <div className="p-5 flex flex-col gap-5">
        <HeaderEditor
          customTitle={customTitle}
          customLocation={customLocation}
          onTitleChange={setCustomTitle}
          onLocationChange={setCustomLocation}
        />

        <FormatEditor
          nameSize={nameSize}
          bodySize={bodySize}
          lineSpacing={lineSpacing}
          onNameSizeChange={setNameSize}
          onBodySizeChange={setBodySize}
          onLineSpacingChange={setLineSpacing}
        />

        <SkillsSection
          categories={skillCategories}
          selectedSkills={selectedSkills}
          onToggleSkill={toggleSkill}
          onApplyPreset={applyPreset}
          onAddCategory={addCategory}
          onRemoveCategory={removeCategory}
          onAddSkill={addSkill}
          onRemoveSkill={removeSkill}
        />

        <TagFilterBar activeTag={activeTag} onTagChange={setActiveTag} />

        <div className="flex flex-col gap-4">
          <GroupLabel>Experience</GroupLabel>
          {data.experiences.map((exp) => (
            <ExperienceSection
              key={exp.id}
              experience={exp}
              selectedBullets={selectedBullets}
              onToggleBullet={toggleBullet}
              onEditBullet={editBullet}
              getBulletContent={getBulletContent}
              activeTag={activeTag}
            />
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <GroupLabel>Projects</GroupLabel>
          {data.projects.map((proj) => (
            <ProjectSection
              key={proj.id}
              project={proj}
              selectedBullets={selectedBullets}
              onToggleBullet={toggleBullet}
              onEditBullet={editBullet}
              getBulletContent={getBulletContent}
              activeTag={activeTag}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
