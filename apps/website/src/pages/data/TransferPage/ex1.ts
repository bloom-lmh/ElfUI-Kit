import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "基础用法", en: "Basic usage" },
  playground: {
    zh: "勾选左侧项，点击箭头移到右侧",
    en: "Check source items and use the arrow to move them to the target.",
  },
  defaults: { zh: "默认选中", en: "Default selection" },
  defaultsPlayground: {
    zh: "modelValue 设置初始选中项",
    en: "Set initially selected items with modelValue.",
  },
  option: { zh: "选项", en: "Option" },
  comment: { zh: "初始选中 2 和 5", en: "Initially select 2 and 5" },
});

const data = Array.from({ length: 8 }, (_, index) => ({
  key: String(index + 1),
  label: `${t("option")} ${index + 1}`,
}));

const selected1 = useRef<string[]>([]);

const selected2 = useRef<string[]>(["2", "5"]);

const onTransfer1 = (e: Event) => {
  const detail = (e as CustomEvent).detail;
  if (Array.isArray(detail)) selected1.set(detail);
};

const onTransfer2 = (e: Event) => {
  const detail = (e as CustomEvent).detail;
  if (Array.isArray(detail)) selected2.set(detail);
};

const code1 = `const data = [
  { key: "1", label: "${t("option")} 1" },
  { key: "2", label: "${t("option")} 2" },
  // ...
]
const selected = useRef<string[]>([])
<elf-transfer :data="data" :modelValue="selected" @update:modelValue="onChange" />`;

const code1Script = `const data = [
    { key: "1", label: "${t("option")} 1" },
    { key: "2", label: "${t("option")} 2" },
    { key: "3", label: "${t("option")} 3" },
    { key: "4", label: "${t("option")} 4" },
    { key: "5", label: "${t("option")} 5" },
    { key: "6", label: "${t("option")} 6" },
    { key: "7", label: "${t("option")} 7" },
    { key: "8", label: "${t("option")} 8" }
];
const selected = useRef([]);

const onChange = (event) => {
  if (Array.isArray(event.detail)) selected.set(event.detail);
};`;

const code2 = `// ${t("comment")}
const selected = useRef<string[]>(["2", "5"])`;

const PageTransferEx1 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("playground")} :code=${code1} :script=${code1Script}>
    <elf-transfer
      :data.prop=${data}
      :modelValue.prop=${selected1.value}
      @update:modelValue=${onTransfer1}
    ></elf-transfer>
  </elf-playground>

  <h2>${t("defaults")}</h2>
  <elf-playground :title=${t("defaultsPlayground")} :code=${code2}>
    <elf-transfer
      :data.prop=${data}
      :modelValue.prop=${selected2.value}
      @update:modelValue=${onTransfer2}
    ></elf-transfer>
  </elf-playground>
`);

export { PageTransferEx1 };
