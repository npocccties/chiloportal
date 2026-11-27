import js from "@eslint/js";
import canonical from "eslint-plugin-canonical";
import next from "eslint-config-next";
import prettier from "eslint-config-prettier/flat";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

const eslintConfig = defineConfig([
  globalIgnores(["api/**/*.ts"]),
  ...next,
  tseslint.config(
    js.configs.recommended,
    tseslint.configs.recommended,
    {
      rules: {
        "@typescript-eslint/no-unused-vars": [
          "error",
          { argsIgnorePattern: "^_" },
        ],
      },
    },
    {
      plugins: { canonical },
    },
  ),
  {
    files: ["pages/_app.tsx"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    files: ["*/**/*.{ts,tsx}"],
    rules: {
      "canonical/filename-match-exported": ["error", { transforms: "kebab" }],
    },
  },
  {
    files: ["{components,templates}/**/*.tsx"],
    rules: {
      "canonical/filename-match-exported": ["error", { transforms: "pascal" }],
    },
  },
  {
    files: ["pages/**/*.{ts,tsx}"],
    rules: {
      "canonical/filename-match-exported": "off",
    },
  },
  prettier,
]);

export default eslintConfig;
