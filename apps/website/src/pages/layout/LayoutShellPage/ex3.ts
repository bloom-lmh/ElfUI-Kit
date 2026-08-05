import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import diagramStyles from "../layout-diagrams.scss?inline";

const t = createDocsTranslator({
  nested: { zh: "嵌套双导航", en: "Nested navigation" },
  details: { zh: "右侧详情栏", en: "Right detail panel" },
  rail: { zh: "导航轨", en: "Rail" },
  header: { zh: "顶栏", en: "Header" },
  subNavigation: { zh: "次级导航", en: "Sub navigation" },
  main: { zh: "内容区", en: "Main" },
  footer: { zh: "页脚", en: "Footer" },
  detailRegion: { zh: "详情栏", en: "Details" },
});

const nestedCode = `<elf-layout direction="horizontal">
  <elf-aside width="72px">${t("rail")}</elf-aside>
  <elf-layout>
    <elf-header height="52px">${t("header")}</elf-header>
    <elf-layout direction="horizontal">
      <elf-aside width="156px">${t("subNavigation")}</elf-aside>
      <elf-main>${t("main")}</elf-main>
    </elf-layout>
    <elf-footer height="48px">${t("footer")}</elf-footer>
  </elf-layout>
</elf-layout>`;

const detailsCode = `<elf-layout>
  <elf-header height="52px">${t("header")}</elf-header>
  <elf-layout direction="horizontal">
    <elf-main>${t("main")}</elf-main>
    <elf-aside width="196px">${t("detailRegion")}</elf-aside>
  </elf-layout>
</elf-layout>`;

defineStyle(diagramStyles);

const PageLayoutShellEx3 = defineHtml(`
  <elf-playground data-docs-toc-level="2" :title=${t("nested")} :code=${nestedCode}>
    <div class="layout-shell">
      <elf-layout direction="horizontal">
        <elf-aside width="72px">${t("rail")}</elf-aside>
        <elf-layout>
          <elf-header height="52px">${t("header")}</elf-header>
          <elf-layout direction="horizontal">
            <elf-aside class="secondary-region" width="156px">${t("subNavigation")}</elf-aside>
            <elf-main><span class="region-label">${t("main")}</span><div class="shell-skeleton"><span></span><span></span><span></span><span></span></div></elf-main>
          </elf-layout>
          <elf-footer height="48px">${t("footer")}</elf-footer>
        </elf-layout>
      </elf-layout>
    </div>
  </elf-playground>

  <elf-playground data-docs-toc-level="2" :title=${t("details")} :code=${detailsCode}>
    <div class="layout-shell">
      <elf-layout>
        <elf-header height="52px">${t("header")}</elf-header>
        <elf-layout direction="horizontal">
          <elf-main><span class="region-label">${t("main")}</span><div class="shell-skeleton"><span></span><span></span><span></span><span></span></div></elf-main>
          <elf-aside class="right-region" width="196px">${t("detailRegion")}</elf-aside>
        </elf-layout>
      </elf-layout>
    </div>
  </elf-playground>
`);

export { PageLayoutShellEx3 };
