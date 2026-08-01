import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";
import { timelineIconOptions } from "./icons";

const t = createDocsTranslator({
  title: { zh: "订单活动", en: "Order activity" },
  playground: { zh: "高级版扩展面板", en: "Advanced activity panel" },
  toolbar: { zh: "订单活动工具", en: "Order activity tools" },
  theme: { zh: "切换外观", en: "Toggle appearance" },
  palette: { zh: "颜色设置", en: "Color settings" },
  copy: { zh: "复制记录", en: "Copy activity" },
  code: { zh: "查看代码", en: "View code" },
  today: { zh: "今天", en: "TODAY" },
  post: { zh: "发布", en: "Post" },
  archived: { zh: "该订单已归档。", en: "This order was archived." },
  fulfilled: { zh: "数字下载已完成 1 件商品。", en: "Digital Downloads fulfilled 1 item." },
  emailSent: {
    zh: "订单确认邮件已发送给 John Lee（john@example.com）。",
    en: "Order confirmation email was sent to John Lee (john@example.com).",
  },
  resend: { zh: "重发邮件", en: "Resend Email" },
  payment: {
    zh: "通过 PayPal Express Checkout 处理了 15.00 美元付款。",
    en: "A $15.00 USD payment was processed on PayPal Express Checkout.",
  },
  sent: { zh: "确认邮件已重新发送", en: "Confirmation email resent" },
  ready: { zh: "等待操作", en: "Ready" },
});

const resendCount = useRef(0);
const resendEmail = (): void => resendCount.set(resendCount.value + 1);
const status = (): string =>
  resendCount.value > 0 ? `${t("sent")} · ${resendCount.value}` : t("ready");

const items = [
  { hideTimestamp: true, color: "#fb8c00", size: "large" },
  { hideTimestamp: true, color: "#a6a6a6" },
  { hideTimestamp: true, color: "#1976d2" },
  { hideTimestamp: true, color: "#a6a6a6" },
  { hideTimestamp: true, color: "#a6a6a6" },
];

const code = `<section class="order-panel">
  <div class="order-toolbar">...</div>
  <elf-timeline :items.prop=\${items} mode="start">
    <span slot="dot-0">JL</span>
    <article slot="item-0">...</article>
    <article slot="item-1">...</article>
  </elf-timeline>
</section>`;

const script = `const resendCount = useRef(0);
const resendEmail = () => resendCount.set(resendCount.value + 1);
const items = [
  { hideTimestamp: true, color: "#fb8c00", size: "large" },
  { hideTimestamp: true, color: "#a6a6a6" },
  { hideTimestamp: true, color: "#1976d2" }
];`;

defineStyle(styles);

const PageTimelineEx4 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("playground")} :code=${code} :script=${script}>
    <span slot="status" role="status" aria-live="polite">${status()}</span>
    <elf-icon-provider :options.prop=${timelineIconOptions}>
      <section class="order-panel">
        <div class="order-toolbar" role="toolbar" :aria-label=${t("toolbar")}>
          <span></span>
          <div class="order-toolbar-actions">
            <elf-button circle variant="text" size="small" :aria-label=${t("theme")}><elf-icon name="theme" size="18"></elf-icon></elf-button>
            <elf-button circle variant="text" size="small" :aria-label=${t("palette")}><elf-icon name="palette" size="18"></elf-icon></elf-button>
            <elf-button circle variant="text" size="small" :aria-label=${t("copy")}><elf-icon name="copy" size="18"></elf-icon></elf-button>
            <elf-button circle variant="text" size="small" :aria-label=${t("code")}><elf-icon name="code" size="18"></elf-icon></elf-button>
          </div>
        </div>

        <div class="order-timeline-shell">
          <elf-timeline class="order-timeline" :items.prop=${items} mode="start">
            <span slot="dot-0" class="order-avatar">JL</span>
            <article slot="item-0" class="order-profile">
              <div class="order-profile-row">
                <div class="order-profile-main">
                  <span class="order-profile-placeholder">L...</span>
                  <strong>${t("post")}</strong>
                </div>
              </div>
              <p class="order-day">${t("today")}</p>
            </article>

            <article slot="item-1" class="order-event">
              <div class="order-event-row"><span>${t("archived")}</span><time>15:26 EDT</time></div>
            </article>

            <article slot="item-2" class="order-event">
              <div class="order-event-row"><span><span class="order-event-tag">APP</span>${t("fulfilled")}</span><time>15:25 EDT</time></div>
            </article>

            <article slot="item-3" class="order-event">
              <div class="order-event-row"><span>${t("emailSent")}</span><time>15:25 EDT</time></div>
              <elf-button variant="outlined" @click=${resendEmail}>${t("resend")}</elf-button>
            </article>

            <article slot="item-4" class="order-event">
              <div class="order-event-row"><span>${t("payment")}</span><time>15:25 EDT</time></div>
            </article>
          </elf-timeline>
        </div>
      </section>
    </elf-icon-provider>
  </elf-playground>
`);

export { PageTimelineEx4 };
