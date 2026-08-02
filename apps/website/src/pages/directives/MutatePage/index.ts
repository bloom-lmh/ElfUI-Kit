import { defineDirective, defineHtml, defineStyle, useRef } from "@elfui/core";

import { mutateDirective } from "@elfui/kit";
import { createDocsTranslator } from "../../docsLocale";
import demoStyles from "../directive-demo.scss?inline";
import articleStyles from "../../shared/article.scss?inline";

const t = createDocsTranslator({
  kicker: { zh: "指令", en: "Directive" },
  title: { zh: "DOM 变更监听", en: "Mutate" },
  description: {
    zh: "基于浏览器 MutationObserver 监听元素的子节点、属性或文本变更，适合接入会直接修改 DOM 的第三方库。它不监听业务变量，也不能代替响应式状态。",
    en: "Use the browser MutationObserver to watch child, attribute, or text changes, especially when integrating third-party code that mutates the DOM directly. It does not watch application state or replace reactivity.",
  },
  demo: { zh: "监听子节点变更", en: "Observe child mutations" },
  add: { zh: "添加 DOM 节点", en: "Add DOM node" },
  records: { zh: "DOM 变更记录", en: "Mutation records" },
  useTitle: { zh: "什么时候使用？", en: "When should it be used?" },
  useBody: {
    zh: "仅在图表、编辑器等外部代码绕过 ElfUI 响应式系统并直接改动 DOM 时使用；普通界面状态继续使用 ref、computed 或 watch。",
    en: "Use it only when external code such as a chart or editor bypasses ElfUI reactivity and changes the DOM directly. Keep ordinary UI state in refs, computed values, or watchers.",
  },
  api: { zh: "API", en: "API" },
  handler: {
    zh: "接收本次批量 DOM 变更记录与原生观察器。",
    en: "Receives a batch of DOM mutation records and the native observer.",
  },
  observer: {
    zh: "传入 MutationObserverInit，选择监听子节点、属性、文本或后代节点。",
    en: "Pass MutationObserverInit to select child, attribute, text, or descendant mutations.",
  },
  disabled: {
    zh: "暂停监听并释放当前观察器。",
    en: "Pauses observation and releases the active observer.",
  },
});

defineStyle(articleStyles, demoStyles);
const mutate = defineDirective(mutateDirective);
const entries = useRef<string[]>(["Initial record"]);
const count = useRef(0);
const visibleEntries = (): string[] => entries.value;
const onMutate = (records: readonly MutationRecord[]): void =>
  count.set(count.value + records.length);
const addRecord = (): void => entries.set([...entries.value, `Record ${entries.value.length + 1}`]);
const options = () => ({ handler: onMutate, observer: { childList: true } });
const optionRows = () => [
  { name: "handler", type: "(records, observer) => void", default: "—", desc: t("handler") },
  {
    name: "observer",
    type: "MutationObserverInit",
    default: "{ childList: true }",
    desc: t("observer"),
  },
  { name: "disabled", type: "boolean", default: "false", desc: t("disabled") },
];
const code = `<section v-mutate={ handler: onMutate, observer: { childList: true } }>
  <p v-for="entry in entries">{{ entry }}</p>
</section>`;
const script = `import { defineDirective } from "@elfui/core";
import { mutateDirective } from "@elfui/kit";
const mutate = defineDirective(mutateDirective);
const onMutate = (records) => sync(records);`;

const PageMutate = defineHtml(`
  <elf-container class="docs-article">
    <elf-docs-hero category="directives" :title=${t("title")} :description=${t("description")}></elf-docs-hero>

    <elf-playground :title=${t("demo")} :code=${code} :script=${script}>
      <span slot="status" role="status" aria-live="polite">${t("records")}: ${count}</span>
      <div class="directive-stack">
        <elf-button @click=${addRecord}>${t("add")}</elf-button>
        <section v-mutate=${options()} class="directive-demo">
          <div><p v-for="entry in visibleEntries()" :key="entry">{{ entry }}</p></div>
        </section>
      </div>
    </elf-playground>

    <p class="docs-callout">
      <strong>${t("useTitle")}</strong> ${t("useBody")}
    </p>

    <section class="docs-section">
      <h2>${t("api")}</h2>
      <elf-props-table :title=${t("api")} :rows=${optionRows()} />
    </section>
  </elf-container>
`);
export { PageMutate };
