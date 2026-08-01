export default {
  "*.{js,mjs,cjs,ts,tsx}": [
    "prettier --write",
    "eslint --fix --max-warnings=0 --no-warn-ignored",
    "cspell --no-progress --no-summary",
  ],
  "*.{md,scss,css,html}": ["prettier --write", "cspell --no-progress --no-summary"],
  "*.{json,yaml,yml}": "prettier --write",
};
