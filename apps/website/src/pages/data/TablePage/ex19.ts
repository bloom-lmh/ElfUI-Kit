import { defineHtml, defineStyle, useRef } from "@elfui/core";
import type {
  TableCellContext,
  TableColumn,
  TableFilterIconContext,
  TableHeaderCellContext,
  TableRow,
  TableRowContext,
} from "@elfui/kit-src/components/Data/Table";
import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import demoStyles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "自定义单元格", en: "Custom cells" },
  ready: { zh: "富内容渲染器已就绪", en: "Rich renderers are ready" },
  memberHeader: { zh: "成员档案", en: "Member profile" },
  detail: { zh: "职责方向：{role} · 联系方式：{email}", en: "Focus: {role} · Contact: {email}" },
  viewProfile: { zh: "查看档案", en: "View profile" },
  viewing: { zh: "正在查看：{name}", en: "Viewing: {name}" },
});
const pick = createDocsPicker();
const renderState = useRef(t("ready"));
const data = (): TableRow[] => [
  {
    id: "1",
    name: pick("林舒", "Lin Shu"),
    email: "lin@elfui.dev",
    role: pick("设计", "Design"),
    status: pick("在岗", "Active"),
    statusCode: "active",
    bio: pick("设计系统负责人", "Design system lead"),
  },
  {
    id: "2",
    name: pick("许宁", "Xu Ning"),
    email: "xu@elfui.dev",
    role: pick("研发", "Engineering"),
    status: pick("在岗", "Active"),
    statusCode: "active",
    bio: pick("组件架构与可访问性", "Component architecture and accessibility"),
  },
  {
    id: "3",
    name: pick("周然", "Zhou Ran"),
    email: "zhou@elfui.dev",
    role: pick("产品", "Product"),
    status: pick("休假", "On leave"),
    statusCode: "leave",
    bio: pick("开发者体验与文档", "Developer experience and documentation"),
  },
];
const createText = (tag: keyof HTMLElementTagNameMap, text: string, style = ""): HTMLElement => {
  const element = document.createElement(tag);
  element.textContent = text;
  element.style.cssText = style;
  return element;
};
const renderMemberHeader = (_context: TableHeaderCellContext): Node[] => {
  const heading = createText("strong", t("memberHeader"), "margin-left:6px");
  heading.className = "member-heading";
  return [createText("span", "●", "color:var(--elf-primary);font-size:10px"), heading];
};
const renderMember = ({ row }: TableCellContext): HTMLElement => {
  const profile = createText("span", "", "display:inline-flex;align-items:center;gap:10px");
  profile.className = "member-profile";
  const avatar = createText(
    "span",
    String(row.name).slice(0, 1),
    "display:grid;place-items:center;width:30px;height:30px;border-radius:50%;background:var(--elf-primary);color:white;font-weight:700",
  );
  const identity = createText("span", "", "display:grid;line-height:1.35");
  identity.append(
    createText("strong", String(row.name)),
    createText("small", String(row.email), "color:var(--elf-text-secondary)"),
  );
  profile.append(avatar, identity);
  return profile;
};
const renderStatus = ({ row }: TableCellContext): HTMLElement => {
  const active = row.statusCode === "active";
  return createText(
    "span",
    String(row.status),
    `display:inline-flex;padding:3px 9px;border-radius:999px;font-size:12px;font-weight:600;color:${active ? "#16794a" : "#9a6700"};background:${active ? "#e8f7ef" : "#fff4d6"}`,
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
    "display:grid;gap:4px;padding:4px 8px;color:var(--elf-text-primary)",
  );
  detail.className = "member-detail";
  detail.append(
    createText("strong", `${row.name} · ${row.bio}`),
    createText(
      "span",
      t("detail").replace("{role}", String(row.role)).replace("{email}", String(row.email)),
      "color:var(--elf-text-secondary)",
    ),
  );
  return detail;
};
const renderAction = ({ row }: TableCellContext): HTMLButtonElement => {
  const button = createText(
    "button",
    t("viewProfile"),
    "padding:5px 10px;border:1px solid var(--elf-border-color);border-radius:6px;background:var(--elf-bg-container);color:var(--elf-primary);cursor:pointer",
  ) as HTMLButtonElement;
  button.type = "button";
  button.className = "profile-button";
  button.addEventListener("click", () =>
    renderState.set(t("viewing").replace("{name}", String(row.name))),
  );
  return button;
};
const columns = () =>
  [
    { type: "expand", width: 48, renderExpand },
    {
      prop: "name",
      label: pick("成员", "Member"),
      minWidth: 190,
      renderHeader: renderMemberHeader,
      renderCell: renderMember,
    },
    { prop: "role", label: pick("职责", "Role"), width: 90 },
    {
      prop: "status",
      label: pick("状态", "Status"),
      width: 100,
      filters: [
        { text: pick("在岗", "Active"), value: pick("在岗", "Active") },
        { text: pick("休假", "On leave"), value: pick("休假", "On leave") },
      ],
      filteredValue: [pick("在岗", "Active")],
      filterMethod: (value: unknown, row: TableRow) => row.status === value,
      renderCell: renderStatus,
      renderFilterIcon,
    },
    {
      prop: "action",
      label: pick("操作", "Action"),
      width: 110,
      align: "center",
      renderCell: renderAction,
    },
  ] satisfies TableColumn[];

const code = `<elf-table :data.prop="data" :columns.prop="columns" border />

const columns = [{
  prop: "name",
  renderHeader: () => document.createTextNode("${t("memberHeader")}"),
  renderCell: ({ row }) => createMemberProfile(row)
}, {
  type: "expand",
  renderExpand: ({ row }) => createDetailPanel(row)
}];`;
const script = (): string => `const renderState = useRef("${t("ready")}");
const data = ${JSON.stringify(data(), null, 2)};
const columns = [
  { type: "expand", width: 48, renderExpand },
  { prop: "name", label: "${pick("成员", "Member")}", renderHeader: renderMemberHeader, renderCell: renderMember },
  { prop: "role", label: "${pick("职责", "Role")}" },
  { prop: "status", label: "${pick("状态", "Status")}", renderCell: renderStatus, renderFilterIcon },
  { prop: "action", label: "${pick("操作", "Action")}", renderCell: renderAction }
];`;

defineStyle(demoStyles);

const PageTableEx19 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script()}>
    <span slot="status" role="status" aria-live="polite">${renderState}</span>
    <div class="table-demo-stage">
      <elf-table class="table-demo-surface" :data.prop=${data()} :columns.prop=${columns()} row-key="id" border></elf-table>
    </div>
  </elf-playground>
`);

export { PageTableEx19 };
