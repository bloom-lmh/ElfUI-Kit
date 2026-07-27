import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import diagramStyles from "../layout-diagrams.scss?inline";

const t = createDocsTranslator({
  classic: { zh: "经典后台", en: "Classic administration" },
  system: { zh: "双层顶栏", en: "Two-level header" }
});

const classicCode = `<elf-layout>
  <elf-header height="52px">Header</elf-header>
  <elf-layout direction="horizontal">
    <elf-aside width="144px">Aside</elf-aside>
    <elf-main>Main</elf-main>
  </elf-layout>
  <elf-footer height="36px">Footer</elf-footer>
</elf-layout>`;

const systemCode = `<elf-layout>
  <elf-header height="28px">System bar</elf-header>
  <elf-header height="52px">Header</elf-header>
  <elf-main>Main</elf-main>
</elf-layout>`;

defineStyle(diagramStyles);

const PageLayoutShellEx2 = defineHtml(`
  <elf-playground data-docs-toc-level="2" :title=${t("classic")} :code=${classicCode}>
    <div class="layout-shell">
      <elf-layout>
        <elf-header height="52px">Header</elf-header>
        <elf-layout direction="horizontal">
          <elf-aside width="144px">Aside</elf-aside>
          <elf-main><span class="region-label">Main</span><div class="shell-skeleton"><span></span><span></span><span></span><span></span></div></elf-main>
        </elf-layout>
        <elf-footer height="36px">Footer</elf-footer>
      </elf-layout>
    </div>
  </elf-playground>

  <elf-playground data-docs-toc-level="2" :title=${t("system")} :code=${systemCode}>
    <div class="layout-shell">
      <elf-layout>
        <elf-header class="system-region" height="28px">System bar</elf-header>
        <elf-header height="52px">Header</elf-header>
        <elf-main><span class="region-label">Main</span><div class="shell-skeleton"><span></span><span></span><span></span><span></span></div></elf-main>
      </elf-layout>
    </div>
  </elf-playground>
`);

export { PageLayoutShellEx2 };
