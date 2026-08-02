import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  hover: { zh: "悬停展开", en: "Open on hover" },
  hoverTitle: { zh: "悬停触发子菜单", en: "Hover-triggered submenu" },
  theme: { zh: "主题与自定义颜色", en: "Theme and custom colors" },
  themeTitle: { zh: "暗色主题与自定义颜色", en: "Dark theme and custom colors" },
});

const active = useRef("analytics");
const activeDark = useRef("home");
const activeCustom = useRef("profile");

const items = [
  {
    index: "analytics",
    label: "Analytics",
    icon: "A",
    children: [
      { index: "analytics-overview", label: "Overview" },
      { index: "analytics-realtime", label: "Realtime" },
      { index: "analytics-retention", label: "Retention" },
    ],
  },
  {
    index: "workspace",
    label: "Workspace",
    icon: "W",
    children: [
      { index: "workspace-projects", label: "Projects" },
      { index: "workspace-tasks", label: "Tasks" },
    ],
  },
  { index: "settings", label: "Settings", icon: "S" },
];

const themeItems = [
  { index: "home", label: "Home", icon: "H" },
  { index: "profile", label: "Profile", icon: "P", badge: "new" },
  { index: "messages", label: "Messages", icon: "M", badge: 5 },
  { divider: true },
  {
    index: "settings",
    label: "Settings",
    icon: "S",
    children: [
      { index: "general", label: "General" },
      { index: "security", label: "Security" },
      { index: "notifications", label: "Notifications", badge: 3 },
    ],
  },
];

const code1 = `<elf-menu
  :items=\${items}
  :modelValue=\${active}
  menu-trigger="hover"
  :showTimeout=\${120}
  :hideTimeout=\${260}
  rounded
>
  <template #header>
    <strong>Hover Menu</strong>
  </template>
</elf-menu>`;

const code2 = `<elf-menu :items=\${items} :modelValue=\${activeDark} theme="dark" rounded show-toggle />

<elf-menu
  :items=\${items}
  :modelValue=\${activeCustom}
  backgroundColor="#f5f0ff"
  activeTextColor="#7c3aed"
  activeBackground="rgba(124,58,237,0.12)"
  rounded
/>`;

const script = `const active = useRef("analytics-overview");
const items = [
  { index: "analytics", label: "Analytics", children: [
    { index: "analytics-overview", label: "Overview" },
    { index: "analytics-realtime", label: "Realtime" }
  ] },
  { index: "settings", label: "Settings" }
];

const activeDark = useRef("home");
const activeCustom = useRef("profile");`;

const PageMenuEx6 = defineHtml(`
  <h2>${t("hover")}</h2>
  <elf-playground :title=${t("hoverTitle")} :code=${code1} :script=${script}>
    <elf-menu
      bordered
      :items=${items}
      :modelValue=${active}
      menu-trigger="hover"
      :showTimeout=${120}
      :hideTimeout=${260}
      rounded
      style="height:360px"
    >
      <template #header>
        <div style="display:flex;align-items:center;gap:8px">
          <elf-avatar size="sm" alt="Hover"></elf-avatar>
          <strong>Hover Menu</strong>
        </div>
      </template>
    </elf-menu>
  </elf-playground>

  <h2>${t("theme")}</h2>
  <elf-playground :title=${t("themeTitle")} :code=${code2} :script=${script}>
    <div style="display:flex;gap:16px;flex-wrap:wrap">
      <elf-menu
        bordered
        :items=${themeItems}
        :modelValue=${activeDark}
        theme="dark"
        rounded
        show-toggle
        style="height:400px"
      ></elf-menu>
      <elf-menu
        bordered
        :items=${themeItems}
        :modelValue=${activeCustom}
        backgroundColor="#f5f0ff"
        activeTextColor="#7c3aed"
        activeBackground="rgba(124,58,237,0.12)"
        rounded
        style="height:400px"
      ></elf-menu>
    </div>
  </elf-playground>
`);

export { PageMenuEx6 };
