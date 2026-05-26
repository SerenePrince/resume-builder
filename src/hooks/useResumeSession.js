/**
 * useResumeSession.js
 *
 * Central state hook for the resume builder. Owns all session state and exposes
 * stable action callbacks and derived helpers to the rest of the app.
 *
 * State shape:
 *   selectedBullets  Set<string>          — IDs of bullets the user has toggled on
 *   editedBullets    Map<string, string>  — bulletId → edited text (only when changed)
 *   skillCategories  {id,label,skills}[]  — current skill categories (editable; starts from JSON)
 *   selectedSkills   Map<string, Set>     — categoryId → Set of selected skill strings
 *   customTitle      string               — professional title shown in the header contact line
 *   customLocation   string               — location shown in the header contact line
 *   nameSize         number               — name font size in pt (16 | 18 | 20)
 *   bodySize         number               — body font size in pt (9 | 9.5 | 10 | 10.5 | 11)
 *   lineSpacing      number               — line height multiplier (1.0 | 1.1 | 1.2 | 1.3)
 *
 * The hook is the single source of truth for resumeData; components receive it via
 * session.data rather than importing the JSON directly.
 */
import { useReducer, useCallback, useState } from "react";
import resumeData from "../data/resumeData.json";
import { exportDocx } from "../utils/exportDocx";

function buildInitialState() {
  return {
    selectedBullets: new Set(),
    editedBullets: new Map(),
    skillCategories: resumeData.skillCategories,
    selectedSkills: new Map(
      resumeData.skillCategories.map((cat) => [cat.id, new Set()]),
    ),
    customTitle: "Full Stack Developer",
    customLocation: resumeData.meta.location,
    nameSize: 18,
    bodySize: 10,
    lineSpacing: 1.3,
  };
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

function reducer(state, action) {
  switch (action.type) {
    case "TOGGLE_BULLET": {
      const next = new Set(state.selectedBullets);
      if (next.has(action.id)) {
        next.delete(action.id);
        // Also drop any edit for this bullet when deselecting
        const edits = new Map(state.editedBullets);
        edits.delete(action.id);
        return { ...state, selectedBullets: next, editedBullets: edits };
      } else {
        next.add(action.id);
        return { ...state, selectedBullets: next };
      }
    }

    case "EDIT_BULLET": {
      const edits = new Map(state.editedBullets);
      edits.set(action.id, action.content);
      return { ...state, editedBullets: edits };
    }

    case "TOGGLE_SKILL": {
      const catSkills = new Set(state.selectedSkills.get(action.categoryId));
      if (catSkills.has(action.skill)) {
        catSkills.delete(action.skill);
      } else {
        catSkills.add(action.skill);
      }
      const nextSkills = new Map(state.selectedSkills);
      nextSkills.set(action.categoryId, catSkills);
      return { ...state, selectedSkills: nextSkills };
    }

    case "APPLY_PRESET": {
      const cats = action.categories;
      return {
        ...state,
        skillCategories: cats,
        selectedSkills: new Map(
          cats.map((cat) => [cat.id, new Set(cat.skills)]),
        ),
      };
    }

    case "ADD_CATEGORY": {
      const newCat = { id: action.id, label: action.label, skills: [] };
      const newSelectedSkills = new Map(state.selectedSkills);
      newSelectedSkills.set(action.id, new Set());
      return {
        ...state,
        skillCategories: [...state.skillCategories, newCat],
        selectedSkills: newSelectedSkills,
      };
    }

    case "REMOVE_CATEGORY": {
      const newSelectedSkills = new Map(state.selectedSkills);
      newSelectedSkills.delete(action.id);
      return {
        ...state,
        skillCategories: state.skillCategories.filter(
          (c) => c.id !== action.id,
        ),
        selectedSkills: newSelectedSkills,
      };
    }

    case "ADD_SKILL": {
      const target = state.skillCategories.find(
        (c) => c.id === action.categoryId,
      );
      if (!target || target.skills.includes(action.skill)) return state;
      return {
        ...state,
        skillCategories: state.skillCategories.map((c) =>
          c.id === action.categoryId
            ? { ...c, skills: [...c.skills, action.skill] }
            : c,
        ),
      };
    }

    case "REMOVE_SKILL": {
      const catSet = new Set(state.selectedSkills.get(action.categoryId));
      catSet.delete(action.skill);
      const newSelectedSkills = new Map(state.selectedSkills);
      newSelectedSkills.set(action.categoryId, catSet);
      return {
        ...state,
        skillCategories: state.skillCategories.map((c) =>
          c.id === action.categoryId
            ? { ...c, skills: c.skills.filter((s) => s !== action.skill) }
            : c,
        ),
        selectedSkills: newSelectedSkills,
      };
    }

    case "SET_TITLE":
      return { ...state, customTitle: action.title };

    case "SET_LOCATION":
      return { ...state, customLocation: action.location };

    case "SET_NAME_SIZE":
      return { ...state, nameSize: action.size };

    case "SET_BODY_SIZE":
      return { ...state, bodySize: action.size };

    case "SET_LINE_SPACING":
      return { ...state, lineSpacing: action.spacing };

    case "RESET":
      return buildInitialState();

    default:
      return state;
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useResumeSession() {
  const [state, dispatch] = useReducer(reducer, null, buildInitialState);

  const toggleBullet = useCallback(
    (id) => dispatch({ type: "TOGGLE_BULLET", id }),
    [],
  );

  const editBullet = useCallback(
    (id, content) => dispatch({ type: "EDIT_BULLET", id, content }),
    [],
  );

  const toggleSkill = useCallback(
    (categoryId, skill) =>
      dispatch({ type: "TOGGLE_SKILL", categoryId, skill }),
    [],
  );

  const reset = useCallback(() => dispatch({ type: "RESET" }), []);

  const applyPreset = useCallback(
    (preset) =>
      dispatch({ type: "APPLY_PRESET", categories: preset.categories }),
    [],
  );

  const addCategory = useCallback((label) => {
    dispatch({ type: "ADD_CATEGORY", id: `custom-${Date.now()}`, label });
  }, []);

  const removeCategory = useCallback(
    (id) => dispatch({ type: "REMOVE_CATEGORY", id }),
    [],
  );

  const addSkill = useCallback(
    (categoryId, skill) => dispatch({ type: "ADD_SKILL", categoryId, skill }),
    [],
  );

  const removeSkill = useCallback(
    (categoryId, skill) =>
      dispatch({ type: "REMOVE_SKILL", categoryId, skill }),
    [],
  );

  const setCustomTitle = useCallback(
    (title) => dispatch({ type: "SET_TITLE", title }),
    [],
  );

  const setCustomLocation = useCallback(
    (location) => dispatch({ type: "SET_LOCATION", location }),
    [],
  );

  const setNameSize = useCallback(
    (size) => dispatch({ type: "SET_NAME_SIZE", size }),
    [],
  );

  const setBodySize = useCallback(
    (size) => dispatch({ type: "SET_BODY_SIZE", size }),
    [],
  );

  const setLineSpacing = useCallback(
    (spacing) => dispatch({ type: "SET_LINE_SPACING", spacing }),
    [],
  );

  // Resolves the display content for a bullet — edited version takes priority
  const getBulletContent = useCallback(
    (bullet) => state.editedBullets.get(bullet.id) ?? bullet.content,
    [state.editedBullets],
  );

  // Returns selected skills per category as an array of { label, skills[] } objects
  // Only includes categories that have at least one skill selected
  const getSelectedSkillRows = useCallback(() => {
    return state.skillCategories
      .map((cat) => ({
        label: cat.label,
        skills: [...(state.selectedSkills.get(cat.id) ?? [])],
      }))
      .filter((row) => row.skills.length > 0);
  }, [state.skillCategories, state.selectedSkills]);

  // True if no skills are selected across any category
  const hasNoSkills = useCallback(() => {
    return [...state.selectedSkills.values()].every((s) => s.size === 0);
  }, [state.selectedSkills]);

  const [isExporting, setIsExporting] = useState(false);

  const handleExport = useCallback(async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      await exportDocx({
        state,
        data: resumeData,
        getBulletContent,
        getSelectedSkillRows,
        customTitle: state.customTitle,
        customLocation: state.customLocation,
        nameSize: state.nameSize,
        bodySize: state.bodySize,
        lineSpacing: state.lineSpacing,
      });
    } finally {
      setIsExporting(false);
    }
  }, [state, getBulletContent, getSelectedSkillRows, isExporting]);

  return {
    // Raw state (needed by composition components for checked/selected status)
    selectedBullets: state.selectedBullets,
    selectedSkills: state.selectedSkills,
    editedBullets: state.editedBullets,
    skillCategories: state.skillCategories,
    customTitle: state.customTitle,
    customLocation: state.customLocation,
    nameSize: state.nameSize,
    bodySize: state.bodySize,
    lineSpacing: state.lineSpacing,

    // Actions
    toggleBullet,
    editBullet,
    toggleSkill,
    applyPreset,
    addCategory,
    removeCategory,
    addSkill,
    removeSkill,
    setCustomTitle,
    setCustomLocation,
    setNameSize,
    setBodySize,
    setLineSpacing,
    reset,
    export: handleExport,
    isExporting,

    // Derived helpers
    getBulletContent,
    getSelectedSkillRows,
    hasNoSkills,

    // The source data — components read from here rather than importing directly
    data: resumeData,
  };
}
