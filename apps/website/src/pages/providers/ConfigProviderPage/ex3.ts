import { defineHtml, defineStyle, useComponents, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import { PageConfigProviderMotionPreview } from "./motionPreview";
import { PageConfigProviderPreview } from "./preview";
import styles from "./ex3.scss?inline";

defineStyle(styles);

const t = createDocsTranslator({
  title: { zh: "显示与动效偏好", en: "Display and motion preferences" },
  displayTitle: {
    zh: "显示偏好 · 移动端阈值",
    en: "Display · mobile threshold",
  },
  displayDesc: {
    zh: "调整 mobileBreakpoint，布局在相同窗口宽度下切换双栏与单栏。",
    en: "Change mobileBreakpoint to switch the layout between two columns and stacked at the same window width.",
  },
  motionTitle: { zh: "动效偏好", en: "Motion preference" },
  motionDesc: {
    zh: "motion 偏好通过主题过渡 token 全局生效。",
    en: "The motion preference applies globally through theme transition tokens.",
  },
  full: { zh: "完整动效", en: "Full motion" },
  reduced: { zh: "减少动效", en: "Reduced motion" },
  thresholdLabel: { zh: "移动端阈值", en: "Mobile threshold" },
  codeComment: {
    zh: "三个独立 ConfigProvider 分别配置 display 与 motion。",
    en: "Three ConfigProviders configure display and motion independently.",
  },
});

useComponents({
  "page-config-provider-preview": PageConfigProviderPreview,
  "page-config-provider-motion-preview": PageConfigProviderMotionPreview,
});

const mobileBreakpoint = useRef("sm");

const breakpointOptions = (): Array<{ value: string; label: string }> => [
  { value: "sm", label: "sm" },
  { value: "md", label: "md" },
  { value: "lg", label: "lg" },
  { value: "xl", label: "xl" },
];

const onBreakpointUpdate = (event: CustomEvent<string>): void => {
  mobileBreakpoint.set(String(event.detail));
};

const displayConfig = (): Record<string, unknown> => ({
  display: { mobileBreakpoint: mobileBreakpoint.value },
});
const motionFull = { motion: "full" };
const motionReduced = { motion: "reduced" };

const code = `<elf-config-provider :config.prop="displayConfig">
  <page-config-provider-preview />
</elf-config-provider>

<elf-config-provider :config.prop="motionFull">
  <page-config-provider-motion-preview />
</elf-config-provider>

<elf-config-provider :config.prop="motionReduced">
  <page-config-provider-motion-preview />
</elf-config-provider>`;

const script = `const displayConfig = {
  display: { mobileBreakpoint: "sm" }
};
const motionFull = { motion: "full" };
const motionReduced = { motion: "reduced" };

// ${t("codeComment")}
// Read the active state inside a descendant component:
const config = useConfigProvider();
config.display.mobile;   // mobile layout
config.reducedMotion;    // reduced motion`;

const PageConfigProviderEx3 = defineHtml(`
  <elf-playground
    :title=${t("title")}
    :code=${code}
    :script=${script}
  >
    <div class="display-motion-demo">
      <section class="demo-section">
        <header class="demo-section-header">
          <div>
            <strong>${t("displayTitle")}</strong>
            <small>${t("displayDesc")}</small>
          </div>
          <elf-select
            :label=${t("thresholdLabel")}
            :options.prop=${breakpointOptions()}
            :modelValue.prop=${mobileBreakpoint.value}
            @update:modelValue=${onBreakpointUpdate}
          ></elf-select>
        </header>
        <elf-config-provider :config.prop=${displayConfig()}>
          <page-config-provider-preview />
        </elf-config-provider>
      </section>

      <section class="demo-section">
        <header class="demo-section-header">
          <div>
            <strong>${t("motionTitle")}</strong>
            <small>${t("motionDesc")}</small>
          </div>
        </header>
        <div class="motion-demo-grid">
          <div class="motion-demo-card">
            <strong>${t("full")}</strong>
            <elf-config-provider :config.prop=${motionFull}>
              <page-config-provider-motion-preview />
            </elf-config-provider>
          </div>
          <div class="motion-demo-card">
            <strong>${t("reduced")}</strong>
            <elf-config-provider :config.prop=${motionReduced}>
              <page-config-provider-motion-preview />
            </elf-config-provider>
          </div>
        </div>
      </section>
    </div>
  </elf-playground>
`);

export { PageConfigProviderEx3 };
