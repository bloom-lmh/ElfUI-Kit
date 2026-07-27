import { defineHtml } from "@elfui/core";

const code1 = `<div style="width:100%;max-width:480px">
  <elf-textarea autosize placeholder="键入更多内容会自动撑高" />
</div>`;

const code2 = `<div style="width:100%;max-width:480px">
  <elf-textarea resize="none" rows="3" placeholder="不可拖拽" />
</div>`;

const PageTextareaEx2 = defineHtml(`
  <h2>自动高度</h2>
  <elf-playground title="输入内容自动撑高" :code=${code1}>
    <div style="width:100%;max-width:480px">
      <elf-textarea autosize placeholder="键入更多内容会自动撑高" />
    </div>
  </elf-playground>
  <h2>禁止 resize</h2>
  <elf-playground title="禁止手动调整大小" :code=${code2}>
    <div style="width:100%;max-width:480px">
      <elf-textarea resize="none" rows="3" placeholder="不可拖拽" />
    </div>
  </elf-playground>
`);

export { PageTextareaEx2 };
