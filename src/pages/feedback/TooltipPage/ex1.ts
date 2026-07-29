import { defineHtml } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  section: { zh: "不同弹出位置", en: "Placements" },
  topContent: { zh: "提示位于上方", en: "Tooltip above" },
  bottomContent: { zh: "提示位于下方", en: "Tooltip below" },
  leftContent: { zh: "提示位于左侧", en: "Tooltip on the left" },
  rightContent: { zh: "提示位于右侧", en: "Tooltip on the right" },
  top: { zh: "上方", en: "Top" },
  bottom: { zh: "下方", en: "Bottom" },
  left: { zh: "左侧", en: "Left" },
  right: { zh: "右侧", en: "Right" },
});

const code1 = `<elf-tooltip content="${t("topContent")}" placement="top">
  <elf-button>${t("top")}</elf-button>
</elf-tooltip>
<elf-tooltip content="${t("bottomContent")}" placement="bottom">
  <elf-button>${t("bottom")}</elf-button>
</elf-tooltip>
<elf-tooltip content="${t("leftContent")}" placement="left">
  <elf-button>${t("left")}</elf-button>
</elf-tooltip>
<elf-tooltip content="${t("rightContent")}" placement="right">
  <elf-button>${t("right")}</elf-button>
</elf-tooltip>`;

const PageTooltipEx1 = defineHtml(`
  <h2>${t("section")}</h2>
  <elf-playground :title=${t("section")} :code=${code1}>
    <div
      style="display: flex; gap: 16px; align-items: center; justify-content: center; height: 120px;"
    >
      <elf-tooltip :content=${t("topContent")} placement="top">
        <elf-button>${t("top")}</elf-button>
      </elf-tooltip>
      <elf-tooltip :content=${t("bottomContent")} placement="bottom">
        <elf-button>${t("bottom")}</elf-button>
      </elf-tooltip>
      <elf-tooltip :content=${t("leftContent")} placement="left">
        <elf-button>${t("left")}</elf-button>
      </elf-tooltip>
      <elf-tooltip :content=${t("rightContent")} placement="right">
        <elf-button>${t("right")}</elf-button>
      </elf-tooltip>
    </div>
  </elf-playground>
`);

export { PageTooltipEx1 };
