import { defineHtml } from "@elfui/core";

import type { LoadingVariant } from "@elfui/kit-src/components/Feedback/Loading/types";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "四种加载动效", en: "Four loading variants" },
  spinner: { zh: "旋转", en: "Spinner" },
  spinnerText: { zh: "正在同步数据", en: "Syncing data" },
  dots: { zh: "圆点", en: "Dots" },
  dotsText: { zh: "正在连接", en: "Connecting" },
  pulse: { zh: "脉冲", en: "Pulse" },
  pulseText: { zh: "等待响应", en: "Waiting for a response" },
  bars: { zh: "音柱", en: "Bars" },
  barsText: { zh: "正在分析数据", en: "Analyzing data" },
});

const code = `<elf-loading loading variant="spinner" text="${t("spinnerText")}">...</elf-loading>
<elf-loading loading variant="dots" text="${t("dotsText")}">...</elf-loading>
<elf-loading loading variant="pulse" text="${t("pulseText")}">...</elf-loading>
<elf-loading loading variant="bars" text="${t("barsText")}">...</elf-loading>`;

interface VariantExample {
  value: LoadingVariant;
  label: string;
  text: string;
}

const variants: VariantExample[] = [
  { value: "spinner", label: t("spinner"), text: t("spinnerText") },
  { value: "dots", label: t("dots"), text: t("dotsText") },
  { value: "pulse", label: t("pulse"), text: t("pulseText") },
  { value: "bars", label: t("bars"), text: t("barsText") },
];

const variantKey = (item: VariantExample): LoadingVariant => item.value;
const variantLabel = (item: VariantExample): string => item.label;
const variantText = (item: VariantExample): string => item.text;

const PageLoadingEx4 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code}>
    <div
      style="display:grid;grid-template-columns:repeat(2,minmax(180px,1fr));gap:14px;width:100%;max-width:760px"
    >
      <article
        v-for="item in variants"
        :key="variantKey(item)"
        style="display:grid;gap:8px;min-height:150px"
      >
        <strong style="font-size:13px;color:var(--elf-text-secondary)">{{ variantLabel(item) }}</strong>
        <elf-loading loading :variant="variantKey(item)" :text="variantText(item)">
          <div
            style="height:118px;border:1px solid var(--elf-divider);border-radius:14px;background:var(--elf-bg-paper)"
          ></div>
        </elf-loading>
      </article>
    </div>
  </elf-playground>
`);

export { PageLoadingEx4 };
