import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import diagramStyles from "../layout-diagrams.scss?inline";

const t = createDocsTranslator({
  headerMain: { zh: "顶栏与内容", en: "Header and content" },
  asideMain: { zh: "侧栏与内容", en: "Sidebar and content" }
});

const headerMainCode = `<elf-layout>
  <elf-header height="52px">Header</elf-header>
  <elf-main>Main</elf-main>
</elf-layout>`;

const asideMainCode = `<elf-layout direction="horizontal">
  <elf-aside width="144px">Aside</elf-aside>
  <elf-main>Main</elf-main>
</elf-layout>`;

defineStyle(diagramStyles);

const PageLayoutShellEx1 = defineHtml(`
  <elf-playground data-docs-toc-level="2" :title=${t("headerMain")} :code=${headerMainCode}>
    <div class="layout-shell compact">
      <elf-layout>
        <elf-header height="52px">Header</elf-header>
        <elf-main><span class="region-label">Main</span><div class="shell-skeleton"><span></span><span></span><span></span><span></span></div></elf-main>
      </elf-layout>
    </div>
  </elf-playground>

  <elf-playground data-docs-toc-level="2" :title=${t("asideMain")} :code=${asideMainCode}>
    <div class="layout-shell compact">
      <elf-layout direction="horizontal">
        <elf-aside width="144px">Aside</elf-aside>
        <elf-main><span class="region-label">Main</span><div class="shell-skeleton"><span></span><span></span><span></span><span></span></div></elf-main>
      </elf-layout>
    </div>
  </elf-playground>
`);

export { PageLayoutShellEx1 };
