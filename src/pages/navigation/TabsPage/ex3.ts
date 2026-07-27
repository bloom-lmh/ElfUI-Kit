import { defineHtml, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  section: { zh: "面板过渡", en: "Panel transitions" },
  title: { zh: "滑动过渡与持续时间", en: "Slide transition and duration" },
  overview: { zh: "概览面板使用滑动过渡进入。", en: "The overview panel enters with a slide transition." },
  metrics: { zh: "指标面板在切换时平滑滑入。", en: "The metrics panel slides in smoothly." },
  logs: { zh: "日志面板保持相同的过渡节奏。", en: "The logs panel uses the same transition rhythm." }
});

const active = useRef("overview");
const items = () => [
  { label: "Overview", value: "overview", content: t("overview") },
  { label: "Metrics", value: "metrics", content: t("metrics") },
  { label: "Logs", value: "logs", content: t("logs") }
];
const onChange = (event: CustomEvent): void => active.set(String(event.detail));
const code = `<elf-tabs :items.prop=\${items} :modelValue=\${active} show-panels transition="slide" :transitionDuration=\${260} />`;
const script = `const active = useRef("overview");
const items = [
  { label: "Overview", value: "overview", content: "Overview panel" },
  { label: "Metrics", value: "metrics", content: "Metrics panel" },
  { label: "Logs", value: "logs", content: "Logs panel" }
];`;

const PageTabsEx3 = defineHtml(`
  <h2>${t("section")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <div style="width:100%;max-width:760px">
      <elf-tabs
        :key=${t("section")}
        :items.prop=${items()}
        :modelValue.prop=${active.value}
        show-panels transition="slide" :transitionDuration=${260}
        @update:modelValue=${onChange}
      ></elf-tabs>
    </div>
  </elf-playground>
`);

export { PageTabsEx3 };
