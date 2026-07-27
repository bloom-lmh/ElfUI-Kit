import { defineHtml, useRef } from "@elfui/core";

const loading = useRef(true);
const toggleLoading = (): void => loading.set(!loading.value);

const code1 = `<elf-skeleton loading />
<elf-skeleton loading variant="text" count="3" gap="12px" style="margin-top:16px" />
<elf-skeleton loading variant="text" count="1" width="60%" style="margin-top:8px" />`;

const code2 = `<elf-skeleton loading variant="circle" width="64px" height="64px" />
<elf-skeleton loading variant="circle" width="48px" height="48px" />
<elf-skeleton loading variant="circle" width="32px" height="32px" />

<elf-skeleton loading variant="rect" width="100%" height="200px" />
<elf-skeleton loading variant="rect" width="60%" height="40px" />
<elf-skeleton loading variant="rect" width="40%" height="24px" />`;

const code3 = `<elf-skeleton loading variant="image" width="100%" height="180px" />
<elf-skeleton loading variant="text" count="1" width="60%" height="20px" style="margin-top:16px" />
<elf-skeleton loading variant="text" count="1" width="40%" height="14px" style="margin-top:6px" />`;

const code4 = `<elf-button @click=\${toggleLoading}>Toggle loading</elf-button>
<elf-skeleton :loading="loading" :throttle="200">
  <article>Loaded content</article>
  <template #template>
    <elf-skeleton loading rows="2" animated />
  </template>
</elf-skeleton>`;

const code4Script = `const loading = useRef(true);
const toggleLoading = () => loading.set(!loading.value);`;

const PageSkeletonEx1 = defineHtml(`
  <h2>文字骨架</h2>
  <elf-playground title="单行 + 多行段落" :code="code1">
    <div style="width:360px">
      <elf-skeleton loading />
      <elf-skeleton loading variant="text" count="3" gap="12px" style="margin-top:16px" />
      <elf-skeleton loading variant="text" count="1" width="60%" style="margin-top:8px" />
    </div>
  </elf-playground>

  <h2>圆形 / 矩形 / 图片</h2>
  <elf-playground title="各种形状 + 自定义尺寸" :code="code2">
    <div style="display:flex;flex-direction:column;gap:16px;width:100%;max-width:360px">
      <div style="display:flex;gap:16px;align-items:flex-end">
        <elf-skeleton loading variant="circle" width="64px" height="64px" />
        <elf-skeleton loading variant="circle" width="48px" height="48px" />
        <elf-skeleton loading variant="circle" width="32px" height="32px" />
      </div>
      <elf-skeleton loading variant="rect" width="100%" height="200px" />
      <elf-skeleton loading variant="rect" width="60%" height="40px" />
      <elf-skeleton loading variant="rect" width="40%" height="24px" />
    </div>
  </elf-playground>

  <h2>图片占位</h2>
  <elf-playground title="image 变体 = rect + 200px 默认高度" :code="code3">
    <div style="width:360px">
      <elf-skeleton loading variant="image" width="100%" height="180px" />
      <elf-skeleton loading variant="text" count="1" width="60%" height="20px" style="margin-top:16px" />
      <elf-skeleton loading variant="text" count="1" width="40%" height="14px" style="margin-top:6px" />
    </div>
  </elf-playground>

  <h2>加载状态与自定义模板</h2>
  <elf-playground title="loading / throttle / template" :code=${code4} :script=${code4Script}>
    <div style="display:grid;gap:12px;width:360px">
      <elf-button size="sm" @click=${toggleLoading}>{{ loading ? "显示内容" : "重新加载" }}</elf-button>
      <elf-skeleton :loading=${loading} :throttle=${200} animated>
        <article style="padding:16px;border:1px solid var(--elf-border);border-radius:8px">
          <strong>Loaded content</strong>
          <p style="margin:6px 0 0;color:var(--elf-text-secondary)">默认 slot 只会在加载结束后显示。</p>
        </article>
        <template #template>
          <elf-skeleton loading rows="2" animated />
        </template>
      </elf-skeleton>
    </div>
  </elf-playground>
`);

export { PageSkeletonEx1 };
