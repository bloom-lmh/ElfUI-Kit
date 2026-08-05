import { defineHtml, defineStyle, useRef } from "@elfui/core";
import { mdiAccount, mdiAccountOutline, mdiAlert, mdiAlertOutline } from "@mdi/js";

import { createSvgIconSet } from "@elfui/kit-src/components/Basic/Icon";
import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const activeSet = useRef<"outline" | "filled">("outline");

const outlineOptions = {
  defaultSet: "outline",
  aliases: {
    account: "outline:account",
    alert: "outline:alert",
  },
  sets: {
    outline: createSvgIconSet({
      account: mdiAccountOutline,
      alert: mdiAlertOutline,
    }),
  },
};

const filledOptions = {
  defaultSet: "filled",
  aliases: {
    account: "filled:account",
    alert: "filled:alert",
  },
  sets: {
    filled: createSvgIconSet({
      account: mdiAccount,
      alert: mdiAlert,
    }),
  },
};

const t = createDocsTranslator({
  title: { zh: "图标集与回退", en: "Icon sets and fallback" },
  outline: { zh: "线性", en: "Outline" },
  filled: { zh: "填充", en: "Filled" },
  switchSet: { zh: "切换图标集", en: "Switch icon set" },
  status: { zh: "当前图标集", en: "Current icon set" },
  navTitle: { zh: "工作区设置", en: "Workspace settings" },
  accountTitle: { zh: "账户", en: "Account" },
  accountDesc: { zh: "个人资料与安全", en: "Profile and security" },
  alertTitle: { zh: "消息通知", en: "Notifications" },
  alertDesc: { zh: "告警与提醒", en: "Alerts and reminders" },
  missingTitle: { zh: "未知入口", en: "Unknown entry" },
  missingDesc: { zh: "缺失名称时展示回退", en: "Fallback when the name is missing" },
  fallback: {
    zh: "缺失时使用 fallback 属性或插槽",
    en: "Use the fallback prop or slot when an icon is missing",
  },
});

const currentOptions = () => (activeSet.value === "outline" ? outlineOptions : filledOptions);
const currentSetLabel = (): string => t(activeSet.value);
const toggleSet = (): void => activeSet.set(activeSet.value === "outline" ? "filled" : "outline");

const providerCode = `<elf-icon-provider :options.prop=\${iconOptions}>
  <nav class="icon-nav">
    <a class="icon-nav-item is-active" href="#">
      <elf-icon name="$account" size="20" />
      <span><strong>Account</strong><small>Profile and security</small></span>
    </a>
    <a class="icon-nav-item" href="#">
      <elf-icon name="$alert" size="20" />
      <span><strong>Notifications</strong><small>Alerts and reminders</small></span>
    </a>
    <span class="icon-nav-item is-disabled">
      <elf-icon name="unknown" fallback="?" size="20" />
      <span><strong>Unknown entry</strong><small>Fallback shown</small></span>
    </span>
  </nav>
</elf-icon-provider>`;

const providerScript = `import { createSvgIconSet } from "@elfui/kit";

const iconOptions = {
  defaultSet: "mdi",
  aliases: { account: "mdi:account" },
  sets: {
    mdi: createSvgIconSet({ account: mdiAccount })
  }
};

// IconProvider 仅影响自身子树；嵌套 Provider 可覆盖 defaultSet。`;

defineStyle(styles);

const PageIconEx2 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${providerCode} :script=${providerScript}>
    <span slot="status" class="icon-demo-actions">
      <span>${t("status")}：${currentSetLabel()}</span>
      <elf-button size="sm" variant="outlined" @click=${toggleSet}>${t("switchSet")}</elf-button>
    </span>

    <elf-icon-provider :options.prop=${currentOptions()}>
      <div class="icon-provider-panel">
        <strong class="icon-nav-title">${t("navTitle")}</strong>
        <nav class="icon-nav" :aria-label=${t("navTitle")}>
          <a class="icon-nav-item is-active" href="#">
            <span class="icon-nav-icon">
              <elf-icon name="$account" size="20" color="var(--elf-primary)"></elf-icon>
            </span>
            <span class="icon-nav-text">
              <strong>${t("accountTitle")}</strong>
              <small>${t("accountDesc")}</small>
            </span>
          </a>
          <a class="icon-nav-item" href="#">
            <span class="icon-nav-icon">
              <elf-icon name="$alert" size="20"></elf-icon>
            </span>
            <span class="icon-nav-text">
              <strong>${t("alertTitle")}</strong>
              <small>${t("alertDesc")}</small>
            </span>
          </a>
          <span class="icon-nav-item is-disabled" aria-disabled="true">
            <span class="icon-nav-icon">
              <elf-icon name="unknown" fallback="?" size="20"></elf-icon>
            </span>
            <span class="icon-nav-text">
              <strong>${t("missingTitle")}</strong>
              <small>${t("missingDesc")}</small>
            </span>
          </span>
        </nav>
        <small class="icon-nav-note">${t("fallback")}</small>
      </div>
    </elf-icon-provider>
  </elf-playground>
`);

export { PageIconEx2 };
