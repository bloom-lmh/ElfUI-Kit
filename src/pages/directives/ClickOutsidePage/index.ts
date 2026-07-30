import {
  defineDirective,
  defineHtml,
  defineStyle,
  useRef
} from "@elfui/core";

import { clickOutsideDirective } from "../../../directives";
import { createDocsTranslator } from "../../docsLocale";
import articleStyles from "../../shared/article.scss?inline";

const t = createDocsTranslator({
  kicker: { zh: "指令", en: "Directive" },
  title: { zh: "外部点击", en: "Click outside" },
  description: {
    zh: "当指针事件发生在目标和排除元素之外时执行回调，适合菜单、建议面板和轻量浮层。",
    en: "Run a callback when a pointer event occurs outside the target and excluded elements, ideal for menus, suggestion panels, and lightweight overlays."
  },
  demoTitle: { zh: "目标与排除区域", en: "Target and excluded areas" },
  inside: { zh: "目标区域：点击这里不会触发", en: "Target area: clicks here are ignored" },
  excluded: { zh: "排除按钮", en: "Excluded button" },
  outside: { zh: "外部区域", en: "Outside area" },
  count: { zh: "外部触发", en: "Outside triggers" },
  options: { zh: "配置", en: "Options" },
  handlerDescription: { zh: "外部事件回调。", en: "Callback for outside events." },
  disabledDescription: { zh: "暂停触发而不卸载指令。", en: "Pauses handling without unmounting the directive." },
  eventDescription: { zh: "监听 pointerdown 或 click。", en: "Listens for pointerdown or click." },
  excludeDescription: {
    zh: "排除元素、选择器、元素数组或元素解析函数。",
    en: "Excludes an element, selector, element array, or element resolver."
  },
  a11yTitle: { zh: "焦点提示", en: "Focus note" },
  a11yBody: {
    zh: "隐藏浮层前应先把焦点恢复到触发器，避免焦点停留在即将隐藏的内容中。",
    en: "Restore focus to the activator before hiding an overlay so focus is never retained inside hidden content."
  }
});

defineStyle(
  articleStyles,
  `
    .outside-actions {
      display: flex;
      align-items: center;
      margin-bottom: var(--elf-space-3);
    }

    .outside-demo {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(180px, .45fr);
      gap: var(--elf-space-3);
      width: min(720px, 100%);
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
  `
);

const clickOutside = defineDirective(clickOutsideDirective);
const outsideCount = useRef(0);

const onOutside = (): void => {
  outsideCount.set(outsideCount.value + 1);
};

const directiveOptions = () => ({
  handler: onOutside,
  exclude: ".outside-trigger"
});

const optionRows = () => [
  { name: "handler", type: "(event) => void", default: "—", desc: t("handlerDescription") },
  { name: "disabled", type: "boolean", default: "false", desc: t("disabledDescription") },
  { name: "event", type: "'pointerdown' | 'click'", default: "pointerdown", desc: t("eventDescription") },
  { name: "exclude", type: "Element | string | Element[] | Function", default: "—", desc: t("excludeDescription") }
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
  exclude: ".outside-trigger"
});`;

const PageClickOutside = defineHtml(`
  <elf-container class="docs-article">
    <span class="docs-kicker">${t("kicker")}</span>
    <h1>${t("title")}</h1>
    <p class="page-lead">${t("description")}</p>

    <elf-playground :title=${t("demoTitle")} :code=${code} :script=${script}>
      <span slot="status">${t("count")}: ${outsideCount}</span>
      <div class="outside-actions">
        <elf-button class="outside-trigger">${t("excluded")}</elf-button>
      </div>
      <div class="outside-demo">
        <section v-click-outside=${directiveOptions()} class="outside-target">
          ${t("inside")}
        </section>
        <button class="outside-zone" type="button">${t("outside")}</button>
      </div>
    </elf-playground>

    <section class="docs-section">
      <h2>API</h2>
      <elf-props-table :title=${t("options")} :rows=${optionRows()} />
    </section>

    <p class="docs-callout is-warning">
      <strong>${t("a11yTitle")}</strong> ${t("a11yBody")}
    </p>
  </elf-container>
`);

export { PageClickOutside };
