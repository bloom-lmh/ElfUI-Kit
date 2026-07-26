import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "垂直分组与 RTL", en: "Vertical grouping and RTL" },
  ltr: { zh: "从左到右", en: "Left to right" },
  rtl: { zh: "从右到左", en: "Right to left" },
  switchRtl: { zh: "切换 RTL", en: "Switch to RTL" },
  switchLtr: { zh: "切换 LTR", en: "Switch to LTR" },
  overview: { zh: "概览", en: "Overview" },
  activity: { zh: "动态", en: "Activity" },
  settings: { zh: "设置", en: "Settings" },
  logicalStart: { zh: "逻辑起始区域", en: "Logical start region" },
  logicalEnd: { zh: "逻辑结束区域", en: "Logical end region" },
  hint: {
    zh: "垂直线使用逻辑边框；容器进入 RTL 后，横向内容位置和行内间距随书写方向自然镜像。",
    en: "Vertical rules use logical borders; horizontal content placement and inline spacing mirror naturally when the container enters RTL."
  }
});

// State
const rtl = useRef(false);

// Derived state
const direction = (): "ltr" | "rtl" => (rtl.value ? "rtl" : "ltr");
const statusText = (): string => (rtl.value ? t("rtl") : t("ltr"));

// Methods
const toggleDirection = (): void => rtl.set(!rtl.value);

const rtlCode = `<nav dir=\${rtl ? "rtl" : "ltr"} aria-label="Workspace">
  <a href="#overview">Overview</a>
  <elf-divider direction="vertical" />
  <a href="#activity">Activity</a>
  <elf-divider direction="vertical" />
  <a href="#settings">Settings</a>
</nav>

<elf-divider content-position="left">Logical start region</elf-divider>
<elf-divider content-position="right">Logical end region</elf-divider>`;

const rtlScript = `const rtl = useRef(false);
const toggleDirection = () => rtl.set(!rtl.value);

// Divider uses border-block-start and border-inline-start.
// It therefore follows the nearest dir="ltr | rtl" context without extra CSS.`;

defineStyle(styles);

const PageDividerEx2 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${rtlCode} :script=${rtlScript}>
    <div slot="status" class="divider-demo-actions">
      <span role="status" aria-live="polite">${statusText()}</span>
      <button type="button" @click=${toggleDirection}>
        ${rtl.value ? t("switchLtr") : t("switchRtl")}
      </button>
    </div>

    <div class="divider-rtl-stage" :dir=${direction()}>
      <nav class="divider-toolbar" aria-label="Workspace sections">
        <a href="#/data/divider">${t("overview")}</a>
        <elf-divider direction="vertical" />
        <a href="#/data/divider">${t("activity")}</a>
        <elf-divider direction="vertical" />
        <a href="#/data/divider">${t("settings")}</a>
      </nav>

      <div class="divider-position-preview">
        <elf-divider content-position="left">${t("logicalStart")}</elf-divider>
        <elf-divider content-position="right">${t("logicalEnd")}</elf-divider>
      </div>
      <p>${t("hint")}</p>
    </div>
  </elf-playground>
`);

export { PageDividerEx2 };
