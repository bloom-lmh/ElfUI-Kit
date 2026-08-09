import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import articleStyles from "../../shared/article.scss?inline";

const t = createDocsTranslator({
  kicker: { zh: "实验室组件", en: "Labs component" },
  title: { zh: "AI Context Card 上下文卡片", en: "AI Context Card" },
  description: {
    zh: "RAG 检索知识块卡片：标题、字符数、内容预览与来源文件徽标，可一键加入上下文。",
    en: "Retrieved knowledge chunks with title, character count, content preview, source badges, and a use-in-context action.",
  },
  warning: {
    zh: "实验性 API：来源模型可能在稳定版前调整。",
    en: "Experimental API: the source model may change before stabilization.",
  },
  demo: { zh: "检索上下文", en: "Retrieved context" },

  status: { zh: "状态", en: "Status" },
  selected: { zh: "已选中的块", en: "Selected chunks" },
  none: { zh: "无", en: "None" },
  api: { zh: "API", en: "API" },
  props: { zh: "属性", en: "Props" },
  events: { zh: "事件", en: "Events" },
  titleDesc: { zh: "知识块标题。", en: "Chunk title." },
  contentDesc: { zh: "知识块内容。", en: "Chunk content." },
  charactersDesc: { zh: "字符数。", en: "Character count." },
  sourceKindDesc: {
    zh: "来源类型：pdf / csv / web / doc。",
    en: "Source kind: pdf / csv / web / doc.",
  },
  sourceNameDesc: { zh: "来源文件名。", en: "Source filename." },
  selectableDesc: { zh: "显示「使用此块」按钮。", en: "Shows the use-chunk action." },
  labelsDesc: { zh: "文案覆盖。", en: "Label overrides." },
  ariaLabelDesc: { zh: "无障碍标签。", en: "Accessible label." },
  selectEvent: { zh: "请求把该块加入上下文。", en: "Requests the chunk be added to context." },
});

const selectedChunks = useRef<string[]>([]);
const chunks = [
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

const code = `<elf-ai-context-card
  title="Vendor onboarding rule"
  content="Cold-chain certification must be verified..."
  :characters="290"
  source-kind="pdf"
  source-name="Dairy Onboarding SOP.pdf"
  selectable
  @select="onSelect"
/>`;
const script = `const onSelect = () => {
  // 把该知识块加入 Agent 上下文
};`;

const propRows = () => [
  { name: "title", type: "string", default: "''", desc: t("titleDesc") },
  { name: "content", type: "string", default: "''", desc: t("contentDesc") },
  { name: "characters", type: "number", default: "0", desc: t("charactersDesc") },
  { name: "source-kind", type: "AiContextSourceKind", default: "'pdf'", desc: t("sourceKindDesc") },
  { name: "source-name", type: "string", default: "''", desc: t("sourceNameDesc") },
  { name: "selectable", type: "boolean", default: "false", desc: t("selectableDesc") },
  { name: "labels", type: "Partial<AiContextCardLabels>", default: "{}", desc: t("labelsDesc") },
  { name: "aria-label", type: "string", default: "''", desc: t("ariaLabelDesc") },
];

const eventRows = () => [
  { name: "select", type: "CustomEvent<void>", default: "—", desc: t("selectEvent") },
];

defineStyle(
  articleStyles,
  `
  .ai-context-stage {
    display: grid;
    gap: 10px;
    width: min(100%, 640px);
  }
  .ai-context-note {
    margin: 0;
    color: var(--elf-text-secondary, #64748b);
    font-size: 12.5px;
  }
  `,
);

const onSelectChunk = (event: Event): void => {
  const index = (event.currentTarget as HTMLElement).dataset.index || "";
  const current = selectedChunks.value;
  if (index && !current.includes(index)) selectedChunks.set([...current, index]);
};

const PageLabsAiContextCard = defineHtml(`
  <elf-container class="docs-article">
    <elf-docs-hero category="labs" tag="AI Context Card" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <p class="docs-callout is-warning labs-warning">${t("warning")}</p>
    <elf-playground :title=${t("demo")} :code=${code} :script=${script}>
      <span slot="status">${t("status")}: ${selectedChunks.value.length > 0 ? selectedChunks.value.length : t("none")}</span>
      <div class="ai-context-stage">
        <elf-ai-context-card
          v-for="(chunk, index) in chunks"
          :key="chunk.title"
          :title="chunk.title"
          :content="chunk.content"
          :characters="chunk.characters"
          :source-kind="chunk.sourceKind"
          :source-name="chunk.sourceName"
          :data-index="index"
          :selectable.prop=${true}
          @select=${onSelectChunk}
        ></elf-ai-context-card>
      </div>
    </elf-playground>
    <elf-api-builder component="elf-ai-context-card" title="API">
    <elf-props-table role="props" :title=${t("props")} :rows=${propRows()}></elf-props-table>
    <elf-props-table role="events" :title=${t("events")} :rows=${eventRows()}></elf-props-table>
  </elf-api-builder>
  </elf-container>
`);

export { PageLabsAiContextCard };
