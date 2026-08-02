import { defineHtml, useComputed, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "键盘排序", en: "Keyboard reordering" },
  hint: {
    zh: "Space 抓取，方向键定位，Enter 投放，Esc 取消",
    en: "Press Space to grab, use arrow keys to move, Enter to drop, and Escape to cancel",
  },
  brief: { zh: "产品简报", en: "Product brief" },
  tokens: { zh: "设计令牌", en: "Design tokens" },
  release: { zh: "发布检查", en: "Release checklist" },
  archive: { zh: "归档", en: "Archive" },
  aria: { zh: "可键盘排序的发布流程", en: "Keyboard-sortable release workflow" },
});

const nodes = useComputed(() => [
  { key: "brief", label: `01 · ${t("brief")}` },
  { key: "tokens", label: `02 · ${t("tokens")}` },
  { key: "release", label: `03 · ${t("release")}` },
  { key: "archive", label: `04 · ${t("archive")}` },
]);
const movement = useRef<{ source: string; target: string; placement: string } | null>(null);
const statusText = (): string => {
  const current = movement.value;
  if (!current) return t("hint");
  return `${current.source} → ${current.target} · ${current.placement}`;
};
const onDrop = (event: CustomEvent): void => {
  const [source, target, placement] = event.detail;
  movement.set({ source: source.label, target: target.label, placement });
};

const code = `<elf-tree draggable :data.prop="nodes" @node-drop="onDrop" />`;
const script = `// Keyboard: Space grabs, ArrowUp/ArrowDown chooses a sibling,
// ArrowRight switches to inner placement, Enter drops, Escape cancels.`;

const PageTreeEx7 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <span slot="status" class="demo-state">${statusText()}</span>
    <elf-card variant="outlined" style="width:min(100%,520px);padding:12px">
      <elf-tree
        draggable
        :data.prop=${nodes}
        :ariaLabel.prop=${t("aria")}
        @node-drop=${onDrop}
      />
    </elf-card>
  </elf-playground>
`);

export { PageTreeEx7 };
