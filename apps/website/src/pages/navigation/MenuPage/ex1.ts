import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  section: { zh: "基础用法", en: "Basic usage" },
  title: {
    zh: "垂直菜单",
    en: "Vertical menu",
  },
  current: { zh: "当前选中", en: "Selected" },
});

const active = useRef("/workspace/projects");

const openeds = ["/workspace"];

const items = [
  { index: "/dashboard", label: "Dashboard", icon: "D" },
  {
    index: "/workspace",
    label: "Workspace",
    icon: "W",
    children: [
      { index: "/workspace/projects", label: "Projects" },
      { index: "/workspace/tasks", label: "Tasks" },
      { index: "/workspace/disabled", label: "Disabled item", disabled: true },
    ],
  },
  {
    index: "/settings",
    label: "Settings",
    icon: "S",
    children: [
      { index: "/settings/profile", label: "Profile" },
      { index: "/settings/security", label: "Security" },
    ],
  },
];

const onChange = (event: CustomEvent): void => {
  active.set(event.detail);
};

const code = `<elf-menu
  :items="items"
  :modelValue="active"
  :defaultOpeneds="['/workspace']"
  unique-opened
  @update:modelValue="onChange"
/>`;
const script = `const active = useRef("/workspace/projects");
const openeds = ["/workspace"];
const items = [
  { index: "/dashboard", label: "Dashboard", icon: "D" },
  { index: "/workspace", label: "Workspace", icon: "W", children: [
    { index: "/workspace/projects", label: "Projects" },
    { index: "/workspace/tasks", label: "Tasks" }
  ] }
];
const onChange = (event) => active.set(event.detail);`;

const PageMenuEx1 = defineHtml(`
  <h2>${t("section")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <span slot="status" class="demo-state">${t("current")}: {{ active }}</span>
    <div style="width:100%;max-width:320px">
      <elf-menu
        bordered
        :items.prop=${items}
        :modelValue.prop=${active.value}
        :defaultOpeneds.prop=${openeds}
        unique-opened
        @update:modelValue="onChange"
      ></elf-menu>
    </div>
  </elf-playground>
`);

export { PageMenuEx1 };
