import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  section: { zh: "折叠与自定义字段", en: "Collapse and custom fields" },
  title: { zh: "折叠模式 / 字段映射", en: "Collapse mode / field mapping" },
  expanded: { zh: "展开", en: "Expanded" },
  collapsed: { zh: "折叠", en: "Collapsed" }
});


const active = useRef("overview");

const collapsedActive = useRef("overview");

const openeds = ["team"];

const customProps = {
  index: "id",
  label: "title",
  icon: "mark",
  disabled: "locked",
  children: "nodes"
};

const customItems = [
  { id: "overview", title: "Overview", mark: "O" },
  {
    id: "team",
    title: "Team",
    mark: "T",
    nodes: [
      { id: "team-members", title: "Members" },
      { id: "team-roles", title: "Roles", locked: true }
    ]
  },
  { id: "billing", title: "Billing", mark: "B" }
];

const onChange = (event: CustomEvent): void => {
  active.set(event.detail);
};

const onCollapsedChange = (event: CustomEvent): void => {
  collapsedActive.set(event.detail);
};

const code1 = `<elf-menu
  :items="customItems"
  :props="customProps"
  :modelValue="active"
  :defaultOpeneds="openeds"
/>

<elf-menu
  collapse
  show-toggle
  :items="customItems"
  :props="customProps"
  :modelValue="collapsedActive"
/>`;
const script = `const active = useRef("overview");
const collapsedActive = useRef("overview");
const customProps = { index: "id", label: "title", icon: "mark", disabled: "locked", children: "nodes" };
const customItems = [
  { id: "overview", title: "Overview", mark: "O" },
  { id: "team", title: "Team", mark: "T", nodes: [{ id: "team-members", title: "Members" }] }
];

const openeds = ["team"];`;

const PageMenuEx3 = defineHtml(`
  <h2>${t("section")}</h2>
  <elf-playground :title=${t("title")} :code=${code1} :script=${script}>
    <span slot="status" class="demo-state">${t("expanded")}: {{ active }} · ${t("collapsed")}: {{ collapsedActive }}</span>
    <div style="display:flex;gap:20px;align-items:flex-start;flex-wrap:wrap;width:100%">
      <elf-menu
        bordered
        style="max-width:280px"
        :items.prop=${customItems}
        :props.prop=${customProps}
        :modelValue.prop=${active.value}
        :defaultOpeneds.prop=${openeds}
        @update:modelValue="onChange"
      ></elf-menu>
      <elf-menu
        bordered
        collapse
        show-toggle
        :items.prop=${customItems}
        :props.prop=${customProps}
        :modelValue.prop=${collapsedActive.value}
        @update:modelValue="onCollapsedChange"
      ></elf-menu>
    </div>
  </elf-playground>
`);

export { PageMenuEx3 };
