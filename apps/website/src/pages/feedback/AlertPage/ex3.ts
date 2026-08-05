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
  prominentSection: { zh: "强调提示", en: "Prominent accent" },
  prominentInfoTitle: { zh: "发布窗口已确定", en: "Release window confirmed" },
  prominentInfoBody: {
    zh: "v2.4 将于周五 22:00 发布，预计 30 分钟完成，期间登录服务会短暂中断。",
    en: "v2.4 ships Friday at 22:00 and takes about 30 minutes; sign-in may briefly interrupt.",
  },
  prominentSuccessTitle: { zh: "生产构建已就绪", en: "Production build ready" },
  prominentSuccessBody: {
    zh: "构建 #4821 已通过自动化测试与灰度验证，可以标记为可发布版本。",
    en: "Build #4821 passed automated and canary checks and is ready to release.",
  },
  prominentWarningTitle: { zh: "磁盘空间即将不足", en: "Disk space running low" },
  prominentWarningBody: {
    zh: "预发环境使用率已达 86%，剩余空间约支持 6 天，请本周扩容或清理构建产物。",
    en: "Staging usage is at 86%; about 6 days remain. Please expand or clean build artifacts this week.",
  },
  prominentDangerTitle: { zh: "订单服务错误率超限", en: "Order service error rate exceeded" },
  prominentDangerBody: {
    zh: "最近 5 分钟错误率为 5.2%，已触发自动告警并通知值班人员。",
    en: "The last 5-minute error rate hit 5.2%; an alert was triggered and the on-call engineer notified.",
  },
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

const code7 = `<elf-alert
  type="danger"
  prominent
  title="Order service error rate exceeded"
  description="The last 5-minute error rate hit 5.2%; the on-call engineer was notified."
></elf-alert>`;

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
        <div style="width:min(680px,100%);display:flex;flex-direction:column;gap:12px">
            <elf-alert type="info" prominent :title=${t("prominentInfoTitle")} :description=${t("prominentInfoBody")}></elf-alert>
            <elf-alert type="success" prominent :title=${t("prominentSuccessTitle")} :description=${t("prominentSuccessBody")}></elf-alert>
            <elf-alert type="warning" prominent :title=${t("prominentWarningTitle")} :description=${t("prominentWarningBody")}></elf-alert>
            <elf-alert type="danger" prominent :title=${t("prominentDangerTitle")} :description=${t("prominentDangerBody")}></elf-alert>
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
