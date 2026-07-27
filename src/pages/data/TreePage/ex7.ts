import { defineHtml, useRef } from "@elfui/core";

const nodes = useRef([
  { key: "brief", label: "01 · 产品简报" },
  { key: "tokens", label: "02 · 设计令牌" },
  { key: "release", label: "03 · 发布检查" },
  { key: "archive", label: "04 · 归档" }
]);
const status = useRef("Space 抓取，方向键定位，Enter 投放，Esc 取消");
const onDrop = (event: CustomEvent): void => {
  const [source, target, placement] = event.detail;
  status.set(`${source.label} → ${target.label} · ${placement}`);
};

const code = `<elf-tree draggable :data.prop="nodes" @node-drop="onDrop" />`;
const script = `// Keyboard: Space grabs, ArrowUp/ArrowDown chooses a sibling,
// ArrowRight switches to inner placement, Enter drops, Escape cancels.`;

const PageTreeEx7 = defineHtml(`
  <elf-playground title="同级排序与键盘拖拽" :code=${code} :script=${script}>
    <span slot="status" class="demo-state">${status}</span>
    <elf-card variant="outlined" style="width:min(100%,520px);padding:12px">
      <elf-tree draggable :data.prop=${nodes} @node-drop=${onDrop}></elf-tree>
    </elf-card>
  </elf-playground>
`);

export { PageTreeEx7 };
