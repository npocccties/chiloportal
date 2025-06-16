import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import canonical from "eslint-plugin-canonical";
import prettier from "eslint-config-prettier/flat";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

const eslintConfig = defineConfig([
  globalIgnores(["api/**/*.ts"]),
  compat.config({ extends: ["next"] }),
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
