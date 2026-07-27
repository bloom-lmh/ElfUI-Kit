import { defineHtml } from "@elfui/core";

const slotCode = `<elf-result title="自定义图标" sub-title="icon slot 可替换默认状态图形">
  <span slot="icon">★</span>
</elf-result>`;

const PageResultEx3 = defineHtml(`
<elf-playground title="自定义图标" :code=${slotCode}>
      <elf-result title="自定义图标" sub-title="icon slot 可替换默认状态图形">
        <span slot="icon">★</span>
      </elf-result>
    </elf-playground>
`);

export { PageResultEx3 };
