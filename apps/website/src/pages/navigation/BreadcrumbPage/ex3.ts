import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "组合式导航", en: "Compositional navigation" },
  idle: { zh: "尚未导航", en: "Not navigated yet" },
  latest: { zh: "最近导航", en: "Last navigation" },
  home: { zh: "首页", en: "Home" },
  components: { zh: "组件", en: "Components" },
  breadcrumb: { zh: "面包屑导航", en: "Breadcrumb" },
});

const current = useRef(t("idle"));

const onClick = (event: CustomEvent<[Record<string, unknown>, string]>): void => {
  current.set(event.detail[1]);
};

const code = `<elf-breadcrumb separator-icon="chevron_right" @click=\${onClick}>
  <elf-breadcrumb-item to="/">${t("home")}</elf-breadcrumb-item>
  <elf-breadcrumb-item :to=\${{ path: "/basic/button" }} replace>${t("components")}</elf-breadcrumb-item>
  <elf-breadcrumb-item>${t("breadcrumb")}</elf-breadcrumb-item>
</elf-breadcrumb>`;

const script = `const onClick = (event) => console.log(event.detail[1]);`;

const PageBreadcrumbEx3 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <span slot="status" class="demo-state">${t("latest")}：<strong>{{ current }}</strong></span>
    <div style="display:grid;place-items:center;width:100%;min-height:160px">
      <elf-breadcrumb separator-icon="chevron_right" @click=${onClick}>
        <elf-breadcrumb-item to="/">${t("home")}</elf-breadcrumb-item>
        <elf-breadcrumb-item :to=${{ path: "/basic/button" }} replace>${t("components")}</elf-breadcrumb-item>
        <elf-breadcrumb-item>${t("breadcrumb")}</elf-breadcrumb-item>
      </elf-breadcrumb>
    </div>
  </elf-playground>
`);

export { PageBreadcrumbEx3 };
