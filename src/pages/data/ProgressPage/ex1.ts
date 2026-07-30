import { defineHtml, defineStyle, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  heading: { zh: "线性进度", en: "Linear progress" },
  title: { zh: "标签、数值与不确定状态", en: "Labels, values, and indeterminate state" },
  loading: { zh: "正在加载工作区", en: "Loading workspace" },
  value: { zh: "进度值", en: "Progress value" },
  color: { zh: "颜色", en: "Color" },
  primary: { zh: "主色", en: "Primary" },
  success: { zh: "成功", en: "Success" },
  warning: { zh: "警告", en: "Warning" },
  labelPosition: { zh: "标签位置", en: "Label position" },
  top: { zh: "顶部", en: "Top" },
  bottom: { zh: "底部", en: "Bottom" },
  hideLabel: { zh: "隐藏标签", en: "Hide label" },
  hideValue: { zh: "隐藏数值", en: "Hide value" },
  indeterminate: { zh: "不确定进度", en: "Indeterminate" },
  toggleTheme: { zh: "切换预览明暗", en: "Toggle preview theme" },
  positions: { zh: "标签位置", en: "Label positions" },
  downloading: { zh: "正在下载资源", en: "Downloading assets" },
  processing: { zh: "正在处理队列", en: "Processing queue" }
});

const progress = useRef(50);
const color = useRef("success");
const labelPosition = useRef("top");
const showLabel = useRef(true);
const hideValue = useRef(false);
const indeterminate = useRef(false);
const dark = useRef(false);

const valueOf = (event: Event): string => (event.target as HTMLInputElement | HTMLSelectElement).value;
const checked = (event: Event): boolean => (event.target as HTMLInputElement).checked;
const onProgress = (event: Event): void => progress.set(Number(valueOf(event)));
const onColor = (event: Event): void => color.set(valueOf(event));
const onPosition = (event: Event): void => labelPosition.set(valueOf(event));
const onShowLabel = (event: Event): void => showLabel.set(!checked(event));
const onHideValue = (event: Event): void => hideValue.set(checked(event));
const onIndeterminate = (event: Event): void => indeterminate.set(checked(event));
const toggleTheme = (): void => dark.set(!dark.value);
const demoTheme = (): string => dark.value ? "dark" : "light";

const code = `<elf-progress
  label="Loading workspace"
  label-position="top"
  color="success"
  :percentage="50"
  :hide-value="false"
  :indeterminate="false"
/>`;
const positionsCode = `<elf-progress label="Downloading assets" label-position="top" percentage="65" />
<elf-progress label="Processing queue" label-position="bottom" percentage="42" color="warning" />`;

defineStyle(`
  .progress-lab { display: grid; width: min(900px, 100%); grid-template-columns: minmax(0, 1fr) 240px; overflow: hidden; border: 1px solid var(--elf-border); border-radius: 8px; background: var(--elf-bg-default); }
  .progress-preview { display: grid; min-height: 330px; place-items: center; padding: 42px; }
  .progress-preview elf-progress { width: min(520px, 100%); }
  .progress-controls { display: grid; align-content: start; gap: 15px; padding: 22px 18px; border-left: 1px solid var(--elf-divider); background: var(--elf-bg-paper); }
  .progress-controls h3 { margin: 0; font-size: 15px; }
  .control { display: grid; gap: 6px; color: var(--elf-text-secondary); font-size: 12px; }
  .control span { display: flex; align-items: center; justify-content: space-between; }
  .control input[type="range"] { width: 100%; accent-color: var(--elf-primary); }
  .control select { width: 100%; min-height: 34px; padding: 5px 8px; border: 1px solid var(--elf-border); border-radius: 4px; background: var(--elf-bg-paper); color: var(--elf-text-primary); font: inherit; }
  .check { display: flex; align-items: center; gap: 9px; color: var(--elf-text-primary); font-size: 13px; cursor: pointer; }
  .check input { width: 17px; height: 17px; margin: 0; accent-color: var(--elf-primary); }
  .positions { display: grid; width: min(760px, 100%); gap: 28px; padding: 28px; border: 1px solid var(--elf-border); border-radius: 8px; background: var(--elf-bg-default); }
  @media (max-width: 700px) {
    .progress-lab { grid-template-columns: 1fr; }
    .progress-controls { grid-template-columns: repeat(2, minmax(0, 1fr)); border-top: 1px solid var(--elf-divider); border-left: 0; }
    .progress-controls h3, .control { grid-column: 1 / -1; }
    .progress-preview { min-height: 230px; padding: 28px 20px; }
  }
  @media (max-width: 440px) { .progress-controls { grid-template-columns: 1fr; } .progress-controls h3, .control { grid-column: auto; } }
`);

const PageProgressEx1 = defineHtml(`
  <h2>${t("heading")}</h2>
  <elf-playground :title=${t("title")} :code=${code}>
    <elf-theme-provider :theme=${demoTheme()}>
      <div class="progress-lab">
        <div class="progress-preview"><elf-progress :percentage.prop=${progress.value} :label.prop=${showLabel.value ? t("loading") : ""} :labelPosition.prop=${labelPosition.value} :color.prop=${color.value} :hideValue.prop=${hideValue.value} :indeterminate.prop=${indeterminate.value} transition-duration="0.45"></elf-progress></div>
        <aside class="progress-controls">
          <h3>${t("title")}</h3>
          <elf-button size="sm" variant="outlined" @click=${toggleTheme}>${t("toggleTheme")}</elf-button>
          <label class="control"><span><b>${t("value")}</b><output>${progress.value}%</output></span><input type="range" min="0" max="100" step="1" :value=${progress.value} @input=${onProgress} /></label>
          <label class="control"><b>${t("color")}</b><select :value=${color.value} @change=${onColor}><option value="primary">${t("primary")}</option><option value="success">${t("success")}</option><option value="warning">${t("warning")}</option></select></label>
          <label class="control"><b>${t("labelPosition")}</b><select :value=${labelPosition.value} @change=${onPosition}><option value="top">${t("top")}</option><option value="bottom">${t("bottom")}</option></select></label>
          <label class="check"><input type="checkbox" :checked=${!showLabel.value} @change=${onShowLabel} />${t("hideLabel")}</label>
          <label class="check"><input type="checkbox" :checked=${hideValue.value} @change=${onHideValue} />${t("hideValue")}</label>
          <label class="check"><input type="checkbox" :checked=${indeterminate.value} @change=${onIndeterminate} />${t("indeterminate")}</label>
        </aside>
      </div>
    </elf-theme-provider>
  </elf-playground>
  <elf-playground :title=${t("positions")} :code=${positionsCode}>
    <div class="positions"><elf-progress :label=${t("downloading")} label-position="top" percentage="65"></elf-progress><elf-progress :label=${t("processing")} label-position="bottom" percentage="42" color="warning"></elf-progress></div>
  </elf-playground>
`);

export { PageProgressEx1 };
