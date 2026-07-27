import { defineHtml, defineStyle, useReactive, useRef } from "@elfui/core";

import demoStyles from "./demo.scss?inline";


const disabled = useRef(false);

const settings = useReactive({
  env: "prod",
  notify: true,
  remark: "生产环境变更需要审批"
});

const envOptions = [
  { label: "开发环境", value: "dev" },
  { label: "测试环境", value: "test" },
  { label: "生产环境", value: "prod" }
];

const toggle = (): void => {
  disabled.set(!disabled.value);
};

const code = `<elf-form :model.prop="settings" label-position="right" label-width="96px" :disabled="disabled">
  <elf-form-item label="环境"><elf-select v-model="settings.env" /></elf-form-item>
</elf-form>`;

const script = `const disabled = useRef(false);
const settings = useReactive({
    env: "prod",
    notify: true,
    remark: "生产环境变更需要审批"
});`;

defineStyle(demoStyles);

const PageFormEx4 = defineHtml(`
  <h2>布局与禁用态</h2>
  <elf-playground title="label-position / label-width / disabled" :code="code" :script=${script}>
    <elf-button slot="status" size="small" @click=${toggle}
      >${disabled.value ? "启用表单" : "禁用表单"}</elf-button
    >
    <elf-card
      class="form-demo-card"
      variant="outlined"
      title="环境配置"
      subtitle="通过 extra 插槽放置与内容相关的轻量操作"
    >
      <elf-form
        :model.prop="settings"
        label-position="right"
        label-width="96px"
        :disabled="disabled"
      >
        <elf-form-item label="环境">
          <elf-select v-model="settings.env" :options.prop="envOptions"></elf-select>
        </elf-form-item>
        <elf-form-item label="通知">
          <elf-switch v-model="settings.notify"></elf-switch>
        </elf-form-item>
        <elf-form-item label="备注">
          <elf-textarea v-model="settings.remark" rows="3"></elf-textarea>
        </elf-form-item>
      </elf-form>
    </elf-card>
  </elf-playground>
`);

export { PageFormEx4 };
