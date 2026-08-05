/** Workspace identity shown at the top of the sidebar. */
export interface AiSidebarWorkspace {
  name: string;
  subtitle?: string;
  avatar?: string;
}

/** One navigation item inside a section. */
export interface AiSidebarItem {
  key: string;
  label: string;
  badge?: string | number;
  active?: boolean;
}

/** A labelled group of navigation items. */
export interface AiSidebarSection {
  label: string;
  items: AiSidebarItem[];
}

/** User-facing labels for `elf-ai-sidebar-nav`. */
export interface AiSidebarNavLabels {
  workspace: string;
  search: string;
  newTask: string;
  noResults: string;
}

/** Public properties for `elf-ai-sidebar-nav`. */
export interface AiSidebarNavProps {
  workspace: AiSidebarWorkspace;
  sections: AiSidebarSection[];
  activeKey: string;
  newTaskLabel: string;
  searchPlaceholder: string;
  showSearch: boolean;
  showNewTask: boolean;
  labels: Partial<AiSidebarNavLabels>;
  ariaLabel: string;
}

/** Semantic events emitted by `elf-ai-sidebar-nav`. */
export interface AiSidebarNavEmits {
  select: [detail: AiSidebarItem];
  "new-task": [];
  "query-change": [query: string];
}

/** Imperative methods exposed by `elf-ai-sidebar-nav`. */
export interface AiSidebarNavExpose {
  focusSearch(): void;
  clearSearch(): void;
  getQuery(): string;
}

export type AiSidebarNavElement = HTMLElement & Partial<AiSidebarNavProps> & AiSidebarNavExpose;
