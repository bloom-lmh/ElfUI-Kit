import { defineDirective, defineHtml, defineStyle, useRef } from "@elfui/core";

import { clickOutsideDirective } from "@elfui/kit";
import { createDocsTranslator } from "../../docsLocale";
import articleStyles from "../../shared/article.scss?inline";

const t = createDocsTranslator({
  kicker: { zh: "指令", en: "Directive" },
  title: { zh: "外部点击", en: "Click outside" },
  description: {
    zh: "当指针事件发生在目标和排除元素之外时执行回调，适合菜单、建议面板和轻量浮层。",
    en: "Run a callback when a pointer event occurs outside the target and excluded elements, ideal for menus, suggestion panels, and lightweight overlays.",
  },
  demoTitle: { zh: "目标、触发器与外部区域", en: "Target, activator, and outside area" },
  inside: { zh: "目标区域：不执行回调", en: "Target area: no callback" },
  excluded: { zh: "触发按钮（已排除）", en: "Activator (excluded)" },
  outside: { zh: "外部区域：执行回调", en: "Outside area: runs callback" },
  count: { zh: "外部触发", en: "Outside triggers" },
  excludeNoteTitle: { zh: "为什么排除触发按钮？", en: "Why exclude the activator?" },
  excludeNoteBody: {
    zh: "触发按钮通常位于菜单或浮层目标之外。把它加入 exclude 后，点击按钮只负责开关浮层，不会同时被当作一次外部点击。",
    en: "An activator usually sits outside its menu or overlay target. Adding it to exclude lets the button toggle the overlay without also counting as an outside click.",
  },
  options: { zh: "配置", en: "Options" },
  handlerDescription: { zh: "外部事件回调。", en: "Callback for outside events." },
  disabledDescription: {
    zh: "暂停触发而不卸载指令。",
    en: "Pauses handling without unmounting the directive.",
  },
  eventDescription: { zh: "监听 pointerdown 或 click。", en: "Listens for pointerdown or click." },
  excludeDescription: {
    zh: "位于目标之外、但不应触发回调的元素；支持选择器、元素、元素数组或解析函数。",
    en: "Elements outside the target that must not trigger the callback; accepts a selector, element, element array, or resolver.",
  },
  a11yTitle: { zh: "焦点提示", en: "Focus note" },
  a11yBody: {
    zh: "隐藏浮层前应先把焦点恢复到触发器，避免焦点停留在即将隐藏的内容中。",
    en: "Restore focus to the activator before hiding an overlay so focus is never retained inside hidden content.",
  },
});

defineStyle(
  articleStyles,
  `
    .outside-demo {
      display: grid;
      grid-template-columns: minmax(260px, 1fr) minmax(200px, .72fr);
      gap: var(--elf-space-3);
      width: min(720px, 100%);
    }

    .outside-status {
      display: inline-flex;
      align-items: center;
      gap: var(--elf-space-2);
    }

    .outside-target,
    .outside-zone {
      display: grid;
      min-height: 150px;
      place-items: center;
      padding: var(--elf-space-5);
      border-radius: var(--elf-radius-md);
    }

    .outside-target {
      border: 1px solid color-mix(in srgb, var(--elf-primary) 48%, var(--elf-border));
      background: color-mix(in srgb, var(--elf-primary) 8%, var(--elf-bg-paper));
      color: var(--elf-primary);
    }

    .outside-zone {
      border: 1px dashed var(--elf-border);
      background: var(--elf-bg-overlay);
      color: var(--elf-text-secondary);
      cursor: pointer;
    }

    @media (max-width: 640px) {
      .outside-demo { grid-template-columns: 1fr; }
    }
  `,
);

const clickOutside = defineDirective(clickOutsideDirective);
const outsideCount = useRef(0);

const onOutside = (): void => {
  outsideCount.set(outsideCount.value + 1);
};

const directiveOptions = () => ({
  handler: onOutside,
  event: "click" as const,
  exclude: ".outside-trigger",
});

const optionRows = () => [
  { name: "handler", type: "(event) => void", default: "—", desc: t("handlerDescription") },
  { name: "disabled", type: "boolean", default: "false", desc: t("disabledDescription") },
  {
    name: "event",
    type: "'pointerdown' | 'click'",
    default: "pointerdown",
    desc: t("eventDescription"),
  },
  {
    name: "exclude",
    type: "Element | string | Element[] | Function",
    default: "—",
    desc: t("excludeDescription"),
  },
];

const code = `<elf-button class="outside-trigger">${t("excluded")}</elf-button>
<section
  v-click-outside=\${directiveOptions()}
  class="outside-target"
>
  ${t("inside")}
</section>`;

const script = `import { defineDirective, useRef } from "@elfui/core";
import { clickOutsideDirective } from "@elfui/kit";

const clickOutside = defineDirective(clickOutsideDirective);
const outsideCount = useRef(0);
const onOutside = () => outsideCount.set(outsideCount.value + 1);
const directiveOptions = () => ({
  handler: onOutside,
  event: "click",
  exclude: ".outside-trigger"
});`;

const PageClickOutside = defineHtml(`
  <elf-container class="docs-article">
    <elf-docs-hero category="directives" :title=${t("title")} :description=${t("description")}></elf-docs-hero>

    <elf-playground :title=${t("demoTitle")} :code=${code} :script=${script}>
      <span slot="status" class="outside-status">
        <elf-button class="outside-trigger" size="sm">${t("excluded")}</elf-button>
        <span role="status" aria-live="polite">${t("count")}: ${outsideCount}</span>
      </span>
      <div class="outside-demo">
        <section v-click-outside=${directiveOptions()} class="outside-target">
          ${t("inside")}
        </section>
        <button class="outside-zone" type="button">${t("outside")}</button>
      </div>
    </elf-playground>

    <elf-quote type="info" :title=${t("excludeNoteTitle")}>${t("excludeNoteBody")}</elf-quote>

    <h2>API</h2>
    <elf-props-table :title=${t("options")} :rows=${optionRows()} />

    <p class="docs-callout is-warning">
      <strong>${t("a11yTitle")}</strong> ${t("a11yBody")}
    </p>
  </elf-container>
`);

export { PageClickOutside };
