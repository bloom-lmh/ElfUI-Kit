import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "组合式插槽与嵌套面板", en: "Composition slots and nested panels" },
  outer: { zh: "外层", en: "Outer" },
  inner: { zh: "内层", en: "Inner" },
  account: { zh: "账户设置", en: "Account settings" },
  accountIntro: {
    zh: "外层内容可以继续承载独立受控的折叠面板。",
    en: "Outer content can contain another independently controlled collapse."
  },
  security: { zh: "安全验证", en: "Security verification" },
  securityBody: {
    zh: "配置通行密钥和二次验证。",
    en: "Configure passkeys and two-factor authentication."
  },
  sessions: { zh: "登录会话", en: "Login sessions" },
  sessionsBody: {
    zh: "查看并撤销其他设备的登录状态。",
    en: "Review and revoke sessions on other devices."
  },
  notifications: { zh: "通知偏好", en: "Notification preferences" },
  notificationsBody: {
    zh: "title 与 icon 插槽可以表达更丰富的标题层级。",
    en: "The title and icon slots can express richer heading hierarchy."
  },
  hint: {
    zh: "内层切换不会误触外层；每层都保持独立 model-value、键盘顺序和 ARIA 关系。",
    en: "Inner toggles never activate the outer panel; each level keeps its own model, keyboard order, and ARIA relationships."
  }
});

// State
const outerActive = useRef<string[]>(["account"]);
const innerActive = useRef<string[]>(["security"]);

// Derived state
const nestedStatus = (): string =>
  `${t("outer")} · ${outerActive.value.join(", ") || "—"} / ${t("inner")} · ${innerActive.value.join(", ") || "—"}`;

// Methods
const onOuterUpdate = (event: CustomEvent<string[]>): void => {
  outerActive.set(Array.isArray(event.detail) ? event.detail.map(String) : []);
};

const onInnerUpdate = (event: CustomEvent<string[]>): void => {
  innerActive.set(Array.isArray(event.detail) ? event.detail.map(String) : []);
};

const nestedCode = `<elf-collapse
  :modelValue.prop=\${outerActive}
  @update:modelValue=\${onOuterUpdate}
>
  <elf-collapse-item name="account">
    <span slot="title">Account settings</span>
    <span slot="icon">⌄</span>

    <elf-collapse
      :modelValue.prop=\${innerActive}
      @update:modelValue=\${onInnerUpdate}
    >
      <elf-collapse-item name="security" title="Security verification">
        Configure passkeys and two-factor authentication.
      </elf-collapse-item>
    </elf-collapse>
  </elf-collapse-item>
</elf-collapse>`;

const nestedScript = `const outerActive = useRef(["account"]);
const innerActive = useRef(["security"]);

const onOuterUpdate = (event) => outerActive.set(event.detail);
const onInnerUpdate = (event) => innerActive.set(event.detail);`;

defineStyle(styles);

const PageCollapseEx3 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${nestedCode} :script=${nestedScript}>
    <span slot="status" class="collapse-demo-status">${nestedStatus()}</span>
    <div class="collapse-demo-shell">
      <elf-collapse
        :modelValue.prop=${outerActive}
        @update:modelValue=${onOuterUpdate}
      >
        <elf-collapse-item name="account">
          <span slot="title" class="collapse-rich-title">
            <span class="collapse-title-mark">A</span>
            ${t("account")}
          </span>
          <span slot="icon" class="collapse-custom-icon">⌄</span>
          <p class="collapse-nested-intro">${t("accountIntro")}</p>
          <elf-collapse
            class="collapse-nested"
            :modelValue.prop=${innerActive}
            @update:modelValue=${onInnerUpdate}
          >
            <elf-collapse-item name="security" :title=${t("security")}>
              ${t("securityBody")}
            </elf-collapse-item>
            <elf-collapse-item name="sessions" :title=${t("sessions")}>
              ${t("sessionsBody")}
            </elf-collapse-item>
          </elf-collapse>
        </elf-collapse-item>
        <elf-collapse-item name="notifications">
          <span slot="title" class="collapse-rich-title">
            <span class="collapse-title-mark secondary">N</span>
            ${t("notifications")}
          </span>
          ${t("notificationsBody")}
        </elf-collapse-item>
      </elf-collapse>
      <p class="collapse-demo-hint">${t("hint")}</p>
    </div>
  </elf-playground>
`);

export { PageCollapseEx3 };
