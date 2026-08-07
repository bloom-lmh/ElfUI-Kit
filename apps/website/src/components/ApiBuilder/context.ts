import { createInjectionKey } from "@elfui/core";
import type { TableRow } from "../PropsTable/types";
import type { ApiBuilderRole, ApiBuilderRoleRows, ApiBuilderSelection } from "./types";

export interface ApiBuilderContext {
  readonly component: string;
  readonly roleRows: ApiBuilderRoleRows;
  readonly selections: ApiBuilderSelection;
  registerTable(role: ApiBuilderRole, rows: TableRow[], component?: string): void;
  /** Table selection-change 整批设置某 role 的选中行。 */
  setSelected(role: ApiBuilderRole, names: string[], component?: string): void;
  isSelected(role: ApiBuilderRole, name: string, component?: string): boolean;
  clear(): void;
}

export const API_BUILDER_KEY = createInjectionKey<ApiBuilderContext>("elfui.api-builder");
