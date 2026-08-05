import { defineHtml, defineStyle, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

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
  appearance: { zh: "触发器外观", en: "Trigger appearance" },
  controls: { zh: "命令菜单配置", en: "Command menu controls" },
  filled: { zh: "填充", en: "Filled" },
  outlined: { zh: "描边", en: "Outlined" },
  underlined: { zh: "下划线", en: "Underlined" },
  solo: { zh: "独立表面", en: "Solo" },
  soloFilled: { zh: "独立填充", en: "Solo filled" },
  soloInverted: { zh: "独立反色", en: "Solo inverted" },
  workspace: { zh: "团队工作区", en: "Team workspace" },
  workspaceHint: {
    zh: "从更接近真实产品的命令入口打开菜单。",
    en: "Open commands from a product-like workspace surface.",
  },
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
      { label: t("export"), command: "export" },
    ],
  },
  { label: t("delete"), command: "delete", icon: "×", divided: true },
];

const basicSelected = useRef(t("notSelected"));
const variant = useRef("filled");

const variantOptions = () => [
  { label: t("filled"), value: "filled" },
  { label: t("outlined"), value: "outlined" },
  { label: t("underlined"), value: "underlined" },
  { label: t("solo"), value: "solo" },
  { label: t("soloFilled"), value: "solo-filled" },
  { label: t("soloInverted"), value: "solo-inverted" },
];

const detail = (event: CustomEvent): unknown =>
  Array.isArray(event.detail) ? event.detail[0] : event.detail;

const onVariant = (event: CustomEvent): void => {
  variant.set(String(detail(event) || "filled"));
};

const basicCode = (): string => `<elf-dropdown
  :items.prop=\${items}
  label="${t("moreActions")}"
  variant="${variant.value}"
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

defineStyle(styles);

const PageDropdownEx1 = defineHtml(`
<elf-playground :title=${t("title")} :code=${basicCode()} :script=${triggerScript}>
      <section class="command-surface">
        <div class="command-copy">
          <span class="command-eyebrow">${t("workspace")}</span>
          <strong>${t("moreActions")}</strong>
          <span>${t("workspaceHint")}</span>
        </div>
        <elf-dropdown
          :items.prop=${items}
          :label=${t("moreActions")}
          :variant.prop=${variant.value}
          @command=${onBasicCommand}
        ></elf-dropdown>
      </section>
      <span slot="status" class="demo-state">${t("currentCommand")}: {{ basicSelected }}</span>
      <aside slot="controls" class="command-controls" :aria-label=${t("controls")}>
        <strong>${t("controls")}</strong>
        <label>
          <elf-select
            variant="underlined"
            :label=${t("appearance")}
            :options.prop=${variantOptions()}
            :modelValue.prop=${variant.value}
            @update:modelValue=${onVariant}
          ></elf-select>
        </label>
      </aside>
    </elf-playground>
`);

export { PageDropdownEx1 };
