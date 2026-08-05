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

const detailValue = (event: Event): string => String((event as CustomEvent).detail ?? "");
const detailBoolean = (event: Event): boolean => Boolean((event as CustomEvent).detail);
const onProgress = (event: Event): void => progress.set(Number((event as CustomEvent).detail));
const onColor = (event: Event): void => color.set(detailValue(event));
const onType = (event: Event): void => progressType.set(detailValue(event));
const onPosition = (event: Event): void => labelPosition.set(detailValue(event));
const onHideLabel = (event: Event): void => showLabel.set(!detailBoolean(event));
const onHideValue = (event: Event): void => hideValue.set(detailBoolean(event));
const onIndeterminate = (event: Event): void => indeterminate.set(detailBoolean(event));

const typeOptions = (): Array<{ value: string; label: string }> => [
  { value: "line", label: t("line") },
  { value: "circle", label: t("circle") },
  { value: "dashboard", label: t("dashboard") },
];
const colorOptions = (): Array<{ value: string; label: string }> => [
  { value: "primary", label: t("primary") },
  { value: "success", label: t("success") },
  { value: "warning", label: t("warning") },
];

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
  .progress-preview { display: grid; width: 100%; min-width: 0; min-height: 416px; place-items: center; padding: clamp(20px, 5vw, 48px); box-sizing: border-box; overflow: hidden; background: var(--elf-bg-default); }
  .progress-preview elf-progress { width: min(520px, 100%); min-width: 0; }
  .progress-preview elf-progress[data-type="circle"], .progress-preview elf-progress[data-type="dashboard"] { width: auto; }
  .progress-controls { display: grid; align-content: start; gap: 14px; }
  .progress-controls h3 { margin: 0; font-size: 15px; }
  .control { display: grid; gap: 6px; color: var(--elf-text-secondary); font-size: 12px; }
  .control span { display: flex; align-items: center; justify-content: space-between; }
  .control elf-select,
  .control elf-slider { width: 100%; }
  .checks { display: grid; gap: 8px; }
  .positions { display: grid; width: min(760px, 100%); gap: 28px; padding: 28px; border: 1px solid var(--elf-border); border-radius: 8px; background: var(--elf-bg-default); }
  @media (max-width: 700px) { .progress-workbench { --elf-playground-controls-demo-min-height: 280px; } .progress-preview { min-height: 280px; padding: 28px 20px; } }
`);

const PageProgressEx1 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground class="progress-workbench" :title=${t("title")} :code=${code} :script=${script}>
    <div class="progress-preview"><elf-progress :type.prop=${progressType.value} :percentage.prop=${progress.value} :label.prop=${showLabel.value ? t("loading") : ""} :labelPosition.prop=${labelPosition.value} :color.prop=${color.value} :hideValue.prop=${hideValue.value} :indeterminate.prop=${indeterminate.value} size="148" transition-duration="0.45"></elf-progress></div>
    <aside slot="controls" class="progress-controls" :aria-label=${t("controls")}>
      <h3>${t("controls")}</h3>
      <label class="control"><elf-select :label=${t("type")} :options.prop=${typeOptions()} :modelValue.prop=${progressType.value} @update:modelValue=${onType}></elf-select></label>
      <label class="control"><span><b>${t("value")}</b><output>${progress.value}%</output></span><elf-slider min="0" max="100" step="1" :modelValue.prop=${progress.value} @update:modelValue=${onProgress}></elf-slider></label>
      <label class="control"><elf-select :label=${t("color")} :options.prop=${colorOptions()} :modelValue.prop=${color.value} @update:modelValue=${onColor}></elf-select></label>
      <label class="control"><b>${t("labelPosition")}</b><elf-radio-group :modelValue.prop=${labelPosition.value} @update:modelValue=${onPosition}><elf-radio value="top" :label=${t("top")}></elf-radio><elf-radio value="bottom" :label=${t("bottom")}></elf-radio></elf-radio-group></label>
      <div class="checks"><elf-checkbox :modelValue.prop=${!showLabel.value} :label=${t("hideLabel")} @update:modelValue=${onHideLabel}></elf-checkbox><elf-checkbox :modelValue.prop=${hideValue.value} :label=${t("hideValue")} @update:modelValue=${onHideValue}></elf-checkbox><elf-checkbox :modelValue.prop=${indeterminate.value} :label=${t("indeterminate")} @update:modelValue=${onIndeterminate}></elf-checkbox></div>
    </aside>
  </elf-playground>
  <elf-playground :title=${t("positions")} :code=${positionsCode}>
    <div class="positions"><elf-progress :label=${t("downloading")} label-position="top" percentage="65"></elf-progress><elf-progress :label=${t("processing")} label-position="bottom" percentage="42" color="warning"></elf-progress></div>
  </elf-playground>
`);

export { PageProgressEx1 };
