import { defineHtml, defineStyle } from "@elfui/core";
import { mdiCheckCircleOutline, mdiCogOutline, mdiRefresh, mdiSync } from "@mdi/js";

import { createSvgIconSet } from "../../../components/Basic/Icon";
import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "按钮名称与加载状态", en: "Button naming and loading state" },
  status: {
    zh: "交互名称属于按钮；装饰图标保持 aria-hidden",
    en: "The interactive name belongs to the button; decorative icons stay aria-hidden",
  },
  refresh: { zh: "刷新数据", en: "Refresh data" },
  settings: { zh: "打开设置", en: "Open settings" },
  syncing: { zh: "正在同步", en: "Syncing" },
  semantic: {
    zh: "独立图标自身承载语义时使用 aria-label",
    en: "Use aria-label when a standalone icon carries meaning",
  },
  keyboard: {
    zh: "按钮可通过 Tab 聚焦并使用 Enter 或 Space",
    en: "Use Tab to focus the button, then Enter or Space to activate it",
  },
});

const iconOptions = {
  defaultSet: "mdi",
  sets: {
    mdi: createSvgIconSet({
      refresh: mdiRefresh,
      settings: mdiCogOutline,
      available: mdiCheckCircleOutline,
      sync: mdiSync,
    }),
  },
};

const accessibilityCode = `<elf-button circle aria-label="Refresh data">
  <elf-icon name="refresh"></elf-icon>
</elf-button>

<elf-icon name="available" color="var(--elf-success)" aria-label="Service available"></elf-icon>
<elf-icon loading name="sync" aria-label="Syncing"></elf-icon>`;

const accessibilityScript = `// 按钮内图标只是装饰，因此不设置 aria-label。
// Icon 默认 aria-hidden="true"，按钮通过 aria-label 获得完整名称。
// prefers-reduced-motion: reduce 时 loading 动画会自动停用。`;

defineStyle(styles);

const PageIconEx3 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${accessibilityCode} :script=${accessibilityScript}>
    <span slot="status" class="icon-demo-status">${t("status")}</span>
    <elf-icon-provider :options.prop=${iconOptions}><div class="icon-accessibility-panel">
      <div class="icon-demo-row">
        <elf-button circle :aria-label=${t("refresh")}><elf-icon name="refresh"></elf-icon></elf-button>
        <elf-button shape="square" variant="outlined" :aria-label=${t("settings")}>
          <elf-icon name="settings"></elf-icon>
        </elf-button>
        <elf-icon loading name="sync" size="28" color="var(--elf-primary)" :aria-label=${t("syncing")}></elf-icon>
      </div>
      <div>
        <strong>${t("semantic")}</strong>
        <p>${t("keyboard")}</p>
      </div>
    </div></elf-icon-provider>
  </elf-playground>
`);

export { PageIconEx3 };
