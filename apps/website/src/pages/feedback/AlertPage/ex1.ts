import { defineHtml } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  section: { zh: "四种类型", en: "Four types" },
  info: { zh: "系统维护", en: "System maintenance" },
  infoDesc: {
    zh: "本周六 02:00–04:00 进行系统维护，期间登录与订单查询可能短暂不可用。",
    en: "Maintenance runs Saturday 02:00–04:00; sign-in and order lookup may briefly be unavailable.",
  },
  success: { zh: "同步完成", en: "Sync complete" },
  successDesc: {
    zh: "已同步 1,284 条客户记录，最近一次更新于 5 分钟前。",
    en: "1,284 customer records synced; the latest update was 5 minutes ago.",
  },
  warning: { zh: "存储空间不足", en: "Storage nearly full" },
  warningDesc: {
    zh: "附件目录使用率已达 92%，请清理或扩容。",
    en: "The attachment directory is at 92% capacity. Clean up or expand it.",
  },
  danger: { zh: "构建失败", en: "Build failed" },
  dangerDesc: {
    zh: "生产构建 #4824 在 lint 阶段失败，请查看日志。",
    en: "Production build #4824 failed at the lint stage. Check the logs.",
  },
});

const code1 = `<elf-alert type="info" title="${t("info")}" description="${t("infoDesc")}"></elf-alert>
<elf-alert type="success" title="${t("success")}" description="${t("successDesc")}"></elf-alert>
<elf-alert type="warning" title="${t("warning")}" description="${t("warningDesc")}"></elf-alert>
<elf-alert type="danger" title="${t("danger")}" description="${t("dangerDesc")}"></elf-alert>`;

const PageAlertEx1 = defineHtml(`
    <h2>${t("section")}</h2>
    <elf-playground title="info / success / warning / danger" :code=${code1}>
        <div style="width:50%;display:flex;flex-direction:column;gap:12px">
            <elf-alert type="info" :title=${t("info")} :description=${t("infoDesc")}></elf-alert>
            <elf-alert type="success" :title=${t("success")} :description=${t("successDesc")}></elf-alert>
            <elf-alert type="warning" :title=${t("warning")} :description=${t("warningDesc")}></elf-alert>
            <elf-alert type="danger" :title=${t("danger")} :description=${t("dangerDesc")}></elf-alert>
        </div>
    </elf-playground>
`);

export { PageAlertEx1 };
