import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  // If deploying to GitHub Pages, set base to your repo name:
  //   base: "/resume-builder/",
  // Leave as "/" (the default) for local dev or a root-path deployment.
});
