import { defineHtml, useRef } from "@elfui/core";

const verticalSize = useRef(48);

const onVerticalUpdate = (event: CustomEvent): void => {
  verticalSize.set(Number(event.detail) || 48);
};

const code = `<elf-splitter
  vertical
  :modelValue.prop=\${verticalSize}
  @update:modelValue=\${onVerticalUpdate}
>
  <div slot="first">上方面板</div>
  <div slot="second">下方面板</div>
</elf-splitter>`;

const script = `const verticalSize = useRef(48);

const onVerticalUpdate = (event) => {
    verticalSize.set(Number(event.detail) || 48);
};`;

const PageSplitterEx2 = defineHtml(`
  <h2>垂直分割</h2>
  <elf-playground title="vertical" :code=${code} :script=${script}>
    <div style="width:100%;max-width:720px;height:260px">
      <elf-splitter vertical :modelValue.prop=${verticalSize.value} @update:modelValue=${onVerticalUpdate}>
        <div slot="first" style="padding:16px">上方面板</div>
        <div slot="second" style="padding:16px">下方面板</div>
      </elf-splitter>
    </div>
  </elf-playground>
`);

export { PageSplitterEx2 };
