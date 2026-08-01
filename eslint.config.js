import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";
import tseslint from "typescript-eslint";

const camelize = (value) =>
  value.replace(/-([a-zA-Z0-9_$])/g, (_match, character) => character.toUpperCase());

const pascalize = (value) => {
  const camelized = camelize(value);
  return camelized.charAt(0).toUpperCase() + camelized.slice(1);
};

/**
 * Collects TypeScript bindings referenced by an ElfUI raw macro template.
 *
 * @param template - The static portions of a `defineHtml` template literal.
 * @returns Candidate bindings for ESLint scope resolution.
 */
const templateNames = (template) => {
  const names = new Set(template.match(/[A-Za-z_$][\w$]*/g) ?? []);
  const kebabNames = template.match(/[A-Za-z_$][\w$]*(?:-[A-Za-z0-9_$]+)+/g) ?? [];

  for (const value of kebabNames) {
    names.add(camelize(value));
    if (value.startsWith("v-")) names.add(camelize(value.slice(2)));
    if (value.startsWith("elf-")) names.add(pascalize(value.slice(4)));
  }

  return names;
};

const elfuiMacroPlugin = {
  rules: {
    "template-uses": {
      meta: {
        type: "problem",
        docs: {
          description: "Mark setup bindings referenced by ElfUI defineHtml templates as used.",
        },
        schema: [],
      },
      create(context) {
        return {
          "CallExpression[callee.name='defineHtml'] > TemplateLiteral"(node) {
            const sourceCode = context.sourceCode;
            const template = node.quasis.map((quasi) => quasi.value.raw).join(" ");
            for (const name of templateNames(template)) {
              sourceCode.markVariableAsUsed(name, node);
            }
          },
        };
      },
    },
  },
};

export default tseslint.config(
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "lib-dist/**",
      "coverage/**",
      "output/**",
      ".playwright-cli/**",
      "docs/screenshots/**",
      "public/**",
      "src/elements.generated.d.ts",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts,tsx}"],
    plugins: {
      "elfui-macro": elfuiMacroPlugin,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      "elfui-macro/template-uses": "error",
      "no-constant-binary-expression": "error",
      "no-unused-private-class-members": "error",
      "no-unreachable-loop": "error",
      "no-useless-assignment": "off",
      "prefer-const": "error",
      "@typescript-eslint/ban-ts-comment": [
        "error",
        {
          "ts-check": false,
          "ts-expect-error": "allow-with-description",
          "ts-ignore": "allow-with-description",
          "ts-nocheck": "allow-with-description",
          minimumDescriptionLength: 10,
        },
      ],
      "@typescript-eslint/no-empty-object-type": [
        "error",
        { allowInterfaces: "with-single-extends" },
      ],
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    files: [
      "scripts/**/*.playwright.js",
      "**/*.test.ts",
      "**/*.test-component.ts",
      "*.config.{js,mjs,cjs,ts}",
    ],
    rules: {
      "no-console": "off",
      "@typescript-eslint/no-this-alias": "off",
    },
  },
  {
    files: ["scripts/**/*.playwright.js"],
    rules: {
      "@typescript-eslint/no-unused-expressions": "off",
    },
  },
  eslintConfigPrettier,
);
