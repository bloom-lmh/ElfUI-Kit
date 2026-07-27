import { defineHtml, useRef } from "@elfui/core";

const permissions = useRef<string[]>(["read"]);
const permissionOptions = [
  { text: "查看", code: "read" },
  { text: "编辑", code: "write" },
  { text: "删除", code: "delete", locked: true }
];
const optionProps = { label: "text", value: "code", disabled: "locked" };

const onUpdate = (event: CustomEvent): void => permissions.set([...(event.detail as string[])]);

const code = `<elf-checkbox-group
  :modelValue.prop=\${permissions.value}
  :options.prop=\${permissionOptions}
  :props.prop=\${optionProps}
  variant="button"
  fill="#0f766e"
  @update:modelValue=\${onUpdate}
/>`;

const script = `const permissions = useRef(["read"]);
const permissionOptions = [
  { text: "查看", code: "read" },
  { text: "编辑", code: "write" },
  { text: "删除", code: "delete", locked: true }
];
const optionProps = { label: "text", value: "code", disabled: "locked" };
const onUpdate = (event) => permissions.set([...event.detail]);`;

const PageCheckboxEx4 = defineHtml(`
  <elf-playground title="声明式 options 与按钮外观" :code=${code} :script=${script}>
    <elf-checkbox-group
      :modelValue.prop=${permissions.value}
      :options.prop=${permissionOptions}
      :props.prop=${optionProps}
      variant="button"
      fill="#0f766e"
      @update:modelValue=${onUpdate}
    ></elf-checkbox-group>
    <span slot="status" class="demo-state">权限：{{ permissions.join(', ') }}</span>
  </elf-playground>
`);

export { PageCheckboxEx4 };
