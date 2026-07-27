import { defineHtml, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  section: { zh: "布局变体：侧边导航", en: "Layout: side navigation" },
  title: { zh: "垂直布局、舒适密度与内容面板", en: "Vertical layout, comfortable density, and panels" },
  profile: { zh: "资料", en: "Profile" },
  profileContent: { zh: "账号资料和基础信息。", en: "Account profile and basic information." },
  security: { zh: "安全", en: "Security" },
  securityContent: { zh: "密码、双因素认证和访问密钥。", en: "Passwords, two-factor authentication, and access keys." },
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
const code = `<elf-tabs :items.prop=\${items} :modelValue=\${active} direction="vertical" density="comfortable" show-panels color="#006a6a" />`;
const script = `const active = useRef("security");
const items = [
  { label: "Profile", value: "profile", content: "Account profile" },
  { label: "Security", value: "security", content: "Security settings" },
  { label: "Billing", value: "billing", content: "Billing information" }
];`;

const PageTabsEx5 = defineHtml(`
  <h2>${t("section")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <div style="width:100%;max-width:860px">
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
