import { defineHtml, useRef } from "@elfui/core";
import { createDocsPicker } from "../../docsLocale";

const p = createDocsPicker();
const tags = useRef([p("设计", "Design"), p("开发", "Development")]);

const code1 = `<elf-input-tag
  :modelValue.prop=\${tags}
  variant="outlined"
  label="${p("标签", "Tags")}"
  clearable
  tag-type="primary"
  tag-effect="light"
  placeholder="${p("输入后按 Enter", "Type and press Enter")}"
  @update:modelValue=\${onTagsUpdate}
  @add-tag=\${onAddTag}
  @remove-tag=\${onRemoveTag}
/>
<span slot="status" class="demo-state">${p("当前标签", "Current tags")}: \${tags.join(" / ")}</span>`;

const script1 = `const tags = useRef(["${p("设计", "Design")}", "${p("开发", "Development")}"]);

const onTagsUpdate = (event) => {
  tags.set(event.detail);
};

const onAddTag = (event) => {
  console.log("add", event.detail);
};

const onRemoveTag = (event) => {
  console.log("remove", event.detail);
};`;

const onTagsUpdate = (event: CustomEvent): void => {
  tags.set(Array.isArray(event.detail) ? event.detail.map(String) : []);
};

const onAddTag = (): void => undefined;

const onRemoveTag = (): void => undefined;

const tagSummary = (): string => tags.value.join(" / ");

const PageInputTagEx1 = defineHtml(`
<elf-playground :title=${p("受控数组与清空", "Controlled array and clear")} :code=${code1} :script=${script1}>
      <elf-input-tag
        :modelValue.prop=${tags}
        variant="outlined"
        :label=${p("标签", "Tags")}
        clearable
        tag-type="primary"
        tag-effect="light"
        :placeholder=${p("输入后按 Enter", "Type and press Enter")}
        @update:modelValue=${onTagsUpdate}
        @add-tag=${onAddTag}
        @remove-tag=${onRemoveTag}
      ></elf-input-tag>
      <span slot="status" class="demo-state">${p("当前标签", "Current tags")}: ${tagSummary()}</span>
    </elf-playground>
`);

export { PageInputTagEx1 };
