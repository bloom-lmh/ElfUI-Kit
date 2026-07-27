import { defineHtml, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  section: { zh: "外观变体：顶部导航", en: "Appearance: top navigation" },
  title: { zh: "等宽、堆叠与主题色", en: "Grow, stacked labels, and color" },
  inbox: { zh: "收件箱", en: "Inbox" },
  inboxContent: { zh: "消息中心", en: "Message center" },
  reports: { zh: "报表", en: "Reports" },
  reportsContent: { zh: "报表中心", en: "Reporting center" },
  settings: { zh: "设置", en: "Settings" },
  settingsContent: { zh: "系统设置", en: "System settings" }
});

const active = useRef("inbox");
const items = () => [
  { label: t("inbox"), value: "inbox", icon: "I", content: t("inboxContent") },
  { label: t("reports"), value: "reports", icon: "R", content: t("reportsContent") },
  { label: t("settings"), value: "settings", icon: "S", content: t("settingsContent") }
];
const onChange = (event: CustomEvent): void => active.set(String(event.detail));

const code = `<elf-tabs :items.prop=\${items} :modelValue=\${active} grow stacked show-panels color="#6750a4" />`;
const script = `const active = useRef("inbox");
const items = [
  { label: "Inbox", value: "inbox", content: "Message center" },
  { label: "Reports", value: "reports", content: "Reporting center" },
  { label: "Settings", value: "settings", content: "System settings" }
];`;

const PageTabsEx2 = defineHtml(`
  <h2>${t("section")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <div style="display:grid;gap:20px;width:100%;max-width:860px">
      <elf-tabs
        :key=${t("section")}
        :items.prop=${items()}
        :modelValue.prop=${active.value}
        grow stacked show-panels color="#6750a4"
        @update:modelValue=${onChange}
      ></elf-tabs>
    </div>
  </elf-playground>
`);

export { PageTabsEx2 };
