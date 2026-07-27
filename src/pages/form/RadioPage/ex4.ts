import { defineHtml, useRef } from "@elfui/core";

const delivery = useRef("standard");
const deliveryOptions = [
  { text: "标准配送", code: "standard" },
  { text: "次日达", code: "express" },
  { text: "专人配送", code: "concierge", locked: true }
];
const optionProps = { label: "text", value: "code", disabled: "locked" };

const onUpdate = (event: CustomEvent): void => delivery.set(String(event.detail));

const code = `<elf-radio-group
  :modelValue.prop=\${delivery.value}
  :options.prop=\${deliveryOptions}
  :props.prop=\${optionProps}
  variant="button"
  @update:modelValue=\${onUpdate}
/>`;

const script = `const delivery = useRef("standard");
const deliveryOptions = [
  { text: "标准配送", code: "standard" },
  { text: "次日达", code: "express" },
  { text: "专人配送", code: "concierge", locked: true }
];
const optionProps = { label: "text", value: "code", disabled: "locked" };
const onUpdate = (event) => delivery.set(String(event.detail));`;

const PageRadioEx4 = defineHtml(`
  <elf-playground title="声明式 options 与字段映射" :code=${code} :script=${script}>
    <elf-radio-group
      :modelValue.prop=${delivery.value}
      :options.prop=${deliveryOptions}
      :props.prop=${optionProps}
      variant="button"
      @update:modelValue=${onUpdate}
    ></elf-radio-group>
    <span slot="status" class="demo-state">配送方式：{{ delivery }}</span>
  </elf-playground>
`);

export { PageRadioEx4 };
