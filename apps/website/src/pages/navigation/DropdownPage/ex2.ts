import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "子菜单与禁用", en: "Nested menu and disabled items" },
  keepOpen: { zh: "选择后不关闭", en: "Keep open after selection" },
  disabledItems: { zh: "禁用项", en: "Disabled items" },
  edit: { zh: "编辑资料", en: "Edit profile" },
  copy: { zh: "复制链接", en: "Copy link" },
  more: { zh: "更多操作", en: "More actions" },
  archive: { zh: "移动到归档", en: "Move to archive" },
  export: { zh: "导出记录", en: "Export record" },
  delete: { zh: "删除", en: "Delete" },
  refresh: { zh: "刷新", en: "Refresh" },
  locked: { zh: "锁定中", en: "Locked" },
  audit: { zh: "审计日志", en: "Audit log" },
  notSelected: { zh: "未选择", en: "No selection" },
  currentCommand: { zh: "当前命令", en: "Current command" },
});

const items = [
  { label: t("edit"), command: "edit", icon: "✎", shortcut: "E" },
  { label: t("copy"), command: "copy", icon: "⧉", shortcut: "Ctrl C" },
  {
    label: t("more"),
    command: "more",
    icon: "⋯",
    children: [
      { label: t("archive"), command: "archive" },
      { label: t("export"), command: "export" },
    ],
  },
  { label: t("delete"), command: "delete", icon: "×", divided: true },
];

const disabledItems = [
  { label: t("refresh"), command: "refresh" },
  { label: t("locked"), command: "lock", disabled: true },
  { label: t("audit"), command: "audit" },
];

const advancedSelected = useRef(t("notSelected"));

const advancedCode = `<elf-dropdown
  :items.prop=\${items}
  label="${t("keepOpen")}"
  :hideOnClick=\${false}
  @command=\${onAdvancedCommand}
></elf-dropdown>`;

const triggerScript = `const items = [
  { label: "${t("edit")}", command: "edit", icon: "✎", shortcut: "E" },
  { label: "${t("copy")}", command: "copy", icon: "⧉", shortcut: "Ctrl C" },
  {
    label: "${t("more")}",
    command: "more",
    icon: "⋯",
    children: [
      { label: "${t("archive")}", command: "archive" },
      { label: "${t("export")}", command: "export" }
    ]
  }
];

const advancedSelected = useRef("${t("notSelected")}");
const commandText = (event) => {
    const detail = event.detail;
    return \`\${String(detail.command || "")} / \${String(detail.item?.label || "")}\`;
};
const onAdvancedCommand = (event) => {
    advancedSelected.set(commandText(event));
};`;

const commandText = (event: CustomEvent): string => {
  const detail = event.detail as { command?: string; item?: { label?: string } };
  return `${String(detail.command || "")} / ${String(detail.item?.label || "")}`;
};

const onAdvancedCommand = (event: CustomEvent): void => {
  advancedSelected.set(commandText(event));
};

const PageDropdownEx2 = defineHtml(`
<elf-playground :title=${t("title")} :code=${advancedCode} :script=${triggerScript}>
      <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
        <elf-dropdown
          :items.prop=${items}
          :label=${t("keepOpen")}
          :hideOnClick=${false}
          @command=${onAdvancedCommand}
        ></elf-dropdown>
        <elf-dropdown :items.prop=${disabledItems} :label=${t("disabledItems")}></elf-dropdown>
        <span slot="status" class="demo-state">${t("currentCommand")}: {{ advancedSelected }}</span>
      </div>
    </elf-playground>
`);

export { PageDropdownEx2 };
