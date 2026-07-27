import { defineHtml } from "@elfui/core";

const code2 = `<elf-page-header content="自定义插槽">
  <span slot="breadcrumb">Home / Product / Detail</span>
  <span slot="icon">←</span>
  <span slot="title">回到列表</span>
  <span slot="content">发布配置</span>
  <div slot="extra">
    <elf-button size="sm" variant="outlined">预览</elf-button>
    <elf-button size="sm">保存</elf-button>
  </div>
</elf-page-header>`;

const script2 = `// 纯插槽组合案例，无需额外状态。`;

const PagePageHeaderEx2 = defineHtml(`
<elf-playground title="breadcrumb / icon / title / content / extra" :code=${code2} :script=${script2}>
      <elf-page-header content="自定义插槽">
        <span slot="breadcrumb">Home / Product / Detail</span>
        <span slot="icon">←</span>
        <span slot="title">回到列表</span>
        <span slot="content">发布配置</span>
        <div slot="extra" style="display:flex;gap:8px">
          <elf-button size="sm" variant="outlined">预览</elf-button>
          <elf-button size="sm">保存</elf-button>
        </div>
      </elf-page-header>
    </elf-playground>
`);

export { PagePageHeaderEx2 };
