import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: {
    zh: "长标签、面板底部与窄容器",
    en: "Long labels, panel footers, and narrow containers",
  },
  playground: {
    zh: "窄容器自动切换为纵向布局",
    en: "Narrow containers switch to a vertical layout automatically.",
  },
  design: {
    zh: "设计系统与跨产品主题规范维护负责人",
    en: "Design system and cross-product theme standards owner",
  },
  frontend: {
    zh: "前端组件库构建、测试与发布流水线维护者",
    en: "Frontend library build, test, and release pipeline maintainer",
  },
  quality: {
    zh: "质量保障与无障碍体验专项负责人",
    en: "Quality assurance and accessibility owner",
  },
  docs: {
    zh: "文档站案例与 API 一致性维护者",
    en: "Documentation examples and API consistency maintainer",
  },
  leftFooter: { zh: "候选成员会按权限过滤", en: "Candidates are filtered by permissions." },
  rightFooter: { zh: "已选成员将收到邀请", en: "Selected members receive an invitation." },
});

const data = [
  { key: "design", label: t("design") },
  { key: "frontend", label: t("frontend") },
  { key: "quality", label: t("quality") },
  { key: "docs", label: t("docs") },
];

const selected = useRef<string[]>(["quality", "docs"]);

const code = `<div style="width:100%;max-width:520px">
  <elf-transfer :data=\${data} :modelValue=\${selected}>
    <span slot="left-footer">${t("leftFooter")}</span>
    <span slot="right-footer">${t("rightFooter")}</span>
  </elf-transfer>
</div>`;

const script = `const selected = useRef(["quality", "docs"]);

const data = [
  { key: "design", label: "${t("design")}" },
  // ...
];`;

const PageTransferEx3 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("playground")} :code=${code} :script=${script}>
    <div style="width:100%;max-width:520px">
      <elf-transfer :data.prop=${data} :modelValue.prop=${selected.value}>
        <span slot="left-footer" style="display:block;padding:10px 12px;color:var(--elf-text-secondary)">
          ${t("leftFooter")}
        </span>
        <span slot="right-footer" style="display:block;padding:10px 12px;color:var(--elf-text-secondary)">
          ${t("rightFooter")}
        </span>
      </elf-transfer>
    </div>
  </elf-playground>
`);

export { PageTransferEx3 };
