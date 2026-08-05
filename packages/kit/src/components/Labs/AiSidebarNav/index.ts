import {
  defineEmits,
  defineExpose,
  defineHtml,
  defineProps,
  defineStyle,
  onMounted,
  useHostAttr,
  useRef,
  useTemplateRef,
} from "@elfui/core";

import styles from "./style.scss?inline";
import type {
  AiSidebarItem,
  AiSidebarNavEmits,
  AiSidebarNavExpose,
  AiSidebarNavLabels,
  AiSidebarNavProps,
  AiSidebarSection,
} from "./types";

export type {
  AiSidebarItem,
  AiSidebarNavElement,
  AiSidebarNavEmits,
  AiSidebarNavExpose,
  AiSidebarNavLabels,
  AiSidebarNavProps,
  AiSidebarSection,
  AiSidebarWorkspace,
} from "./types";

const DEFAULT_LABELS: AiSidebarNavLabels = {
  workspace: "Workspace",
  search: "Quick search",
  newTask: "New task",
  noResults: "No matches",
};

const props = defineProps<AiSidebarNavProps>({
  workspace: { type: Object, default: () => ({ name: "" }) },
  sections: { type: Array, default: () => [] },
  activeKey: { type: String, default: "" },
  newTaskLabel: { type: String, default: "" },
  searchPlaceholder: { type: String, default: "" },
  showSearch: { type: Boolean, default: true },
  showNewTask: { type: Boolean, default: true },
  labels: { type: Object, default: () => ({}) },
  ariaLabel: { type: String, default: "" },
});

const emit = defineEmits<AiSidebarNavEmits>(["select", "new-task", "query-change"]);
const input = useTemplateRef<HTMLInputElement>("input");
const query = useRef("");

const label = (key: keyof AiSidebarNavLabels): string =>
  props.labels?.[key] || DEFAULT_LABELS[key] || key;
const workspaceName = (): string => props.workspace?.name || "";
const workspaceSubtitle = (): string => props.workspace?.subtitle || "";
const workspaceAvatar = (): string =>
  props.workspace?.avatar || workspaceName().slice(0, 1).toUpperCase() || "?";
const hasWorkspaceSubtitle = (): boolean => Boolean(workspaceSubtitle());
const searchPlaceholder = (): string => props.searchPlaceholder || label("search");
const newTaskText = (): string => props.newTaskLabel || label("newTask");
const normalizedQuery = (): string => query.value.trim().toLowerCase();
const matches = (item: AiSidebarItem): boolean => {
  const needle = normalizedQuery();
  return needle.length === 0 || `${item.label} ${item.key}`.toLowerCase().includes(needle);
};
const visibleSections = (): AiSidebarSection[] =>
  props.sections
    .map((section) => ({
      ...section,
      items: section.items.filter(matches),
    }))
    .filter((section) => section.items.length > 0);
const itemKey = (item: AiSidebarItem): string => item.key;
const itemBadge = (item: AiSidebarItem): string => String(item.badge ?? "");
const hasBadge = (item: AiSidebarItem): boolean =>
  item.badge !== undefined && item.badge !== null && item.badge !== "";
const isActive = (item: AiSidebarItem): boolean => item.active || item.key === props.activeKey;
const hostLabel = (): string => props.ariaLabel || `${label("workspace")}: ${workspaceName()}`;

const onInput = (event: Event): void => {
  query.set((event.currentTarget as HTMLInputElement).value);
  emit("query-change", query.value);
};
const onItemClick = (event: Event): void => {
  const key = (event.currentTarget as HTMLElement).dataset.key || "";
  const item = visibleSections()
    .flatMap((section) => section.items)
    .find((entry) => entry.key === key);
  if (item) emit("select", item);
};
const onNewTask = (): void => {
  emit("new-task");
};
const focusSearch = (): void => input.value?.focus();
const clearSearch = (): void => {
  query.set("");
  emit("query-change", "");
  focusSearch();
};
const getQuery = (): string => query.value;

onMounted(() => {
  focusSearch();
});

useHostAttr("aria-label", hostLabel);

defineExpose<AiSidebarNavExpose>(
  { focusSearch, clearSearch, getQuery },
  { overrideNative: ["focus"] },
);

defineStyle(styles);

const AiSidebarNav = defineHtml(`
  <aside class="sidebar-nav" role="navigation" :aria-label=${props.ariaLabel || label("workspace")}>
    <div class="workspace">
      <slot name="header">
        <span class="avatar" aria-hidden="true">${workspaceAvatar()}</span>
        <span class="identity">
          <span class="name">${workspaceName()}</span>
          <span v-if=${hasWorkspaceSubtitle()} class="subtitle">${workspaceSubtitle()}</span>
        </span>
      </slot>
    </div>
    <div v-if=${props.showSearch} class="search">
      <span class="search-icon" aria-hidden="true"></span>
      <input
        ref="input"
        class="input"
        type="text"
        :value=${query}
        :placeholder=${searchPlaceholder()}
        :aria-label=${label("search")}
        @input=${onInput}
      >
      <span class="kbd" aria-hidden="true">/</span>
    </div>
    <button
      v-if=${props.showNewTask}
      class="new-task"
      type="button"
      :aria-label=${newTaskText()}
      @click=${onNewTask}
    >
      <span class="plus" aria-hidden="true"></span>
      <span>${newTaskText()}</span>
    </button>
    <div class="sections">
      <section v-for="section in visibleSections()" :key="section.label" class="section">
        <span class="section-label">{{ section.label }}</span>
        <div class="items">
          <button
            v-for="item in section.items"
            :key="itemKey(item)"
            class="item"
            :class="{ active: isActive(item) }"
            type="button"
            :data-key="item.key"
            :aria-current="String(isActive(item))"
            @click=${onItemClick}
          >
            <span class="item-label">{{ item.label }}</span>
            <span v-if="hasBadge(item)" class="badge">{{ itemBadge(item) }}</span>
          </button>
        </div>
      </section>
      <p v-if=${visibleSections().length === 0} class="empty">${label("noResults")}</p>
    </div>
    <div class="footer"><slot name="footer"></slot></div>
  </aside>
`);

export { AiSidebarNav };
