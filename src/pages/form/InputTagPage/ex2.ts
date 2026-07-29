import { defineHtml, useRef } from "@elfui/core";
import { createDocsPicker } from "../../docsLocale";

const p = createDocsPicker();
const limitedTags = useRef([p("需求", "Alpha"), p("设计系统", "Design system"), p("响应式布局", "Responsive layout")]);

const code2 = `<elf-input-tag
  :modelValue.prop=\${limitedTags}
  variant="outlined"
  label="${p("标签", "Tags")}"
  :max=\${6}
  size="lg"
  tag-type="success"
  tag-effect="plain"
  placeholder="${p("最多 6 个", "Up to 6 tags")}"
  @update:modelValue=\${onLimitedUpdate}
/>
<elf-input-tag :modelValue.prop=\${["${p("只读", "Read only")}"]} variant="outlined" label="${p("只读", "Read only")}" readonly />
<elf-input-tag :modelValue.prop=\${["${p("禁用", "Disabled")}"]} variant="outlined" label="${p("禁用", "Disabled")}" disabled />`;

const script2 = `const limitedTags = useRef(["${p("需求", "Alpha")}", "${p("设计系统", "Design system")}", "${p("响应式布局", "Responsive layout")}"]);

const onLimitedUpdate = (event) => {
  limitedTags.set(event.detail);
};`;

const onLimitedUpdate = (event: CustomEvent): void => {
  limitedTags.set(Array.isArray(event.detail) ? event.detail.map(String) : []);
};

const PageInputTagEx2 = defineHtml(`
<elf-playground :title=${p("数量上限、自动换行与状态", "Maximum count, wrapping, and states")} :code=${code2} :script=${script2}>
      <div style="display:grid;gap:12px;width:min(100%,520px)">
        <elf-input-tag
          :modelValue.prop=${limitedTags}
          variant="outlined"
          :label=${p("标签", "Tags")}
          :max=${6}
          size="lg"
          tag-type="success"
          tag-effect="plain"
          :placeholder=${p("最多 6 个", "Up to 6 tags")}
          @update:modelValue=${onLimitedUpdate}
        ></elf-input-tag>
        <elf-input-tag :modelValue.prop=${[p("只读", "Read only")]} variant="outlined" :label=${p("只读", "Read only")} readonly></elf-input-tag>
        <elf-input-tag :modelValue.prop=${[p("禁用", "Disabled")]} variant="outlined" :label=${p("禁用", "Disabled")} disabled></elf-input-tag>
      </div>
    </elf-playground>
`);

export { PageInputTagEx2 };
