import { defineHtml, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";

const checked = useRef<string[]>(["readme"]);
const checkedStrict = useRef<string[]>([]);

const t = createDocsTranslator({
  cascadeTitle: { zh: "级联复选", en: "Cascading checks" },
  strictTitle: { zh: "严格复选", en: "Strict checks" },
  checked: { zh: "已勾选", en: "Checked" },
  strictChecked: { zh: "严格勾选", en: "Strictly checked" },
  none: { zh: "无", en: "None" },
  search: { zh: "搜索文件", en: "Search files" },
  ariaCascade: { zh: "文件权限树", en: "File permission tree" },
  ariaStrict: { zh: "严格复选树", en: "Strict check tree" }
});

const data = () => [
  {
    id: "docs",
    name: "docs",
    nodes: [
      { id: "readme", name: "README.md" },
      { id: "plan", name: "PLAN.md" },
      { id: "api", name: "API.md", disabled: true }
    ]
  },
  {
    id: "src",
    name: "src",
    nodes: [
      {
        id: "components",
        name: "components",
        nodes: [
          { id: "tree", name: "Tree" },
          { id: "menu", name: "Menu" }
        ]
      }
    ]
  }
];

const onChecked = (event: Event): void => {
  const detail = (event as CustomEvent).detail;
  if (Array.isArray(detail)) checked.set(detail);
};

const onStrictChecked = (event: Event): void => {
  const detail = (event as CustomEvent).detail;
  if (Array.isArray(detail)) checkedStrict.set(detail);
};

const checkedText = (): string => checked.value.join(", ") || t("none");
const checkedStrictText = (): string => checkedStrict.value.join(", ") || t("none");

const code1 = `<elf-tree
  :data.prop="data"
  :props.prop="{ key: 'id', label: 'name', children: 'nodes' }"
  show-checkbox
  filterable
  default-expand-all
/>`;

const code1Script = `const data = [
    {
        id: "docs",
        name: "docs",
        nodes: [
            { id: "readme", name: "README.md" },
            { id: "plan", name: "PLAN.md" },
            { id: "api", name: "API.md", disabled: true }
        ]
    },
    {
        id: "src",
        name: "src",
        nodes: [
            {
                id: "components",
                name: "components",
                nodes: [
                    { id: "tree", name: "Tree" },
                    { id: "menu", name: "Menu" }
                ]
            }
        ]
    }
];`;

const code2 = `<elf-tree
  :data.prop="data"
  :props.prop="{ key: 'id', label: 'name', children: 'nodes' }"
  show-checkbox
  check-strictly
/>`;

const code2Script = `const data = [
    {
        id: "docs",
        name: "docs",
        nodes: [
            { id: "readme", name: "README.md" },
            { id: "plan", name: "PLAN.md" },
            { id: "api", name: "API.md", disabled: true }
        ]
    },
    {
        id: "src",
        name: "src",
        nodes: [
            {
                id: "components",
                name: "components",
                nodes: [
                    { id: "tree", name: "Tree" },
                    { id: "menu", name: "Menu" }
                ]
            }
        ]
    }
];`;

const PageTreeEx2 = defineHtml(`
  <elf-playground :title=${t("cascadeTitle")} :code=${code1} :script=${code1Script}>
    <elf-card variant="outlined" density="compact" style="width:100%;max-width:560px">
      <elf-tree
        :data.prop=${data()}
        :props.prop=${{ key: "id", label: "name", children: "nodes" }}
        :checkedKeys.prop=${checked}
        :filterPlaceholder.prop=${t("search")}
        :ariaLabel.prop=${t("ariaCascade")}
        show-checkbox
        filterable
        default-expand-all
        @update:checkedKeys=${onChecked}
      />
    </elf-card>
    <p slot="status" class="demo-state">${t("checked")} · ${checkedText()}</p>
  </elf-playground>

  <elf-playground :title=${t("strictTitle")} :code=${code2} :script=${code2Script}>
    <elf-card variant="outlined" density="compact" style="width:100%;max-width:560px">
      <elf-tree
        :data.prop=${data()}
        :props.prop=${{ key: "id", label: "name", children: "nodes" }}
        :checkedKeys.prop=${checkedStrict}
        :ariaLabel.prop=${t("ariaStrict")}
        show-checkbox
        check-strictly
        default-expand-all
        @update:checkedKeys=${onStrictChecked}
      />
    </elf-card>
    <p slot="status" class="demo-state">${t("strictChecked")} · ${checkedStrictText()}</p>
  </elf-playground>
`);

export { PageTreeEx2 };
