import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  section: { zh: "面板过渡", en: "Panel transitions" },
  title: { zh: "滑动过渡与持续时间", en: "Slide transition and duration" },
  current: { zh: "当前", en: "Current" },
  overviewLabel: { zh: "概览", en: "Overview" },
  metricsLabel: { zh: "指标", en: "Metrics" },
  logsLabel: { zh: "日志", en: "Logs" },
  overview: {
    zh: "概览面板使用滑动过渡进入。",
    en: "The overview panel enters with a slide transition.",
  },
  metrics: { zh: "指标面板在切换时平滑滑入。", en: "The metrics panel slides in smoothly." },
  logs: {
    zh: "日志面板保持相同的过渡节奏。",
    en: "The logs panel uses the same transition rhythm.",
  },
});

const active = useRef("overview");
const items = () => [
  { label: t("overviewLabel"), value: "overview", content: t("overview") },
  { label: t("metricsLabel"), value: "metrics", content: t("metrics") },
  { label: t("logsLabel"), value: "logs", content: t("logs") },
];
const onChange = (event: CustomEvent): void => active.set(String(event.detail));
const status = (): string => `${t("current")}: ${active.value}`;
const code = `<elf-tabs :items.prop=\${items} :modelValue=\${active} show-panels transition="slide" :transitionDuration=\${260} />`;
const script = (): string => `const active = useRef("overview");
const items = [
  { label: "${t("overviewLabel")}", value: "overview", content: "${t("overview")}" },
  { label: "${t("metricsLabel")}", value: "metrics", content: "${t("metrics")}" },
  { label: "${t("logsLabel")}", value: "logs", content: "${t("logs")}" }
];`;

defineStyle(styles);

const PageTabsEx3 = defineHtml(`
  <h2>${t("section")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script()}>
    <span slot="status" role="status" aria-live="polite">${status()}</span>
    <div class="tabs-demo-stage" style="max-width:760px">
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
