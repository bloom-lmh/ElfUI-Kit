import { defineHtml } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  triggerSection: { zh: "不同触发方式", en: "Trigger modes" },
  hoverContent: { zh: "悬浮触发的提示", en: "Shown on hover" },
  clickContent: { zh: "点击触发的提示", en: "Shown on click" },
  focusContent: { zh: "聚焦触发的提示", en: "Shown on focus" },
  contextContent: { zh: "右键触发的提示", en: "Shown from the context menu" },
  hover: { zh: "悬浮（默认）", en: "Hover (default)" },
  click: { zh: "点击", en: "Click" },
  focus: { zh: "聚焦输入框", en: "Focus this input" },
  context: { zh: "右键点击", en: "Right-click" },
  effectSection: { zh: "明暗风格", en: "Light and dark effects" },
  darkContent: { zh: "深色风格提示", en: "Dark tooltip" },
  lightContent: { zh: "浅色风格提示", en: "Light tooltip" },
  dark: { zh: "深色风格", en: "Dark effect" },
  light: { zh: "浅色风格", en: "Light effect" },
});

const code2 = `<elf-tooltip content="${t("hoverContent")}" trigger="hover">
  <elf-button>${t("hover")}</elf-button>
</elf-tooltip>
<elf-tooltip content="${t("clickContent")}" trigger="click">
  <elf-button>${t("click")}</elf-button>
</elf-tooltip>
<elf-tooltip content="${t("focusContent")}" trigger="focus">
  <elf-input placeholder="${t("focus")}" style="width: 150px;"></elf-input>
</elf-tooltip>
<elf-tooltip content="${t("contextContent")}" trigger="contextmenu">
  <elf-button>${t("context")}</elf-button>
</elf-tooltip>`;

const code3 = `<elf-tooltip content="${t("darkContent")}" effect="dark">
  <elf-button>${t("dark")}</elf-button>
</elf-tooltip>
<elf-tooltip content="${t("lightContent")}" effect="light">
  <elf-button>${t("light")}</elf-button>
</elf-tooltip>`;

const PageTooltipEx2 = defineHtml(`
  <h2>${t("triggerSection")}</h2>
  <elf-playground :title=${t("triggerSection")} :code=${code2}>
    <div style="display: flex; gap: 16px; align-items: center; justify-content: center;">
      <elf-tooltip :content=${t("hoverContent")} trigger="hover">
        <elf-button>${t("hover")}</elf-button>
      </elf-tooltip>
      <elf-tooltip :content=${t("clickContent")} trigger="click">
        <elf-button>${t("click")}</elf-button>
      </elf-tooltip>
      <elf-tooltip :content=${t("focusContent")} trigger="focus">
        <elf-input :placeholder=${t("focus")} style="width: 150px;"></elf-input>
      </elf-tooltip>
      <elf-tooltip :content=${t("contextContent")} trigger="contextmenu">
        <elf-button>${t("context")}</elf-button>
      </elf-tooltip>
    </div>
  </elf-playground>

  <h2>${t("effectSection")}</h2>
  <elf-playground :title=${t("effectSection")} :code=${code3}>
    <div style="display: flex; gap: 16px; align-items: center; justify-content: center;">
      <elf-tooltip :content=${t("darkContent")} effect="dark">
        <elf-button>${t("dark")}</elf-button>
      </elf-tooltip>
      <elf-tooltip :content=${t("lightContent")} effect="light">
        <elf-button>${t("light")}</elf-button>
      </elf-tooltip>
    </div>
  </elf-playground>
`);

export { PageTooltipEx2 };
