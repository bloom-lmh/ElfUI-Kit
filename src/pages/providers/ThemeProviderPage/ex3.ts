import { defineHtml } from "@elfui/core";

import { APP_SKINS } from "../../../app/skins";

const PageThemeProviderEx3 = defineHtml(`
  <elf-playground title="多套主题皮肤">
    <span slot="status" class="demo-state">同一组件 · 四套 Provider token</span>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px;width:100%">
      <elf-theme-provider
        v-for="skin in APP_SKINS"
        :key="skin.id"
        :theme="skin.providerTheme"
        :tokens.prop="skin.tokens"
      >
        <section style="display:grid;gap:16px;min-height:210px;padding:20px;border:1px solid var(--elf-border);border-radius:18px;background:var(--elf-bg-paper);color:var(--elf-text-primary);box-shadow:0 12px 28px rgba(0,0,0,.08)">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:12px">
            <strong>{{ skin.label }}</strong>
            <span style="width:18px;height:18px;border-radius:50%;background:var(--elf-primary)"></span>
          </div>
          <elf-input label="Project name" model-value="ElfUI" variant="solo-filled"></elf-input>
          <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
            <elf-button size="sm">Confirm</elf-button>
            <elf-button size="sm" variant="outlined">Details</elf-button>
            <elf-tag>Token</elf-tag>
          </div>
        </section>
      </elf-theme-provider>
    </div>
  </elf-playground>
`);

export { PageThemeProviderEx3 };
