import { defineHtml, defineStyle, onUnmounted, useRef, useTemplateRef } from "@elfui/core";

import "@elfui/kit/labs";
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
  status: { zh: "状态", en: "Status" },
  codex: { zh: "完整 Codex 案例", en: "Complete Codex session" },
  codexDesc: {
    zh: "一个端到端 Agent 会话：接收任务、思考、调用工具、修改代码、运行测试、给出差异与总结。",
    en: "An end-to-end agent session: receive a task, think, call tools, edit code, run tests, then summarize.",
  },
  codexPrompt: {
    zh: "修复表单校验：邮箱必填且格式合法，密码至少 8 位",
    en: "Fix form validation: email required and valid, password at least 8 chars",
  },
  codexRun: { zh: "运行会话", en: "Run session" },
  codexReplay: { zh: "重放", en: "Replay" },
  codexPlaying: { zh: "会话进行中", en: "Session running" },
  codexDone: { zh: "会话完成", en: "Session complete" },
  codexIdle: { zh: "点击运行开始", en: "Press run to start" },
  codexFinal: {
    zh: "已修改 1 个文件 · 34 个测试通过 · 用时 12s",
    en: "1 file changed · 34 tests passed · 12s",
  },
  codexSessions: { zh: "会话管理", en: "Sessions" },
  codexTools: { zh: "工具调用合集", en: "Tool calls" },
  codexNewSession: { zh: "新建会话", en: "New session" },
  codexComposerPlaceholder: {
    zh: "输入任务，回车开始模拟…",
    en: "Type a task and press Enter to simulate…",
  },
  codexComposer: { zh: "会话输入", en: "New task" },
  codexFullscreen: { zh: "全屏演示", en: "Fullscreen demo" },
  codexExitFullscreen: { zh: "退出全屏", en: "Exit fullscreen" },
  codexToggleSidebar: { zh: "收起侧边栏", en: "Collapse sidebar" },
  codexExpandSidebar: { zh: "展开侧边栏", en: "Expand sidebar" },
  codexResizeHint: { zh: "拖动调整宽度，双击折叠", en: "Drag to resize, double-click to collapse" },
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

const CODEX_STEPS = 8;
const codexStep = useRef(0);
const codexPlaying = useRef(false);
const codexPromptInput = useRef("");
const codexSidebarOpen = useRef(true);
const codexSidebarWidth = useRef(220);
const codexFullscreen = useRef(false);
const codexConversationRef = useTemplateRef<HTMLElement>("codexConversation");
let codexTimer: ReturnType<typeof setTimeout> | undefined;
let codexToken = 0;

const codexSteps = [
  { id: 1, title: "Reading validation.ts", kind: "steps" },
  { id: 2, title: "Comparing input rules", kind: "reasoning", detail: "3 fields" },
  { id: 3, title: "Searching test fixtures", kind: "search" },
  { id: 4, title: "Writing the patch", kind: "coding", detail: "validation.ts", duration: "2.1s" },
];
const codexCalls = [
  {
    id: 1,
    name: "Edit validation.ts",
    status: "success",
    duration: "1.2s",
    arguments: '{"file":"src/validation.ts","change":"email + password rules"}',
    result: '{"insertions":12,"deletions":4}',
  },
  {
    id: 2,
    name: "Run test suite",
    status: "running",
    duration: "3.4s",
    arguments: '{"command":"pnpm test"}',
  },
];
const codexTask = {
  id: 1,
  title: "Fix form validation",
  subtitle: "3 rules",
  status: "running",
  steps: [
    { label: "Email required + format", detail: "done" },
    { label: "Password min length", detail: "8 chars" },
    { label: "Run test suite", detail: "34/34" },
  ],
};
const codexSource = `export function validate(input: FormInput): string[] {
  const errors: string[] = [];
  if (!input.email || !/^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(input.email)) {
    errors.push("email is required and must be valid");
  }
  if (!input.password || input.password.length < 8) {
    errors.push("password must be at least 8 characters");
  }
  return errors;
}`;
const codexColumns = [
  { key: "rule", label: "Rule" },
  { key: "before", label: "Before" },
  { key: "after", label: "After" },
];
const codexRows = [
  {
    id: 1,
    cells: {
      rule: { value: "Email", status: "same" },
      before: { value: "optional", status: "remove" },
      after: { value: "required + format", status: "add" },
    },
  },
  {
    id: 2,
    cells: {
      rule: { value: "Password", status: "same" },
      before: { value: "≥ 4 chars", status: "change", original: "no minimum" },
      after: { value: "≥ 8 chars", status: "same" },
    },
  },
];
const codexAnswer =
  "Done — form validation now requires a valid email and a password of at least 8 characters. 34 tests pass, including 6 new cases.";

const codexStatusText = (): string =>
  codexPlaying.value
    ? t("codexPlaying")
    : codexStep.value >= CODEX_STEPS
      ? t("codexDone")
      : t("codexIdle");
const codexActionLabel = (): string =>
  codexStep.value >= CODEX_STEPS ? t("codexReplay") : t("codexRun");
const codexCallStatus = (index: number): string =>
  index === 0 || codexStep.value >= 4 ? "success" : "running";
const codexCallValue = (index: number, key: "name" | "duration" | "arguments" | "result"): string =>
  codexCalls[index]?.[key] ?? "";
const codexWorkspace = { name: "ElfUI Kit", subtitle: "workspace", avatar: "E" };
const codexNavSections = [
  {
    label: "Workspace",
    items: [
      { key: "home", label: "Home" },
      { key: "tasks", label: "Agent tasks", badge: 3 },
      { key: "inbox", label: "Inbox" },
    ],
  },
  {
    label: "Objects",
    items: [
      { key: "sessions", label: "Sessions" },
      { key: "runs", label: "Runs" },
    ],
  },
];
interface CodexSessionView {
  id: number;
  title: string;
  subtitle: string;
  status: string;
  active: boolean;
}
const codexSessions = [
  { id: 1, title: "fix-form-validation", subtitle: "validation.ts", status: "running" },
  { id: 2, title: "add-ai-chat", subtitle: "3 files · 12 tests", status: "completed" },
  { id: 3, title: "docs-polish", subtitle: "7 files", status: "failed" },
];
const codexSessionViews = (): CodexSessionView[] =>
  codexSessions.map((session) => ({
    ...session,
    status: session.id === 1 ? (codexPlaying.value ? "running" : "completed") : session.status,
    active: session.id === 1,
  }));
const codexToolsView = (): Array<{
  id: number;
  kind: string;
  title: string;
  detail: string;
  status: string;
  meta: string;
}> => [
  {
    id: 1,
    kind: "edit",
    title: "Edit validation.ts",
    detail: "src/validation.ts",
    status: "success",
    meta: "12 insertions",
  },
  {
    id: 2,
    kind: "shell",
    title: "Run test suite",
    detail: "pnpm test",
    status: codexCallStatus(1),
    meta: codexStep.value >= 4 ? "34 passed" : "running",
  },
];
const codexFiles = [{ name: "validation.ts", additions: 12, deletions: 4 }];
const codexTaskStatus = (): string => (codexStep.value === 4 ? "running" : "completed");
const codexTaskView = (): object => ({ ...codexTask, status: codexTaskStatus() });
const codexBlockStatus = (): string => (codexStep.value === 5 ? "streaming" : "complete");

const codexStart = (): void => {
  codexToken += 1;
  const token = codexToken;
  if (codexTimer) clearTimeout(codexTimer);
  codexStep.set(0);
  codexPlaying.set(true);
  codexScrollToLatest();
  const advance = (): void => {
    codexTimer = setTimeout(() => {
      if (token !== codexToken) return;
      if (codexStep.value + 1 >= CODEX_STEPS) {
        codexStep.set(CODEX_STEPS);
        codexPlaying.set(false);
        codexScrollToLatest();
        return;
      }
      codexStep.set(codexStep.value + 1);
      codexScrollToLatest();
      advance();
    }, 850);
  };
  advance();
};

const codexStop = (): void => {
  if (codexTimer) {
    clearTimeout(codexTimer);
    codexTimer = undefined;
  }
};

const onCodexSend = (event: CustomEvent<string>): void => {
  const text = (event.detail ?? "").trim();
  if (!text) return;
  codexPromptInput.set(text);
  codexStart();
};

const codexCaseClass = (): Record<string, boolean> => ({
  "is-fullscreen": codexFullscreen.value,
  "is-sidebar-collapsed": !codexSidebarOpen.value,
});
const codexFullscreenIconClass = (): Record<string, boolean> => ({
  "is-active": codexFullscreen.value,
});
const codexLayoutStyle = (): Record<string, string> => ({
  "--codex-sidebar-w": codexSidebarOpen.value ? `${codexSidebarWidth.value}px` : "0px",
});
const codexToggleFullscreen = (): void => {
  codexFullscreen.set(!codexFullscreen.value);
};
const codexToggleSidebar = (): void => {
  codexSidebarOpen.set(!codexSidebarOpen.value);
};
const codexScrollToLatest = (): void => {
  requestAnimationFrame(() => {
    const panel = codexConversationRef.value;
    if (panel) panel.scrollTop = panel.scrollHeight;
  });
};
const onCodexResizeStart = (event: PointerEvent): void => {
  const target = event.currentTarget as HTMLElement;
  if (!target || !codexSidebarOpen.value) return;
  event.preventDefault();
  target.setPointerCapture?.(event.pointerId);
  const startX = event.clientX;
  const startWidth = codexSidebarWidth.value;
  const onMove = (moveEvent: PointerEvent): void => {
    if (target.hasPointerCapture && !target.hasPointerCapture(moveEvent.pointerId)) return;
    const next = Math.min(300, Math.max(150, startWidth + moveEvent.clientX - startX));
    codexSidebarWidth.set(next);
  };
  const onUp = (upEvent: PointerEvent): void => {
    target.releasePointerCapture?.(upEvent.pointerId);
    target.removeEventListener("pointermove", onMove);
    target.removeEventListener("pointerup", onUp);
  };
  target.addEventListener("pointermove", onMove);
  target.addEventListener("pointerup", onUp);
};

onUnmounted(codexStop);

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

const codexCode = `<div class="codex-case" data-theme="dark">
  <div class="codex-bar">
    <span class="ai-window-dot"></span>
    <span>elfui-kit · fix-form-validation</span>
    <span class="codex-bar-actions">
      <button class="codex-icon-button" @click="toggleSidebar">
        <span class="codex-sidebar-icon" aria-hidden="true"></span>
      </button>
      <button class="codex-icon-button" @click="toggleFullscreen">
        <span class="codex-fullscreen-icon" :class="{ 'is-active': fullscreen }" aria-hidden="true"></span>
      </button>
    </span>
  </div>
  <div class="codex-layout" :style="{ '--codex-sidebar-w': sidebarOpen ? sidebarWidth + 'px' : '0px' }">
    <aside class="codex-sidebar">
      <elf-ai-sidebar-nav :workspace="workspace" :sections="sections" active-key="tasks" />
      <div class="codex-sessions">
        <span class="ai-pane-label">Sessions</span>
        <elf-ai-task-row v-for="session in sessions" :key="session.id" :task="session" variant="capsule" />
      </div>
    </aside>
    <div class="codex-resizer" @pointerdown="resizeStart" @dblclick="toggleSidebar"></div>
    <div class="codex-main">
      <div class="codex-conversation">
        <div class="codex-user"><span class="bubble">Fix form validation…</span></div>
        <elf-ai-thinking title="Thought for 3 seconds" :steps="steps" status="done" />
        <elf-ai-task-row :task="task" />
        <elf-ai-code-block :code="code" filename="validation.ts" language="typescript" status="complete" />
        <elf-ai-diff-table title="Proposed change" :columns="columns" :rows="rows" />
        <elf-ai-streaming-text content="Done — 34 tests pass." :sources="[]" :actions="[]" :follow-ups="[]" />
        <div class="codex-composer">
          <elf-chat-composer placeholder="Type a task and press Enter to simulate…" @send="onSend" />
        </div>
      </div>
      <aside class="codex-tools">
        <span class="ai-pane-label">Tool calls</span>
        <elf-ai-tool-chips summary="2 tool calls" :items="toolCalls" :files="files" />
        <elf-chat-tool-call name="Edit validation.ts" status="success" />
        <elf-chat-tool-call name="Run test suite" status="running" />
      </aside>
    </div>
  </div>
</div>`;

const codexScript = `// 用一个 step 状态驱动整个会话回放
const step = ref(0);
const prompt = ref("");
const sidebarOpen = ref(true);
const sidebarWidth = ref(220);
const fullscreen = ref(false);
const play = () => {
  const timer = setInterval(() => {
    step.value += 1;
    if (step.value >= 8) clearInterval(timer);
  }, 850);
};
const onSend = (value: string) => {
  prompt.value = value;
  play();
};
const toggleSidebar = () => { sidebarOpen.value = !sidebarOpen.value; };
const toggleFullscreen = () => { fullscreen.value = !fullscreen.value; };
// step >= 1 显示思考轨迹，>= 2 工具调用，>= 4 任务状态，
// >= 5 流式代码，>= 6 表格差异，>= 7 最终总结`;

defineStyle(
  articleStyles,
  `
  .codex-case {
    position: relative;
    width: min(100%, 880px);
    overflow: hidden;
    padding: 0;
    border: 1px solid #20242d;
    border-radius: 16px;
    background: #0d1017;
    box-shadow: 0 24px 70px rgb(0 0 0 / 0.35);
    container-type: inline-size;
    --elf-bg-paper: #131722;
    --elf-bg-overlay: #0f131c;
    --elf-border: #232936;
    --elf-divider: #1a1f2a;
    --elf-text-primary: #e6e9ef;
    --elf-text-secondary: #9aa3b2;
    --elf-text-disabled: #5b6472;
    --elf-primary: #7c9cf5;
    --elf-primary-hover: #9ab1ff;
    --elf-success: #3ddc84;
    --elf-warning: #fbbf24;
    --elf-danger: #f87171;
  }
  .codex-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    border-bottom: 1px solid var(--elf-divider, #1a1f2a);
    background: #11151e;
    color: var(--elf-text-secondary, #9aa3b2);
    font-size: 12px;
    font-weight: 650;
  }
  .codex-phase {
    margin-inline-start: auto;
    color: var(--elf-primary, #7c9cf5);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  .codex-bar-actions {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-inline-start: 8px;
  }
  .codex-icon-button {
    display: grid;
    place-items: center;
    width: 26px;
    height: 26px;
    padding: 0;
    border: 0;
    border-radius: 7px;
    background: transparent;
    color: var(--elf-text-secondary, #9aa3b2);
    cursor: pointer;
  }
  .codex-icon-button:hover,
  .codex-icon-button:focus-visible {
    background: color-mix(in srgb, var(--elf-text-secondary, #9aa3b2) 12%, transparent);
    color: var(--elf-text-primary, #e6e9ef);
    outline: 2px solid var(--elf-primary, #7c9cf5);
    outline-offset: -2px;
  }
  .codex-sidebar-icon {
    position: relative;
    display: block;
    width: 15px;
    height: 12px;
    border: 1.5px solid currentColor;
    border-radius: 2px;
  }
  .codex-sidebar-icon::before {
    position: absolute;
    top: -1.5px;
    bottom: -1.5px;
    left: 4px;
    width: 1.5px;
    background: currentColor;
    content: "";
  }
  .codex-sidebar-icon::after {
    position: absolute;
    top: 3px;
    left: 7px;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: currentColor;
    content: "";
  }
  .codex-fullscreen-icon {
    position: relative;
    display: block;
    width: 12px;
    height: 12px;
  }
  .codex-fullscreen-icon::before,
  .codex-fullscreen-icon::after {
    position: absolute;
    width: 5px;
    height: 5px;
    content: "";
  }
  .codex-fullscreen-icon::before {
    top: 0;
    left: 0;
    border-top: 1.5px solid currentColor;
    border-left: 1.5px solid currentColor;
    border-radius: 1px 0 0;
  }
  .codex-fullscreen-icon::after {
    right: 0;
    bottom: 0;
    border-right: 1.5px solid currentColor;
    border-bottom: 1.5px solid currentColor;
    border-radius: 0 0 1px;
  }
  .codex-fullscreen-icon.is-active::before {
    top: auto;
    right: 0;
    bottom: 0;
    left: auto;
    border: 0;
    border-right: 1.5px solid currentColor;
    border-bottom: 1.5px solid currentColor;
    border-radius: 0 0 1px;
  }
  .codex-fullscreen-icon.is-active::after {
    top: 0;
    left: 0;
    border: 0;
    border-top: 1.5px solid currentColor;
    border-left: 1.5px solid currentColor;
    border-radius: 1px 0 0;
  }
  .codex-layout {
    display: grid;
    grid-template-columns: var(--codex-sidebar-w, 220px) 10px minmax(0, 1fr);
    gap: 12px 0;
    padding: 14px;
  }
  .codex-resizer {
    min-width: 0;
    cursor: col-resize;
    touch-action: none;
    border-radius: 999px;
    background: transparent;
    transition: background 160ms ease;
  }
  .codex-resizer:hover,
  .codex-resizer:active {
    background: color-mix(in srgb, var(--elf-primary, #7c9cf5) 38%, transparent);
  }
  .codex-sidebar {
    display: grid;
    gap: 10px;
    align-content: start;
    min-width: 0;
    overflow: hidden;
  }
  .codex-sidebar > * {
    min-width: 0;
  }
  .codex-sidebar elf-ai-sidebar-nav {
    --elf-bg-paper: #131722;
    --elf-ai-sidebar-nav-min-height: 300px;
  }
  .codex-sessions {
    display: grid;
    gap: 6px;
  }
  .codex-sessions .is-active {
    padding: 3px;
    border-radius: 12px;
    outline: 1px solid var(--elf-primary, #7c9cf5);
  }
  .codex-composer {
    display: grid;
    position: sticky;
    bottom: 0;
    justify-self: center;
    width: min(100%, 480px);
    padding-top: 10px;
    background: linear-gradient(to top, var(--elf-bg-paper, #131722) 78%, transparent);
  }
  .codex-composer elf-chat-composer {
    --elf-bg-paper: #131722;
  }
  .codex-main {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 220px;
    gap: 14px;
    align-items: start;
  }
  .codex-conversation {
    display: grid;
    gap: 12px;
    min-width: 0;
    max-height: 560px;
    padding-right: 6px;
    overflow-y: auto;
    overscroll-behavior: contain;
    scrollbar-width: thin;
    scrollbar-color: var(--elf-text-disabled, #5b6472) transparent;
  }
  .codex-conversation::-webkit-scrollbar {
    width: 6px;
  }
  .codex-conversation::-webkit-scrollbar-thumb {
    border-radius: 999px;
    background: var(--elf-text-disabled, #5b6472);
  }
  .codex-tools {
    display: grid;
    gap: 8px;
    align-content: start;
  }
  .codex-tools > * {
    min-width: 0;
  }
  .codex-calls {
    display: grid;
    gap: 6px;
  }
  .codex-user {
    display: flex;
    justify-content: flex-end;
  }
  .codex-user .bubble {
    max-width: 82%;
    padding: 10px 14px;
    border-radius: 14px 14px 4px 14px;
    background: color-mix(in srgb, var(--elf-primary, #7c9cf5) 20%, var(--elf-bg-paper, #131722));
    color: var(--elf-text-primary, #e6e9ef);
    font-size: 13px;
    line-height: 1.6;
  }
  .codex-final {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 14px;
    border: 1px solid var(--elf-border, #232936);
    border-radius: 12px;
    background: color-mix(in srgb, var(--elf-success, #3ddc84) 10%, var(--elf-bg-paper, #131722));
    color: var(--elf-text-primary, #e6e9ef);
    font-size: 13px;
  }
  .codex-actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
  }
  .codex-actions button {
    padding: 7px 14px;
    border: 1px solid var(--elf-primary, #7c9cf5);
    border-radius: 8px;
    background: var(--elf-primary, #7c9cf5);
    color: #0b0e14;
    cursor: pointer;
    font: 700 12px/1.4 var(--elf-font-family, sans-serif);
  }
  .codex-actions button:hover {
    background: var(--elf-primary-hover, #9ab1ff);
  }
  .codex-case.is-sidebar-collapsed .codex-layout {
    grid-template-columns: minmax(0, 1fr);
  }
  .codex-case.is-sidebar-collapsed .codex-sidebar,
  .codex-case.is-sidebar-collapsed .codex-resizer {
    display: none;
  }
  .codex-case.is-fullscreen {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    width: 100vw;
    height: 100vh;
    border: 0;
    border-radius: 0;
    box-shadow: none;
  }
  .codex-case.is-fullscreen .codex-layout {
    flex: 1 1 auto;
    min-height: 0;
    overflow: hidden;
  }
  .codex-case.is-fullscreen .codex-main {
    height: 100%;
    min-height: 0;
    align-items: stretch;
  }
  .codex-case.is-fullscreen .codex-conversation,
  .codex-case.is-fullscreen .codex-tools {
    height: 100%;
    max-height: none;
  }
  .codex-case.is-fullscreen .codex-actions {
    flex: 0 0 auto;
  }
  @media (max-width: 1080px) {
    .codex-layout,
    .codex-main {
      grid-template-columns: minmax(0, 1fr);
    }
  }
  @container (max-width: 760px) {
    .codex-main {
      grid-template-columns: minmax(0, 1fr);
    }
    .codex-tools {
      grid-template-columns: minmax(0, 1fr);
    }
  }
  @container (max-width: 540px) {
    .codex-layout {
      grid-template-columns: minmax(0, 1fr);
    }
  }
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
    background:
      radial-gradient(1200px 500px at 15% -10%, rgb(0 229 255 / 0.16), transparent 60%),
      #0d0f14;
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
    background:
      radial-gradient(900px 420px at 85% -10%, rgb(124 108 255 / 0.18), transparent 60%),
      #0a0a12;
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
    border: 1px solid transparent;
    background:
      linear-gradient(#fbfbfc, #fbfbfc) padding-box,
      linear-gradient(135deg, #f97316, #06b6d4 55%, #8b5cf6) border-box;
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

    <h2>${t("codex")}</h2>
    <elf-playground :title=${t("codex")} :code=${codexCode} :script=${codexScript}>
      <span slot="status">${t("status")}: ${codexStatusText()}</span>
      <div class="codex-case" data-theme="dark" :class=${codexCaseClass()}>
        <div class="codex-bar">
          <span class="ai-window-dot"></span><span class="ai-window-dot"></span><span class="ai-window-dot"></span>
          <span>elfui-kit · fix-form-validation</span>
          <span class="codex-phase">${codexStatusText()}</span>
          <span class="codex-bar-actions">
            <button
              class="codex-icon-button"
              type="button"
              :aria-label=${codexSidebarOpen.value ? t("codexToggleSidebar") : t("codexExpandSidebar")}
              :title=${codexSidebarOpen.value ? t("codexToggleSidebar") : t("codexExpandSidebar")}
              @click=${codexToggleSidebar}
            >
              <span class="codex-sidebar-icon" aria-hidden="true"></span>
            </button>
            <button
              class="codex-icon-button"
              type="button"
              :aria-label=${codexFullscreen.value ? t("codexExitFullscreen") : t("codexFullscreen")}
              :title=${codexFullscreen.value ? t("codexExitFullscreen") : t("codexFullscreen")}
              @click=${codexToggleFullscreen}
            >
              <span class="codex-fullscreen-icon" :class=${codexFullscreenIconClass()} aria-hidden="true"></span>
            </button>
          </span>
        </div>
        <div class="codex-layout" :style=${codexLayoutStyle()}>
          <aside class="codex-sidebar">
            <elf-ai-sidebar-nav
              :workspace=${codexWorkspace}
              :sections=${codexNavSections}
              active-key="tasks"
              :new-task-label.prop=${t("codexNewSession")}
            ></elf-ai-sidebar-nav>
            <div class="codex-sessions">
              <span class="ai-pane-label">${t("codexSessions")}</span>
              <div
                v-for="session in codexSessionViews()"
                :key="session.id"
                :class="{ 'is-active': session.active }"
              >
                <elf-ai-task-row :task="session" variant="capsule"></elf-ai-task-row>
              </div>
            </div>
          </aside>
          <div
            class="codex-resizer"
            :title=${t("codexResizeHint")}
            @pointerdown=${onCodexResizeStart}
            @dblclick=${codexToggleSidebar}
          ></div>
          <div class="codex-main">
            <div class="codex-conversation" ref="codexConversation">
              <div class="codex-user">
                <span class="bubble">${codexPromptInput.value || t("codexPrompt")}</span>
              </div>
              <div v-if=${codexStep.value >= 1}>
                <elf-ai-thinking
                  title="Thought for 3 seconds"
                  :steps=${codexSteps}
                  :status=${codexStep.value === 1 ? "running" : "done"}
                  :default-expanded.prop=${true}
                ></elf-ai-thinking>
              </div>
              <div v-if=${codexStep.value >= 4}>
                <elf-ai-task-row
                  :task=${codexTaskView()}
                  :default-expanded.prop=${true}
                ></elf-ai-task-row>
              </div>
              <div v-if=${codexStep.value >= 5}>
                <elf-ai-code-block
                  :code=${codexSource}
                  filename="validation.ts"
                  language="typescript"
                  :status=${codexBlockStatus()}
                  :stream-speed.prop=${55}
                ></elf-ai-code-block>
              </div>
              <div v-if=${codexStep.value >= 6}>
                <elf-ai-diff-table
                  title="Proposed change"
                  :columns=${codexColumns}
                  :rows=${codexRows}
                ></elf-ai-diff-table>
              </div>
              <div v-if=${codexStep.value >= 7}>
                <elf-ai-streaming-text
                  :content=${codexAnswer}
                  :sources=${[]}
                  :actions=${[]}
                  :follow-ups=${[]}
                ></elf-ai-streaming-text>
                <div class="codex-final">
                  <span>✓ ${t("codexFinal")}</span>
                </div>
              </div>
              <div class="codex-composer">
                <elf-chat-composer
                  :placeholder.prop=${t("codexComposerPlaceholder")}
                  @send=${onCodexSend}
                ></elf-chat-composer>
              </div>
            </div>
            <aside class="codex-tools">
              <span class="ai-pane-label">${t("codexTools")}</span>
              <div v-if=${codexStep.value >= 2} class="codex-calls">
                <elf-ai-tool-chips
                  summary="2 tool calls"
                  :items=${codexToolsView()}
                  :files=${codexFiles}
                  :default-expanded.prop=${true}
                ></elf-ai-tool-chips>
                <elf-chat-tool-call
                  :name=${codexCallValue(0, "name")}
                  :status=${codexCallStatus(0)}
                  :duration=${codexCallValue(0, "duration")}
                  :arguments=${codexCallValue(0, "arguments")}
                  :result=${codexCallValue(0, "result")}
                  :default-expanded.prop=${true}
                ></elf-chat-tool-call>
                <elf-chat-tool-call
                  :name=${codexCallValue(1, "name")}
                  :status=${codexCallStatus(1)}
                  :duration=${codexCallValue(1, "duration")}
                  :arguments=${codexCallValue(1, "arguments")}
                ></elf-chat-tool-call>
              </div>
            </aside>
          </div>
        </div>
        <div class="codex-actions" style="padding: 0 14px 14px">
          <button @click=${codexStart}>${codexActionLabel()}</button>
        </div>
      </div>
    </elf-playground>

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
