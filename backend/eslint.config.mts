// import js from "@eslint/js";
// import globals from "globals";
// import tseslint from "typescript-eslint";
// import pluginReact from "eslint-plugin-react";
// import { defineConfig } from "eslint/config";

// export default defineConfig([
//   {
//     files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
//     plugins: { js }, extends: ["js/recommended"],
//     languageOptions: { globals: globals.browser }
//   },
//   tseslint.configs.recommended,
//   pluginReact.configs.flat.recommended,
//   { ignores: ["dist/**", "node_modules/**"] }
// ]);

import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx,js}"],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    ignores: ["dist/**", "node_modules/**"],
  },
]);