import { defineHtml } from "@elfui/core";

const code1 = `<elf-container padding="0" max-width="md">padding=0</elf-container>
<elf-container padding="sm" max-width="md">padding=sm</elf-container>
<elf-container padding="md" max-width="md">padding=md</elf-container>
<elf-container padding="lg" max-width="md">padding=lg</elf-container>`;

const code2 = `<elf-container fluid padding="lg">
  <header>全宽背景区域</header>
  <elf-container max-width="md" padding="md">居中的正文内容</elf-container>
</elf-container>`;

const script = `// fluid 取消最大宽度限制，可在内部嵌套限宽容器。`;

const PageContainerEx2 = defineHtml(`
  <h2>不同 padding</h2>
  <elf-playground title="0 / sm / md / lg" :code=${code1} :script=${script}>
    <elf-container
      padding="0"
      max-width="md"
      style="background:transparent;margin:4px 0;border:1px dashed var(--elf-border-strong);border-radius:4px"
      >padding=0</elf-container
    >
    <elf-container
      padding="sm"
      max-width="md"
      style="background:transparent;margin:4px 0;border:1px dashed var(--elf-border-strong);border-radius:4px"
      >padding=sm</elf-container
    >
    <elf-container
      padding="md"
      max-width="md"
      style="background:transparent;margin:4px 0;border:1px dashed var(--elf-border-strong);border-radius:4px"
      >padding=md</elf-container
    >
    <elf-container
      padding="lg"
      max-width="md"
      style="background:transparent;margin:4px 0;border:1px dashed var(--elf-border-strong);border-radius:4px"
      >padding=lg</elf-container
    >
  </elf-playground>

  <h2>全宽与内容限宽组合</h2>
  <elf-playground title="fluid 外壳 + 居中正文" :code=${code2} :script=${script}>
    <elf-container fluid padding="lg" style="border:1px dashed var(--elf-border-strong);border-radius:4px;background:transparent">
      <elf-container max-width="md" padding="md" style="border:1px dashed var(--elf-primary);border-radius:4px">
        <small style="color:var(--elf-primary);font-weight:700">工作台布局</small>
        <h3 style="margin:8px 0">全宽承载背景，内容保持舒适阅读宽度</h3>
        <p style="margin:0;color:var(--elf-text-secondary);line-height:1.7">外层虚线框表示全宽容器，内层虚线框表示限宽并居中的正文。</p>
      </elf-container>
    </elf-container>
  </elf-playground>
`);

export { PageContainerEx2 };
