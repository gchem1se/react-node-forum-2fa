import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import securityPlugin from "eslint-plugin-security"; // added security-related static checks

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js, securityPlugin },
    extends: ["js/recommended", "securityPlugin/recommended"], // added security-related static checks
    rules: {
      strict: ["error", "global"], // enforce 'use strict' in every file
    },
  },
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: { globals: globals.node }, // this makes sure eslint knows we're on Node (e.g. `process` exists)
  },
]);
