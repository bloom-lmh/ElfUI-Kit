import { defineHtml } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "四种状态", en: "Four states" },
  success: { zh: "订单支付成功", en: "Payment successful" },
  successDetail: {
    zh: "订单 20260805-0012 已支付，预计明天发货。",
    en: "Order 20260805-0012 is paid and ships tomorrow.",
  },
  warning: { zh: "库存不足", en: "Low stock" },
  warningDetail: {
    zh: "「经典款保温杯」库存仅剩 3 件，低于预警线。",
    en: "The classic tumbler has 3 units left, below the warning threshold.",
  },
  error: { zh: "上传失败", en: "Upload failed" },
  errorDetail: {
    zh: "文件 52MB 超过 50MB 上限，请压缩后重试。",
    en: "The 52MB file exceeds the 50MB limit; compress it and retry.",
  },
  info: { zh: "正在导出", en: "Exporting" },
  infoDetail: {
    zh: "正在生成 1,248 条销售记录，完成后自动下载。",
    en: "Generating 1,248 sales records; the download starts when ready.",
  },
});

const statusCode = `<elf-result icon="success" title="${t("success")}" sub-title="${t("successDetail")}" />
<elf-result icon="warning" title="${t("warning")}" sub-title="${t("warningDetail")}" />
<elf-result icon="error" title="${t("error")}" sub-title="${t("errorDetail")}" />
<elf-result icon="info" title="${t("info")}" sub-title="${t("infoDetail")}" />`;

const PageResultEx1 = defineHtml(`
<elf-playground :title=${t("title")} :code=${statusCode}>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;width:100%">
        <elf-result style="border:1px solid var(--elf-border);border-radius:16px;background:var(--elf-bg-paper)" icon="success" :title=${t("success")} :sub-title=${t("successDetail")}></elf-result>
        <elf-result style="border:1px solid var(--elf-border);border-radius:16px;background:var(--elf-bg-paper)" icon="warning" :title=${t("warning")} :sub-title=${t("warningDetail")}></elf-result>
        <elf-result style="border:1px solid var(--elf-border);border-radius:16px;background:var(--elf-bg-paper)" icon="error" :title=${t("error")} :sub-title=${t("errorDetail")}></elf-result>
        <elf-result style="border:1px solid var(--elf-border);border-radius:16px;background:var(--elf-bg-paper)" icon="info" :title=${t("info")} :sub-title=${t("infoDetail")}></elf-result>
      </div>
    </elf-playground>
`);

export { PageResultEx1 };
