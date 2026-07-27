import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import diagramStyles from "../layout-diagrams.scss?inline";

const t = createDocsTranslator({
  three: { zh: "三栏工作台", en: "Three-column workspace" },
  collaboration: { zh: "多栏协作区", en: "Multi-column collaboration" }
});

const threeCode = `<elf-layout>
  <elf-header height="52px">Header</elf-header>
  <elf-layout direction="horizontal">
    <elf-aside width="136px">Navigation</elf-aside>
    <elf-main>Main</elf-main>
    <elf-aside width="176px">Inspector</elf-aside>
  </elf-layout>
</elf-layout>`;

const collaborationCode = `<elf-layout direction="horizontal">
  <elf-aside width="64px">Rail</elf-aside>
  <elf-aside width="132px">Rooms</elf-aside>
  <elf-main>Main</elf-main>
  <elf-aside width="164px">Members</elf-aside>
</elf-layout>`;

defineStyle(diagramStyles);

const PageLayoutShellEx4 = defineHtml(`
  <elf-playground data-docs-toc-level="2" :title=${t("three")} :code=${threeCode}>
    <div class="layout-shell">
      <elf-layout>
        <elf-header height="52px">Header</elf-header>
        <elf-layout direction="horizontal">
          <elf-aside width="136px">Navigation</elf-aside>
          <elf-main><span class="region-label">Main</span><div class="shell-skeleton"><span></span><span></span><span></span><span></span></div></elf-main>
          <elf-aside class="right-region" width="176px">Inspector</elf-aside>
        </elf-layout>
      </elf-layout>
    </div>
  </elf-playground>

  <elf-playground data-docs-toc-level="2" :title=${t("collaboration")} :code=${collaborationCode}>
    <div class="layout-shell">
      <elf-layout direction="horizontal">
        <elf-aside width="64px">Rail</elf-aside>
        <elf-aside class="secondary-region" width="132px">Rooms</elf-aside>
        <elf-main><span class="region-label">Main</span><div class="shell-skeleton"><span></span><span></span><span></span><span></span></div></elf-main>
        <elf-aside class="right-region" width="164px">Members</elf-aside>
      </elf-layout>
    </div>
  </elf-playground>
`);

export { PageLayoutShellEx4 };
