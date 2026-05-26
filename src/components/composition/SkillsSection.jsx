import { useState, useCallback } from "react";
import { SKILL_PRESETS } from "../../utils/skillPresets";

// Shared chip style constants
const CHIP_BASE =
  "px-2 py-0.5 text-sm cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-elevated";
const CHIP_ACTIVE =
  "bg-accent-subtle border border-accent-border text-accent-text";
const CHIP_INACTIVE =
  "border border-border-default text-text-secondary hover:border-border-strong hover:text-text-primary";

// Moves focus to the previous or next button inside a group container.
// Wraps around at either end (Left from first → last; Right from last → first).
function handleChipGroupArrowKey(e, groupEl) {
  if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
  const chips = [...groupEl.querySelectorAll("button")];
  const idx = chips.indexOf(document.activeElement);
  if (idx === -1) return;
  e.preventDefault();
  const next =
    e.key === "ArrowRight"
      ? chips[(idx + 1) % chips.length]
      : chips[(idx - 1 + chips.length) % chips.length];
  next.focus();
}

// ── Skill chip ────────────────────────────────────────────────────────────────
// In normal mode: a single toggle button.
// In edit mode: toggle button (rounded-l) + remove button (rounded-r).
function SkillChip({
  skill,
  isSelected,
  categoryId,
  isEditing,
  onToggle,
  onRemove,
}) {
  return (
    <div className="flex items-center">
      <button
        type="button"
        onClick={() => onToggle(categoryId, skill)}
        aria-pressed={isSelected}
        className={[
          CHIP_BASE,
          isEditing ? "rounded-l" : "rounded",
          isSelected ? CHIP_ACTIVE : CHIP_INACTIVE,
        ].join(" ")}
      >
        {skill}
      </button>
      {isEditing && (
        <button
          type="button"
          onClick={() => onRemove(categoryId, skill)}
          aria-label={`Remove ${skill}`}
          className="px-1 py-0.5 rounded-r text-xs border border-l-0 border-border-default text-text-ghost hover:text-text-secondary hover:border-border-strong transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-elevated"
        >
          ×
        </button>
      )}
    </div>
  );
}

// ── Category row ──────────────────────────────────────────────────────────────
function CategoryRow({
  category,
  selectedSkills,
  isEditing,
  onToggleSkill,
  onRemoveSkill,
  onRemoveCategory,
  onAddSkill,
  newSkillInput,
  onNewSkillInputChange,
}) {
  const selected = selectedSkills.get(category.id) ?? new Set();

  function commitNewSkill() {
    const trimmed = newSkillInput.trim();
    if (trimmed) {
      onAddSkill(category.id, trimmed);
      onNewSkillInputChange(category.id, "");
    }
  }

  return (
    <div className="flex items-start gap-3">
      {/* Category label + optional delete button */}
      <div className="flex items-center w-28 shrink-0 pt-0.5 gap-1">
        <span
          className="text-sm text-text-secondary truncate"
          id={`skill-cat-${category.id}`}
        >
          {category.label}
        </span>
        {isEditing && (
          <button
            type="button"
            onClick={() => onRemoveCategory(category.id)}
            aria-label={`Remove ${category.label} category`}
            className="ml-auto shrink-0 text-xs text-text-ghost hover:text-text-secondary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded"
          >
            ×
          </button>
        )}
      </div>

      {/* Chips + optional add-skill input */}
      <div
        className="flex flex-wrap gap-1"
        role="group"
        aria-labelledby={`skill-cat-${category.id}`}
        onKeyDown={(e) => handleChipGroupArrowKey(e, e.currentTarget)}
      >
        {category.skills.map((skill) => (
          <SkillChip
            key={skill}
            skill={skill}
            isSelected={selected.has(skill)}
            categoryId={category.id}
            isEditing={isEditing}
            onToggle={onToggleSkill}
            onRemove={onRemoveSkill}
          />
        ))}

        {isEditing && (
          <input
            type="text"
            value={newSkillInput}
            onChange={(e) => onNewSkillInputChange(category.id, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                commitNewSkill();
              }
            }}
            onBlur={commitNewSkill}
            placeholder="Add skill…"
            aria-label={`Add skill to ${category.label}`}
            className="px-2 py-0.5 rounded text-xs border border-dashed border-border-default bg-transparent text-text-secondary placeholder:text-text-ghost focus:outline-none focus:border-accent w-24 transition-colors"
          />
        )}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function SkillsSection({
  categories,
  selectedSkills,
  onToggleSkill,
  onApplyPreset,
  onAddCategory,
  onRemoveCategory,
  onAddSkill,
  onRemoveSkill,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [newCategoryLabel, setNewCategoryLabel] = useState("");
  // Per-category add-skill input values: { [categoryId]: string }
  const [newSkillInputs, setNewSkillInputs] = useState({});

  const totalSelected = [...selectedSkills.values()].reduce(
    (sum, set) => sum + set.size,
    0,
  );
  const categoriesWithSelections = [...selectedSkills.values()].filter(
    (set) => set.size > 0,
  ).length;

  const handleNewSkillInputChange = useCallback((categoryId, value) => {
    setNewSkillInputs((prev) => ({ ...prev, [categoryId]: value }));
  }, []);

  function commitNewCategory() {
    const label = newCategoryLabel.trim();
    if (label) {
      onAddCategory(label);
      setNewCategoryLabel("");
    }
  }

  return (
    <div className="bg-elevated border border-border-default rounded-lg overflow-hidden">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border-default">
        <span className="text-xs font-medium uppercase tracking-widest text-text-secondary">
          Skills
        </span>
        <div className="flex items-center gap-3">
          <span className="text-xs text-text-ghost">
            {totalSelected > 0
              ? `${totalSelected} skills · ${categoriesWithSelections} ${categoriesWithSelections === 1 ? "category" : "categories"}`
              : "none selected"}
          </span>
          <button
            type="button"
            onClick={() => setIsEditing((e) => !e)}
            className={[
              "text-sm px-1.5 py-0.5 rounded border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-elevated",
              isEditing
                ? "bg-accent-subtle border-accent-border text-accent-text"
                : "border-transparent text-text-secondary hover:text-text-primary hover:border-border-default",
            ].join(" ")}
          >
            {isEditing ? "Done" : "Edit"}
          </button>
        </div>
      </div>

      {/* ── Presets ── */}
      <div className="px-4 pt-3 pb-2.5 flex items-center gap-x-3 gap-y-2 flex-wrap border-b border-border-subtle">
        <span className="text-xs text-text-ghost shrink-0 select-none">
          Presets
        </span>
        {SKILL_PRESETS.map((preset) => (
          <button
            type="button"
            key={preset.id}
            onClick={() => onApplyPreset(preset)}
            className="px-2 py-0.5 rounded text-xs border border-border-default text-text-tertiary hover:border-border-strong hover:text-text-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-elevated"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* ── Category rows ── */}
      <div className="px-4 py-3 flex flex-col gap-3">
        {categories.map((category) => (
          <CategoryRow
            key={category.id}
            category={category}
            selectedSkills={selectedSkills}
            isEditing={isEditing}
            onToggleSkill={onToggleSkill}
            onRemoveSkill={onRemoveSkill}
            onRemoveCategory={onRemoveCategory}
            onAddSkill={onAddSkill}
            newSkillInput={newSkillInputs[category.id] ?? ""}
            onNewSkillInputChange={handleNewSkillInputChange}
          />
        ))}

        {/* ── Add category (edit mode only) ── */}
        {isEditing && (
          <div className="flex items-center gap-2 pt-2 border-t border-border-subtle">
            <input
              type="text"
              value={newCategoryLabel}
              onChange={(e) => setNewCategoryLabel(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  commitNewCategory();
                }
              }}
              placeholder="New category name…"
              aria-label="New skill category name"
              className="flex-1 px-2 py-0.5 rounded text-xs border border-dashed border-border-default bg-transparent text-text-secondary placeholder:text-text-ghost focus:outline-none focus:border-accent transition-colors"
            />
            <button
              type="button"
              onClick={commitNewCategory}
              className="px-2 py-0.5 rounded text-xs border border-border-default text-text-tertiary hover:border-border-strong hover:text-text-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-elevated"
            >
              Add
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
