/**
 * skillPresets.js
 *
 * Predefined skill category sets aligned with the five role filter tags.
 * Applying a preset replaces all current skill categories and pre-selects
 * every skill in the loaded set — ready to export with no further clicks.
 */

export const SKILL_PRESETS = [
  {
    id: "fullstack",
    label: "Full Stack",
    categories: [
      {
        id: "frontend",
        label: "Frontend",
        skills: ["React", "JavaScript", "Vite", "Tailwind CSS", "HTML/CSS"],
      },
      {
        id: "backend",
        label: "Backend",
        skills: [
          "Java",
          "Spring Boot",
          "Maven",
          "Node.js",
          "REST APIs",
          "Thymeleaf",
        ],
      },
      {
        id: "databases",
        label: "Databases",
        skills: ["PostgreSQL", "SQL"],
      },
      {
        id: "tools",
        label: "Developer Tools",
        skills: ["Git", "Docker", "Linux/Ubuntu"],
      },
    ],
  },
  {
    id: "frontend",
    label: "Frontend",
    categories: [
      {
        id: "frontend",
        label: "Frontend",
        skills: ["React", "JavaScript", "Vite", "Tailwind CSS", "HTML/CSS"],
      },
      {
        id: "databases",
        label: "Databases",
        skills: ["PostgreSQL", "SQL"],
      },
      {
        id: "tools",
        label: "Developer Tools",
        skills: ["Git", "Docker", "Linux/Ubuntu"],
      },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    categories: [
      {
        id: "backend",
        label: "Backend",
        skills: [
          "Java",
          "Spring Boot",
          "Maven",
          "Node.js",
          "REST APIs",
          "Thymeleaf",
        ],
      },
      {
        id: "testing",
        label: "Testing",
        skills: ["JUnit", "Azure DevOps", "Manual Testing", "Agile"],
      },
      {
        id: "databases",
        label: "Databases",
        skills: ["PostgreSQL", "SQL"],
      },
      {
        id: "tools",
        label: "Developer Tools",
        skills: ["Git", "Docker", "Linux/Ubuntu"],
      },
    ],
  },
  {
    id: "power-platform",
    label: "Power Platform",
    categories: [
      {
        id: "power-platform",
        label: "Power Platform",
        skills: ["Power Apps", "Power Automate", "Power BI"],
      },
      {
        id: "microsoft",
        label: "Microsoft 365",
        skills: ["SharePoint", "Azure DevOps"],
      },
      {
        id: "databases",
        label: "Databases",
        skills: ["PostgreSQL", "SQL"],
      },
      {
        id: "tools",
        label: "Developer Tools",
        skills: ["Git", "Docker", "Linux/Ubuntu"],
      },
    ],
  },
  {
    id: "testing",
    label: "Testing",
    categories: [
      {
        id: "testing",
        label: "Testing",
        skills: ["JUnit", "Azure DevOps", "Manual Testing", "Agile"],
      },
      {
        id: "languages",
        label: "Languages",
        skills: ["Java", "JavaScript"],
      },
      {
        id: "tools",
        label: "Developer Tools",
        skills: ["Git", "Docker", "Linux/Ubuntu"],
      },
    ],
  },
];
