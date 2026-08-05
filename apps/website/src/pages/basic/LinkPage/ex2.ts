import { defineHtml, defineStyle, useRef } from "@elfui/core";
import type { RouteLocationRaw } from "@elfui/router";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const navigationState = useRef<"ready" | "current" | "button" | "icon">("ready");

const t = createDocsTranslator({
  title: { zh: "路由导航", en: "Router navigation" },
  ready: { zh: "等待导航", en: "Ready to navigate" },
  current: { zh: "当前页：Link", en: "Current page: Link" },
  button: { zh: "即将前往 Button", en: "Navigating to Button" },
  icon: { zh: "即将替换为 Icon", en: "Replacing with Icon" },
  routerTitle: { zh: "声明式路由", en: "Declarative router links" },
  routerDescription: {
    zh: "to 使用当前 @elfui/router，并自动生成 hash history 对应的 href。",
    en: "to uses the active @elfui/router and resolves the correct href for hash history.",
  },
  currentPage: { zh: "Link 当前页", en: "Current Link page" },
  openButton: { zh: "打开 Button", en: "Open Button" },
  replaceIcon: { zh: "replace 前往 Icon", en: "Replace with Icon" },
  nativeTitle: { zh: "原生 hash 回退", en: "Native hash fallback" },
  nativeDescription: {
    zh: "没有激活 router 时，字符串 to 与 href 仍保留为可复制、可打开的新地址。",
    en: "Without an active router, string to and href remain usable, copyable destinations.",
  },
  copyHint: {
    zh: "Ctrl / Cmd + 点击保留浏览器原生行为",
    en: "Ctrl / Cmd + click keeps native browser behavior",
  },
});

const statusText = (): string => t(navigationState.value);

const onNavigate = (event: Event): void => {
  const to = (event as CustomEvent<RouteLocationRaw>).detail;
  const path = typeof to === "string" ? to : "path" in to ? to.path : "";
  if (path === "/basic/button") navigationState.set("button");
  else if (path === "/basic/icon") navigationState.set("icon");
  else navigationState.set("current");
};

const routerCode = `<elf-link to="/basic/link">Current Link page</elf-link>
<elf-link type="primary" to="/basic/button">Open Button</elf-link>
<elf-link type="info" :to.prop=\${{ path: "/basic/icon" }} replace>
  Replace with Icon
</elf-link>`;

const routerScript = `const onNavigate = (event) => {
  console.log("route target", event.detail);
};

// to 存在时优先使用当前 @elfui/router：
// - 普通点击调用 router.push / router.replace
// - Ctrl / Cmd / Shift / Alt + 点击交回浏览器
// - 没有 router 时仍输出可用的 href 作为回退`;

defineStyle(styles);

const PageLinkEx2 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${routerCode} :script=${routerScript}>
    <span slot="status" class="link-demo-status" role="status" aria-live="polite">${statusText()}</span>
    <section class="link-navigation-panel">
      <article>
        <span class="link-demo-eyebrow">Router</span>
        <strong>${t("routerTitle")}</strong>
        <p>${t("routerDescription")}</p>
        <div class="link-demo-row">
          <elf-link to="/basic/link" @navigate=${onNavigate}>${t("currentPage")}</elf-link>
          <elf-link type="primary" to="/basic/button" @navigate=${onNavigate}>${t("openButton")}</elf-link>
          <elf-link type="info" :to.prop=${{ path: "/basic/icon" }} replace @navigate=${onNavigate}>
            ${t("replaceIcon")}
          </elf-link>
        </div>
      </article>
      <article>
        <span class="link-demo-eyebrow">Fallback</span>
        <strong>${t("nativeTitle")}</strong>
        <p>${t("nativeDescription")}</p>
        <small>${t("copyHint")}</small>
      </article>
    </section>
  </elf-playground>
`);

export { PageLinkEx2 };
