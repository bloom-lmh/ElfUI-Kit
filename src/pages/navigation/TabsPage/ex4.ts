import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  section: { zh: "自定义过渡", en: "Custom transition" },
  title: { zh: "自定义过渡与 CSS 变量", en: "Custom transition and CSS variables" },
  current: { zh: "当前", en: "Current" },
  draftLabel: { zh: "草稿", en: "Draft" },
  reviewLabel: { zh: "审核", en: "Review" },
  publishLabel: { zh: "发布", en: "Publish" },
  draft: {
    zh: "通过 CSS 变量控制初始透明度和位移。",
    en: "CSS variables control the initial opacity and offset.",
  },
  review: {
    zh: "可以在宿主元素上覆盖自定义进入变换。",
    en: "Override the custom enter transform on the host.",
  },
  publish: {
    zh: "适合统一产品中的标签面板动效。",
    en: "Keep tab panel motion consistent across a product.",
  },
});

const active = useRef("draft");
const items = () => [
  { label: t("draftLabel"), value: "draft", content: t("draft") },
  { label: t("reviewLabel"), value: "review", content: t("review") },
  { label: t("publishLabel"), value: "publish", content: t("publish") },
];
const onChange = (event: CustomEvent): void => active.set(String(event.detail));
const status = (): string => `${t("current")}: ${active.value}`;
const code = `<elf-tabs :items.prop=\${items} :modelValue=\${active} transition="custom" style="--tabs-custom-from-transform: translateY(18px) scale(.96)" show-panels />`;
const script = (): string => `const active = useRef("draft");
const items = [
  { label: "${t("draftLabel")}", value: "draft", content: "${t("draft")}" },
  { label: "${t("reviewLabel")}", value: "review", content: "${t("review")}" },
  { label: "${t("publishLabel")}", value: "publish", content: "${t("publish")}" }
];`;

defineStyle(styles);

const PageTabsEx4 = defineHtml(`
  <h2>${t("section")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script()}>
    <span slot="status" role="status" aria-live="polite">${status()}</span>
    <div class="tabs-demo-stage" style="max-width:760px">
      <elf-tabs
        :key=${t("section")}
        :items.prop=${items()}
        :modelValue.prop=${active.value}
        show-panels transition="custom" :transitionDuration=${320}
        style="--tabs-custom-from-transform: translateY(18px) scale(.96)"
        @update:modelValue=${onChange}
      ></elf-tabs>
    </div>
  </elf-playground>
`);

export { PageTabsEx4 };
