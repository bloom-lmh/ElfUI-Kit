import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  section: { zh: "布局变体：侧边导航", en: "Layout: side navigation" },
  title: {
    zh: "垂直布局",
    en: "Vertical layout",
  },
  current: { zh: "当前", en: "Current" },
  profile: { zh: "资料", en: "Profile" },
  profileContent: { zh: "账号资料和基础信息。", en: "Account profile and basic information." },
  security: { zh: "安全", en: "Security" },
  securityContent: {
    zh: "密码、双因素认证和访问密钥。",
    en: "Passwords, two-factor authentication, and access keys.",
  },
  billing: { zh: "账单", en: "Billing" },
  billingContent: { zh: "账单周期、发票和套餐。", en: "Billing cycles, invoices, and plans." },
});

const active = useRef("security");
const items = () => [
  { label: t("profile"), value: "profile", icon: "P", content: t("profileContent") },
  { label: t("security"), value: "security", icon: "S", content: t("securityContent") },
  { label: t("billing"), value: "billing", icon: "B", content: t("billingContent") },
];
const onChange = (event: CustomEvent): void => active.set(String(event.detail));
const status = (): string => `${t("current")}: ${active.value}`;
const code = `<elf-tabs :items.prop=\${items} :modelValue=\${active} direction="vertical" density="comfortable" show-panels color="#006a6a" />`;
const script = (): string => `const active = useRef("security");
const items = [
  { label: "${t("profile")}", value: "profile", content: "${t("profileContent")}" },
  { label: "${t("security")}", value: "security", content: "${t("securityContent")}" },
  { label: "${t("billing")}", value: "billing", content: "${t("billingContent")}" }
];`;

defineStyle(styles);

const PageTabsEx5 = defineHtml(`
  <h2>${t("section")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script()}>
    <span slot="status" role="status" aria-live="polite">${status()}</span>
    <div class="tabs-demo-stage" style="max-width:860px">
      <elf-tabs
        :key=${t("section")}
        :items.prop=${items()}
        :modelValue.prop=${active.value}
        direction="vertical"
        density="comfortable"
        show-panels
        color="#006a6a"
        @update:modelValue=${onChange}
      ></elf-tabs>
    </div>
  </elf-playground>
`);

export { PageTabsEx5 };
