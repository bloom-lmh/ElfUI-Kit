import { defineHtml, useRef } from "@elfui/core";


const triggerSelected = useRef("未选择");

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

const triggerCode = `<elf-dropdown trigger="hover" placement="bottom-start" :items.prop=\${items}></elf-dropdown>
<elf-dropdown trigger="contextmenu" :items.prop=\${items}></elf-dropdown>`;

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

const commandText = (event: CustomEvent): string => {
  const detail = event.detail as { command?: string; item?: { label?: string } };
  return `${String(detail.command || "")} / ${String(detail.item?.label || "")}`;
};

const onTriggerCommand = (event: CustomEvent): void => {
  triggerSelected.set(commandText(event));
};

const PageDropdownEx3 = defineHtml(`
<elf-playground title="触发方式与位置" :code=${triggerCode} :script=${triggerScript}>
      <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
        <elf-dropdown
          trigger="hover"
          placement="bottom-start"
          :items.prop=${items}
          label="Hover 展开"
          @command=${onTriggerCommand}
        ></elf-dropdown>
        <elf-dropdown
          trigger="contextmenu"
          :items.prop=${items}
          label="右键展开"
          @command=${onTriggerCommand}
        ></elf-dropdown>
        <elf-dropdown
          split-button
          :items.prop=${disabledItems}
          label="分裂按钮"
          @command=${onTriggerCommand}
        ></elf-dropdown>
        <span slot="status" class="demo-state">当前命令：{{ triggerSelected }}</span>
      </div>
    </elf-playground>
`);

export { PageDropdownEx3 };
