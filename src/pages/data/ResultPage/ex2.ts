import { defineHtml } from "@elfui/core";

const extraCode = `<elf-result icon="success" title="发布成功" sub-title="页面已经上线">
  <div slot="extra" style="display:flex;gap:8px;justify-content:center">
    <elf-button variant="outlined">查看页面</elf-button>
    <elf-button>继续编辑</elf-button>
  </div>
</elf-result>`;

const PageResultEx2 = defineHtml(`
<elf-playground title="扩展操作区" :code=${extraCode}>
      <elf-result icon="success" title="发布成功" sub-title="页面已经上线">
        <div slot="extra" style="display:flex;gap:8px;justify-content:center">
          <elf-button variant="outlined">查看页面</elf-button>
          <elf-button>继续编辑</elf-button>
        </div>
      </elf-result>
    </elf-playground>
`);

export { PageResultEx2 };
