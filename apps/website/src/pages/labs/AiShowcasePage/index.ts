import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import articleStyles from "../../shared/article.scss?inline";

const t = createDocsTranslator({
  kicker: { zh: "实验室案例", en: "Labs showcase" },
  title: { zh: "AI 案例秀", en: "AI Showcase" },
  description: {
    zh: "同一套 AI 组件在不同风格下的完整案例：霓虹暗夜、终端、奶油纸感、午夜高对比与渐变边框，全部通过 CSS 变量换肤。",
    en: "Complete AI component cases in different styles — neon night, terminal, cream paper, midnight, and gradient — all reskinned through CSS variables.",
  },
  warning: {
    zh: "案例仅演示换肤与组合方式，组件 API 仍为实验性。",
    en: "Cases demonstrate theming and composition; component APIs remain experimental.",
  },
  neon: { zh: "霓虹暗夜", en: "Neon night" },
  neonDesc: {
    zh: "深色玻璃质感 + 青色霓虹强调色，适合夜间模式的 Agent 工作台。",
    en: "Dark glass with a cyan neon accent, ideal for night-mode agent consoles.",
  },
  terminal: { zh: "终端风格", en: "Terminal" },
  terminalDesc: {
    zh: "等宽字体 + 终端绿强调色，配合流式代码块和工具胶囊。",
    en: "Monospace type, terminal-green accents, streaming code, and tool chips.",
  },
  cream: { zh: "奶油纸感", en: "Cream paper" },
  creamDesc: {
    zh: "暖白纸感底色 + 琥珀强调色与大圆角，适合轻量业务工具。",
    en: "Warm paper tones with amber accents and large radii for lightweight business tools.",
  },
  midnight: { zh: "午夜高对比", en: "Midnight" },
  midnightDesc: {
    zh: "深靛蓝底 + 高对比文字，适合数据密集型洞察场景。",
    en: "Deep indigo with high-contrast text for data-dense insights.",
  },
  gradient: { zh: "渐变边框", en: "Gradient frame" },
  gradientDesc: {
    zh: "白底 + 渐变描边卡片，适合展示型与营销型界面。",
    en: "White surfaces with gradient-bordered cards for showcase interfaces.",
  },
});

const recommendationSegments = [
  { text: "Reorder waffle cones from " },
  { text: "cone_king", code: true },
  { text: " with lead time " },
  { text: "7_days", code: true },
  { text: "." },
];
const recommendationAlternatives = [
  { label: "Switch to vanilla_madagascar", signal: "Needs review", signalKind: "review" },
  { label: "Full restock across every SKU", signal: "No signal", signalKind: "none" },
];
const contextChunks = [
  {
    title: "Vendor onboarding rule",
    content:
      "Cold-chain certification must be verified before a new dairy can be added to the reorder workflow.",
    characters: 290,
    sourceKind: "pdf",
    sourceName: "Dairy Onboarding SOP.pdf",
  },
  {
    title: "Seasonal demand row",
    content:
      "Q4 velocity table: pistachio +18%, vanilla +6%, rocky road -11%; retire flavors below 40 scoops weekly.",
    characters: 1250,
    sourceKind: "csv",
    sourceName: "Sales Velocity Export.csv",
  },
];

const terminalSource = `export async function churnBatch() {
  const flavor = await getFlavor("pistachio");
  const base = await dairy.fetch({ flavor });
  await freezer.store(base, { temp: "-14C" });
  return base.gallons;
}`;
const toolItems = [
  { id: 1, kind: "think", title: "Planning the churn schedule…", meta: "Thinking" },
  {
    id: 2,
    kind: "edit",
    title: "Write 204 lines",
    detail: "ChurnSchedule.tsx",
    status: "success",
    meta: "Done",
  },
  {
    id: 3,
    kind: "shell",
    title: "Rebuild and verify",
    detail: "npm run freeze",
    status: "success",
    meta: "1.2s",
  },
];
const toolFiles = [
  { name: "ChurnSchedule.tsx", additions: 74, deletions: 41 },
  { name: "menu.ts", additions: 8, deletions: 2 },
];

const approvalQuestions = [
  {
    id: 1,
    title: "How many flavors should we launch?",
    description:
      "Your weekly sales data supports a small core line, but the full case hedges against weekend spikes.",
    options: [
      { label: "Three (core line)", value: "three" },
      { label: "Five (full case)", value: "five" },
      { label: "Just one hero", value: "one" },
    ],
    customPlaceholder: "Type something…",
  },
];
const taskItems = [
  {
    id: 1,
    title: "Verified vendor records",
    subtitle: "12 suppliers",
    status: "completed",
    steps: [
      { label: "Matched tax and contact IDs", detail: "12/12" },
      { label: "Flagged stale records", detail: "0" },
    ],
  },
  {
    id: 2,
    title: "Build reorder task list",
    subtitle: "7 SKUs",
    status: "running",
    steps: [
      { label: "Reading POS export", detail: "3 files" },
      { label: "Scoring stockout risk", detail: "68%" },
    ],
  },
];

const searchItems = [
  { id: 1, title: "Forecast summer demand", description: "Seasonal ice cream", hint: "forecast" },
  {
    id: 2,
    title: "Find waffle cone suppliers",
    description: "Cold-chain verified",
    hint: "supplier",
  },
  {
    id: 3,
    title: "Compare seasonal flavors",
    description: "Mint chip vs pistachio",
    hint: "compare",
  },
];
const insights = [
  {
    id: 1,
    segments: [
      { text: "The worst performer in your " },
      { text: "@Creamery", mention: true },
      { text: " is Rocky Road — down " },
      { text: "-6%", code: true },
    ],
    sparks: [
      { label: "Mint Chip", change: "-4.41%", amount: "-$2,377.66", tone: "bad" },
      { label: "Pistachio", change: "+1.15%", amount: "+$617.22", tone: "good" },
    ],
    cta: "Should I rebalance flavors?",
  },
];

const neonCode = `<elf-ai-recommendation-card
  title="Want me to place this restock order?"
  :segments="segments"
  confidence="high"
  :alternatives="alternatives"
/>

<elf-ai-context-card
  title="Vendor onboarding rule"
  content="Cold-chain certification must be verified…"
  :characters="290"
  source-kind="pdf"
  source-name="Dairy Onboarding SOP.pdf"
/>`;
const terminalCode = `<elf-ai-code-block
  :code="code"
  filename="churn.ts"
  language="typescript"
  status="complete"
  theme="dark"
  code-theme="github"
/>

<elf-ai-tool-chips
  summary="3 tool calls"
  :items="items"
  :files="files"
  default-expanded
/>`;
const creamCode = `<elf-ai-approval-card
  :questions="questions"
/>

<elf-ai-task-row :task="task" default-expanded />`;
const midnightCode = `<elf-ai-command-search
  :items="items"
  placeholder="Search flavors…"
/>

<elf-ai-insight-card :insights="insights" />`;
const gradientCode = `<elf-ai-loading label="Churning" variant="orbit" />

<elf-ai-streaming-text
  content="Pistachio is your fastest-growing flavor — sales are up 23% this month."
  :sources="sources"
  :actions="actions"
  :follow-ups="followUps"
/>`;
const sharedScript = `// 每个案例都可以直接复制使用；
// 外层容器通过覆盖 --elf-* CSS 变量完成整套换肤。`;

defineStyle(
  articleStyles,
  `
  .showcase-stage {
    display: grid;
    gap: 14px;
    width: min(100%, 760px);
    padding: 22px;
    border-radius: 18px;
  }
  .showcase-grid {
    display: grid;
    gap: 14px;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }

  .case-neon {
    border: 1px solid #1c2333;
    background: #0d0f14;
    --elf-bg-paper: rgb(20 24 33 / 0.86);
    --elf-bg-overlay: #151a24;
    --elf-border: #232b3d;
    --elf-divider: #1d2432;
    --elf-text-primary: #eef4ff;
    --elf-text-secondary: #9aa7bd;
    --elf-text-disabled: #5b6578;
    --elf-primary: #00e5ff;
    --elf-primary-hover: #4dedff;
    --elf-success: #2dd4bf;
    --elf-warning: #fbbf24;
    --elf-danger: #fb7185;
    box-shadow: 0 24px 70px rgb(0 229 255 / 0.08);
  }

  .case-terminal {
    border: 1px solid #1c2a21;
    background: #0b0f0d;
    font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
    --elf-font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
    --elf-bg-paper: #0f1411;
    --elf-bg-overlay: #0c110e;
    --elf-border: #1e2b23;
    --elf-divider: #18221b;
    --elf-text-primary: #d7e3da;
    --elf-text-secondary: #7f978a;
    --elf-text-disabled: #4d6257;
    --elf-primary: #3ddc84;
    --elf-primary-hover: #63eda1;
    --elf-success: #3ddc84;
    --elf-warning: #fbbf24;
    --elf-danger: #f87171;
    box-shadow: 0 24px 70px rgb(0 0 0 / 0.35);
  }

  .case-cream {
    border: 1px solid #eadfce;
    background: #faf6ef;
    --elf-bg-paper: #fffdf8;
    --elf-bg-overlay: #f4eee3;
    --elf-border: #e7dcc9;
    --elf-divider: #efe6d8;
    --elf-text-primary: #3d3226;
    --elf-text-secondary: #8a7a66;
    --elf-text-disabled: #bfb09a;
    --elf-primary: #b45309;
    --elf-primary-hover: #d97706;
    --elf-success: #3f8f5d;
    --elf-warning: #d97706;
    --elf-danger: #c2410c;
    border-radius: 22px;
    box-shadow: 0 18px 50px rgb(139 105 55 / 0.12);
  }

  .case-midnight {
    border: 1px solid #232243;
    background: #0a0a12;
    --elf-bg-paper: #11111d;
    --elf-bg-overlay: #161625;
    --elf-border: #242440;
    --elf-divider: #1b1b2e;
    --elf-text-primary: #f3f2ff;
    --elf-text-secondary: #a6a4c9;
    --elf-text-disabled: #5f5e82;
    --elf-primary: #7c6cff;
    --elf-primary-hover: #9b8fff;
    --elf-success: #34d399;
    --elf-warning: #fbbf24;
    --elf-danger: #fb7185;
    box-shadow: 0 24px 70px rgb(124 108 255 / 0.12);
  }

  .case-gradient {
    border: 1px solid #06b6d4;
    background: #fbfbfc;
    --elf-primary: #ea580c;
    --elf-primary-hover: #f97316;
    --elf-success: #0d9488;
    --elf-warning: #d97706;
    --elf-danger: #dc2626;
    border-radius: 22px;
    box-shadow: 0 20px 60px rgb(6 182 212 / 0.12);
  }
  `,
);

const PageLabsAiShowcase = defineHtml(`
  <elf-container class="docs-article">
    <elf-docs-hero category="labs" tag="AI Showcase" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <p class="docs-callout is-warning labs-warning">${t("warning")}</p>

    <h2>${t("neon")}</h2>
    <elf-playground :title=${t("neon")} :code=${neonCode} :script=${sharedScript}>
      <span slot="status">${t("neonDesc")}</span>
      <div class="showcase-stage case-neon" data-theme="dark">
        <elf-ai-recommendation-card
          title="Want me to place this restock order?"
          :segments=${recommendationSegments}
          confidence="high"
          :alternatives=${recommendationAlternatives}
        ></elf-ai-recommendation-card>
        <div class="showcase-grid">
          <elf-ai-context-card
            v-for="(chunk, index) in contextChunks"
            :key="chunk.title + index"
            :title="chunk.title"
            :content="chunk.content"
            :characters="chunk.characters"
            :source-kind="chunk.sourceKind"
            :source-name="chunk.sourceName"
          ></elf-ai-context-card>
        </div>
      </div>
    </elf-playground>

    <h2>${t("terminal")}</h2>
    <elf-playground :title=${t("terminal")} :code=${terminalCode} :script=${sharedScript}>
      <span slot="status">${t("terminalDesc")}</span>
      <div class="showcase-stage case-terminal" data-theme="dark">
        <elf-ai-code-block
          :code=${terminalSource}
          filename="churn.ts"
          language="typescript"
          status="complete"
          theme="dark"
          code-theme="github"
        ></elf-ai-code-block>
        <elf-ai-tool-chips
          summary="3 tool calls, 2 messages"
          :items=${toolItems}
          :files=${toolFiles}
          :default-expanded.prop=${true}
        ></elf-ai-tool-chips>
      </div>
    </elf-playground>

    <h2>${t("cream")}</h2>
    <elf-playground :title=${t("cream")} :code=${creamCode} :script=${sharedScript}>
      <span slot="status">${t("creamDesc")}</span>
      <div class="showcase-stage case-cream">
        <elf-ai-approval-card :questions=${approvalQuestions}></elf-ai-approval-card>
        <elf-ai-task-row
          v-for="task in taskItems"
          :key="task.id"
          :task="task"
          :default-expanded.prop=${true}
        ></elf-ai-task-row>
      </div>
    </elf-playground>

    <h2>${t("midnight")}</h2>
    <elf-playground :title=${t("midnight")} :code=${midnightCode} :script=${sharedScript}>
      <span slot="status">${t("midnightDesc")}</span>
      <div class="showcase-stage case-midnight" data-theme="dark">
        <elf-ai-command-search
          :items=${searchItems}
          placeholder="Search flavors…"
        ></elf-ai-command-search>
        <elf-ai-insight-card :insights=${insights}></elf-ai-insight-card>
      </div>
    </elf-playground>

    <h2>${t("gradient")}</h2>
    <elf-playground :title=${t("gradient")} :code=${gradientCode} :script=${sharedScript}>
      <span slot="status">${t("gradientDesc")}</span>
      <div class="showcase-stage case-gradient">
        <elf-ai-loading label="Churning" variant="orbit"></elf-ai-loading>
        <elf-ai-streaming-text
          content="Pistachio is your fastest-growing flavor — sales are up 23% this month and margins beat vanilla by 8 points."
          :sources=${[
            { label: "Scoop Data", url: "https://scoopdata.io/", domain: "scoopdata.io" },
          ]}
          :actions=${[
            { label: "View chart", value: "chart", tone: "primary" },
            { label: "Export", value: "export" },
          ]}
          :follow-ups=${["Which flavors sell best in winter?"]}
          :streaming.prop=${false}
        ></elf-ai-streaming-text>
      </div>
    </elf-playground>
  </elf-container>
`);

export { PageLabsAiShowcase };
