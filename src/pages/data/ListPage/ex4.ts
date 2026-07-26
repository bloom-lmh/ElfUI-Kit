import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

type ListMode = "standard" | "virtual";

interface LogItem {
  id: number;
  service: string;
  duration: number;
}

const t = createDocsTranslator({
  title: { zh: "普通列表与虚拟化边界", en: "Standard and virtual list boundary" },
  standard: { zh: "普通列表", en: "Standard" },
  virtual: { zh: "虚拟列表", en: "Virtual" },
  standardHint: { zh: "12 条 · 内容完整渲染", en: "12 rows · fully rendered" },
  virtualHint: { zh: "1,000 条 · 仅渲染可视窗口", en: "1,000 rows · visible window only" },
  service: { zh: "服务调用", en: "Service call" },
  ms: { zh: "毫秒", en: "ms" }
});

const createRows = (count: number): LogItem[] =>
  Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    service: ["Gateway", "Search", "Billing", "Worker"][index % 4]!,
    duration: 18 + (index * 17) % 180
  }));

const standardRows = createRows(12);
const virtualRows = createRows(1_000);

// State
const mode = useRef<ListMode>("standard");

// Derived state
const activeRows = (): LogItem[] => mode.value === "standard" ? standardRows : virtualRows;
const modeHint = (): string => t(mode.value === "standard" ? "standardHint" : "virtualHint");

// Methods
const selectMode = (event: Event): void => {
  const button = event.composedPath().find((entry): entry is HTMLElement =>
    entry instanceof HTMLElement && Boolean(entry.dataset.listMode)
  );
  const nextMode = button?.dataset.listMode as ListMode | undefined;
  if (nextMode) mode.set(nextMode);
};
const renderRow = (item: unknown): Node => {
  const row = item as LogItem;
  const element = document.createElement("div");
  element.style.cssText = "display:grid;grid-template-columns:64px minmax(0,1fr) auto;align-items:center;gap:14px;width:100%;min-width:0";
  const index = document.createElement("span");
  index.style.cssText = "font-variant-numeric:tabular-nums;color:var(--elf-primary)";
  index.textContent = `#${String(row.id).padStart(4, "0")}`;
  const title = document.createElement("strong");
  title.style.cssText = "overflow:hidden;text-overflow:ellipsis;white-space:nowrap";
  title.textContent = `${row.service} · ${t("service")}`;
  const duration = document.createElement("small");
  duration.style.color = "var(--elf-text-secondary)";
  duration.textContent = `${row.duration} ${t("ms")}`;
  element.append(index, title, duration);
  return element;
};

const code = `<elf-list
  v-if="mode === 'standard'"
  :items.prop="rows.slice(0, 12)"
  :renderItem.prop="renderRow"
  bordered
/>

<elf-virtual-list
  v-else
  :items.prop="rows"
  :renderItem.prop="renderRow"
  height="320"
  :item-height="56"
  bordered
/>`;

const script = `const rows = createRows(1000);
const mode = useRef("standard");

// List is ideal for short semantic collections.
// VirtualList keeps only the visible window mounted for large data sets.
const visibleRows = () => mode.value === "standard"
  ? rows.slice(0, 12)
  : rows;`;

defineStyle(styles);

const PageListEx4 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <div slot="status" class="list-demo-actions" @click=${selectMode}>
      <span role="status">${modeHint()}</span>
      <button
        type="button"
        data-list-mode="standard"
        :aria-pressed=${String(mode.value === "standard")}
      >
        ${t("standard")}
      </button>
      <button
        type="button"
        data-list-mode="virtual"
        :aria-pressed=${String(mode.value === "virtual")}
      >
        ${t("virtual")}
      </button>
    </div>

    <section class="list-boundary-card">
      <elf-scrollbar v-if=${mode.value === "standard"} height="320px" always>
        <elf-list
          :items.prop=${activeRows()}
          :renderItem.prop=${renderRow}
          bordered
        />
      </elf-scrollbar>
      <elf-virtual-list
        v-else
        :items.prop=${activeRows()}
        :renderItem.prop=${renderRow}
        height="320"
        :itemHeight=${56}
        :overscan=${6}
        bordered
      />
    </section>
  </elf-playground>
`);

export { PageListEx4 };
