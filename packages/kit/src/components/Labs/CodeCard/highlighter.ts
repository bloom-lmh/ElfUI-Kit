// cspell:ignore shiki vitesse palenight

import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import bash from "shiki/langs/bash.mjs";
import css from "shiki/langs/css.mjs";
import html from "shiki/langs/html.mjs";
import javascript from "shiki/langs/javascript.mjs";
import json from "shiki/langs/json.mjs";
import markdown from "shiki/langs/markdown.mjs";
import scss from "shiki/langs/scss.mjs";
import typescript from "shiki/langs/typescript.mjs";
import vue from "shiki/langs/vue.mjs";
import githubDark from "shiki/themes/github-dark.mjs";
import githubLight from "shiki/themes/github-light.mjs";
import materialDark from "shiki/themes/material-theme-palenight.mjs";
import materialLight from "shiki/themes/material-theme-lighter.mjs";
import vitesseDark from "shiki/themes/vitesse-dark.mjs";
import vitesseLight from "shiki/themes/vitesse-light.mjs";

export type CodeCardHighlighter = Awaited<ReturnType<typeof createHighlighterCore>>;

/** Creates the single grammar and theme owner shared by all CodeCard instances. */
export const createCodeCardHighlighter = (): Promise<CodeCardHighlighter> =>
  createHighlighterCore({
    langs: [javascript, typescript, html, vue, css, scss, json, markdown, bash],
    themes: [githubLight, githubDark, vitesseLight, vitesseDark, materialLight, materialDark],
    engine: createJavaScriptRegexEngine(),
  });
