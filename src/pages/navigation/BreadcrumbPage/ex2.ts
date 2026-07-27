import { defineHtml, useRef } from "@elfui/core";


const routeText = useRef(window.location.hash || "#/");

const docs = [
  { name: "组件", path: "/basic/button" },
  { name: "Navigation", path: "/navigation/menu" },
  { name: "Breadcrumb", path: "/navigation/breadcrumb" },
  { name: "API", path: "/navigation/breadcrumb" }
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
    { name: "组件", path: "/basic/button" },
    { name: "Navigation", path: "/navigation/menu" },
    { name: "Breadcrumb", path: "/navigation/breadcrumb" },
    { name: "API", path: "/navigation/breadcrumb" }
];`;

const PageBreadcrumbEx2 = defineHtml(`
  <elf-playground title="路由与字段映射" :code=${code} :script=${script}>
    <span slot="status" class="demo-state">当前 hash：<strong>{{ routeText }}</strong></span>
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
