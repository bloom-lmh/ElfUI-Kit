import type { TableRow } from "../PropsTable/types";

/** API 表角色。未列出的特化表名按未知字符串处理（codegen 归类时可扩展）。 */
export type ApiBuilderRole =
  "props" | "events" | "slots" | "methods" | "exposes" | "expose" | (string & {});

/** 一张已注册的 API 表：归属于某个组件标签与角色。 */
export interface ApiBuilderRoleEntry {
  role: ApiBuilderRole;
  /** 表所属组件标签；空串时使用构建器默认 component。 */
  component: string;
  rows: TableRow[];
}

export interface ApiBuilderProps {
  /** 目标组件标签，如 "elf-card"。 */
  component: string;
  /** 面板标题。 */
  title: string;
}

export interface ApiBuilderSlots {
  /** 各角色 API 表格。 */
  default?: unknown;
}

/** 一个已选项的取值状态。 */
export interface ApiBuilderSelectionItem {
  name: string;
  /** 字符串化的当前值；布尔用 "true"/"false"。 */
  value: string;
}

/** role → component → name → 选项。 */
export type ApiBuilderSelection = Record<
  string,
  Record<string, Record<string, ApiBuilderSelectionItem>>
>;
export type ApiBuilderRoleRows = ApiBuilderRoleEntry[];

/** role 归类：决定 codegen 把它生成到哪一类。 */
export const ROLE_ATTRS = new Set<ApiBuilderRole>(["props"]);
export const ROLE_EVENTS = new Set<ApiBuilderRole>(["events"]);
export const ROLE_SLOTS = new Set<ApiBuilderRole>(["slots"]);
export const ROLE_METHODS = new Set<ApiBuilderRole>(["methods", "exposes", "expose"]);

export const isAttrRole = (role: ApiBuilderRole): boolean => ROLE_ATTRS.has(role);
export const isEventRole = (role: ApiBuilderRole): boolean => ROLE_EVENTS.has(role);
export const isSlotRole = (role: ApiBuilderRole): boolean => ROLE_SLOTS.has(role);
export const isMethodRole = (role: ApiBuilderRole): boolean => ROLE_METHODS.has(role);
