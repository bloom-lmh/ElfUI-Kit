import { defineHtml } from "@elfui/core";
import { createDocsPicker } from "../../docsLocale";

const pick = createDocsPicker();

const layoutRows = [
  {
    name: "<elf-layout> direction",
    type: "vertical|horizontal",
    default: "auto",
    desc: pick(
      "主轴方向；直接包含 Aside 时自动切换为横向",
      "Main-axis direction; switches to horizontal when it directly contains an Aside.",
    ),
  },
  {
    name: "<elf-header> height",
    type: "string",
    default: "60px",
    desc: pick("顶栏高度", "Header height."),
  },
  {
    name: "<elf-aside> width",
    type: "string",
    default: "300px",
    desc: pick("侧栏宽度", "Sidebar width."),
  },
  {
    name: "<elf-main>",
    type: "—",
    default: "—",
    desc: pick("占据布局中的剩余空间", "Fills the remaining layout space."),
  },
  {
    name: "<elf-footer> height",
    type: "string",
    default: "60px",
    desc: pick("页脚高度", "Footer height."),
  },
];

const slotsRows = [
  {
    name: "default",
    type: "—",
    default: "—",
    desc: pick("各布局区域的默认内容", "Default content for each layout region."),
  },
];

const PageLayoutShellProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table title="Props" :rows=${layoutRows} />
  <elf-props-table title="Slots" :rows=${slotsRows} />
`);

export { PageLayoutShellProps };
