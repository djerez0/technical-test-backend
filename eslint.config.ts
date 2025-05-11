import path from "node:path";

import eslint from "@eslint/js";
import prettierRecommended from "eslint-plugin-prettier/recommended";
import simpleImportSortPlugin from "eslint-plugin-simple-import-sort";
import tseslint from "typescript-eslint";

const tsconfigPath = path.join(__dirname, "tsconfig.json");

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.recommended,
  prettierRecommended,
  {
    plugins: {
      "simple-import-sort": simpleImportSortPlugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: tsconfigPath,
        ecmaVersion: 2020,
        sourceType: "module",
      },
      globals: {
        process: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        console: "readonly",
        module: "readonly",
        require: "readonly",
      },
    },
    rules: {
      "prettier/prettier": "error",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-return": "warn",
      "no-console": ["warn", { allow: ["warn", "error", "info"] }],
      "no-duplicate-imports": "error",
      "prefer-const": "error",
      "no-var": "error",
      eqeqeq: ["error", "always"],
      "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 1 }],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports" },
      ],
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-empty-function": [
        "error",
        { allow: ["constructors"] },
      ],
      "@typescript-eslint/await-thenable": "off",
      "no-self-assign": "error",
      "no-useless-return": "error",
      "id-length": [
        "warn",
        { min: 2, exceptions: ["i", "j", "k", "x", "y", "z"] },
      ],
      "import/order": "off",
      "sort-imports": "off",
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "no-trailing-spaces": "error",
      "space-before-blocks": ["error", "always"],
      "space-infix-ops": "error",
      "object-curly-spacing": ["error", "always"],
      "@typescript-eslint/no-unsafe-argument": "off",
    },
    ignores: [
      "node_modules/**",
      "dist/**",
      "coverage/**",
      "build/**",
      ".idea/**",
      ".vscode/**",
      "**/*.log",
    ],
  },
);
