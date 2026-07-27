import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  section: { zh: "基础定位", en: "Basic positioning" },
  title: { zh: "滚动监听与点击定位", en: "Scroll spy and click navigation" },
  intro: { zh: "概览", en: "Overview" },
  usage: { zh: "使用", en: "Usage" },
  api: { zh: "API", en: "API" },
  introBody: { zh: "Anchor 监听容器滚动并同步当前章节。", en: "Anchor observes the container and follows its current section." },
  usageBody: { zh: "点击目录项会平滑定位到对应内容。", en: "Click a directory item to smoothly reveal its content." },
  apiBody: { zh: "使用 offset 与 bounds 适配吸顶标题。", en: "Use offset and bounds to account for sticky headers." },
  controls: { zh: "定位参数", en: "Positioning" },
  offset: { zh: "顶部偏移", en: "Top offset" },
  bounds: { zh: "激活边界", en: "Activation bounds" },
  smooth: { zh: "平滑滚动", en: "Smooth scrolling" },
  enabled: { zh: "启用", en: "Enabled" },
  active: { zh: "当前", en: "Active" }
});

const active = useRef("#anchor-basic-intro");
const offset = useRef(8);
const bounds = useRef(20);
const smooth = useRef<string[]>(["smooth"]);
const items = () => [
  { title: t("intro"), href: "#anchor-basic-intro" },
  { title: t("usage"), href: "#anchor-basic-usage" },
  { title: t("api"), href: "#anchor-basic-api" }
];
const onChange = (event: CustomEvent<{ href: string }>): void => active.set(event.detail.href);
const onOffset = (event: CustomEvent<number>): void => offset.set(Number(event.detail) || 0);
const onBounds = (event: CustomEvent<number>): void => bounds.set(Number(event.detail) || 0);
const onSmooth = (event: CustomEvent<string[]>): void => smooth.set(event.detail || []);

const code = `<elf-anchor
  :items.prop="items"
  container="#anchor-basic-scroll"
  :offset="offset"
  :bounds="bounds"
  :smooth.prop="smooth.includes('smooth')"
  @change="onChange"
/>`;
const script = `const active = useRef("#anchor-basic-intro");
const offset = useRef(8);
const bounds = useRef(20);
const onChange = (event) => active.set(event.detail.href);

const t = createDocsTranslator({
    section: { zh: "基础定位", en: "Basic positioning" },
    title: { zh: "滚动监听与点击定位", en: "Scroll spy and click navigation" },
    intro: { zh: "概览", en: "Overview" },
    usage: { zh: "使用", en: "Usage" },
    api: { zh: "API", en: "API" },
    introBody: { zh: "Anchor 监听容器滚动并同步当前章节。", en: "Anchor observes the container and follows its current section." },
    usageBody: { zh: "点击目录项会平滑定位到对应内容。", en: "Click a directory item to smoothly reveal its content." },
    apiBody: { zh: "使用 offset 与 bounds 适配吸顶标题。", en: "Use offset and bounds to account for sticky headers." },
    controls: { zh: "定位参数", en: "Positioning" },
    offset: { zh: "顶部偏移", en: "Top offset" },
    bounds: { zh: "激活边界", en: "Activation bounds" },
    smooth: { zh: "平滑滚动", en: "Smooth scrolling" },
    enabled: { zh: "启用", en: "Enabled" },
    active: { zh: "当前", en: "Active" }
});
const smooth = useRef(["smooth"]);
const items = () => [
    { title: t("intro"), href: "#anchor-basic-intro" },
    { title: t("usage"), href: "#anchor-basic-usage" },
    { title: t("api"), href: "#anchor-basic-api" }
];`;

const PageAnchorEx1 = defineHtml(`
  <h2>${t("section")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <span slot="status" class="demo-state">${t("active")}: ${active.value}</span>
    <div slot="controls" style="display:grid;gap:14px">
      <strong style="font-size:var(--elf-font-size-sm)">${t("controls")}</strong>
      <elf-input-number variant="underlined" :label=${t("offset")} :modelValue=${offset.value} :min=${0} control-variant="stacked" @update:modelValue=${onOffset}></elf-input-number>
      <elf-input-number variant="underlined" :label=${t("bounds")} :modelValue=${bounds.value} :min=${0} control-variant="stacked" @update:modelValue=${onBounds}></elf-input-number>
      <elf-checkbox-group :modelValue.prop=${smooth.value} :options.prop=${[{ label: t("smooth"), value: "smooth" }]} @update:modelValue=${onSmooth}></elf-checkbox-group>
    </div>
    <div style="display:grid;grid-template-columns:minmax(150px,210px) minmax(0,1fr);gap:20px;width:100%;max-width:820px">
      <elf-anchor :items.prop=${items()} container="#anchor-basic-scroll" :offset=${offset.value} :bounds=${bounds.value} :smooth.prop=${smooth.value.includes("smooth")} :modelValue.prop=${active.value} @change=${onChange}></elf-anchor>
      <div id="anchor-basic-scroll" style="height:300px;overflow:auto;border:1px solid var(--elf-divider);background:var(--elf-bg-paper)">
        <section id="anchor-basic-intro" style="min-height:230px;padding:28px;background:color-mix(in srgb,var(--elf-primary) 8%,var(--elf-bg-paper))"><h3>${t("intro")}</h3><p>${t("introBody")}</p></section>
        <section id="anchor-basic-usage" style="min-height:230px;padding:28px;background:color-mix(in srgb,var(--elf-success) 8%,var(--elf-bg-paper))"><h3>${t("usage")}</h3><p>${t("usageBody")}</p></section>
        <section id="anchor-basic-api" style="min-height:230px;padding:28px;background:color-mix(in srgb,var(--elf-warning) 9%,var(--elf-bg-paper))"><h3>${t("api")}</h3><p>${t("apiBody")}</p></section>
      </div>
    </div>
  </elf-playground>
`);

export { PageAnchorEx1 };
