import { defineHtml } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  sizes: { zh: "尺寸", en: "Sizes" },
  sizeTitle: { zh: "小、中、大三种尺寸", en: "Small, medium, and large sizes" },
  small: { zh: "小", en: "Small" },
  medium: { zh: "中", en: "Medium" },
  large: { zh: "大", en: "Large" },
  states: { zh: "禁用与加载", en: "Disabled and loading" },
  stateTitle: { zh: "禁用与加载状态", en: "Disabled and loading states" },
  unavailable: { zh: "不可切换", en: "Unavailable" },
  saving: { zh: "保存中", en: "Saving" },
  on: { zh: "开", en: "On" },
  off: { zh: "关", en: "Off" },
});

const sizeCode = `<elf-switch size="sm" />
<elf-switch size="md" />
<elf-switch size="lg" />`;

const stateCode = `<elf-switch disabled label="${t("unavailable")}" />
<elf-switch loading label="${t("saving")}" />`;

const PageSwitchEx2 = defineHtml(`
  <h2>${t("sizes")}</h2>
  <elf-playground :title=${t("sizeTitle")} :code=${sizeCode}>
    <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
      <elf-switch size="sm" :label=${t("small")}></elf-switch>
      <elf-switch size="md" :label=${t("medium")}></elf-switch>
      <elf-switch size="lg" :label=${t("large")}></elf-switch>
    </div>
  </elf-playground>

  <h2>${t("states")}</h2>
  <elf-playground :title=${t("stateTitle")} :code=${stateCode}>
    <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
      <elf-switch disabled :label=${t("unavailable")}></elf-switch>
      <elf-switch loading :label=${t("saving")}></elf-switch>
      <elf-switch loading model-value :active-text=${t("on")} :inactive-text=${t("off")}></elf-switch>
    </div>
  </elf-playground>
`);

export { PageSwitchEx2 };
