import { defineHtml, defineProps, defineStyle, useComponents } from "@elfui/core";

import { PageHeader } from "@elfui/kit-src/components/Navigation/PageHeader";
import { useLocaleProvider } from "@elfui/kit-src/components/Providers/context";
import styles from "./style.scss?inline";
import type { DocsHeroProps, DocsHeroSlots } from "./types";

export type { DocsHeroProps, DocsHeroSlots } from "./types";

const props = defineProps<DocsHeroProps>({
  category: { type: String, default: "component" },
  title: { type: String, default: "" },
  description: { type: String, default: "" },
  tag: { type: String, default: "" },
  version: { type: String, default: "v1.0.0" },
});

const locale = useLocaleProvider();
const categoryLabels: Record<string, readonly [string, string]> = {
  basic: ["基础组件", "Basic components"],
  data: ["数据展示", "Data display"],
  feedback: ["反馈组件", "Feedback components"],
  form: ["表单组件", "Form components"],
  labs: ["实验室组件", "Labs components"],
  layout: ["布局组件", "Layout components"],
  navigation: ["导航组件", "Navigation components"],
  picker: ["选择器组件", "Picker components"],
  providers: ["全局配置", "Global configuration"],
  "getting-started": ["快速入门", "Getting started"],
  directives: ["指令", "Directives"],
  component: ["组件库", "Components"],
};

const isChinese = (): boolean =>
  String(locale.name || "")
    .toLowerCase()
    .startsWith("zh");
const eyebrow = (): string => {
  const labels = categoryLabels[String(props.category || "component")] ?? categoryLabels.component!;
  return labels[isChinese() ? 0 : 1];
};
const inferredTag = (): string => {
  if (props.tag) return props.tag;
  return String(props.title || "").match(/[A-Za-z][A-Za-z0-9]*/)?.[0] || "ElfUI";
};
const metaText = (): string =>
  `${isChinese() ? "组件库" : "Component library"} · ${props.version || "v1.0.0"}`;

useComponents({ "docs-hero-page-header": PageHeader });
defineStyle(styles);

const DocsHero = defineHtml<DocsHeroProps, Record<string, never>, DocsHeroSlots>(`
  <docs-hero-page-header
    mode="hero"
    variant="banner"
    tone="primary"
    :eyebrow=${eyebrow()}
    :title=${props.title}
    :tag=${inferredTag()}
    :description=${props.description}
    :version=${metaText()}
  >
    <div slot="extra"><slot name="extra"></slot></div>
  </docs-hero-page-header>
`);

export { DocsHero };
