import { defineHtml, useRef } from "@elfui/core";

const lastAction = useRef("等待选择");

const items = [
  { label: "查看详情", command: "detail" },
  { label: "复制链接", command: "copy" },
  { label: "移到归档", command: "archive", divided: true }
];

const popperOptions = {
  modifiers: [
    { name: "offset", options: { offset: [0, 10] } },
    { name: "flip", enabled: true },
    { name: "preventOverflow", options: { padding: 12 } }
  ]
};

const onCommand = (event: CustomEvent): void => {
  lastAction.set(`执行：${String(event.detail.command)}`);
};

const code = `<elf-dropdown
  :items=\${items}
  teleported
  append-to="body"
  placement="bottom-end"
  :popperOptions=\${popperOptions}
  @command="onCommand"
/>`;

const script = `const lastAction = useRef("等待选择");
const items = [
    { label: "查看详情", command: "detail" },
    { label: "复制链接", command: "copy" },
    { label: "移到归档", command: "archive", divided: true }
];
const popperOptions = {
    modifiers: [
        { name: "offset", options: { offset: [0, 10] } },
        { name: "flip", enabled: true },
        { name: "preventOverflow", options: { padding: 12 } }
    ]
};
const onCommand = (event) => {
    lastAction.set(\`执行：\${String(event.detail.command)}\`);
};`;

const PageDropdownEx6 = defineHtml(`
  <h2>锚定浮层与视口碰撞</h2>
  <elf-playground title="top layer / offset / flip / preventOverflow" :code=${code} :script=${script}>
    <span slot="status">{{ lastAction }}</span>
    <div
      style="width:min(100%,520px);height:150px;overflow:hidden;transform:translateZ(0);border:1px dashed var(--elf-border);border-radius:12px;padding:18px;box-sizing:border-box;display:flex;justify-content:flex-end;align-items:flex-end"
    >
      <elf-dropdown
        :items=${items}
        label="受裁切容器内的操作"
        teleported
        append-to="body"
        placement="bottom-end"
        :popperOptions=${popperOptions}
        @command=${onCommand}
      ></elf-dropdown>
    </div>
  </elf-playground>
`);

export { PageDropdownEx6 };
