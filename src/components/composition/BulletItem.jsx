import { useState, useRef, useEffect } from "react";
import { TAG_LABEL } from "../../utils/tags";

/**
 * BulletItem
 *
 * Props:
 *   bullet      { id, content, tags[] }
 *   isSelected  boolean
 *   content     string — resolved content (may be an edited override)
 *   onToggle    (id) => void
 *   onEdit      (id, content) => void
 *   activeTag   string | null — when set, bullets that don't include this tag are dimmed
 */
export default function BulletItem({
  bullet,
  isSelected,
  content,
  onToggle,
  onEdit,
  activeTag,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef(null);

  // isEditing is only meaningful while the bullet is selected
  const effectiveIsEditing = isSelected && isEditing;

  // Dim this bullet when a filter is active and it doesn't match
  const isDimmed =
    activeTag !== null && !(bullet.tags ?? []).includes(activeTag);

  // Auto-resize textarea and move cursor to end when entering edit mode
  useEffect(() => {
    if (effectiveIsEditing && textareaRef.current) {
      const el = textareaRef.current;
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
    }
  }, [effectiveIsEditing]);

  function handleRowClick() {
    if (!isSelected) {
      onToggle(bullet.id);
    } else if (!effectiveIsEditing) {
      setIsEditing(true);
    }
  }

  function handleRowKeyDown(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleRowClick();
    }
  }

  function handleTextareaChange(e) {
    onEdit(bullet.id, e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  }

  function handleTextareaKeyDown(e) {
    if (e.key === "Escape") {
      setIsEditing(false);
    }
  }

  function handleTextareaBlur() {
    setIsEditing(false);
  }

  function handleCheckboxClick(e) {
    e.stopPropagation();
    // Reset edit mode immediately on deselection so that re-selecting this bullet
    // later starts in read mode, not edit mode.
    if (isSelected) setIsEditing(false);
    onToggle(bullet.id);
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleRowClick}
      onKeyDown={handleRowKeyDown}
      aria-pressed={isSelected}
      className={[
        "flex items-start gap-2 p-3 rounded-md transition-[color,background-color,border-color,opacity] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-elevated",
        isSelected
          ? "bg-accent-subtle border border-accent-border cursor-text"
          : "border border-transparent hover:bg-overlay cursor-pointer",
        isDimmed ? "opacity-35" : "opacity-100",
      ].join(" ")}
    >
      {/* Checkbox */}
      <button
        type="button"
        onClick={handleCheckboxClick}
        tabIndex={-1}
        className={[
          "w-3.5 h-3.5 rounded shrink-0 mt-0.5 flex items-center justify-center transition-colors",
          isSelected
            ? "bg-accent border-0"
            : "border border-border-strong bg-transparent",
        ].join(" ")}
        aria-label={isSelected ? "Deselect bullet" : "Select bullet"}
      >
        {isSelected && (
          <svg
            width="8"
            height="8"
            viewBox="0 0 10 10"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M2 5l2.5 2.5L8 3"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {/* Content + tags */}
      <div className="flex-1 min-w-0">
        {/* Edit mode or read mode */}
        {effectiveIsEditing ? (
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleTextareaChange}
            onKeyDown={handleTextareaKeyDown}
            onBlur={handleTextareaBlur}
            onClick={(e) => e.stopPropagation()}
            rows={1}
            aria-label="Edit bullet content"
            className="w-full text-sm text-accent-text leading-relaxed bg-transparent border-0 border-b border-accent-border resize-none outline-none p-0"
          />
        ) : (
          <span
            className={[
              "text-sm leading-relaxed",
              isSelected ? "text-accent-text" : "text-text-secondary",
            ].join(" ")}
          >
            {content}
          </span>
        )}

        {/* Tag chips — always visible in read mode */}
        {!effectiveIsEditing && bullet.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {bullet.tags.map((tag) => (
              <span
                key={tag}
                className={[
                  "inline-block px-1.5 py-px rounded text-xs leading-tight border transition-colors",
                  isSelected
                    ? "border-accent-border text-accent-text opacity-60"
                    : activeTag === tag
                      ? "border-accent-border text-accent-text"
                      : "border-border-subtle text-text-ghost",
                ].join(" ")}
              >
                {TAG_LABEL[tag] ?? tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
