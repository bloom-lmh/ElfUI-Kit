import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "传送面板与视口定位", en: "Teleported panel and viewport positioning" },
  design: { zh: "设计系统", en: "Design system" },
  authoring: { zh: "组件开发", en: "Component authoring" },
  accessibility: { zh: "可访问性", en: "Accessibility" },
  testing: { zh: "自动化测试", en: "Automated testing" },
  label: { zh: "前端框架", en: "Frontend framework" },
  placeholder: { zh: "在裁切容器内搜索", en: "Search inside a clipped container" },
});

const keyword = useRef("");
const suggestions = [
  { label: t("design"), value: "design-system" },
  { label: t("authoring"), value: "component-authoring" },
  { label: t("accessibility"), value: "accessibility" },
  { label: t("testing"), value: "automated-testing" },
];

const popperOptions = {
  modifiers: [
    { name: "offset", options: { offset: [0, 0] } },
    { name: "flip", enabled: true },
    { name: "preventOverflow", options: { padding: 12 } },
  ],
};

const onUpdate = (event: CustomEvent): void => {
  keyword.set(String(event.detail || ""));
};

const code = `<elf-autocomplete
  :modelValue=\${keyword}
  :options.prop=\${suggestions}
  :popperOptions.prop=\${popperOptions}
  teleported
  fit-input-width
  append-to="body"
  @update:modelValue=\${onUpdate}
/>`;

const script = `const keyword = useRef("");
const suggestions = [
    { label: "${t("design")}", value: "design-system" },
    { label: "${t("authoring")}", value: "component-authoring" },
    { label: "${t("accessibility")}", value: "accessibility" },
    { label: "${t("testing")}", value: "automated-testing" }
];
const popperOptions = {
    modifiers: [
        { name: "offset", options: { offset: [0, 0] } },
        { name: "flip", enabled: true },
        { name: "preventOverflow", options: { padding: 12 } }
    ]
};
const onUpdate = (event) => {
    keyword.set(String(event.detail || ""));
};`;

const PageAutocompleteEx4 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <div
      style="width:min(100%,520px);height:120px;overflow:hidden;transform:translateZ(0);border:1px dashed var(--elf-border);border-radius:12px;padding:18px;box-sizing:border-box;display:flex;align-items:flex-end"
    >
      <elf-autocomplete
        :modelValue=${keyword}
        :options.prop=${suggestions}
        :popperOptions.prop=${popperOptions}
        teleported
        fit-input-width
        append-to="body"
        :label=${t("label")}
        :placeholder=${t("placeholder")}
        @update:modelValue=${onUpdate}
      ></elf-autocomplete>
    </div>
  </elf-playground>
`);

export { PageAutocompleteEx4 };
