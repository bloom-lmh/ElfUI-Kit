import { defineHtml, defineStyle, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const active = useRef("one");
const direction = useRef("horizontal");
const alignment = useRef("start");
const color = useRef("#2563eb");
const background = useRef("var(--elf-bg-paper)");
const slider = useRef("#2563eb");
const sliderVariant = useRef("rounded");
const grow = useRef(true);
const hideSlider = useRef(false);

const t = createDocsTranslator({
  heading: { zh: "标签页操作台", en: "Tabs playground" },
  current: { zh: "当前标签", en: "Active tab" },
  controls: { zh: "标签页配置", en: "Tabs controls" },
  direction: { zh: "方向", en: "Direction" },
  alignment: { zh: "对齐", en: "Alignment" },
  activeColor: { zh: "激活色", en: "Active color" },
  background: { zh: "背景", en: "Background" },
  slider: { zh: "滑块色", en: "Slider color" },
  sliderVariant: { zh: "滑块样式", en: "Slider style" },
  grow: { zh: "铺满宽度", en: "Grow" },
  hideSlider: { zh: "隐藏滑块", en: "Hide slider" },
  horizontal: { zh: "水平", en: "Horizontal" },
  vertical: { zh: "垂直", en: "Vertical" },
  start: { zh: "靠左", en: "Start" },
  center: { zh: "居中", en: "Center" },
  end: { zh: "靠右", en: "End" },
  blue: { zh: "蓝色", en: "Blue" },
  teal: { zh: "青色", en: "Teal" },
  purple: { zh: "紫色", en: "Purple" },
  orange: { zh: "橙色", en: "Orange" },
  surface: { zh: "表面色", en: "Surface" },
  softBlue: { zh: "浅蓝", en: "Soft blue" },
  rounded: { zh: "圆角短条", en: "Rounded bar" },
  flat: { zh: "平直直线", en: "Flat line" },
  one: { zh: "项目一", en: "Item one" },
  two: { zh: "项目二", en: "Item two" },
  three: { zh: "项目三", en: "Item three" },
  oneContent: { zh: "项目一的工作台内容。", en: "Workspace content for item one." },
  twoContent: { zh: "项目二的工作台内容。", en: "Workspace content for item two." },
  threeContent: { zh: "项目三的工作台内容。", en: "Workspace content for item three." },
});

const items = () => [
  { label: t("one"), value: "one", content: t("oneContent") },
  { label: t("two"), value: "two", content: t("twoContent") },
  { label: t("three"), value: "three", content: t("threeContent") },
];
const directionOptions = () => [
  { label: t("horizontal"), value: "horizontal" },
  { label: t("vertical"), value: "vertical" },
];
const alignmentOptions = () => [
  { label: t("start"), value: "start" },
  { label: t("center"), value: "center" },
  { label: t("end"), value: "end" },
];
const colorOptions = () => [
  { label: t("blue"), value: "#2563eb" },
  { label: t("teal"), value: "#0f766e" },
  { label: t("purple"), value: "#7c3aed" },
];
const backgroundOptions = () => [
  { label: t("surface"), value: "var(--elf-bg-paper)" },
  { label: t("softBlue"), value: "color-mix(in srgb, var(--elf-primary) 8%, var(--elf-bg-paper))" },
];
const sliderOptions = () => [
  { label: t("blue"), value: "#2563eb" },
  { label: t("teal"), value: "#0d9488" },
  { label: t("orange"), value: "#ea580c" },
];
const sliderVariantOptions = () => [
  { label: t("rounded"), value: "rounded" },
  { label: t("flat"), value: "flat" },
];

const value = (event: CustomEvent): string => String(event.detail ?? "");
const flag = (event: CustomEvent): boolean => Boolean(event.detail);
const onActive = (event: CustomEvent): void => active.set(value(event));
const onDirection = (event: CustomEvent): void => direction.set(value(event));
const onAlignment = (event: CustomEvent): void => alignment.set(value(event));
const onColor = (event: CustomEvent): void => color.set(value(event));
const onBackground = (event: CustomEvent): void => background.set(value(event));
const onSlider = (event: CustomEvent): void => slider.set(value(event));
const onSliderVariant = (event: CustomEvent): void => sliderVariant.set(value(event));
const onGrow = (event: CustomEvent): void => grow.set(flag(event));
const onHideSlider = (event: CustomEvent): void => hideSlider.set(flag(event));
const statusText = (): string => `${t("current")}: ${active.value}`;

const code = `<elf-tabs
  :items.prop=\${items}
  :modelValue.prop=\${active.value}
  :direction.prop=\${direction.value}
  :alignTabs.prop=\${alignment.value}
  :color.prop=\${color.value}
  :backgroundColor.prop=\${background.value}
  :sliderColor.prop=\${slider.value}
  :sliderVariant.prop=\${sliderVariant.value}
  :grow.prop=\${grow.value}
  :hideSlider.prop=\${hideSlider.value}
  show-panels
/>`;

const script = (): string => `const active = useRef("one");
const direction = useRef("horizontal");
const alignment = useRef("start");
const grow = useRef(true);
const hideSlider = useRef(false);
const color = useRef("#2563eb");
const background = useRef("var(--elf-bg-paper)");
const slider = useRef("#2563eb");
const sliderVariant = useRef("rounded");
const items = [
  { label: "${t("one")}", value: "one", content: "${t("oneContent")}" },
  { label: "${t("two")}", value: "two", content: "${t("twoContent")}" },
  { label: "${t("three")}", value: "three", content: "${t("threeContent")}" }
];
const directionOptions = [
  { label: "${t("horizontal")}", value: "horizontal" },
  { label: "${t("vertical")}", value: "vertical" }
];
const onActive = (event) => active.set(event.detail);`;

defineStyle(styles);

const PageTabsEx8 = defineHtml(`
  <h2>{{ t("heading") }}</h2>
  <elf-playground :title=${t("heading")} :code=${code} :script=${script()}>
    <span slot="status" role="status" aria-live="polite">${statusText()}</span>
    <section class="tabs-demo-stage">
      <div class="tabs-lab-preview">
        <elf-tabs
        :key=${t("heading")}
        :items.prop=${items()}
        :modelValue.prop=${active.value}
        :direction.prop=${direction.value}
        :alignTabs.prop=${alignment.value}
        :color.prop=${color.value}
        :backgroundColor.prop=${background.value}
        :sliderColor.prop=${slider.value}
        :sliderVariant.prop=${sliderVariant.value}
        :grow.prop=${grow.value}
        :hideSlider.prop=${hideSlider.value}
        show-panels
        @update:modelValue=${onActive}
        ></elf-tabs>
      </div>
    </section>
    <aside slot="controls" class="tabs-lab-config" :aria-label=${t("controls")}>
      <strong>{{ t("controls") }}</strong>
      <label><elf-select variant="outlined" :label=${t("direction")} :options.prop=${directionOptions()} :modelValue.prop=${direction.value} @update:modelValue=${onDirection}></elf-select></label>
      <label><elf-select variant="outlined" :label=${t("alignment")} :options.prop=${alignmentOptions()} :modelValue.prop=${alignment.value} @update:modelValue=${onAlignment}></elf-select></label>
      <label><elf-select variant="outlined" :label=${t("activeColor")} :options.prop=${colorOptions()} :modelValue.prop=${color.value} @update:modelValue=${onColor}></elf-select></label>
      <label><elf-select variant="outlined" :label=${t("background")} :options.prop=${backgroundOptions()} :modelValue.prop=${background.value} @update:modelValue=${onBackground}></elf-select></label>
      <label><elf-select variant="outlined" :label=${t("slider")} :options.prop=${sliderOptions()} :modelValue.prop=${slider.value} @update:modelValue=${onSlider}></elf-select></label>
      <label><elf-select variant="outlined" :label=${t("sliderVariant")} :options.prop=${sliderVariantOptions()} :modelValue.prop=${sliderVariant.value} @update:modelValue=${onSliderVariant}></elf-select></label>
      <elf-checkbox :modelValue.prop=${grow.value} :label=${t("grow")} @update:modelValue=${onGrow}></elf-checkbox>
      <elf-checkbox :modelValue.prop=${hideSlider.value} :label=${t("hideSlider")} @update:modelValue=${onHideSlider}></elf-checkbox>
    </aside>
  </elf-playground>
`);

export { PageTabsEx8 };
