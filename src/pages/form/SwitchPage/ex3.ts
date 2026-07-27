import { defineHtml } from "@elfui/core";

const variantCode = `<elf-switch variant="default" label="Default" />
<elf-switch variant="inset" color="success" label="Inset" />
<elf-switch variant="material" color="warning" label="Material" />
<elf-switch variant="square" color="#7c3aed" label="Square" />`;

const labelCode = `<elf-switch label-position="start">默认 slot 标签</elf-switch>`;

const actionCode = `<elf-switch
  active-action-icon="✓"
  inactive-action-icon="○"
  active-text="已同步"
  inactive-text="未同步"
/>`;

const PageSwitchEx3 = defineHtml(`
  <h2>外观</h2>
  <elf-playground title="Default / Inset / Material / Square" :code=${variantCode}>
    <div style="display:grid;grid-template-columns:repeat(2,minmax(180px,1fr));gap:22px 40px;width:min(100%,560px)">
      <div style="display:flex;gap:12px;align-items:center"><elf-switch variant="default"></elf-switch><span>Default</span></div>
      <div style="display:flex;gap:12px;align-items:center"><elf-switch variant="inset" color="success" :modelValue.prop=${true}></elf-switch><span>Inset</span></div>
      <div style="display:flex;gap:12px;align-items:center"><elf-switch variant="material" color="warning"></elf-switch><span>Material</span></div>
      <div style="display:flex;gap:12px;align-items:center"><elf-switch variant="square" color="#7c3aed" :modelValue.prop=${true}></elf-switch><span>Square</span></div>
    </div>
  </elf-playground>

  <h2>标签 slot</h2>
  <elf-playground title="默认插槽标签" :code=${labelCode}>
    <div style="display:flex;gap:18px;align-items:center;flex-wrap:wrap">
      <elf-switch label-position="start">默认 slot 标签</elf-switch>
      <elf-switch label="属性标签"></elf-switch>
    </div>
  </elf-playground>

  <h2>动作图标</h2>
  <elf-playground title="滑块状态图标" :code=${actionCode}>
    <div style="display:flex;gap:24px;align-items:center;flex-wrap:wrap">
      <elf-switch active-action-icon="✓" inactive-action-icon="○" active-text="已同步" inactive-text="未同步"></elf-switch>
      <elf-switch variant="square" active-action-icon="✓" inactive-action-icon="○" :modelValue.prop=${true}></elf-switch>
    </div>
  </elf-playground>
`);

export { PageSwitchEx3 };
