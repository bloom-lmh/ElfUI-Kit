import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const count = useRef(0);
const direction = useRef<"ltr" | "rtl">("ltr");

const t = createDocsTranslator({
  dynamicTitle: { zh: "动态值、零值与 RTL", en: "Dynamic value, zero, and RTL" },
  count: { zh: "当前数量", en: "Current count" },
  increase: { zh: "增加", en: "Increase" },
  decrease: { zh: "减少", en: "Decrease" },
  toggle: { zh: "切换方向", en: "Toggle direction" },
  notifications: { zh: "通知中心", en: "Notifications" },
  urgent: { zh: "需要人工复核的高优先级通知", en: "High-priority notifications requiring manual review" },
  longHint: { zh: "长文本视觉省略，状态名称保持完整", en: "Long text is visually truncated while its status name remains complete" },
  customTitle: { zh: "偏移、样式与内容插槽", en: "Offset, style, and content slot" },
  customStatus: { zh: "高级外观能力集中展示", en: "Advanced appearance options in one comparison" }
});

const increase = (): void => count.set(count.value + 1);
const decrease = (): void => count.set(Math.max(0, count.value - 1));
const toggleDirection = (): void => direction.set(direction.value === "ltr" ? "rtl" : "ltr");
const statusText = (): string => `${t("count")}：${count.value} · ${direction.value.toUpperCase()}`;

const dynamicCode = `<div :dir=\${direction.value}>
  <elf-badge :value.prop=\${count.value}>
    <elf-button>Notifications</elf-button>
  </elf-badge>
  <elf-badge value="High-priority notifications requiring manual review">
    <span>Long status</span>
  </elf-badge>
</div>`;

const dynamicScript = `const count = useRef(0);
const direction = useRef("ltr");

const increase = () => count.set(count.value + 1);
const decrease = () => count.set(Math.max(0, count.value - 1));
const toggleDirection = () => {
  direction.set(direction.value === "ltr" ? "rtl" : "ltr");
};`;

const customCode = `<elf-badge content="NEW" offset="8,4">
  <elf-button>Offset</elf-button>
</elf-badge>
<elf-badge value="1" :badgeStyle.prop=\${{ borderRadius: "4px", minWidth: "28px" }}>
  <elf-button>Style</elf-button>
</elf-badge>
<elf-badge value="1">
  <strong slot="content">VIP</strong>
  <elf-button>Slot</elf-button>
</elf-badge>`;

defineStyle(styles);

const PageBadgeEx2 = defineHtml(`
  <elf-playground :title=${t("dynamicTitle")} :code=${dynamicCode} :script=${dynamicScript}>
    <span slot="status" class="badge-demo-actions">
      <span>${statusText()}</span>
      <elf-button size="sm" variant="outlined" @click=${decrease}>−</elf-button>
      <elf-button size="sm" variant="outlined" @click=${increase}>+</elf-button>
      <elf-button size="sm" variant="text" @click=${toggleDirection}>${t("toggle")}</elf-button>
    </span>
    <div class="badge-dynamic-panel" :dir=${direction.value}>
      <elf-badge :value.prop=${count.value}>
        <elf-button>${t("notifications")}</elf-button>
      </elf-badge>
      <div class="badge-long-state">
        <elf-badge :value.prop=${t("urgent")} type="warning">
          <span>${t("longHint")}</span>
        </elf-badge>
      </div>
    </div>
  </elf-playground>

  <elf-playground :title=${t("customTitle")} :code=${customCode} :script=${dynamicScript}>
    <span slot="status" class="badge-demo-status">${t("customStatus")}</span>
    <div class="badge-custom-row">
      <elf-badge content="NEW" offset="8,4"><elf-button>Offset</elf-button></elf-badge>
      <elf-badge value="1" :badgeStyle.prop=${{ borderRadius: "4px", minWidth: "28px" }}>
        <elf-button>Style</elf-button>
      </elf-badge>
      <elf-badge value="1">
        <strong slot="content">VIP</strong>
        <elf-button>Slot</elf-button>
      </elf-badge>
    </div>
  </elf-playground>
`);

export { PageBadgeEx2 };
