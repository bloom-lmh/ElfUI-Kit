import { defineDirective, defineHtml, defineStyle, useRef } from "@elfui/core";

import { rippleDirective } from "../../../directives";
import { createDocsTranslator } from "../../docsLocale";
import articleStyles from "../../shared/article.scss?inline";

const t = createDocsTranslator({
  kicker: { zh: "指令", en: "Directive" },
  title: { zh: "波纹", en: "Ripple" },
  description: {
    zh: "为任意可交互元素添加指针与键盘触发的波纹反馈。",
    en: "Add pointer- and keyboard-triggered ripple feedback to any interactive element.",
  },
  demo: { zh: "卡片交互反馈", en: "Card interaction feedback" },
  cardTitle: { zh: "发布设计规范", en: "Publish design guidelines" },
  cardBody: {
    zh: "点击卡片任意位置，观察从指针位置扩散的波纹。",
    en: "Click anywhere on the card to see the ripple expand from the pointer.",
  },
  cardHint: { zh: "也支持 Enter / Space", en: "Also supports Enter / Space" },
  count: { zh: "激活次数", en: "Activations" },
  options: { zh: "配置", en: "Options" },
  center: { zh: "始终从元素中心扩散。", en: "Always expands from the element center." },
  color: { zh: "波纹颜色，默认 currentColor。", en: "Ripple color; defaults to currentColor." },
  duration: { zh: "动画持续时间，最小 120ms。", en: "Animation duration with a 120ms minimum." },
  disabled: { zh: "禁用视觉反馈。", en: "Disables the visual feedback." },
});

defineStyle(
  articleStyles,
  `
    .ripple-card {
      position: relative;
      display: grid;
      width: min(420px, 100%);
      min-height: 190px;
      align-content: end;
      gap: 8px;
      box-sizing: border-box;
      padding: 28px;
      border: 1px solid color-mix(in srgb, var(--elf-primary) 42%, var(--elf-border));
      border-radius: var(--elf-radius-lg);
      background: color-mix(in srgb, var(--elf-primary) 88%, #182a4f);
      box-shadow: 0 14px 36px color-mix(in srgb, var(--elf-primary) 24%, transparent);
      color: #fff;
      cursor: pointer;
      text-align: left;
      transition: transform 160ms ease, box-shadow 160ms ease;
    }

    .ripple-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 18px 42px color-mix(in srgb, var(--elf-primary) 30%, transparent);
    }

    .ripple-card:focus-visible {
      outline: 3px solid color-mix(in srgb, var(--elf-primary) 45%, #fff);
      outline-offset: 3px;
    }

    .ripple-card-content {
      position: relative;
      z-index: 1;
      display: grid;
      gap: 8px;
      pointer-events: none;
    }

    .ripple-card-title { font-size: 21px; font-weight: 700; }
    .ripple-card-body { max-width: 32ch; color: rgb(255 255 255 / 82%); line-height: 1.6; }
    .ripple-card-hint { color: rgb(255 255 255 / 70%); font-size: 12px; }
  `,
);

const ripple = defineDirective(rippleDirective);
const activationCount = useRef(0);
const cardOptions = () => ({ duration: 520 });

const activate = (): void => {
  activationCount.set(activationCount.value + 1);
};

const onCardKeydown = (event: KeyboardEvent): void => {
  if (event.key !== "Enter" && event.key !== " ") return;
  event.preventDefault();
  (event.currentTarget as HTMLElement).click();
};

const optionRows = () => [
  { name: "center", type: "boolean", default: "false", desc: t("center") },
  { name: "color", type: "string", default: "currentColor", desc: t("color") },
  { name: "duration", type: "number", default: "420", desc: t("duration") },
  { name: "disabled", type: "boolean", default: "false", desc: t("disabled") },
];

const code = `<article
  v-ripple={ duration: 520 }
  role="button"
  tabindex="0"
  @click="activate"
>
  Publish design guidelines
</article>`;

const script = `import { defineDirective, useRef } from "@elfui/core";
import { rippleDirective } from "@elfui/kit";

const ripple = defineDirective(rippleDirective);
const activationCount = useRef(0);
const activate = () => activationCount.set(activationCount.value + 1);`;

const PageRipple = defineHtml(`
  <elf-container class="docs-article">
    <span class="docs-kicker">${t("kicker")}</span>
    <h1>${t("title")}</h1>
    <p class="page-lead">${t("description")}</p>

    <elf-playground :title=${t("demo")} :code=${code} :script=${script}>
      <span slot="status">${t("count")}: ${activationCount}</span>
      <article
        class="ripple-card"
        v-ripple=${cardOptions()}
        role="button"
        tabindex="0"
        @click=${activate}
        @keydown=${onCardKeydown}
      >
        <div class="ripple-card-content">
          <strong class="ripple-card-title">${t("cardTitle")}</strong>
          <span class="ripple-card-body">${t("cardBody")}</span>
          <span class="ripple-card-hint">${t("cardHint")}</span>
        </div>
      </article>
    </elf-playground>

    <section class="docs-section">
      <h2>API</h2>
      <elf-props-table :title=${t("options")} :rows=${optionRows()} />
    </section>
  </elf-container>
`);

export { PageRipple };
