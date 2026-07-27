import { defineHtml, useRef } from "@elfui/core";


const advancedSelected = useRef("未选择");

const items = [
  { label: "编辑资料", command: "edit", icon: "✎", shortcut: "E" },
  { label: "复制链接", command: "copy", icon: "⧉", shortcut: "Ctrl C" },
  {
    label: "更多操作",
    command: "more",
    icon: "⋯",
    children: [
      { label: "移动到归档", command: "archive" },
      { label: "导出记录", command: "export" }
    ]
  },
  { label: "删除", command: "delete", icon: "×", divided: true }
];

const disabledItems = [
  { label: "刷新", command: "refresh" },
  { label: "锁定中", command: "lock", disabled: true },
  { label: "审计日志", command: "audit" }
];

const advancedCode = `<elf-dropdown
  :items.prop=\${items}
  label="选择后不关闭"
  :hideOnClick=\${false}
  @command=\${onAdvancedCommand}
></elf-dropdown>`;

const triggerScript = `const items = [
  { label: "编辑资料", command: "edit", icon: "✎", shortcut: "E" },
  { label: "复制链接", command: "copy", icon: "⧉", shortcut: "Ctrl C" },
  {
    label: "更多操作",
    command: "more",
    icon: "⋯",
    children: [
      { label: "移动到归档", command: "archive" },
      { label: "导出记录", command: "export" }
    ]
  }
];

const advancedSelected = useRef("未选择");
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
<elf-playground title="子菜单、禁用项与保持展开" :code=${advancedCode} :script=${triggerScript}>
      <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
        <elf-dropdown
          :items.prop=${items}
          label="选择后不关闭"
          :hideOnClick=${false}
          @command=${onAdvancedCommand}
        ></elf-dropdown>
        <elf-dropdown :items.prop=${disabledItems} label="禁用项"></elf-dropdown>
        <span slot="status" class="demo-state">当前命令：{{ advancedSelected }}</span>
      </div>
    </elf-playground>
`);

export { PageDropdownEx2 };
