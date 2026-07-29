import { defineHtml, useComponents } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import { PageNotificationEx1 } from "./ex1";
import { PageNotificationEx2 } from "./ex2";
import { PageNotificationEx3 } from "./ex3";
import { PageNotificationEx4 } from "./ex4";
import { PageNotificationProps } from "./props";

const t = createDocsTranslator({
  title: { zh: "Notification 通知", en: "Notification" },
  description: {
    zh: "在系统四角以卡片形式滑出，用于相对重要、需长时间展示或有结构化内容的全局通知。",
    en: "Slides card-based notifications into any screen corner for important, long-lived, or structured global updates.",
  },
});

useComponents({
  "page-notification-ex1": PageNotificationEx1,
  "page-notification-ex2": PageNotificationEx2,
  "page-notification-ex3": PageNotificationEx3,
  "page-notification-ex4": PageNotificationEx4,
  "page-notification-props": PageNotificationProps
});

const PageNotification = defineHtml(`
  <elf-container
    ><h1>${t("title")}</h1>
    <p>${t("description")}</p>
    <page-notification-ex1 /><page-notification-ex2 /><page-notification-ex3 /><page-notification-ex4 /><page-notification-props
  /></elf-container>
`);

export { PageNotification };
