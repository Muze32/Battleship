import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  {
    files: ["webpack.common.js", "webpack.dev.js", "webpack.prod.js"],
    languageOptions: {
      globals: globals.node,
      sourceType: "script",
    },
  },
];
