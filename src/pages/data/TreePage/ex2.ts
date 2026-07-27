import { defineHtml, useRef } from "@elfui/core";


const checked = useRef<string[]>(["readme"]);

const checkedStrict = useRef<string[]>([]);

const data = [
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

const checkedText = (): string => checked.value.join(", ") || "无";

const checkedStrictText = (): string => checkedStrict.value.join(", ") || "无";

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
  <h2>复选框与过滤</h2>
  <elf-playground title="父子级联勾选，输入关键字过滤节点" :code="code1" :script=${code1Script}>
    <elf-card variant="outlined" density="compact" style="width:100%;max-width:560px">
      <elf-tree
      :data.prop="data"
      :props.prop="{ key: 'id', label: 'name', children: 'nodes' }"
      :checkedKeys.prop="checked"
      @update:checkedKeys="onChecked"
      show-checkbox
      filterable
      default-expand-all
      filter-placeholder="搜索文件"
      ></elf-tree>
    </elf-card>
    <p slot="status" class="demo-state">已勾选：{{ checkedText() }}</p>
  </elf-playground>

  <h2>严格勾选</h2>
  <elf-playground title="check-strictly 开启后父子节点互不影响" :code="code2" :script=${code2Script}>
    <elf-card variant="outlined" density="compact" style="width:100%;max-width:560px">
      <elf-tree
      :data.prop="data"
      :props.prop="{ key: 'id', label: 'name', children: 'nodes' }"
      :checkedKeys.prop="checkedStrict"
      @update:checkedKeys="onStrictChecked"
      show-checkbox
      check-strictly
      default-expand-all
      ></elf-tree>
    </elf-card>
    <p slot="status" class="demo-state">严格勾选：{{ checkedStrictText() }}</p>
  </elf-playground>
`);

export { PageTreeEx2 };
