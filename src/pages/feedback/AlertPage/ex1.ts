import { defineHtml } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  section: { zh: "四种类型", en: "Four types" },
  info: { zh: "信息提示", en: "Information" },
  success: { zh: "操作成功", en: "Operation succeeded" },
  warning: { zh: "警告", en: "Warning" },
  danger: { zh: "错误", en: "Error" },
});

const code1 = `<elf-alert type="info" title="${t("info")}"></elf-alert>
<elf-alert type="success" title="${t("success")}"></elf-alert>
<elf-alert type="warning" title="${t("warning")}"></elf-alert>
<elf-alert type="danger" title="${t("danger")}"></elf-alert>`;

const PageAlertEx1 = defineHtml(`
    <h2>${t("section")}</h2>
    <elf-playground title="info / success / warning / danger" :code=${code1}>
        <div style="width:50%;display:flex;flex-direction:column;gap:12px">
            <elf-alert type="info" :title=${t("info")}></elf-alert>
            <elf-alert type="success" :title=${t("success")}></elf-alert>
            <elf-alert type="warning" :title=${t("warning")}></elf-alert>
            <elf-alert type="danger" :title=${t("danger")}></elf-alert>
        </div>
    </elf-playground>
`);

export { PageAlertEx1 };
