import { defineHtml, useRef } from "@elfui/core";

const size = useRef(36);

const onSizeUpdate = (event: CustomEvent): void => {
  size.set(Number(event.detail) || 36);
};

const code = `<elf-splitter
  :modelValue.prop=\${size}
  :min=\${20}
  :max=\${70}
  @update:modelValue=\${onSizeUpdate}
>
  <div slot="first">列表面板</div>
  <div slot="second">详情面板</div>
</elf-splitter>`;

const script = `const size = useRef(36);

const onSizeUpdate = (event) => {
  size.set(event.detail);
};`;

const PageSplitterEx1 = defineHtml(`
  <h2>水平分割 / 受控比例</h2>
  <elf-playground title="水平分割 / 受控比例" :code=${code} :script=${script}>
    <elf-splitter :modelValue.prop=${size.value} :min=${20} :max=${70} @update:modelValue=${onSizeUpdate}>
      <div slot="first" style="padding:16px">列表面板 ${Math.round(size.value)}%</div>
      <div slot="second" style="padding:16px">详情面板</div>
    </elf-splitter>
  </elf-playground>
`);

export { PageSplitterEx1 };
