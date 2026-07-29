import { defineHtml } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  section: { zh: "显示与隐藏延迟", en: "Show and hide delays" },
  showContent: { zh: "延迟 1 秒显示", en: "Show after one second" },
  hideContent: { zh: "延迟 1 秒隐藏", en: "Hide after one second" },
  show: { zh: "延迟显示", en: "Delayed show" },
  hide: { zh: "延迟隐藏", en: "Delayed hide" },
});

const code4 = `<elf-tooltip content="${t("showContent")}" :show-after="1000">
  <elf-button>${t("show")}</elf-button>
</elf-tooltip>
<elf-tooltip content="${t("hideContent")}" :hide-after="1000">
  <elf-button>${t("hide")}</elf-button>
</elf-tooltip>`;

const PageTooltipEx3 = defineHtml(`
  <h2>${t("section")}</h2>
  <elf-playground :title=${t("section")} :code=${code4}>
    <div style="display: flex; gap: 16px; align-items: center; justify-content: center;">
      <elf-tooltip :content=${t("showContent")} :show-after="1000">
        <elf-button>${t("show")}</elf-button>
      </elf-tooltip>
      <elf-tooltip :content=${t("hideContent")} :hide-after="1000">
        <elf-button>${t("hide")}</elf-button>
      </elf-tooltip>
    </div>
  </elf-playground>
`);

export { PageTooltipEx3 };
