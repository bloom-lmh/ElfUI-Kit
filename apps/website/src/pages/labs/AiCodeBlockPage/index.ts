import { defineHtml, defineStyle, useRef, useTemplateRef } from "@elfui/core";

import type { AiCodeBlockElement } from "@elfui/kit";
import { createDocsTranslator } from "../../docsLocale";
import articleStyles from "../../shared/article.scss?inline";

const t = createDocsTranslator({
  kicker: { zh: "实验室组件", en: "Labs component" },
  title: { zh: "AI Code Block 代码流", en: "AI Code Block" },
  description: {
    zh: "Agent 逐行流式输出的代码块：行号、状态徽标、复制按钮与完成事件。",
    en: "Agent-written code streaming line by line with line numbers, a status badge, copy, and a complete event.",
  },
  warning: {
    zh: "实验性 API：流式状态机可能在稳定版前调整。",
    en: "Experimental API: the streaming state machine may change before stabilization.",
  },
  demo: { zh: "流式生成代码", en: "Streaming code" },
  terminalDemo: { zh: "深色终端风格", en: "Dark terminal style" },
  terminalCode: {
    zh: "固定深色语法主题，适合放入 Agent 控制台或日志面板。",
    en: "Fixed dark syntax theme, ideal for agent consoles and log panels.",
  },
  status: { zh: "状态", en: "Status" },
  streaming: { zh: "流式中", en: "Streaming" },
  complete: { zh: "已完成", en: "Complete" },
  restart: { zh: "重新播放", en: "Replay" },
  reveal: { zh: "立即完成", en: "Reveal all" },
  api: { zh: "API", en: "API" },
  props: { zh: "属性", en: "Props" },
  events: { zh: "事件", en: "Events" },
  expose: { zh: "方法", en: "Methods" },
  codeDesc: { zh: "完整源码。", en: "Full source code." },
  filenameDesc: { zh: "文件名。", en: "Filename." },
  languageDesc: { zh: "语言标签。", en: "Language label." },
  statusDesc: {
    zh: "idle / streaming / complete / error。",
    en: "idle / streaming / complete / error.",
  },
  speedDesc: { zh: "每行流式间隔毫秒数。", en: "Milliseconds between revealed lines." },
  themeDesc: { zh: "auto / light / dark 语法配色方案。", en: "auto / light / dark syntax scheme." },
  codeThemeDesc: {
    zh: "github / vitesse / material 调色板。",
    en: "github / vitesse / material palette.",
  },
  lineNumbersDesc: { zh: "显示行号。", en: "Shows line numbers." },
  copyableDesc: { zh: "显示复制按钮。", en: "Shows the copy action." },
  labelsDesc: { zh: "文案覆盖。", en: "Label overrides." },
  ariaLabelDesc: { zh: "无障碍标签。", en: "Accessible label." },
  completeEvent: { zh: "全部行已展示。", en: "All lines are revealed." },
  copyEvent: { zh: "复制源码。", en: "Copies the source." },
  copyErrorEvent: { zh: "复制失败。", en: "Copy failed." },
  copyMethod: { zh: "复制完整源码。", en: "Copies the full source." },
  revealMethod: { zh: "立即展示全部行。", en: "Reveals every line immediately." },
  resetMethod: { zh: "重置为未开始。", en: "Resets to the start." },
});

const blockStatus = useRef<"streaming" | "complete">("streaming");
const blockEl = useTemplateRef<AiCodeBlockElement>("block");
const onReplay = (): void => {
  blockStatus.set("streaming");
  blockEl.value?.reset?.();
};

const source = `export async function churnBatch() {
  const flavor = await getFlavor("pistachio");
  const base = await dairy.fetch({ flavor });
  await freezer.store(base, { temp: "-14C" });
  return base.gallons;
}`;

const code = `<elf-ai-code-block
  code="const a = 1;\\nconst b = 2;"
  filename="churn.ts"
  language="TypeScript"
  status="streaming"
  @complete="onComplete"
/>`;
const script = `const status = ref("streaming");
const onComplete = () => {
  status.value = "complete";
};`;

const terminalCode = `<elf-ai-code-block
  code="export async function churnBatch() { ... }"
  filename="churn.ts"
  language="typescript"
  status="complete"
  theme="dark"
  code-theme="github"
/>`;

const propRows = () => [
  { name: "code", type: "string", default: "''", desc: t("codeDesc") },
  { name: "filename", type: "string", default: "''", desc: t("filenameDesc") },
  { name: "language", type: "string", default: "'typescript'", desc: t("languageDesc") },
  { name: "status", type: "AiCodeBlockStatus", default: "'idle'", desc: t("statusDesc") },
  { name: "stream-speed", type: "number", default: "45", desc: t("speedDesc") },
  { name: "theme", type: "'auto' | 'light' | 'dark'", default: "'auto'", desc: t("themeDesc") },
  {
    name: "code-theme",
    type: "'github' | 'vitesse' | 'material'",
    default: "'github'",
    desc: t("codeThemeDesc"),
  },
  { name: "show-line-numbers", type: "boolean", default: "true", desc: t("lineNumbersDesc") },
  { name: "copyable", type: "boolean", default: "true", desc: t("copyableDesc") },
  { name: "labels", type: "Partial<AiCodeBlockLabels>", default: "{}", desc: t("labelsDesc") },
  { name: "aria-label", type: "string", default: "'Code'", desc: t("ariaLabelDesc") },
];

const eventRows = () => [
  { name: "complete", type: "CustomEvent<void>", default: "—", desc: t("completeEvent") },
  { name: "copy", type: "CustomEvent<AiCodeBlockCopyDetail>", default: "—", desc: t("copyEvent") },
  { name: "copy-error", type: "CustomEvent<unknown>", default: "—", desc: t("copyErrorEvent") },
];

const exposeRows = () => [
  { name: "copy", desc: t("copyMethod") },
  { name: "revealAll", desc: t("revealMethod") },
  { name: "reset", desc: t("resetMethod") },
];

defineStyle(
  articleStyles,
  `
  elf-playground.code-playground {
    --elf-playground-demo-padding: 6px 10px;
  }
  .ai-code-stage { width: min(100%, 720px); }
    .ai-code-actions {
      display: flex;
      gap: 8px;
      margin-top: 8px;
    }
  .ai-code-actions button {
    padding: 6px 12px;
    border: 1px solid var(--elf-border, #d7dee8);
    border-radius: 8px;
    background: var(--elf-bg-paper, #fff);
    color: var(--elf-text-secondary, #64748b);
    cursor: pointer;
    font: 600 12px/1.4 var(--elf-font-family, sans-serif);
  }
  .ai-code-terminal {
    width: min(100%, 720px);
    padding: 10px;
    border: 1px solid #1f2a24;
    border-radius: 12px;
    background: #0b0f0d;
    box-shadow: 0 18px 50px rgb(0 0 0 / 0.28);
  }
  .ai-code-terminal elf-ai-code-block {
    --elf-bg-paper: #101512;
    --elf-border: #1f2a24;
    --elf-bg-overlay: #0d120f;
    --elf-text-primary: #d7e3da;
    --elf-text-secondary: #7f978a;
    --elf-text-disabled: #4d6257;
    --elf-divider: #18211c;
    --elf-primary: #3ddc84;
    --elf-success: #3ddc84;
    --elf-danger: #f87171;
  }
  `,
);

const PageLabsAiCodeBlock = defineHtml(`
  <elf-container class="docs-article">
    <elf-docs-hero category="labs" tag="AI Code Block" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <p class="docs-callout is-warning labs-warning">${t("warning")}</p>
    <elf-playground class="code-playground" :title=${t("demo")} :code=${code} :script=${script}>
      <span slot="status">${t("status")}: ${blockStatus.value === "streaming" ? t("streaming") : t("complete")}</span>
      <div class="ai-code-stage">
        <elf-ai-code-block
          ref="block"
          :code=${source}
          filename="churn.ts"
          language="TypeScript"
          :status=${blockStatus.value}
          :stream-speed.prop=${70}
          @complete=${() => blockStatus.set("complete")}
        ></elf-ai-code-block>
        <div class="ai-code-actions">
          <button @click=${onReplay}>${t("restart")}</button>
          <button @click=${() => blockEl.value?.revealAll?.()}>${t("reveal")}</button>
        </div>
      </div>
    </elf-playground>
    <h2>${t("terminalDemo")}</h2>
    <elf-playground class="code-playground" :title=${t("terminalDemo")} :code=${terminalCode} :script=${script}>
      <span slot="status">${t("status")}: ${t("complete")}</span>
      <div class="ai-code-terminal">
        <elf-ai-code-block
          :code=${source}
          filename="churn.ts"
          language="typescript"
          status="complete"
          theme="dark"
          code-theme="github"
        ></elf-ai-code-block>
      </div>
    </elf-playground>
    <elf-api-builder component="elf-ai-code-block" title="API">
    <elf-props-table role="props" :title=${t("props")} :rows=${propRows()}></elf-props-table>
    <elf-props-table role="events" :title=${t("events")} :rows=${eventRows()}></elf-props-table>
    <elf-props-table role="methods" :title=${t("expose")} :rows=${exposeRows()}></elf-props-table>
  </elf-api-builder>
  </elf-container>
`);

export { PageLabsAiCodeBlock };
