import { defineHtml, useRef } from "@elfui/core";
import { createDocsPicker } from "../../docsLocale";

const p = createDocsPicker();
const permissions = useRef<string[]>(["read"]);
const permissionOptions = [
  { text: p("查看", "Read"), code: "read" },
  { text: p("编辑", "Write"), code: "write" },
  { text: p("删除", "Delete"), code: "delete", locked: true }
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
  { text: "${p("查看", "Read")}", code: "read" },
  { text: "${p("编辑", "Write")}", code: "write" },
  { text: "${p("删除", "Delete")}", code: "delete", locked: true }
];
const optionProps = { label: "text", value: "code", disabled: "locked" };
const onUpdate = (event) => permissions.set([...event.detail]);`;

const PageCheckboxEx4 = defineHtml(`
  <elf-playground :title=${p("声明式选项与按钮外观", "Declarative options and button styling")} :code=${code} :script=${script}>
    <elf-checkbox-group
      :modelValue.prop=${permissions.value}
      :options.prop=${permissionOptions}
      :props.prop=${optionProps}
      variant="button"
      fill="#0f766e"
      @update:modelValue=${onUpdate}
    ></elf-checkbox-group>
    <span slot="status" class="demo-state">${p("权限", "Permissions")}: {{ permissions.join(', ') }}</span>
  </elf-playground>
`);

export { PageCheckboxEx4 };
