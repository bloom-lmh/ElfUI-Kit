import { defineHtml } from "@elfui/core";

const code1 = `<div style="width:100%;max-width:480px">
  <elf-textarea rows="4" label="描述" placeholder="请输入多行内容..." />
</div>`;

const code2 = `<div style="width:100%;max-width:480px">
  <elf-textarea rows="3" maxlength="100" show-count placeholder="不超过 100 字" />
</div>`;

const PageTextareaEx1 = defineHtml(`
  <h2>基础</h2>
  <elf-playground title="四行文本框" :code=${code1}>
    <div style="width:100%;max-width:480px">
      <elf-textarea rows="4" label="描述" placeholder="请输入多行内容..." />
    </div>
  </elf-playground>
  <h2>字符计数</h2>
  <elf-playground title="字数统计与最大长度" :code=${code2}>
    <div style="width:100%;max-width:480px">
      <elf-textarea rows="3" maxlength="100" show-count placeholder="不超过 100 字" />
    </div>
  </elf-playground>
`);

export { PageTextareaEx1 };
