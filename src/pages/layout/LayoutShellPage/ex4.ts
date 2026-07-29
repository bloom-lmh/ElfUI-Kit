import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import diagramStyles from "../layout-diagrams.scss?inline";

const t = createDocsTranslator({
  three: { zh: "三栏工作台", en: "Three-column workspace" },
  collaboration: { zh: "多栏协作区", en: "Multi-column collaboration" },
  header: { zh: "顶栏", en: "Header" },
  navigation: { zh: "导航", en: "Navigation" },
  main: { zh: "内容区", en: "Main" },
  inspector: { zh: "检查器", en: "Inspector" },
  rail: { zh: "导航轨", en: "Rail" },
  rooms: { zh: "房间", en: "Rooms" },
  members: { zh: "成员", en: "Members" },
});

const threeCode = `<elf-layout>
  <elf-header height="52px">${t("header")}</elf-header>
  <elf-layout direction="horizontal">
    <elf-aside width="136px">${t("navigation")}</elf-aside>
    <elf-main>${t("main")}</elf-main>
    <elf-aside width="176px">${t("inspector")}</elf-aside>
  </elf-layout>
</elf-layout>`;

const collaborationCode = `<elf-layout direction="horizontal">
  <elf-aside width="64px">${t("rail")}</elf-aside>
  <elf-aside width="132px">${t("rooms")}</elf-aside>
  <elf-main>${t("main")}</elf-main>
  <elf-aside width="164px">${t("members")}</elf-aside>
</elf-layout>`;

defineStyle(diagramStyles);

const PageLayoutShellEx4 = defineHtml(`
  <elf-playground data-docs-toc-level="2" :title=${t("three")} :code=${threeCode}>
    <div class="layout-shell">
      <elf-layout>
        <elf-header height="52px">${t("header")}</elf-header>
        <elf-layout direction="horizontal">
          <elf-aside width="136px">${t("navigation")}</elf-aside>
          <elf-main><span class="region-label">${t("main")}</span><div class="shell-skeleton"><span></span><span></span><span></span><span></span></div></elf-main>
          <elf-aside class="right-region" width="176px">${t("inspector")}</elf-aside>
        </elf-layout>
      </elf-layout>
    </div>
  </elf-playground>

  <elf-playground data-docs-toc-level="2" :title=${t("collaboration")} :code=${collaborationCode}>
    <div class="layout-shell">
      <elf-layout direction="horizontal">
        <elf-aside width="64px">${t("rail")}</elf-aside>
        <elf-aside class="secondary-region" width="132px">${t("rooms")}</elf-aside>
        <elf-main><span class="region-label">${t("main")}</span><div class="shell-skeleton"><span></span><span></span><span></span><span></span></div></elf-main>
        <elf-aside class="right-region" width="164px">${t("members")}</elf-aside>
      </elf-layout>
    </div>
  </elf-playground>
`);

export { PageLayoutShellEx4 };
