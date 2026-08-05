import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  section: { zh: "多级菜单（三层嵌套）", en: "Nested menu (three levels)" },
  title: {
    zh: "面包屑层级",
    en: "Breadcrumb hierarchy",
  },
  signOut: { zh: "退出", en: "Sign out" },
});

const active = useRef("platform-web");

const items = [
  {
    index: "platform",
    label: "Platform",
    icon: "⚙",
    children: [
      {
        index: "platform-web",
        label: "Web",
        icon: "🌐",
        children: [
          { index: "platform-web-react", label: "React", icon: "⚛" },
          { index: "platform-web-vue", label: "Vue", icon: "💚" },
          { index: "platform-web-svelte", label: "Svelte", icon: "🔥" },
        ],
      },
      {
        index: "platform-mobile",
        label: "Mobile",
        icon: "📱",
        children: [
          { index: "platform-mobile-ios", label: "iOS", icon: "🍎" },
          { index: "platform-mobile-android", label: "Android", icon: "🤖" },
        ],
      },
    ],
  },
  { divider: true },
  {
    index: "develop",
    label: "Develop",
    icon: "⌨",
    children: [
      { index: "develop-api", label: "API Keys", icon: "🔑", badge: 3 },
      { index: "develop-webhooks", label: "Webhooks", icon: "🪝" },
      { index: "develop-logs", label: "Logs", icon: "📋" },
    ],
  },
  { index: "docs", label: "Documentation", icon: "📖" },
];

const code = `<elf-menu :items="items" :modelValue="active" :defaultOpeneds="['platform','platform-web']" unique-opened rounded elevation show-toggle style="max-height:540px">
  <template #header>
    <div style="display:flex;align-items:center;gap:12px">
      <elf-avatar size="sm" alt="Dev"></elf-avatar>
      <div><strong>Developer</strong><br/><span style="font-size:12px;color:var(--elf-text-secondary)">dev@elfui.dev</span></div>
    </div>
  </template>
  <template #footer>
    <div style="display:flex;align-items:center;justify-content:flex-end">
      <elf-button variant="text" size="sm">Sign out</elf-button>
    </div>
  </template>
</elf-menu>`;

const script = `const active = useRef("platform-web-react");
const items = [
  {
    index: "platform",
    label: "Platform",
    children: [{
      index: "platform-web",
      label: "Web",
      children: [
        { index: "platform-web-react", label: "React" },
        { index: "platform-web-vue", label: "Vue" }
      ]
    }]
  }
];`;

const PageMenuEx5 = defineHtml(`
  <h2>${t("section")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <elf-menu
      bordered
      :items="items"
      :modelValue="active"
      :defaultOpeneds="['platform','platform-web']"
      unique-opened
      rounded
      elevation
      show-toggle
      style="max-height:540px"
    >
      <template #header>
        <div style="display:flex;align-items:center;gap:12px">
          <elf-avatar size="sm" alt="Dev"></elf-avatar>
          <div>
            <strong>Developer</strong><br /><span
              style="font-size:12px;color:var(--elf-text-secondary)"
              >dev@elfui.dev</span
            >
          </div>
        </div>
      </template>
      <template #footer>
        <div style="display:flex;align-items:center;justify-content:flex-end">
          <elf-button variant="text" size="sm">${t("signOut")}</elf-button>
        </div>
      </template>
    </elf-menu>
  </elf-playground>
`);

export { PageMenuEx5 };
