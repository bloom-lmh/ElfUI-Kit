import { defineHtml } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "四种状态", en: "Four states" },
  success: { zh: "提交成功", en: "Submitted" },
  successDetail: { zh: "配置已保存", en: "The configuration has been saved." },
  warning: { zh: "需要确认", en: "Confirmation required" },
  warningDetail: { zh: "请检查风险项", en: "Review the risk items." },
  error: { zh: "提交失败", en: "Submission failed" },
  errorDetail: { zh: "请稍后重试", en: "Try again later." },
  info: { zh: "处理中", en: "Processing" },
  infoDetail: { zh: "系统正在执行任务", en: "The system is running the task." }
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
