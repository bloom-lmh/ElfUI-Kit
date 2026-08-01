import { defineHtml, defineStyle, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

defineStyle(styles);

const t = createDocsTranslator({
  section: { zh: "组合式链接", en: "Compositional links" },
  title: { zh: "锚点链接与嵌套子链接", en: "AnchorLink and nested sub-link" },
  overview: { zh: "概览", en: "Overview" },
  guide: { zh: "指南", en: "Guide" },
  api: { zh: "API", en: "API" },
  overviewBody: {
    zh: "需要直接通过标记声明导航内容时，可以使用 AnchorLink。",
    en: "Use AnchorLink when navigation content should be declared directly in markup.",
  },
  guideBody: {
    zh: "默认插槽可自定义链接标签，sub-link 插槽用于创建嵌套。",
    en: "The default slot customizes a link label, while sub-link creates nesting.",
  },
  apiBody: {
    zh: "父级会让所有组合式链接与当前目标保持同步。",
    en: "The parent keeps every compositional link synchronized with the active target.",
  },
});

const active = useRef("#anchor-links-overview");

const onChange = (event: CustomEvent<{ href: string }>): void => {
  active.set(event.detail.href);
};

const code = `<elf-anchor
  container="#anchor-links-scroll"
  :modelValue=\${active}
  @change=\${onChange}
>
  <elf-anchor-link href="#anchor-links-overview" title="${t("overview")}" />
  <elf-anchor-link href="#anchor-links-guide" title="${t("guide")}">
    <elf-anchor-link slot="sub-link" href="#anchor-links-api" title="API" />
  </elf-anchor-link>
</elf-anchor>`;

const script = `const active = useRef("#anchor-links-overview");

const onChange = (event) => {
  active.set(event.detail.href);
};`;

const PageAnchorEx3 = defineHtml(`
  <h2>${t("section")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <div class="anchor-demo-layout">
      <elf-anchor
        container="#anchor-links-scroll"
        :modelValue.prop=${active.value}
        @change=${onChange}
      >
        <elf-anchor-link href="#anchor-links-overview" :title=${t("overview")}></elf-anchor-link>
        <elf-anchor-link href="#anchor-links-guide" :title=${t("guide")}>
          <elf-anchor-link
            slot="sub-link"
            href="#anchor-links-api"
            :title=${t("api")}
          ></elf-anchor-link>
        </elf-anchor-link>
      </elf-anchor>
      <div id="anchor-links-scroll" class="anchor-document">
        <section id="anchor-links-overview" class="anchor-section">
          <h3>${t("overview")}</h3>
          <p>${t("overviewBody")}</p>
        </section>
        <section
          id="anchor-links-guide"
          class="anchor-section"
        >
          <h3>${t("guide")}</h3>
          <p>${t("guideBody")}</p>
        </section>
        <section
          id="anchor-links-api"
          class="anchor-section"
        >
          <h3>${t("api")}</h3>
          <p>${t("apiBody")}</p>
        </section>
      </div>
    </div>
  </elf-playground>
`);

export { PageAnchorEx3 };
