import { defineHtml } from "@elfui/core";

const sizeCode = `<elf-switch size="sm" />
<elf-switch size="md" />
<elf-switch size="lg" />`;

const stateCode = `<elf-switch disabled label="不可切换" />
<elf-switch loading label="保存中" />`;

const PageSwitchEx2 = defineHtml(`
  <h2>尺寸</h2>
  <elf-playground title="小、中、大三种尺寸" :code=${sizeCode}>
    <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
      <elf-switch size="sm" label="小"></elf-switch>
      <elf-switch size="md" label="中"></elf-switch>
      <elf-switch size="lg" label="大"></elf-switch>
    </div>
  </elf-playground>

  <h2>禁用与加载</h2>
  <elf-playground title="禁用与加载状态" :code=${stateCode}>
    <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
      <elf-switch disabled label="不可切换"></elf-switch>
      <elf-switch loading label="保存中"></elf-switch>
      <elf-switch loading model-value active-text="开" inactive-text="关"></elf-switch>
    </div>
  </elf-playground>
`);

export { PageSwitchEx2 };
