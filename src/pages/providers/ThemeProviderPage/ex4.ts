import { defineHtml, useComponents } from "@elfui/core";
import { PageThemeServiceTrigger } from "./service-preview";

useComponents({ "page-theme-service-trigger": PageThemeServiceTrigger });

const innerTokens = {
  primary: "#ffb4ab",
  primaryHover: "#ff897d",
  bgPaper: "#2b2020",
  fieldBg: "#382a2a",
  border: "rgba(255, 180, 171, .28)"
};

const code = `<elf-theme-provider theme="dark" primary="#80cbc4">
  <elf-theme-provider theme="custom" :tokens.prop="innerTokens">
    <page-theme-service-trigger />
  </elf-theme-provider>
</elf-theme-provider>`;

const script = `const theme = useThemeProvider();

const showThemedMessage = () => ElfMessage.success("Saved", {
  themeTokens: theme?.tokens
});`;

const PageThemeProviderEx4 = defineHtml(`
  <h2>嵌套主题与服务浮层</h2>
  <elf-playground title="暗色工作区中的珊瑚操作区" :code=${code} :script=${script}>
    <elf-theme-provider theme="dark" primary="#80cbc4">
      <section style="display:grid;gap:16px;width:100%;max-width:760px;padding:20px;border-radius:10px;background:var(--elf-bg-paper);color:var(--elf-text-primary);border:1px solid var(--elf-border)">
        <div>
          <strong>Dark workspace</strong>
          <p style="margin:4px 0 0;color:var(--elf-text-secondary)">外层提供暗色表面与对比度。</p>
        </div>
        <elf-theme-provider theme="custom" :tokens.prop=${innerTokens}>
          <div style="display:grid;gap:14px;padding:18px;border-radius:8px;background:var(--elf-bg-paper);border:1px solid var(--elf-border);color:var(--elf-text-primary)">
            <strong>Coral approval scope</strong>
            <elf-input label="Release note" model-value="Ready for review" variant="solo-filled"></elf-input>
            <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
              <page-theme-service-trigger></page-theme-service-trigger>
              <elf-tag>Inherited dark contrast</elf-tag>
            </div>
          </div>
        </elf-theme-provider>
      </section>
    </elf-theme-provider>
  </elf-playground>
`);

export { PageThemeProviderEx4 };
