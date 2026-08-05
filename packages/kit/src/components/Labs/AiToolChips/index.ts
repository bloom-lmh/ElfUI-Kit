import {
  defineEmits,
  defineExpose,
  defineHtml,
  defineProps,
  defineStyle,
  useHostAttr,
  useHostFlag,
  useRef,
} from "@elfui/core";

import styles from "./style.scss?inline";
import type {
  AiToolChipFile,
  AiToolChipItem,
  AiToolChipKind,
  AiToolChipStatus,
  AiToolChipsEmits,
  AiToolChipsExpose,
  AiToolChipsLabels,
  AiToolChipsProps,
} from "./types";

export type {
  AiToolChipFile,
  AiToolChipItem,
  AiToolChipKind,
  AiToolChipStatus,
  AiToolChipsElement,
  AiToolChipsEmits,
  AiToolChipsExpose,
  AiToolChipsLabels,
  AiToolChipsProps,
} from "./types";

const DEFAULT_LABELS: AiToolChipsLabels = {
  toolCalls: "tool calls",
  messages: "messages",
  files: "Files changed",
  expand: "Expand tool chips",
  collapse: "Collapse tool chips",
  tool: "Tool",
  edit: "Edit",
  think: "Thinking",
  shell: "Shell",
  image: "Image",
  idle: "Idle",
  running: "Running",
  success: "Done",
  error: "Failed",
};

const KINDS: readonly AiToolChipKind[] = ["tool", "edit", "think", "shell", "image"];
const STATUSES: readonly AiToolChipStatus[] = ["idle", "running", "success", "error"];

const props = defineProps<AiToolChipsProps>({
  summary: { type: String, default: "" },
  items: { type: Array, default: () => [] },
  files: { type: Array, default: () => [] },
  collapsible: { type: Boolean, default: true },
  defaultExpanded: { type: Boolean, default: false },
  labels: { type: Object, default: () => ({}) },
  ariaLabel: { type: String, default: "" },
});

const emit = defineEmits<AiToolChipsEmits>(["toggle", "item-click"]);
const expanded = useRef(Boolean(props.defaultExpanded));

const label = (key: keyof AiToolChipsLabels): string =>
  props.labels?.[key] || DEFAULT_LABELS[key] || key;
const isExpanded = (): boolean => !props.collapsible || expanded.value;
const items = (): AiToolChipItem[] => props.items;
const files = (): AiToolChipFile[] => props.files;
const hasItems = (): boolean => items().length > 0;
const hasFiles = (): boolean => files().length > 0;
const itemKey = (item: AiToolChipItem, index: number): string | number =>
  item.id ?? `tool-chip-${index}`;
const itemDetail = (item: AiToolChipItem): string => item.detail || "";
const itemMeta = (item: AiToolChipItem): string => item.meta || "";
const resolvedKind = (item: AiToolChipItem): AiToolChipKind =>
  KINDS.includes(item.kind) ? item.kind : "tool";
const resolvedStatus = (item: AiToolChipItem): AiToolChipStatus =>
  item.status && STATUSES.includes(item.status) ? item.status : "idle";
const statusLabel = (item: AiToolChipItem): string => label(resolvedStatus(item));
const fileDelta = (file: AiToolChipFile): string =>
  `${file.additions > 0 ? `+${file.additions}` : ""}${file.deletions > 0 ? ` ${file.deletions}` : ""}`.trim();
const hasFileDelta = (file: AiToolChipFile): boolean => file.additions > 0 || file.deletions > 0;
const hostLabel = (): string => props.ariaLabel || props.summary;
const ariaExpanded = (): string => (isExpanded() ? "true" : "false");
const toggleLabel = (): string => (isExpanded() ? label("collapse") : label("expand"));

const expand = (): void => {
  if (!props.collapsible || expanded.value) return;
  expanded.set(true);
  emit("toggle", true);
};
const collapse = (): void => {
  if (!props.collapsible || !expanded.value) return;
  expanded.set(false);
  emit("toggle", false);
};
const toggle = (): void => {
  if (!props.collapsible) return;
  if (expanded.value) collapse();
  else expand();
};
const onToggle = (): void => toggle();
const onItemClick = (event: Event): void => {
  const index = Number((event.currentTarget as HTMLElement).dataset.index);
  const item = items()[index];
  if (item) emit("item-click", item);
};

useHostFlag("data-expanded", isExpanded);
useHostAttr("aria-label", hostLabel);

defineExpose<AiToolChipsExpose>({ expand, collapse, toggle, isExpanded });

defineStyle(styles);

const AiToolChips = defineHtml(`
  <div class="tool-chips" role="group">
    <button
      class="summary"
      type="button"
      :aria-expanded=${ariaExpanded()}
      :aria-label=${toggleLabel()}
      @click=${onToggle}
    >
      <span class="stack" aria-hidden="true"><i></i><i></i><i></i></span>
      <span class="summary-text">${props.summary}</span>
      <span v-if=${props.collapsible} class="chevron" aria-hidden="true"></span>
    </button>
    <div v-if=${isExpanded()} class="panel">
      <div v-if=${hasItems()} class="items">
        <button
          v-for="(item, index) in items()"
          :key="itemKey(item, index)"
          class="item"
          type="button"
          :data-index="index"
          :data-kind="resolvedKind(item)"
          :data-status="resolvedStatus(item)"
          @click=${onItemClick}
        >
          <span class="item-icon" aria-hidden="true"></span>
          <span class="item-body">
            <span class="item-title">{{ item.title }}</span>
            <span v-if="item.detail" class="item-detail">{{ item.detail }}</span>
          </span>
          <span class="item-meta">{{ item.meta || statusLabel(item) }}</span>
        </button>
      </div>
      <div v-if=${hasFiles()} class="files">
        <span class="files-label">${label("files")}</span>
        <span v-for="(file, index) in files()" :key="file.name + index" class="file">
          <span class="file-name">{{ file.name }}</span>
          <span v-if="hasFileDelta(file)" class="file-delta">{{ fileDelta(file) }}</span>
        </span>
      </div>
      <div class="footer"><slot name="footer"></slot></div>
    </div>
  </div>
`);

export { AiToolChips };
