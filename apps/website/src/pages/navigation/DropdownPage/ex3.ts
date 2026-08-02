import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "触发方式与位置", en: "Trigger modes and placement" },
  hover: { zh: "Hover 展开", en: "Open on hover" },
  context: { zh: "右键展开", en: "Open on right click" },
  split: { zh: "分裂按钮", en: "Split button" },
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

const triggerSelected = useRef(t("notSelected"));

const triggerCode = `<elf-dropdown trigger="hover" placement="bottom-start" :items.prop=\${items}></elf-dropdown>
<elf-dropdown trigger="contextmenu" :items.prop=\${items}></elf-dropdown>`;

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
];`;

const commandText = (event: CustomEvent): string => {
  const detail = event.detail as { command?: string; item?: { label?: string } };
  return `${String(detail.command || "")} / ${String(detail.item?.label || "")}`;
};

const onTriggerCommand = (event: CustomEvent): void => {
  triggerSelected.set(commandText(event));
};

const PageDropdownEx3 = defineHtml(`
<elf-playground :title=${t("title")} :code=${triggerCode} :script=${triggerScript}>
      <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
        <elf-dropdown
          trigger="hover"
          placement="bottom-start"
          :items.prop=${items}
          :label=${t("hover")}
          @command=${onTriggerCommand}
        ></elf-dropdown>
        <elf-dropdown
          trigger="contextmenu"
          :items.prop=${items}
          :label=${t("context")}
          @command=${onTriggerCommand}
        ></elf-dropdown>
        <elf-dropdown
          split-button
          :items.prop=${disabledItems}
          :label=${t("split")}
          @command=${onTriggerCommand}
        ></elf-dropdown>
        <span slot="status" class="demo-state">${t("currentCommand")}: {{ triggerSelected }}</span>
      </div>
    </elf-playground>
`);

export { PageDropdownEx3 };
