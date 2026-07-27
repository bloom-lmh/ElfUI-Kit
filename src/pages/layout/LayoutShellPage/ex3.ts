import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import diagramStyles from "../layout-diagrams.scss?inline";

const t = createDocsTranslator({
  nested: { zh: "嵌套双导航", en: "Nested navigation" },
  details: { zh: "右侧详情栏", en: "Right detail panel" }
});

const nestedCode = `<elf-layout direction="horizontal">
  <elf-aside width="72px">Rail</elf-aside>
  <elf-layout>
    <elf-header height="52px">Header</elf-header>
    <elf-layout direction="horizontal">
      <elf-aside width="156px">Sub navigation</elf-aside>
      <elf-main>Main</elf-main>
    </elf-layout>
    <elf-footer height="36px">Footer</elf-footer>
  </elf-layout>
</elf-layout>`;

const detailsCode = `<elf-layout>
  <elf-header height="52px">Header</elf-header>
  <elf-layout direction="horizontal">
    <elf-main>Main</elf-main>
    <elf-aside width="196px">Details</elf-aside>
  </elf-layout>
</elf-layout>`;

defineStyle(diagramStyles);

const PageLayoutShellEx3 = defineHtml(`
  <elf-playground data-docs-toc-level="2" :title=${t("nested")} :code=${nestedCode}>
    <div class="layout-shell">
      <elf-layout direction="horizontal">
        <elf-aside width="72px">Rail</elf-aside>
        <elf-layout>
          <elf-header height="52px">Header</elf-header>
          <elf-layout direction="horizontal">
            <elf-aside class="secondary-region" width="156px">Sub navigation</elf-aside>
            <elf-main><span class="region-label">Main</span><div class="shell-skeleton"><span></span><span></span><span></span><span></span></div></elf-main>
          </elf-layout>
          <elf-footer height="36px">Footer</elf-footer>
        </elf-layout>
      </elf-layout>
    </div>
  </elf-playground>

  <elf-playground data-docs-toc-level="2" :title=${t("details")} :code=${detailsCode}>
    <div class="layout-shell">
      <elf-layout>
        <elf-header height="52px">Header</elf-header>
        <elf-layout direction="horizontal">
          <elf-main><span class="region-label">Main</span><div class="shell-skeleton"><span></span><span></span><span></span><span></span></div></elf-main>
          <elf-aside class="right-region" width="196px">Details</elf-aside>
        </elf-layout>
      </elf-layout>
    </div>
  </elf-playground>
`);

export { PageLayoutShellEx3 };
