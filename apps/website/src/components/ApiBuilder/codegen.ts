import type { TableRow } from "../PropsTable/types";
import {
  isAttrRole,
  isEventRole,
  isMethodRole,
  isSlotRole,
  type ApiBuilderRole,
  type ApiBuilderRoleRows,
  type ApiBuilderSelection,
} from "./types";

export interface CodegenInput {
  component: string;
  roleRows: ApiBuilderRoleRows;
  selections: ApiBuilderSelection;
}

const escapeAttr = (value: string): string =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const kebabToCamel = (name: string): string =>
  name.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());

/** 事件名 → 处理器名：`preview-open` → `handlePreviewOpen`。 */
export const handlerName = (name: string): string => {
  const camel = kebabToCamel(name);
  return `handle${camel.charAt(0).toUpperCase()}${camel.slice(1)}`;
};

/** 属性行勾选即输出；布尔输出裸属性名，其余输出 name="值"（空值也输出占位让用户填写）。 */
const renderAttr = (role: ApiBuilderRole, row: TableRow): string => {
  if (!isAttrRole(role)) return "";
  const type = String(row.type ?? "").toLowerCase();
  if (type.includes("boolean")) return row.name;
  return `${row.name}="${escapeAttr(String(row.default ?? ""))}"`;
};

const renderEvent = (role: ApiBuilderRole, row: TableRow): string => {
  if (!isEventRole(role)) return "";
  return `@${row.name}="${handlerName(row.name)}"`;
};

const slotLabel = (name: string): string => {
  if (name === "default") return "Content";
  const words = name.split(/[-_]/);
  const capitalized = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  return capitalized || name;
};

const renderSlot = (role: ApiBuilderRole, row: TableRow): string => {
  if (!isSlotRole(role)) return "";
  if (row.name === "default") return slotLabel("default");
  return `<span slot="${escapeAttr(row.name)}">${slotLabel(row.name)}</span>`;
};

const renderMethod = (role: ApiBuilderRole, row: TableRow): string => {
  if (!isMethodRole(role)) return "";
  const method = String(row.name).replace(/\(\)$/, "()");
  return `<!-- ref.value.${method} -->`;
};

interface ComponentGroup {
  attrs: string[];
  events: string[];
  slots: Array<{ name: string; markup: string }>;
  methods: string[];
}

const renderComponent = (component: string, group: ComponentGroup): string => {
  const openLines = [`<${component}`, ...group.attrs, ...group.events];
  const lines = [...openLines, ">"];
  const body = group.slots.map((slot) => slot.markup).join("\n");
  if (body) lines.push(body);
  lines.push(`</${component}>`);
  return [lines.join("\n"), ...group.methods].join("\n");
};

/**
 * 由选择状态生成元素标记字符串（含事件绑定、插槽子元素与方法注释）。
 * 支持多组件页面：每张表可归属不同组件标签，输出按组件分组为多个片段。
 * 每个属性/事件/方法各占一行，便于阅读。纯函数，便于单测。
 */
export const generateMarkup = (input: CodegenInput): string => {
  const { component: defaultComponent, roleRows, selections } = input;
  const groups = new Map<string, ComponentGroup>();

  for (const entry of roleRows) {
    const component = entry.component || defaultComponent;
    const role = entry.role;
    let group = groups.get(component);
    if (!group) {
      group = { attrs: [], events: [], slots: [], methods: [] };
      groups.set(component, group);
    }
    for (const row of entry.rows) {
      const selection = selections[role]?.[component]?.[row.name];
      if (!selection) continue;

      if (isAttrRole(role)) {
        const attr = renderAttr(role, row);
        if (attr) group.attrs.push(attr);
      } else if (isEventRole(role)) {
        group.events.push(renderEvent(role, row));
      } else if (isSlotRole(role)) {
        const markup = renderSlot(role, row);
        group.slots.push({ name: row.name, markup });
      } else if (isMethodRole(role)) {
        const comment = renderMethod(role, row);
        if (comment) group.methods.push(comment);
      }
    }
  }

  return Array.from(groups.entries())
    .map(([component, group]) => renderComponent(component, group))
    .join("\n\n");
};

/** 已选计数（供动作条展示）。 */
export const countSelections = (selections: ApiBuilderSelection): number =>
  Object.values(selections).reduce(
    (total, byComponent) =>
      total + Object.values(byComponent).reduce((sum, group) => sum + Object.keys(group).length, 0),
    0,
  );
