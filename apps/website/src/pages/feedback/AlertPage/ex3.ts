import { defineHtml } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  closableSection: { zh: "可关闭", en: "Closable" },
  updateTitle: { zh: "版本更新提醒", en: "Update available" },
  updateDesc: {
    zh: "v2.4.1 已发布，包含 12 项修复，可在更新日志中查看。",
    en: "v2.4.1 is here with 12 fixes; see the changelog for details.",
  },
  compactSection: { zh: "紧凑模式", en: "Compact density" },
  compactSyncing: { zh: "正在同步…", en: "Syncing…" },
  compactSaved: { zh: "已保存到草稿箱", en: "Saved to drafts" },
  compactOffline: { zh: "离线保存", en: "Saved offline" },
  compactOfflineDesc: {
    zh: "恢复连接后自动同步",
    en: "Will sync when you are back online",
  },
  compactFailed: { zh: "上传失败，点击重试", en: "Upload failed — tap to retry" },
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
  orderSubmitted: { zh: "订单已提交", en: "Order submitted" },
  orderSubmittedDesc: {
    zh: "订单 20260805-0012 已提交，等待商家确认。",
    en: "Order 20260805-0012 is submitted and awaiting merchant confirmation.",
  },
  closeTextSection: { zh: "自定义关闭文字", en: "Custom close text" },
  darkModeTitle: { zh: "新功能上线", en: "New feature" },
  darkModeDesc: {
    zh: "暗色模式已支持，可在设置中切换。",
    en: "Dark mode is now available; switch it on in Settings.",
  },
  understood: { zh: "知道了", en: "Got it" },
  slotsSection: { zh: "自定义插槽", en: "Custom slots" },
  favoriteTitle: { zh: "已加入收藏", en: "Added to favorites" },
  favoriteContent: {
    zh: "文章已保存到「稍后阅读」，可在个人中心查看。",
    en: "The article is saved to “Read later”; find it in your profile.",
  },
});

const code4 = `<elf-alert type="info" closable title="${t("updateTitle")}" description="${t("updateDesc")}"></elf-alert>`;

const code5 = `<elf-alert type="success" center :show-icon="false" title="${t("orderSubmitted")}" description="${t("orderSubmittedDesc")}"></elf-alert>`;

const code6 = `<elf-alert type="info" density="compact" title="${t("compactSyncing")}"></elf-alert>`;

const code7 = `<elf-alert
  type="danger"
  prominent
  title="${t("prominentDangerTitle")}"
  description="${t("prominentDangerBody")}"
></elf-alert>`;

const closeTextCode = `<elf-alert type="info" closable close-text="${t("understood")}" title="${t("darkModeTitle")}" description="${t("darkModeDesc")}"></elf-alert>`;

const slotsCode = `<elf-alert type="success">
  <span slot="icon">⭐</span>
  <span slot="title"><strong>${t("favoriteTitle")}</strong></span>
  ${t("favoriteContent")}
</elf-alert>`;

const PageAlertEx3 = defineHtml(`
    <h2>${t("closableSection")}</h2>
    <elf-playground title="closable" :code=${code4}>
        <div style="width:50%">
            <elf-alert type="info" closable :title=${t("updateTitle")} :description=${t("updateDesc")}></elf-alert>
        </div>
    </elf-playground>

    <h2>${t("compactSection")}</h2>
    <elf-playground title="density=compact" :code=${code6}>
        <div style="width:50%;display:flex;flex-direction:column;gap:12px">
            <elf-alert type="info" density="compact" :title=${t("compactSyncing")}></elf-alert>
            <elf-alert type="success" density="compact" :title=${t("compactSaved")}></elf-alert>
            <elf-alert type="warning" density="compact" :title=${t("compactOffline")} :description=${t("compactOfflineDesc")}></elf-alert>
            <elf-alert type="danger" density="compact" :title=${t("compactFailed")} closable></elf-alert>
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
            <elf-alert type="success" center :show-icon="false" :title=${t("orderSubmitted")} :description=${t("orderSubmittedDesc")}></elf-alert>
        </div>
    </elf-playground>

    <h2>${t("closeTextSection")}</h2>
    <elf-playground title="close-text" :code=${closeTextCode}>
        <div style="width:50%">
            <elf-alert type="info" closable :close-text=${t("understood")} :title=${t("darkModeTitle")} :description=${t("darkModeDesc")}></elf-alert>
        </div>
    </elf-playground>

    <h2>${t("slotsSection")}</h2>
    <elf-playground title="title / icon slot" :code=${slotsCode}>
        <div style="width:50%">
            <elf-alert type="success">
                <span slot="icon">⭐</span>
                <span slot="title"><strong>${t("favoriteTitle")}</strong></span>
                ${t("favoriteContent")}
            </elf-alert>
        </div>
    </elf-playground>
`);

export { PageAlertEx3 };
