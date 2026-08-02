import { defineHtml, defineStyle, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "标签、数值与不确定状态", en: "Labels, values, and indeterminate state" },
  loading: { zh: "正在加载工作区", en: "Loading workspace" },
  value: { zh: "进度值", en: "Progress value" },
  color: { zh: "颜色", en: "Color" },
  primary: { zh: "主色", en: "Primary" },
  success: { zh: "成功", en: "Success" },
  warning: { zh: "警告", en: "Warning" },
  type: { zh: "进度类型", en: "Progress type" },
  line: { zh: "线性进度", en: "Linear" },
  circle: { zh: "环形进度", en: "Circle" },
  dashboard: { zh: "仪表盘", en: "Dashboard" },
  labelPosition: { zh: "标签位置", en: "Label position" },
  top: { zh: "顶部", en: "Top" },
  bottom: { zh: "底部", en: "Bottom" },
  hideLabel: { zh: "隐藏标签", en: "Hide label" },
  hideValue: { zh: "隐藏数值", en: "Hide value" },
  indeterminate: { zh: "不确定进度", en: "Indeterminate" },
  toggleTheme: { zh: "切换预览明暗", en: "Toggle preview theme" },
  controls: { zh: "配置", en: "Configuration" },
  positions: { zh: "标签位置", en: "Label positions" },
  downloading: { zh: "正在下载资源", en: "Downloading assets" },
  processing: { zh: "正在处理队列", en: "Processing queue" },
});

const progress = useRef(50);
const progressType = useRef("line");
const color = useRef("success");
const labelPosition = useRef("top");
const showLabel = useRef(true);
const hideValue = useRef(false);
const indeterminate = useRef(false);
const dark = useRef(
  typeof document !== "undefined" && document.documentElement.getAttribute("data-theme") === "dark",
);

const valueOf = (event: Event): string =>
  (event.target as HTMLInputElement | HTMLSelectElement).value;
const checked = (event: Event): boolean => (event.target as HTMLInputElement).checked;
const onProgress = (event: Event): void => progress.set(Number(valueOf(event)));
const onColor = (event: Event): void => color.set(valueOf(event));
const onType = (event: Event): void => progressType.set(valueOf(event));
const onPosition = (event: Event): void => labelPosition.set(valueOf(event));
const onShowLabel = (event: Event): void => showLabel.set(!checked(event));
const onHideValue = (event: Event): void => hideValue.set(checked(event));
const onIndeterminate = (event: Event): void => indeterminate.set(checked(event));
const toggleTheme = (): void => dark.set(!dark.value);
const demoTheme = (): string => (dark.value ? "dark" : "light");

const code = `<elf-progress
  type="line"
  label="Loading workspace"
  label-position="top"
  color="success"
  :percentage="50"
  :hide-value="false"
  :indeterminate="false"
/>`;
const script = `const progress = 50;
const color = "success";
const labelPosition = "top";
const indeterminate = false;`;
const positionsCode = `<elf-progress label="Downloading assets" label-position="top" percentage="65" />
<elf-progress label="Processing queue" label-position="bottom" percentage="42" color="warning" />`;

defineStyle(`
  .progress-workbench { --elf-playground-demo-padding: 0; --elf-playground-controls-demo-min-height: 416px; }
  .progress-preview { display: grid; width: 100%; min-height: 416px; place-items: center; padding: 48px; background: var(--elf-bg-default); }
  .progress-preview elf-progress { width: min(520px, 100%); }
  .progress-preview elf-progress[data-type="circle"], .progress-preview elf-progress[data-type="dashboard"] { width: auto; }
  .progress-theme { display: block; width: 100%; height: 100%; }
  .progress-theme[data-theme="dark"] .progress-preview { --elf-bg-default: #121212; --elf-bg-paper: #1e1e1e; --elf-bg-overlay: #2a2a2a; --elf-border: #3a3a3a; --elf-text-primary: rgba(255, 255, 255, .9); --elf-text-secondary: rgba(255, 255, 255, .68); background: #121212; }
  .progress-controls { display: grid; align-content: start; gap: 15px; }
  .progress-controls h3 { margin: 0; font-size: 15px; }
  .control { display: grid; gap: 6px; color: var(--elf-text-secondary); font-size: 12px; }
  .control span { display: flex; align-items: center; justify-content: space-between; }
  .control input[type="range"] { width: 100%; accent-color: var(--elf-primary); }
  .control select { width: 100%; min-height: 34px; padding: 5px 8px; border: 1px solid var(--elf-border); border-radius: 4px; background: var(--elf-bg-paper); color: var(--elf-text-primary); font: inherit; }
  .check { display: flex; align-items: center; gap: 9px; color: var(--elf-text-primary); font-size: 13px; cursor: pointer; }
  .check input { width: 17px; height: 17px; margin: 0; accent-color: var(--elf-primary); }
  .positions { display: grid; width: min(760px, 100%); gap: 28px; padding: 28px; border: 1px solid var(--elf-border); border-radius: 8px; background: var(--elf-bg-default); }
  @media (max-width: 700px) { .progress-workbench { --elf-playground-controls-demo-min-height: 280px; } .progress-preview { min-height: 280px; padding: 28px 20px; } }
`);

const PageProgressEx1 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground class="progress-workbench" :title=${t("title")} :code=${code} :script=${script}>
    <elf-theme-provider class="progress-theme" :theme.prop=${demoTheme()}>
      <div class="progress-preview"><elf-progress :type.prop=${progressType.value} :percentage.prop=${progress.value} :label.prop=${showLabel.value ? t("loading") : ""} :labelPosition.prop=${labelPosition.value} :color.prop=${color.value} :hideValue.prop=${hideValue.value} :indeterminate.prop=${indeterminate.value} size="148" transition-duration="0.45"></elf-progress></div>
    </elf-theme-provider>
    <aside slot="controls" class="progress-controls" :aria-label=${t("controls")}>
      <h3>${t("controls")}</h3>
      <elf-button size="sm" variant="outlined" @click=${toggleTheme}>${t("toggleTheme")}</elf-button>
      <label class="control"><b>${t("type")}</b><select :value=${progressType.value} @change=${onType}><option value="line">${t("line")}</option><option value="circle">${t("circle")}</option><option value="dashboard">${t("dashboard")}</option></select></label>
      <label class="control"><span><b>${t("value")}</b><output>${progress.value}%</output></span><input type="range" min="0" max="100" step="1" :value=${progress.value} @input=${onProgress} /></label>
      <label class="control"><b>${t("color")}</b><select :value=${color.value} @change=${onColor}><option value="primary">${t("primary")}</option><option value="success">${t("success")}</option><option value="warning">${t("warning")}</option></select></label>
      <label class="control"><b>${t("labelPosition")}</b><select :value=${labelPosition.value} @change=${onPosition}><option value="top">${t("top")}</option><option value="bottom">${t("bottom")}</option></select></label>
      <label class="check"><input type="checkbox" :checked=${!showLabel.value} @change=${onShowLabel} />${t("hideLabel")}</label>
      <label class="check"><input type="checkbox" :checked=${hideValue.value} @change=${onHideValue} />${t("hideValue")}</label>
      <label class="check"><input type="checkbox" :checked=${indeterminate.value} @change=${onIndeterminate} />${t("indeterminate")}</label>
    </aside>
  </elf-playground>
  <elf-playground :title=${t("positions")} :code=${positionsCode}>
    <div class="positions"><elf-progress :label=${t("downloading")} label-position="top" percentage="65"></elf-progress><elf-progress :label=${t("processing")} label-position="bottom" percentage="42" color="warning"></elf-progress></div>
  </elf-playground>
`);

export { PageProgressEx1 };
