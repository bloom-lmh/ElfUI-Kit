import { defineHtml, useComponents, useRef } from "@elfui/core";
import { createDocsPicker, createDocsTranslator } from "../../docsLocale";

import { PageLocaleProviderPreview } from "./preview";

const pick = createDocsPicker();
const t = createDocsTranslator({
  title: { zh: "切换语言与 RTL", en: "Switching locale and RTL" },
  chinese: { zh: "中文", en: "Chinese" },
  english: { zh: "英文", en: "English" },
  rtl: { zh: "从右到左", en: "RTL" },
});

const localeMode = useRef(pick("zh", "en"));

const zhMessages = {
  common: { confirm: "确认", cancel: "取消" },
  provider: { title: "本地化提供器预览" },
};

const enMessages = {
  common: { confirm: "Confirm", cancel: "Cancel" },
  provider: { title: "Locale provider preview" },
};

const arMessages = {
  common: { confirm: "تأكيد", cancel: "إلغاء" },
  provider: { title: "معاينة موفر اللغة" },
};

const code = `<elf-locale-provider
  :name="currentLocaleName()"
  :rtl="isRtl()"
  :messages.prop="currentMessages()"
>
  <my-child></my-child>
</elf-locale-provider>`;

const localeScript = pick(
  `const localeMode = useRef("zh");

const messages = {
  zh: { common: { confirm: "确认", cancel: "取消" } },
  en: { common: { confirm: "Confirm", cancel: "Cancel" } },
  ar: { common: { confirm: "تأكيد", cancel: "إلغاء" } }
};

const currentLocaleName = () =>
  localeMode.value === "zh" ? "zh-CN" : localeMode.value === "ar" ? "ar" : "en-US";
const currentMessages = () => messages[localeMode.value];
const isRtl = () => localeMode.value === "ar";
const setLocale = (value) => localeMode.set(value);`,
  `const localeMode = useRef("en");

const messages = {
  zh: { common: { confirm: "\\u786e\\u8ba4", cancel: "\\u53d6\\u6d88" } },
  en: { common: { confirm: "Confirm", cancel: "Cancel" } },
  ar: { common: { confirm: "تأكيد", cancel: "إلغاء" } }
};

const currentLocaleName = () =>
  localeMode.value === "zh" ? "zh-CN" : localeMode.value === "ar" ? "ar" : "en-US";
const currentMessages = () => messages[localeMode.value];
const isRtl = () => localeMode.value === "ar";
const setLocale = (value) => localeMode.set(value);`,
);

const currentLocaleName = (): string =>
  localeMode.value === "zh" ? "zh-CN" : localeMode.value === "ar" ? "ar" : "en-US";

const currentMessages = () =>
  localeMode.value === "zh" ? zhMessages : localeMode.value === "ar" ? arMessages : enMessages;

const isRtl = (): boolean => localeMode.value === "ar";

const setLocale = (value: string): void => {
  localeMode.set(value);
};

useComponents({ "page-locale-provider-preview": PageLocaleProviderPreview });

const PageLocaleProviderEx1 = defineHtml(`
<elf-playground :title=${t("title")} :code=${code} :script=${localeScript}>
      <span slot="status" style="display:inline-flex;align-items:center;gap:8px;flex-wrap:wrap">
        <elf-button
          size="sm"
          :variant="localeMode === 'zh' ? 'contained' : 'outlined'"
          @click="setLocale('zh')"
          >${t("chinese")}</elf-button
        >
        <elf-button
          size="sm"
          :variant="localeMode === 'en' ? 'contained' : 'outlined'"
          @click="setLocale('en')"
          >${t("english")}</elf-button
        >
        <elf-button
          size="sm"
          :variant="localeMode === 'ar' ? 'contained' : 'outlined'"
          @click="setLocale('ar')"
          >${t("rtl")}</elf-button
        >
      </span>
      <div style="display:flex;justify-content:center;width:100%">
        <elf-locale-provider
          :name="currentLocaleName()"
          :rtl="isRtl()"
          :messages.prop="currentMessages()"
        >
          <page-locale-provider-preview></page-locale-provider-preview>
        </elf-locale-provider>
      </div>
    </elf-playground>
`);

export { PageLocaleProviderEx1 };
