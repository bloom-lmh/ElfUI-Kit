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
  purpose: { zh: "典型用途", en: "Typical use" },
  purposeValue: { zh: "关闭非模态浮层", en: "Close non-modal overlays" },
  eventPath: { zh: "事件边界", en: "Event boundary" },
  eventPathValue: { zh: "支持 Shadow DOM composedPath", en: "Shadow DOM composedPath aware" },
  cleanup: { zh: "资源管理", en: "Resource management" },
  cleanupValue: { zh: "卸载自动清理", en: "Automatic cleanup" },
  usageTitle: { zh: "使用原则", en: "Usage guidance" },
  usageLead: {
    zh: "外部点击适合关闭菜单、建议面板和轻量弹出层。模态 Dialog 不能只依赖它，还必须处理焦点隔离、Escape 和焦点恢复。",
    en: "Outside click suits menus, suggestion panels, and lightweight popovers. A modal Dialog must also manage focus isolation, Escape, and focus restoration.",
  },
  usageOne: { zh: "触发器通常加入 exclude，避免点击触发器时先关闭再重新打开。", en: "Usually exclude the activator so its click does not close and immediately reopen the overlay." },
  usageTwo: { zh: "优先监听 pointerdown，在焦点变化前决定是否关闭。", en: "Prefer pointerdown when the close decision must happen before focus changes." },
  usageThree: { zh: "回调只处理业务状态，监听和卸载由指令内核负责。", en: "Keep callbacks focused on business state; the directive core owns listeners and cleanup." },
  a11yTitle: { zh: "无障碍边界", en: "Accessibility boundary" },
  a11yBody: {
    zh: "关闭浮层前确认焦点不在即将隐藏的内容中。若浮层拥有键盘导航，应先恢复焦点到激活器，再设置 hidden/aria-hidden，避免辅助技术警告。",
    en: "Before hiding an overlay, ensure focus is not retained inside it. When the overlay owns keyboard navigation, restore focus to the activator before setting hidden or aria-hidden.",
  },
  nextTitle: { zh: "理解实现边界", en: "Understand the boundary" },
  nextBody: { zh: "指令介绍说明局部/应用级注册和单一行为内核约束。", en: "The Directives introduction explains local/app registration and the single behavior-core rule." },
  backLink: { zh: "返回指令介绍", en: "Back to Directives" },
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
    <span class="docs-kicker">${t("kicker")}</span>
    <h1>${t("title")}</h1>
    <p class="page-lead">${t("description")}</p>

    <div class="docs-summary">
      <div class="docs-summary-item">
        <span class="docs-summary-label">${t("purpose")}</span>
        <span class="docs-summary-value">${t("purposeValue")}</span>
      </div>
      <div class="docs-summary-item">
        <span class="docs-summary-label">${t("eventPath")}</span>
        <span class="docs-summary-value">${t("eventPathValue")}</span>
      </div>
      <div class="docs-summary-item">
        <span class="docs-summary-label">${t("cleanup")}</span>
        <span class="docs-summary-value">${t("cleanupValue")}</span>
      </div>
    </div>

    <section class="docs-section">
      <h2>${t("usageTitle")}</h2>
      <p class="docs-section-lead">${t("usageLead")}</p>
      <ul class="docs-checklist">
        <li>${t("usageOne")}</li>
        <li>${t("usageTwo")}</li>
        <li>${t("usageThree")}</li>
      </ul>
    </section>

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
      <h2>${t("optionTitle")}</h2>
      <table class="docs-matrix">
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

    <p class="docs-callout is-warning"><strong>${t("a11yTitle")}</strong> ${t("a11yBody")}</p>

    <section class="docs-next" data-docs-toc-ignore>
      <div>
        <h2>${t("nextTitle")}</h2>
        <p>${t("nextBody")}</p>
      </div>
      <div class="docs-link-list">
        <elf-link href="#/directives">${t("backLink")} →</elf-link>
      </div>
    </section>
  </elf-container>
`);

export { PageClickOutside };
