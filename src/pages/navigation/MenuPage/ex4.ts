import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  sectionFull: { zh: "分隔线、徽章、分组与头尾区域", en: "Dividers, badges, groups, header, and footer" },
  titleFull: { zh: "完整菜单：分隔线、徽章、分组、头像、底栏", en: "Complete menu with dividers, badges, groups, avatar, and footer" },
  sectionSearch: { zh: "搜索、分组、徽章与折叠按钮", en: "Search, groups, badges, and collapse control" },
  titleSearch: { zh: "搜索过滤 + 分组标题 + 折叠切换", en: "Search filtering + group headings + collapse toggle" },
  inbox: { zh: "收件箱", en: "Inbox" }, drafts: { zh: "草稿", en: "Drafts" }, starred: { zh: "星标", en: "Starred" }, archive: { zh: "归档", en: "Archive" },
  labels: { zh: "标签", en: "Labels" }, personal: { zh: "个人", en: "Personal" }, work: { zh: "工作", en: "Work" }, travel: { zh: "旅行", en: "Travel" },
  home: { zh: "首页", en: "Home" }, explore: { zh: "探索", en: "Explore" }, favorites: { zh: "收藏", en: "Favorites" },
  library: { zh: "资料库", en: "Library" }, recent: { zh: "最近", en: "Recent" }, liked: { zh: "喜欢", en: "Liked" }, saved: { zh: "已保存", en: "Saved" },
  administrator: { zh: "管理员", en: "Administrator" }, currentUser: { zh: "当前用户", en: "Current user" }, signOut: { zh: "退出", en: "Sign out" }
});

type LocalizedMenuItem = { label?: string; group?: string; children?: LocalizedMenuItem[]; [key: string]: unknown };
const localizeItems = (source: LocalizedMenuItem[]): LocalizedMenuItem[] => source.map((item) => ({
  ...item,
  ...(item.label ? { label: t(item.label as Parameters<typeof t>[0]) } : {}),
  ...(item.group ? { group: t(item.group as Parameters<typeof t>[0]) } : {}),
  ...(item.children ? { children: localizeItems(item.children) } : {})
}));


const active = useRef("inbox");

const active2 = useRef("home");

const items = [
  { index: "inbox", label: "inbox", icon: "✉", badge: 12 },
  { index: "drafts", label: "drafts", icon: "📝", badge: 3 },
  { divider: true },
  { index: "starred", label: "starred", icon: "★" },
  { index: "archive", label: "archive", icon: "📦" },
  { divider: true },
  {
    group: "labels",
    children: [
      { index: "personal", label: "personal" },
      { index: "work", label: "work", badge: 5 },
      { index: "travel", label: "travel" }
    ]
  }
];

const items2 = [
  { index: "home", label: "home", icon: "🏠" },
  { index: "explore", label: "explore", icon: "🔍" },
  { divider: true },
  { index: "favorites", label: "favorites", icon: "❤", badge: 8 },
  {
    group: "library",
    children: [
      { index: "recent", label: "recent" },
      { index: "liked", label: "liked" },
      { index: "saved", label: "saved", badge: 42 }
    ]
  }
];

const code = `<elf-menu :items=\${items} :modelValue=\${active} rounded elevation>
  <template #header>
    <div style="display:flex;align-items:center;gap:12px">
      <elf-avatar size="sm" alt="User"></elf-avatar>
      <div><strong>Admin</strong><br/><span style="font-size:12px;color:var(--elf-text-secondary)">admin@elfui.dev</span></div>
    </div>
  </template>
  <template #footer>
    <div style="display:flex;align-items:center;justify-content:space-between">
      <span style="font-size:12px;color:var(--elf-text-disabled)">v1.0.0</span>
      <elf-button variant="text" size="sm">退出</elf-button>
    </div>
  </template>
</elf-menu>`;

const code2 = `<elf-menu
  :items=\${items}
  :modelValue=\${active}
  searchable
  bordered
  rounded
  elevation
  show-toggle
  toggle-placement="header"
>
  <template #header>...</template>
</elf-menu>`;

const script = `const active = useRef("inbox");
const items = [
  { index: "inbox", label: "Inbox", icon: "✉", badge: 12 },
  { index: "drafts", label: "Drafts", icon: "📝", badge: 3 },
  { divider: true },
  { group: "Labels", children: [{ index: "work", label: "Work", badge: 5 }] }
];`;

const PageMenuEx4 = defineHtml(`
  <h2>${t("sectionFull")}</h2>
  <elf-playground :title=${t("titleFull")} :code=${code} :script=${script}>
    <elf-menu :key=${t("sectionFull")} :items.prop=${localizeItems(items)} :modelValue.prop=${active.value} bordered rounded elevation style="height:540px">
      <template #header>
        <div style="display:flex;align-items:center;gap:12px">
          <elf-avatar size="sm" alt="User"></elf-avatar>
          <div>
            <strong>${t("administrator")}</strong><br /><span style="font-size:12px;color:var(--elf-text-secondary)"
              >admin@elfui.dev</span
            >
          </div>
        </div>
      </template>
      <template #footer>
        <div style="display:flex;align-items:center;justify-content:space-between">
          <span style="font-size:12px;color:var(--elf-text-disabled)">v1.0.0</span>
          <elf-button variant="text" size="sm">${t("signOut")}</elf-button>
        </div>
      </template>
    </elf-menu>
  </elf-playground>

  <h2>${t("sectionSearch")}</h2>
  <elf-playground :title=${t("titleSearch")} :code=${code2} :script=${script}>
    <elf-menu
      :key=${t("sectionSearch")}
      :items.prop=${localizeItems(items2)}
      :modelValue.prop=${active2.value}
      searchable
      bordered
      rounded
      elevation
      show-toggle
      toggle-placement="header"
      style="height:480px"
    >
      <template #header>
        <div style="display:flex;align-items:center;gap:12px;min-width:0">
          <elf-avatar size="sm" alt="User"></elf-avatar>
          <div><strong>${t("currentUser")}</strong></div>
        </div>
      </template>
    </elf-menu>
  </elf-playground>
`);

export { PageMenuEx4 };
