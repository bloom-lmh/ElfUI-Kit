import { defineHtml, useRef } from "@elfui/core";


const data = [
  { key: "1", label: "选项 1" },
  { key: "2", label: "选项 2" },
  { key: "3", label: "选项 3" },
  { key: "4", label: "选项 4" },
  { key: "5", label: "选项 5" },
  { key: "6", label: "选项 6" },
  { key: "7", label: "选项 7" },
  { key: "8", label: "选项 8" }
];

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
  { key: "1", label: "选项 1" },
  { key: "2", label: "选项 2" },
  // ...
]
const selected = useRef<string[]>([])
<elf-transfer :data="data" :modelValue="selected" @update:modelValue="onChange" />`;

const code1Script = `const data = [
    { key: "1", label: "选项 1" },
    { key: "2", label: "选项 2" },
    { key: "3", label: "选项 3" },
    { key: "4", label: "选项 4" },
    { key: "5", label: "选项 5" },
    { key: "6", label: "选项 6" },
    { key: "7", label: "选项 7" },
    { key: "8", label: "选项 8" }
];
const selected = useRef([]);

const onChange = (event) => {
  if (Array.isArray(event.detail)) selected.set(event.detail);
};`;

const code2 = `// 初始选中 "2", "5"
const selected = useRef<string[]>(["2", "5"])`;

const PageTransferEx1 = defineHtml(`
  <h2>基础用法</h2>
  <elf-playground title="勾选左侧项，点击 → 移到右侧" :code=${code1} :script=${code1Script}>
    <elf-transfer
      :data.prop=${data}
      :modelValue.prop=${selected1.value}
      @update:modelValue=${onTransfer1}
    ></elf-transfer>
  </elf-playground>

  <h2>默认选中</h2>
  <elf-playground title="modelValue 设置初始选中项" :code=${code2}>
    <elf-transfer
      :data.prop=${data}
      :modelValue.prop=${selected2.value}
      @update:modelValue=${onTransfer2}
    ></elf-transfer>
  </elf-playground>
`);

export { PageTransferEx1 };
