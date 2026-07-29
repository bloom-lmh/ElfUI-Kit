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
  title: { zh: "外部点击", en: "Click outside" },
  description: {
    zh: "当指针事件发生在目标及排除元素之外时触发回调，支持 Shadow DOM 的组合事件路径、动态配置和自动卸载清理。",
    en: "Run a callback when a pointer event occurs outside the target and excluded elements, with composed-path support for Shadow DOM, dynamic options, and automatic cleanup.",
  },
  demoTitle: { zh: "目标与排除区域", en: "Target and excluded areas" },
  inside: { zh: "目标区域：点击这里不会触发", en: "Target area: clicks here are ignored" },
  excluded: { zh: "排除按钮", en: "Excluded button" },
  outside: { zh: "外部区域", en: "Outside area" },
  count: { zh: "外部触发", en: "Outside triggers" },
  optionTitle: { zh: "配置", en: "Options" },
  option: { zh: "选项", en: "Option" },
  type: { zh: "类型", en: "Type" },
  optionDescription: { zh: "说明", en: "Description" },
  handlerDescription: { zh: "外部事件回调。", en: "Callback for outside events." },
  disabledDescription: { zh: "暂停触发而不卸载指令。", en: "Pause handling without unmounting the directive." },
  eventDescription: { zh: "监听 pointerdown 或 click。", en: "Listen for pointerdown or click." },
  excludeDescription: {
    zh: "排除元素、选择器、元素数组或返回元素的函数。",
    en: "Exclude an element, selector, element array, or element resolver.",
  },
});

defineStyle(
  articleStyles,
  `
    .outside-demo {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(180px, 0.45fr);
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

    .outside-actions {
      display: flex;
      align-items: center;
      gap: var(--elf-space-3);
      margin-bottom: var(--elf-space-3);
    }

    @media (max-width: 640px) {
      .outside-demo {
        grid-template-columns: 1fr;
      }
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
  exclude: ".outside-trigger",
  event: "pointerdown"
});`;

const PageClickOutside = defineHtml(`
  <elf-container class="docs-article">
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

    <section class="article-card">
      <h2>${t("optionTitle")}</h2>
      <table class="support-table">
        <thead>
          <tr><th>${t("option")}</th><th>${t("type")}</th><th>${t("optionDescription")}</th></tr>
        </thead>
        <tbody>
          <tr><td>handler</td><td>(event) =&gt; void</td><td>${t("handlerDescription")}</td></tr>
          <tr><td>disabled</td><td>boolean</td><td>${t("disabledDescription")}</td></tr>
          <tr><td>event</td><td>pointerdown | click</td><td>${t("eventDescription")}</td></tr>
          <tr><td>exclude</td><td>Element | string | Function</td><td>${t("excludeDescription")}</td></tr>
        </tbody>
      </table>
    </section>
  </elf-container>
`);

export { PageClickOutside };
