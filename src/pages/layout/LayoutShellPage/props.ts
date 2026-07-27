import { defineHtml } from "@elfui/core";

const layoutRows = [
  { name: "<elf-layout> direction", type: "vertical|horizontal", default: "auto", desc: "直接包含 Aside 时自动横向" },
  { name: "<elf-header> height", type: "string", default: "60px" },
  { name: "<elf-aside> width", type: "string", default: "300px" },
  { name: "<elf-main>", type: "—", default: "—", desc: "占据剩余空间" },
  { name: "<elf-footer> height", type: "string", default: "60px" }
];

const PageLayoutShellProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table title="Props" :rows=${layoutRows} />
`);

export { PageLayoutShellProps };
