import { defineDirective, defineHtml, defineStyle, useRef } from "@elfui/core";

import { mutateDirective } from "../../../directives";
import { createDocsTranslator } from "../../docsLocale";
import demoStyles from "../directive-demo.scss?inline";
import articleStyles from "../../shared/article.scss?inline";

const t = createDocsTranslator({
  kicker: { zh: "指令", en: "Directive" }, title: { zh: "DOM 变化观察器", en: "Mutate" },
  description: { zh: "观察元素的子节点、属性或文本变化，适合集成非受控第三方 DOM。", en: "Observe child, attribute, or text changes for integrations with uncontrolled third-party DOM." },
  demo: { zh: "观察子节点变化", en: "Observe child mutations" }, add: { zh: "添加记录", en: "Add record" }, records: { zh: "观察记录", en: "Mutation records" }, api: { zh: "API", en: "API" }, type: { zh: "类型", en: "Type" }, desc: { zh: "说明", en: "Description" },
  handler: { zh: "接收本次批量变更与原生观察器。", en: "Receives a mutation batch and the native observer." }, observer: { zh: "传入 MutationObserverInit 配置。", en: "Passes MutationObserverInit options." }, disabled: { zh: "暂停观察并释放当前观察器。", en: "Pauses observation and releases the active observer." }
});

defineStyle(articleStyles, demoStyles);
const mutate = defineDirective(mutateDirective);
const entries = useRef<string[]>(["Initial record"]);
const count = useRef(0);
const visibleEntries = (): string[] => entries.value;
const onMutate = (records: readonly MutationRecord[]): void => count.set(count.value + records.length);
const addRecord = (): void => entries.set([...entries.value, `Record ${entries.value.length + 1}`]);
const options = () => ({ handler: onMutate, observer: { childList: true } });
const optionRows = () => [
  { name: "handler", type: "(records, observer) => void", default: "—", desc: t("handler") },
  { name: "observer", type: "MutationObserverInit", default: "{ childList: true }", desc: t("observer") },
  { name: "disabled", type: "boolean", default: "false", desc: t("disabled") }
];
const code = `<section v-mutate={ handler: onMutate, observer: { childList: true } }>
  <p v-for="entry in entries">{{ entry }}</p>
</section>`;
const script = `import { defineDirective } from "@elfui/core";
import { mutateDirective } from "@elfui/kit";
const mutate = defineDirective(mutateDirective);
const onMutate = (records) => sync(records);`;

const PageMutate = defineHtml(`
  <elf-container class="docs-article"><span class="docs-kicker">${t("kicker")}</span><h1>${t("title")}</h1><p class="page-lead">${t("description")}</p>
    <elf-playground :title=${t("demo")} :code=${code} :script=${script}><span slot="status">${t("records")}: ${count}</span><div class="directive-stack"><elf-button @click=${addRecord}>${t("add")}</elf-button><section v-mutate=${options()} class="directive-demo"><div><p v-for="entry in visibleEntries()" :key="entry">{{ entry }}</p></div></section></div></elf-playground>
    <section class="docs-section"><h2>${t("api")}</h2><elf-props-table :title=${t("api")} :rows=${optionRows()} /></section>
  </elf-container>
`);
export { PageMutate };
