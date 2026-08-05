import { defineHtml } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  descriptionSection: { zh: "带描述", en: "With descriptions" },
  variantsSection: { zh: "变体", en: "Variants" },
  saved: { zh: "草稿已保存", en: "Draft saved" },
  savedDescription: {
    zh: "更改已自动保存，可随时返回继续编辑。",
    en: "Changes are saved automatically; you can return and keep editing.",
  },
  network: { zh: "离线状态", en: "You are offline" },
  networkDescription: {
    zh: "网络连接已断开，更改将在恢复连接后自动同步。",
    en: "The connection is lost; changes will sync automatically once you are back online.",
  },
  variantTitle: { zh: "同步完成", en: "Sync complete" },
  variantDescription: {
    zh: "所有设备上的更改已合并，冲突已按最新版本解决。",
    en: "Changes are merged across devices; conflicts were resolved with the newest version.",
  },
});

const code2 = `<elf-alert type="success" title="${t("saved")}" description="${t("savedDescription")}"></elf-alert>
<elf-alert type="warning" title="${t("network")}" description="${t("networkDescription")}"></elf-alert>`;

const code3 = `<elf-alert type="success" variant="tonal" title="${t("variantTitle")}" description="${t("variantDescription")}"></elf-alert>
<elf-alert type="success" variant="elevated" title="${t("variantTitle")}" description="${t("variantDescription")}"></elf-alert>
<elf-alert type="success" variant="outlined" title="${t("variantTitle")}" description="${t("variantDescription")}"></elf-alert>
<elf-alert type="success" variant="filled" title="${t("variantTitle")}" description="${t("variantDescription")}"></elf-alert>
<elf-alert type="success" variant="plain" title="${t("variantTitle")}" description="${t("variantDescription")}"></elf-alert>`;

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
            <elf-alert type="success" variant="tonal" :title=${t("variantTitle")} :description=${t("variantDescription")}></elf-alert>
            <elf-alert type="success" variant="elevated" :title=${t("variantTitle")} :description=${t("variantDescription")}></elf-alert>
            <elf-alert type="success" variant="outlined" :title=${t("variantTitle")} :description=${t("variantDescription")}></elf-alert>
            <elf-alert type="success" variant="filled" :title=${t("variantTitle")} :description=${t("variantDescription")}></elf-alert>
            <elf-alert type="success" variant="plain" :title=${t("variantTitle")} :description=${t("variantDescription")}></elf-alert>
        </div>
    </elf-playground>
`);

export { PageAlertEx2 };
