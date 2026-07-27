import { defineHtml } from "@elfui/core";

const darkCode = `<elf-theme-provider theme="dark" primary="#80cbc4" surface="#172525">
  <elf-button>继承局部主题</elf-button>
</elf-theme-provider>`;

const PageThemeProviderEx1 = defineHtml(`
<elf-playground title="局部暗色主题" :code="darkCode">
      <elf-theme-provider theme="dark" primary="#80cbc4" surface="#172525">
        <div
          style="display:grid;gap:12px;width:100%;max-width:680px;padding:20px;border-radius:8px;background:var(--elf-bg-paper);color:var(--elf-text-primary);border:1px solid var(--elf-border)"
        >
          <strong>局部暗色主题</strong>
          <span style="color:var(--elf-text-secondary)"
            >只影响 provider 子树，不会改全站 data-theme。</span
          >
          <div style="display:flex;gap:12px;flex-wrap:wrap">
            <elf-button>继承主题按钮</elf-button>
            <elf-button variant="outlined">描边按钮</elf-button>
            <elf-tag color="info">局部 token</elf-tag>
          </div>
        </div>
      </elf-theme-provider>
    </elf-playground>
`);

export { PageThemeProviderEx1 };
