import { defineHtml } from "@elfui/core";

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
];`;

const PageDropdownEx4 = defineHtml(`
<elf-playground title="兼容配置" :code=${compatCode} :script=${triggerScript}>
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
