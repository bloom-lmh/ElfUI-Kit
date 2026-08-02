import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "路由与字段映射", en: "Routing and field mapping" },
  currentHash: { zh: "当前哈希", en: "Current hash" },
  components: { zh: "组件", en: "Components" },
  navigation: { zh: "导航", en: "Navigation" },
  breadcrumb: { zh: "面包屑", en: "Breadcrumb" },
  api: { zh: "API", en: "API" },
});

const routeText = useRef(window.location.hash || "#/");

const docs = [
  { name: t("components"), path: "/basic/button" },
  { name: t("navigation"), path: "/navigation/menu" },
  { name: t("breadcrumb"), path: "/navigation/breadcrumb" },
  { name: t("api"), path: "/navigation/breadcrumb" },
];

const fields = { label: "name", to: "path", disabled: "locked" };

const onClick = (): void => {
  requestAnimationFrame(() => routeText.set(window.location.hash || "#/"));
};

const code = `<elf-breadcrumb
  :items="docs"
  :props.prop="{ label: 'name', to: 'path', disabled: 'locked' }"
  separator="|"
  router
  :maxItems.prop="3"
  @click="onClick"
/>`;

const script = `const fields = { label: "name", to: "path", disabled: "locked" };
const onClick = () => requestAnimationFrame(() => console.log(window.location.hash));

const docs = [
    { name: "${t("components")}", path: "/basic/button" },
    { name: "${t("navigation")}", path: "/navigation/menu" },
    { name: "${t("breadcrumb")}", path: "/navigation/breadcrumb" },
    { name: "${t("api")}", path: "/navigation/breadcrumb" }
];`;

const PageBreadcrumbEx2 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <span slot="status" class="demo-state">${t("currentHash")}：<strong>{{ routeText }}</strong></span>
    <div style="display:grid;place-items:center;width:100%;min-height:160px">
      <elf-breadcrumb
        :items=${docs}
        :props=${fields}
        separator="|"
        :router.prop=${true}
        :max-items=${3}
        @click=${onClick}
      ></elf-breadcrumb>
    </div>
  </elf-playground>
`);

export { PageBreadcrumbEx2 };
