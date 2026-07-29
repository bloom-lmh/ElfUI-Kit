import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "基础命令菜单", en: "Basic command menu" },
  moreActions: { zh: "更多操作", en: "More actions" },
  edit: { zh: "编辑资料", en: "Edit profile" },
  copy: { zh: "复制链接", en: "Copy link" },
  archive: { zh: "移动到归档", en: "Move to archive" },
  export: { zh: "导出记录", en: "Export record" },
  delete: { zh: "删除", en: "Delete" },
  notSelected: { zh: "未选择", en: "No selection" },
  currentCommand: { zh: "当前命令", en: "Current command" },
});

const items = [
  { label: t("edit"), command: "edit", icon: "✎", shortcut: "E" },
  { label: t("copy"), command: "copy", icon: "⧉", shortcut: "Ctrl C" },
  {
    label: t("moreActions"),
    command: "more",
    icon: "⋯",
    children: [
      { label: t("archive"), command: "archive" },
      { label: t("export"), command: "export" }
    ]
  },
  { label: t("delete"), command: "delete", icon: "×", divided: true }
];

const basicSelected = useRef(t("notSelected"));

const basicCode = `<elf-dropdown
  :items.prop=\${items}
  label="${t("moreActions")}"
  @command=\${onBasicCommand}
></elf-dropdown>`;

const triggerScript = `const items = [
  { label: "${t("edit")}", command: "edit", icon: "✎", shortcut: "E" },
  { label: "${t("copy")}", command: "copy", icon: "⧉", shortcut: "Ctrl C" },
  {
    label: "${t("moreActions")}",
    command: "more",
    icon: "⋯",
    children: [
      { label: "${t("archive")}", command: "archive" },
      { label: "${t("export")}", command: "export" }
    ]
  }
];

const basicSelected = useRef("${t("notSelected")}");
const commandText = (event) => {
    const detail = event.detail;
    return \`\${String(detail.command || "")} / \${String(detail.item?.label || "")}\`;
};
const onBasicCommand = (event) => {
    basicSelected.set(commandText(event));
};`;

const commandText = (event: CustomEvent): string => {
  const detail = event.detail as { command?: string; item?: { label?: string } };
  return `${String(detail.command || "")} / ${String(detail.item?.label || "")}`;
};

const onBasicCommand = (event: CustomEvent): void => {
  basicSelected.set(commandText(event));
};

const PageDropdownEx1 = defineHtml(`
<elf-playground :title=${t("title")} :code=${basicCode} :script=${triggerScript}>
      <div style="display:grid;gap:12px;align-items:start">
        <elf-dropdown
          :items.prop=${items}
          :label=${t("moreActions")}
          @command=${onBasicCommand}
        ></elf-dropdown>
        <span slot="status" class="demo-state">${t("currentCommand")}: {{ basicSelected }}</span>
      </div>
    </elf-playground>
`);

export { PageDropdownEx1 };
