import { defineHtml } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "兼容配置", en: "Compatibility options" },
  edit: { zh: "编辑资料", en: "Edit profile" },
  copy: { zh: "复制链接", en: "Copy link" },
  more: { zh: "更多操作", en: "More actions" },
  archive: { zh: "移动到归档", en: "Move to archive" },
  export: { zh: "导出记录", en: "Export record" },
  delete: { zh: "删除", en: "Delete" },
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

const compatCode = `<elf-dropdown
  type="primary"
  trigger="hover"
  :items.prop=\${items}
  :showTimeout=\${120}
  :hideTimeout=\${240}
  :triggerKeys=\${["ArrowDown"]}
  popper-class="dropdown-demo-popper"
  :popperStyle=\${{ width: "240px" }}
  :closeOnClickOutside=\${false}
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
];`;

const PageDropdownEx4 = defineHtml(`
<elf-playground :title=${t("title")} :code=${compatCode} :script=${triggerScript}>
      <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
        <elf-dropdown
          type="primary"
          trigger="hover"
          :items.prop=${items}
          :showTimeout=${120}
          :hideTimeout=${240}
          :triggerKeys=${["ArrowDown"]}
          popper-class="dropdown-demo-popper"
          :popperStyle=${{ width: "240px" }}
          :closeOnClickOutside=${false}
          label="Hover / ArrowDown"
        ></elf-dropdown>
      </div>
    </elf-playground>
`);

export { PageDropdownEx4 };
