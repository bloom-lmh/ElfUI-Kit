import { defineHtml, useRef } from "@elfui/core";


const basicSelected = useRef("未选择");

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

const basicCode = `<elf-dropdown
  :items.prop=\${items}
  label="更多操作"
  @command=\${onBasicCommand}
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

const basicSelected = useRef("未选择");
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
<elf-playground title="基础命令菜单" :code=${basicCode} :script=${triggerScript}>
      <div style="display:grid;gap:12px;align-items:start">
        <elf-dropdown
          :items.prop=${items}
          label="更多操作"
          @command=${onBasicCommand}
        ></elf-dropdown>
        <span slot="status" class="demo-state">当前命令：{{ basicSelected }}</span>
      </div>
    </elf-playground>
`);

export { PageDropdownEx1 };
