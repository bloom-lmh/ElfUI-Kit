import { defineHtml, defineStyle, useRef, useTemplateRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  nested: { zh: "嵌套与受控模式", en: "Nested and controlled" },
  nestedTitle: { zh: "嵌套项 / 受控激活 / 禁用链接", en: "Nested items / controlled active / disabled link" },
  horizontalTitle: { zh: "水平滚动 / 下划线 / 无侧边标记", en: "Horizontal scrolling / underline / no side marker" },
  current: { zh: "当前", en: "Active" },
  start: { zh: "开始使用", en: "Getting started" }, install: { zh: "安装", en: "Install" },
  register: { zh: "注册", en: "Register" }, advanced: { zh: "进阶", en: "Advanced" },
  disabled: { zh: "禁用目标", en: "Disabled target" }, events: { zh: "事件", en: "Events" },
  overview: { zh: "概览", en: "Overview" }, installation: { zh: "安装", en: "Installation" },
  registration: { zh: "注册", en: "Registration" }, tokens: { zh: "设计令牌", en: "Design tokens" },
  accessibility: { zh: "无障碍", en: "Accessibility" }, keyboard: { zh: "键盘导航", en: "Keyboard navigation" },
  release: { zh: "发布说明", en: "Release notes" },
  startBody: { zh: "组件接收树形数据，并将其展平为清晰的导航轨道。", en: "The component accepts tree data and flattens it into a clear navigation rail." },
  installBody: { zh: "此示例通过 modelValue 受控管理激活项。", en: "The active item is controlled by modelValue in this example." },
  registerBody: { zh: "父级需要管理当前链接时，请监听 update:modelValue。", en: "Listen for update:modelValue when the parent owns the active href." },
  advancedBody: { zh: "偏移量与边界参数便于适配吸顶布局。", en: "Offsets and bounds make sticky-header layouts easier to tune." },
  disabledBody: { zh: "此章节存在，但对应导航项不可点击。", en: "This section exists, but its navigation item is disabled." },
  eventsBody: { zh: "change 返回新旧链接，click 返回当前项与链接。", en: "change emits the new and old href; click emits the item and href." },
  sectionBody: { zh: "滚动内容区时，锚点会同步当前文档章节。", en: "The anchor follows the active document section while the content area scrolls." }
});

const active = useRef("#anchor-nested-install");
const horizontalActive = useRef("#anchor-horizontal-overview");
const horizontalScrollProgress = useRef(0);
const horizontalScroll = useTemplateRef<HTMLElement>("horizontalScroll");
const items = () => [
  { title: t("start"), href: "#anchor-nested-start", children: [
    { title: t("install"), href: "#anchor-nested-install" },
    { title: t("register"), href: "#anchor-nested-register" }
  ] },
  { title: t("advanced"), href: "#anchor-nested-advanced", children: [
    { title: t("disabled"), href: "#anchor-nested-disabled", disabled: true },
    { title: t("events"), href: "#anchor-nested-events" }
  ] }
];
const horizontalItems = () => [
  { title: t("overview"), href: "#anchor-horizontal-overview" },
  { title: t("installation"), href: "#anchor-horizontal-installation" },
  { title: t("registration"), href: "#anchor-horizontal-registration" },
  { title: t("tokens"), href: "#anchor-horizontal-tokens" },
  { title: t("accessibility"), href: "#anchor-horizontal-accessibility" },
  { title: t("keyboard"), href: "#anchor-horizontal-keyboard" },
  { title: t("release"), href: "#anchor-horizontal-release" }
];
const horizontalSections = () => horizontalItems().map((item, index) => ({
  ...item,
  id: item.href.slice(1),
  body: `${index + 1}. ${t("sectionBody")}`,
  tone: `tone-${(index % 4) + 1}`
}));
const onUpdate = (event: CustomEvent<string>): void => active.set(event.detail);
const onHorizontalUpdate = (event: CustomEvent<string>): void => horizontalActive.set(event.detail);
const onHorizontalContentScroll = (event: Event): void => {
  const target = event.currentTarget as HTMLElement;
  const max = Math.max(1, target.scrollWidth - target.clientWidth);
  horizontalScrollProgress.set(Math.min(1, Math.max(0, target.scrollLeft / max)));
};
const horizontalScrollbarValue = (): number => Math.round(horizontalScrollProgress.value * 1000);
const onHorizontalScrollbarInput = (event: Event): void => {
  const target = horizontalScroll.value;
  if (!target) return;
  const progress = Math.min(1, Math.max(0, Number((event.currentTarget as HTMLInputElement).value) / 1000));
  target.scrollLeft = progress * Math.max(0, target.scrollWidth - target.clientWidth);
  horizontalScrollProgress.set(progress);
};

const code = `<elf-anchor :items.prop="items" :modelValue.prop="active" container="#anchor-nested-scroll" :bound="24" @update:modelValue="onUpdate" />`;
const horizontalCode = `<elf-anchor :items.prop="horizontalItems" direction="horizontal" type="underline" :marker="false" container="#anchor-horizontal-scroll" :modelValue.prop="horizontalActive" />
<div class="horizontal-scroll-shell">
  <div id="anchor-horizontal-scroll" class="horizontal-scroll" @scroll="onHorizontalContentScroll">
    <section v-for="section in sections" :key="section.id" :id="section.id" class="horizontal-section">
      <h3>{{ section.title }}</h3>
      <p>{{ section.body }}</p>
    </section>
  </div>
  <input class="horizontal-scrollbar" type="range" min="0" max="1000" value="0" aria-label="Horizontal content position" @input="onHorizontalScrollbarInput" />
</div>`;
const script = `const active = useRef("#install");
const items = [
  {
    title: "Getting started",
    href: "#start",
    children: [
      { title: "Install", href: "#install" },
      { title: "Register", href: "#register" }
    ]
  }
];

const onUpdate = (event) => active.set(event.detail);

const horizontalActive = useRef("#overview");
const horizontalItems = [
  { title: "Overview", href: "#overview" },
  { title: "Installation", href: "#installation" },
  { title: "API", href: "#api" }
];
const sections = horizontalItems.map((item, index) => ({
  ...item,
  id: item.href.slice(1),
  body: \`Section \${index + 1}\`
}));

const onHorizontalContentScroll = (event) => {
  const { scrollLeft, scrollWidth, clientWidth } = event.currentTarget;
  const progress = scrollLeft / Math.max(1, scrollWidth - clientWidth);
  // Synchronize a custom scrollbar or other external navigation here.
};

const onHorizontalScrollbarInput = (event) => {
  const progress = Number(event.currentTarget.value) / 1000;
  // Apply progress to the horizontal content container's scrollLeft.
};`;

const PageAnchorEx2 = defineHtml(`
  <h2>${t("nested")}</h2>
  <elf-playground :title=${t("nestedTitle")} :code=${code} :script=${script}>
    <div style="display:grid;grid-template-columns:minmax(180px,240px) minmax(0,1fr);gap:20px;width:100%;max-width:900px">
      <elf-anchor :key=${t("nestedTitle")} :items.prop=${items()} :modelValue.prop=${active.value} container="#anchor-nested-scroll" :bound=${24} @update:modelValue=${onUpdate}></elf-anchor>
      <div id="anchor-nested-scroll" style="height:300px;overflow:auto;border:1px solid var(--elf-border);border-radius:8px;background:var(--elf-bg-paper)">
        <section id="anchor-nested-start" style="min-height:180px;padding:20px"><h3>${t("start")}</h3><p>${t("startBody")}</p></section>
        <section id="anchor-nested-install" style="min-height:180px;padding:20px;border-top:1px solid var(--elf-border)"><h3>${t("install")}</h3><p>${t("installBody")}</p></section>
        <section id="anchor-nested-register" style="min-height:180px;padding:20px;border-top:1px solid var(--elf-border)"><h3>${t("register")}</h3><p>${t("registerBody")}</p></section>
        <section id="anchor-nested-advanced" style="min-height:180px;padding:20px;border-top:1px solid var(--elf-border)"><h3>${t("advanced")}</h3><p>${t("advancedBody")}</p></section>
        <section id="anchor-nested-disabled" style="min-height:180px;padding:20px;border-top:1px solid var(--elf-border)"><h3>${t("disabled")}</h3><p>${t("disabledBody")}</p></section>
        <section id="anchor-nested-events" style="min-height:180px;padding:20px;border-top:1px solid var(--elf-border)"><h3>${t("events")}</h3><p>${t("eventsBody")}</p></section>
      </div>
    </div>
  </elf-playground>

  <elf-playground :title=${t("horizontalTitle")} :code=${horizontalCode} :script=${script}>
    <div style="width:100%;max-width:960px;min-width:0">
      <elf-anchor style="width:min(480px,100%)" :key=${t("horizontalTitle")} :items.prop=${horizontalItems()} direction="horizontal" type="underline" :marker=${false} :smooth=${false} container="#anchor-horizontal-scroll" :bound=${24} :modelValue.prop=${horizontalActive.value} @update:modelValue=${onHorizontalUpdate}></elf-anchor>
      <div class="horizontal-scroll-shell">
        <div ref="horizontalScroll" id="anchor-horizontal-scroll" class="horizontal-scroll" @scroll=${onHorizontalContentScroll}>
          <section v-for="section in horizontalSections()" :key="section.id" :id="section.id" :class="['horizontal-section', section.tone]">
            <span class="section-index">{{ section.body.slice(0, 2) }}</span>
            <h3>{{ section.title }}</h3>
            <p>{{ section.body.slice(3) }}</p>
          </section>
        </div>
        <input
          class="horizontal-scrollbar"
          type="range"
          min="0"
          max="1000"
          :value=${horizontalScrollbarValue()}
          aria-label="水平内容位置"
          @input=${onHorizontalScrollbarInput}
        />
      </div>
      <span slot="status" class="demo-state">${t("current")}: {{ horizontalActive }}</span>
    </div>
  </elf-playground>
`);

defineStyle(styles);

export { PageAnchorEx2 };
