import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import diagramStyles from "../layout-diagrams.scss?inline";

const t = createDocsTranslator({
  headerMain: { zh: "顶栏与内容", en: "Header and content" },
  asideMain: { zh: "侧栏与内容", en: "Sidebar and content" },
  header: { zh: "顶栏", en: "Header" },
  main: { zh: "内容区", en: "Main" },
  aside: { zh: "侧栏", en: "Aside" },
});

const headerMainCode = `<elf-layout>
  <elf-header height="52px">${t("header")}</elf-header>
  <elf-main>${t("main")}</elf-main>
</elf-layout>`;

const asideMainCode = `<elf-layout direction="horizontal">
  <elf-aside width="144px">${t("aside")}</elf-aside>
  <elf-main>${t("main")}</elf-main>
</elf-layout>`;

defineStyle(diagramStyles);

const PageLayoutShellEx1 = defineHtml(`
  <elf-playground data-docs-toc-level="2" :title=${t("headerMain")} :code=${headerMainCode}>
    <div class="layout-shell compact">
      <elf-layout>
        <elf-header height="52px">${t("header")}</elf-header>
        <elf-main><span class="region-label">${t("main")}</span><div class="shell-skeleton"><span></span><span></span><span></span><span></span></div></elf-main>
      </elf-layout>
    </div>
  </elf-playground>

  <elf-playground data-docs-toc-level="2" :title=${t("asideMain")} :code=${asideMainCode}>
    <div class="layout-shell compact">
      <elf-layout direction="horizontal">
        <elf-aside width="144px">${t("aside")}</elf-aside>
        <elf-main><span class="region-label">${t("main")}</span><div class="shell-skeleton"><span></span><span></span><span></span><span></span></div></elf-main>
      </elf-layout>
    </div>
  </elf-playground>
`);

export { PageLayoutShellEx1 };
