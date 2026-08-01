import { defineHtml, defineStyle, useRef } from "@elfui/core";
import { mdiAccount, mdiAccountOutline, mdiAlert, mdiAlertOutline } from "@mdi/js";

import { createSvgIconSet } from "../../../components/Basic/Icon";
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
  title: { zh: "Provider 图标集与未知回退", en: "Provider icon sets and unknown fallback" },
  outline: { zh: "线性", en: "Outline" },
  filled: { zh: "填充", en: "Filled" },
  switchSet: { zh: "切换图标集", en: "Switch icon set" },
  status: { zh: "当前图标集", en: "Current icon set" },
  account: { zh: "账户", en: "Account" },
  alert: { zh: "告警", en: "Alert" },
  missing: { zh: "未知名称", en: "Unknown name" },
  fallback: {
    zh: "缺失时使用 fallback 属性或插槽",
    en: "Use the fallback prop or slot when an icon is missing",
  },
});

const currentOptions = () => (activeSet.value === "outline" ? outlineOptions : filledOptions);
const currentSetLabel = (): string => t(activeSet.value);
const toggleSet = (): void => activeSet.set(activeSet.value === "outline" ? "filled" : "outline");

const providerCode = `<elf-icon-provider :options.prop=\${iconOptions}>
  <elf-icon name="$account" aria-label="Account"></elf-icon>
  <elf-icon name="$alert" aria-label="Alert"></elf-icon>
  <elf-icon name="unknown" fallback="?"></elf-icon>
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
      <div class="icon-provider-preview">
        <article>
          <elf-icon name="$account" size="32" color="var(--elf-primary)" :aria-label=${t("account")}></elf-icon>
          <strong>${t("account")}</strong>
        </article>
        <article>
          <elf-icon name="$alert" size="32" color="var(--elf-warning)" :aria-label=${t("alert")}></elf-icon>
          <strong>${t("alert")}</strong>
        </article>
        <article>
          <elf-icon name="unknown" fallback="?" size="32" :aria-label=${t("missing")}></elf-icon>
          <strong>${t("missing")}</strong>
          <small>${t("fallback")}</small>
        </article>
      </div>
    </elf-icon-provider>
  </elf-playground>
`);

export { PageIconEx2 };
