import { defineHtml, useRef } from "@elfui/core";

const tags = useRef(["设计", "开发"]);

const code1 = `<elf-input-tag
  :modelValue.prop=\${tags}
  variant="outlined"
  label="标签"
  clearable
  tag-type="primary"
  tag-effect="light"
  placeholder="输入后按 Enter"
  @update:modelValue=\${onTagsUpdate}
  @add-tag=\${onAddTag}
  @remove-tag=\${onRemoveTag}
/>
<span slot="status" class="demo-state">当前：\${tags.join(" / ")}</span>`;

const script1 = `const tags = useRef(["设计", "开发"]);

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
<elf-playground title="受控数组与清空" :code=${code1} :script=${script1}>
      <elf-input-tag
        :modelValue.prop=${tags}
        variant="outlined"
        label="标签"
        clearable
        tag-type="primary"
        tag-effect="light"
        placeholder="输入后按 Enter"
        @update:modelValue=${onTagsUpdate}
        @add-tag=${onAddTag}
        @remove-tag=${onRemoveTag}
      ></elf-input-tag>
      <span slot="status" class="demo-state">当前：${tagSummary()}</span>
    </elf-playground>
`);

export { PageInputTagEx1 };
