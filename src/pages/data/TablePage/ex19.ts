import { defineHtml, useRef } from "@elfui/core";
import type {
  TableCellContext,
  TableColumn,
  TableFilterIconContext,
  TableHeaderCellContext,
  TableRow,
  TableRowContext
} from "../../../components/Data/Table";

// State
const renderState = useRef("富内容渲染器已就绪");

const data: TableRow[] = [
  { id: "1", name: "林舒", email: "lin@elfui.dev", role: "设计", status: "在岗", bio: "设计系统负责人" },
  { id: "2", name: "许宁", email: "xu@elfui.dev", role: "研发", status: "在岗", bio: "组件架构与可访问性" },
  { id: "3", name: "周然", email: "zhou@elfui.dev", role: "产品", status: "休假", bio: "开发者体验与文档" }
];

// Render helpers
const createText = (tag: keyof HTMLElementTagNameMap, text: string, style = ""): HTMLElement => {
  const element = document.createElement(tag);
  element.textContent = text;
  element.style.cssText = style;
  return element;
};

const renderMemberHeader = (_context: TableHeaderCellContext): Node[] => {
  const heading = createText("strong", "成员档案", "margin-left:6px");
  heading.className = "member-heading";
  return [
    createText("span", "●", "color:var(--elf-primary);font-size:10px"),
    heading
  ];
};

const renderMember = ({ row }: TableCellContext): HTMLElement => {
  const profile = createText("span", "", "display:inline-flex;align-items:center;gap:10px");
  profile.className = "member-profile";
  const avatar = createText(
    "span",
    String(row.name).slice(0, 1),
    "display:grid;place-items:center;width:30px;height:30px;border-radius:50%;background:var(--elf-primary);color:white;font-weight:700"
  );
  const identity = createText("span", "", "display:grid;line-height:1.35");
  identity.append(
    createText("strong", String(row.name)),
    createText("small", String(row.email), "color:var(--elf-text-secondary)")
  );
  profile.append(avatar, identity);
  return profile;
};

const renderStatus = ({ row }: TableCellContext): HTMLElement => {
  const active = row.status === "在岗";
  return createText(
    "span",
    String(row.status),
    `display:inline-flex;padding:3px 9px;border-radius:999px;font-size:12px;font-weight:600;color:${active ? "#16794a" : "#9a6700"};background:${active ? "#e8f7ef" : "#fff4d6"}`
  );
};

const renderFilterIcon = ({ filtered }: TableFilterIconContext): HTMLElement => {
  const icon = createText("span", filtered ? "●" : "○", "font-size:12px");
  icon.className = "custom-filter-icon";
  return icon;
};

const renderExpand = ({ row }: TableRowContext): HTMLElement => {
  const detail = createText(
    "section",
    "",
    "display:grid;gap:4px;padding:4px 8px;color:var(--elf-text-primary)"
  );
  detail.className = "member-detail";
  detail.append(
    createText("strong", `${row.name} · ${row.bio}`),
    createText("span", `职责方向：${row.role} · 联系方式：${row.email}`, "color:var(--elf-text-secondary)")
  );
  return detail;
};

const renderAction = ({ row }: TableCellContext): HTMLButtonElement => {
  const button = createText(
    "button",
    "查看档案",
    "padding:5px 10px;border:1px solid var(--elf-border-color);border-radius:6px;background:var(--elf-bg-container);color:var(--elf-primary);cursor:pointer"
  ) as HTMLButtonElement;
  button.type = "button";
  button.className = "profile-button";
  button.addEventListener("click", () => renderState.set(`正在查看：${row.name}`));
  return button;
};

const columns = [
  { type: "expand", width: 48, renderExpand },
  { prop: "name", label: "成员", minWidth: 190, renderHeader: renderMemberHeader, renderCell: renderMember },
  { prop: "role", label: "职责", width: 90 },
  {
    prop: "status",
    label: "状态",
    width: 100,
    filters: [
      { text: "在岗", value: "在岗" },
      { text: "休假", value: "休假" }
    ],
    filteredValue: ["在岗"],
    filterMethod: (value: unknown, row: TableRow) => row.status === value,
    renderCell: renderStatus,
    renderFilterIcon
  },
  { prop: "action", label: "操作", width: 110, align: "center", renderCell: renderAction }
] satisfies TableColumn[];

const code = `<elf-table :data.prop="data" :columns.prop="columns" border />

const columns = [{
  prop: "name",
  renderHeader: () => document.createTextNode("成员档案"),
  renderCell: ({ row }) => createMemberProfile(row)
}, {
  type: "expand",
  renderExpand: ({ row }) => createDetailPanel(row)
}];`;

const script = `const renderState = useRef("富内容渲染器已就绪");
const data = [
    { id: "1", name: "林舒", email: "lin@elfui.dev", role: "设计", status: "在岗", bio: "设计系统负责人" },
    { id: "2", name: "许宁", email: "xu@elfui.dev", role: "研发", status: "在岗", bio: "组件架构与可访问性" },
    { id: "3", name: "周然", email: "zhou@elfui.dev", role: "产品", status: "休假", bio: "开发者体验与文档" }
];
const createText = (tag, text, style = "") => {
    const element = document.createElement(tag);
    element.textContent = text;
    element.style.cssText = style;
    return element;
};
const renderMemberHeader = (_context) => {
    const heading = createText("strong", "成员档案", "margin-left:6px");
    heading.className = "member-heading";
    return [
        createText("span", "●", "color:var(--elf-primary);font-size:10px"),
        heading
    ];
};
const renderMember = ({ row }) => {
    const profile = createText("span", "", "display:inline-flex;align-items:center;gap:10px");
    profile.className = "member-profile";
    const avatar = createText("span", String(row.name).slice(0, 1), "display:grid;place-items:center;width:30px;height:30px;border-radius:50%;background:var(--elf-primary);color:white;font-weight:700");
    const identity = createText("span", "", "display:grid;line-height:1.35");
    identity.append(createText("strong", String(row.name)), createText("small", String(row.email), "color:var(--elf-text-secondary)"));
    profile.append(avatar, identity);
    return profile;
};
const renderStatus = ({ row }) => {
    const active = row.status === "在岗";
    return createText("span", String(row.status), \`display:inline-flex;padding:3px 9px;border-radius:999px;font-size:12px;font-weight:600;color:\${active ? "#16794a" : "#9a6700"};background:\${active ? "#e8f7ef" : "#fff4d6"}\`);
};
const renderFilterIcon = ({ filtered }) => {
    const icon = createText("span", filtered ? "●" : "○", "font-size:12px");
    icon.className = "custom-filter-icon";
    return icon;
};
const renderExpand = ({ row }) => {
    const detail = createText("section", "", "display:grid;gap:4px;padding:4px 8px;color:var(--elf-text-primary)");
    detail.className = "member-detail";
    detail.append(createText("strong", \`\${row.name} · \${row.bio}\`), createText("span", \`职责方向：\${row.role} · 联系方式：\${row.email}\`, "color:var(--elf-text-secondary)"));
    return detail;
};
const renderAction = ({ row }) => {
    const button = createText("button", "查看档案", "padding:5px 10px;border:1px solid var(--elf-border-color);border-radius:6px;background:var(--elf-bg-container);color:var(--elf-primary);cursor:pointer");
    button.type = "button";
    button.className = "profile-button";
    button.addEventListener("click", () => renderState.set(\`正在查看：\${row.name}\`));
    return button;
};
const columns = [
    { type: "expand", width: 48, renderExpand },
    { prop: "name", label: "成员", minWidth: 190, renderHeader: renderMemberHeader, renderCell: renderMember },
    { prop: "role", label: "职责", width: 90 },
    {
        prop: "status",
        label: "状态",
        width: 100,
        filters: [
            { text: "在岗", value: "在岗" },
            { text: "休假", value: "休假" }
        ],
        filteredValue: ["在岗"],
        filterMethod: (value, row) => row.status === value,
        renderCell: renderStatus,
        renderFilterIcon
    },
    { prop: "action", label: "操作", width: 110, align: "center", renderCell: renderAction }
];`;

const PageTableEx19 = defineHtml(`
  <h2>自定义列内容</h2>
  <elf-playground title="成员目录：富表头、单元格、展开区与筛选图标" :code="code" :script=${script}>
    <span slot="status" class="demo-state">{{ renderState }}</span>
    <div style="width:100%;max-width:860px">
      <elf-table :data.prop="data" :columns.prop="columns" row-key="id" border></elf-table>
    </div>
  </elf-playground>
`);

export { PageTableEx19 };
