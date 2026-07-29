import { defineHtml } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  closableSection: { zh: "可关闭", en: "Closable" },
  closeMe: { zh: "点 × 关闭我", en: "Click × to close me" },
  compactSection: { zh: "紧凑模式", en: "Compact density" },
  compactInfo: { zh: "紧凑 info", en: "Compact info" },
  compactSuccess: { zh: "紧凑 success", en: "Compact success" },
  compactWarning: { zh: "紧凑 warning", en: "Compact warning" },
  compactDanger: { zh: "紧凑 danger", en: "Compact danger" },
  compactDescription: { zh: "带描述的紧凑模式", en: "Compact alert with a description" },
  prominentSection: { zh: "粗色强调条", en: "Prominent accent" },
  prominentInfo: { zh: "信息强调提示", en: "Prominent info" },
  prominentSuccess: { zh: "成功强调提示", en: "Prominent success" },
  prominentWarning: { zh: "警告强调提示", en: "Prominent warning" },
  prominentDanger: { zh: "错误强调提示", en: "Prominent danger" },
  centerSection: { zh: "居中 + 无图标", en: "Centered without an icon" },
  centered: { zh: "居中无图标", en: "Centered without an icon" },
  closeTextSection: { zh: "自定义关闭文字", en: "Custom close text" },
  understood: { zh: "知道了", en: "Got it" },
  customClose: { zh: "使用 close-text 代替 × 图标", en: "Use close-text instead of the × icon" },
  slotsSection: { zh: "自定义插槽", en: "Custom slots" },
  customTitle: { zh: "自定义标题", en: "Custom title" },
  customTitleSlot: { zh: "自定义标题（title slot）", en: "Custom title (title slot)" },
  customContent: {
    zh: "这是 default slot 内容，替换了 description 属性",
    en: "Default slot content replaces the description prop.",
  },
});

const code4 = `<elf-alert type="info" closable title="${t("closeMe")}"></elf-alert>`;

const code5 = `<elf-alert type="info" center :show-icon="false" title="${t("centered")}"></elf-alert>`;

const code6 = `<elf-alert type="warning" density="compact" title="${t("compactSection")}"></elf-alert>`;

const code7 = `<elf-alert type="info" prominent title="${t("prominentSection")}"></elf-alert>`;

const closeTextCode = `<elf-alert type="info" closable close-text="${t("understood")}" title="${t("customClose")}"></elf-alert>`;

const slotsCode = `<elf-alert type="success">
  <span slot="icon">⭐</span>
  <span slot="title"><strong>${t("customTitle")}</strong></span>
  ${t("customContent")}
</elf-alert>`;

const PageAlertEx3 = defineHtml(`
    <h2>${t("closableSection")}</h2>
    <elf-playground title="closable" :code=${code4}>
        <div style="width:50%">
            <elf-alert type="info" closable :title=${t("closeMe")}></elf-alert>
        </div>
    </elf-playground>

    <h2>${t("compactSection")}</h2>
    <elf-playground title="density=compact" :code=${code6}>
        <div style="width:50%;display:flex;flex-direction:column;gap:12px">
            <elf-alert type="info" density="compact" :title=${t("compactInfo")}></elf-alert>
            <elf-alert type="success" density="compact" :title=${t("compactSuccess")}></elf-alert>
            <elf-alert type="warning" density="compact" :title=${t("compactWarning")} :description=${t("compactDescription")}></elf-alert>
            <elf-alert type="danger" density="compact" :title=${t("compactDanger")} closable></elf-alert>
        </div>
    </elf-playground>

    <h2>${t("prominentSection")}</h2>
    <elf-playground title="prominent" :code=${code7}>
        <div style="width:50%;display:flex;flex-direction:column;gap:12px">
            <elf-alert type="info" prominent :title=${t("prominentInfo")}></elf-alert>
            <elf-alert type="success" prominent :title=${t("prominentSuccess")}></elf-alert>
            <elf-alert type="warning" prominent :title=${t("prominentWarning")}></elf-alert>
            <elf-alert type="danger" prominent :title=${t("prominentDanger")}></elf-alert>
        </div>
    </elf-playground>

    <h2>${t("centerSection")}</h2>
    <elf-playground title="center / show-icon=false" :code=${code5}>
        <div style="width:50%">
            <elf-alert type="info" center :show-icon="false" :title=${t("centered")}></elf-alert>
        </div>
    </elf-playground>

    <h2>${t("closeTextSection")}</h2>
    <elf-playground title="close-text" :code=${closeTextCode}>
        <div style="width:50%">
            <elf-alert type="info" closable :close-text=${t("understood")} :title=${t("customClose")}></elf-alert>
        </div>
    </elf-playground>

    <h2>${t("slotsSection")}</h2>
    <elf-playground title="title / icon slot" :code=${slotsCode}>
        <div style="width:50%">
            <elf-alert type="success">
                <span slot="icon">⭐</span>
                <span slot="title"><strong>${t("customTitleSlot")}</strong></span>
                ${t("customContent")}
            </elf-alert>
        </div>
    </elf-playground>
`);

export { PageAlertEx3 };
