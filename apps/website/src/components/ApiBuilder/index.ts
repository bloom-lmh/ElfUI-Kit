// elf-api-builder — 组件 API 表格构建器（文档站内部基建）
//
// 包裹一组带 role 的 <elf-props-table>，勾选行即生成元素标记；
// API 标题右侧提供复制与清空操作。

import { defineExpose, defineHtml, defineProps, defineStyle, provide, useRef } from "@elfui/core";

import styles from "./style.scss?inline";
import { countSelections, generateMarkup } from "./codegen";
import { API_BUILDER_KEY, type ApiBuilderContext } from "./context";
import type {
  ApiBuilderProps,
  ApiBuilderRole,
  ApiBuilderRoleRows,
  ApiBuilderSelection,
  ApiBuilderSlots,
} from "./types";
import { createDocsTranslator } from "../../pages/docsLocale";

const t = createDocsTranslator({
  copy: { zh: "复制", en: "Copy" },
  copied: { zh: "已复制", en: "Copied" },
  selectedCount: { zh: "已选 {count} 项", en: "{count} selected" },
  clear: { zh: "清空", en: "Clear" },
});

const COPY_ICON_SVG = `<svg viewBox="0 0 24 24" aria-hidden="true">
  <defs>
    <linearGradient id="api-ico-copy-front" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#38BDF8" />
      <stop offset="1" stop-color="#2563EB" />
    </linearGradient>
    <linearGradient id="api-ico-copy-back" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#BAE6FD" />
      <stop offset="1" stop-color="#93C5FD" />
    </linearGradient>
  </defs>
  <rect x="9" y="9" width="11" height="11" rx="2.2" fill="url(#api-ico-copy-front)" />
  <rect x="4" y="4" width="11" height="11" rx="2.2" fill="url(#api-ico-copy-back)" opacity="0.65" />
</svg>`;

const CLEAR_ICON_SVG = `<svg viewBox="0 0 24 24" aria-hidden="true">
  <defs>
    <linearGradient id="api-ico-clear" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#FBBF24" />
      <stop offset="1" stop-color="#EF4444" />
    </linearGradient>
  </defs>
  <circle cx="12" cy="12" r="9" fill="url(#api-ico-clear)" />
  <path
    d="M8.2 8.2 L15.8 15.8 M15.8 8.2 L8.2 15.8"
    stroke="#fff"
    stroke-width="2"
    stroke-linecap="round"
  />
</svg>`;

const CHECK_ICON_SVG = `<svg viewBox="0 0 24 24" aria-hidden="true">
  <defs>
    <linearGradient id="api-ico-check" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#34D399" />
      <stop offset="1" stop-color="#059669" />
    </linearGradient>
  </defs>
  <circle cx="12" cy="12" r="9" fill="url(#api-ico-check)" />
  <path
    d="M7.4 12.3 L10.7 15.6 L16.6 8.9"
    stroke="#fff"
    stroke-width="2.2"
    stroke-linecap="round"
    stroke-linejoin="round"
    fill="none"
  />
</svg>`;

const props = defineProps<ApiBuilderProps>({
  component: { type: String, default: "" },
  title: { type: String, default: "API" },
});

const roleRows = useRef<ApiBuilderRoleRows>([]);
const selections = useRef<ApiBuilderSelection>({});
const copied = useRef(false);

let copyTimer: ReturnType<typeof setTimeout> | undefined;

const count = (): number => countSelections(selections.value);
const hasSelection = (): boolean => count() > 0;
const countLabel = (): string => t("selectedCount").replace("{count}", String(count()));

const markup = (): string =>
  generateMarkup({
    component: props.component,
    roleRows: roleRows.value,
    selections: selections.value,
  });

/** Table selection-change：整批设置某 role 的选中行。 */
const setSelected = (role: ApiBuilderRole, names: string[], component = props.component): void => {
  const group: Record<string, { name: string; value: string }> = {};
  for (const name of names) group[name] = { name, value: "" };
  selections.set({
    ...selections.value,
    [role]: {
      ...selections.value[role],
      [component]: group,
    },
  });
};

const isSelected = (role: ApiBuilderRole, name: string, component = props.component): boolean =>
  Boolean(selections.value[role]?.[component]?.[name]);

const clear = (): void => {
  selections.set({});
};

const onCopy = async (): Promise<void> => {
  if (!hasSelection()) return;
  const text = markup();
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }
  copied.set(true);
  if (copyTimer) clearTimeout(copyTimer);
  copyTimer = setTimeout(() => copied.set(false), 1200);
};

const ctx: ApiBuilderContext = {
  get component() {
    return props.component;
  },
  get roleRows() {
    return roleRows.value;
  },
  get selections() {
    return selections.value;
  },
  registerTable(role, rows, component = props.component) {
    const entries = roleRows.value.filter(
      (entry) => entry.role !== role || entry.component !== component,
    );
    roleRows.set([...entries, { role, component, rows }]);
  },
  setSelected,
  isSelected,
  clear,
};

/** 生成的元素标记（供复制与测试读取）。 */
const code = (): string => (hasSelection() ? markup() : "");

defineExpose({ code });

provide(API_BUILDER_KEY, ctx);

defineStyle(styles);

const ApiBuilder = defineHtml<ApiBuilderProps, Record<string, never>, ApiBuilderSlots>(`
  <div class="api-builder">
    <div class="api-builder-head">
      <h2 class="api-builder-title">${props.title}</h2>
      <div class="api-builder-actions">
        <span class="api-builder-count">${countLabel()}</span>
        <button
          type="button"
          class="api-builder-copy-btn"
          :class=${copied.value ? "is-copied" : ""}
          aria-label="Copy"
          @click=${onCopy}
        >
          <span class="api-builder-icon" v-html=${copied.value ? CHECK_ICON_SVG : COPY_ICON_SVG}></span>
        </button>
        <button type="button" class="api-builder-clear-btn" aria-label="Clear" @click=${clear}>
          <span class="api-builder-icon" v-html=${CLEAR_ICON_SVG}></span>
        </button>
      </div>
    </div>
    <div class="api-builder-tables"><slot></slot></div>
  </div>
`);

export { ApiBuilder };
