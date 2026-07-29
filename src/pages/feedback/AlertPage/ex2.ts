import { defineHtml } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  descriptionSection: { zh: "带描述", en: "With descriptions" },
  variantsSection: { zh: "变体", en: "Variants" },
  saved: { zh: "保存成功", en: "Saved successfully" },
  savedDescription: {
    zh: "你的更改已经保存到服务器",
    en: "Your changes have been saved to the server.",
  },
  network: { zh: "网络不稳定", en: "Unstable network" },
  networkDescription: {
    zh: "检测到网络延迟，部分功能可能受影响",
    en: "Network latency was detected. Some features may be affected.",
  },
  defaultVariant: { zh: "tonal（默认）", en: "tonal (default)" },
  elevated: { zh: "elevated — 带阴影", en: "elevated — shadow" },
  outlined: { zh: "outlined — 边框", en: "outlined — border" },
  filled: { zh: "filled — 实色填充", en: "filled — solid fill" },
  plain: { zh: "plain — 纯文字", en: "plain — text only" },
});

const code2 = `<elf-alert type="success" title="${t("saved")}" description="${t("savedDescription")}"></elf-alert>
<elf-alert type="warning" title="${t("network")}" description="${t("networkDescription")}"></elf-alert>`;

const code3 = `<elf-alert type="success" variant="tonal" title="${t("defaultVariant")}"></elf-alert>
<elf-alert type="success" variant="elevated" title="${t("elevated")}"></elf-alert>
<elf-alert type="success" variant="outlined" title="${t("outlined")}"></elf-alert>
<elf-alert type="success" variant="filled" title="${t("filled")}"></elf-alert>
<elf-alert type="success" variant="plain" title="${t("plain")}"></elf-alert>`;

const PageAlertEx2 = defineHtml(`
    <h2>${t("descriptionSection")}</h2>
    <elf-playground title="title + description" :code=${code2}>
        <div style="width:50%;display:flex;flex-direction:column;gap:12px">
            <elf-alert type="success" :title=${t("saved")} :description=${t("savedDescription")}></elf-alert>
            <elf-alert type="warning" :title=${t("network")} :description=${t("networkDescription")}></elf-alert>
        </div>
    </elf-playground>

    <h2>${t("variantsSection")}</h2>
    <elf-playground title="tonal / elevated / outlined / filled / plain" :code=${code3}>
        <div style="width:50%;display:flex;flex-direction:column;gap:12px">
            <elf-alert type="success" variant="tonal" :title=${t("defaultVariant")}></elf-alert>
            <elf-alert type="success" variant="elevated" :title=${t("elevated")}></elf-alert>
            <elf-alert type="success" variant="outlined" :title=${t("outlined")}></elf-alert>
            <elf-alert type="success" variant="filled" :title=${t("filled")}></elf-alert>
            <elf-alert type="success" variant="plain" :title=${t("plain")}></elf-alert>
        </div>
    </elf-playground>
`);

export { PageAlertEx2 };
