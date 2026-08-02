import { defineHtml } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  section: { zh: "说明块", en: "Callouts" },
  infoTitle: { zh: "信息", en: "Information" },
  infoBody: { zh: "这是一条补充说明。", en: "This is an info box." },
  tipTitle: { zh: "提示", en: "Tip" },
  tipBody: { zh: "这是一条有用的提示。", en: "This is a tip." },
  warningTitle: { zh: "警告", en: "Warning" },
  warningBody: { zh: "继续操作前请确认当前状态。", en: "This is a warning." },
  dangerTitle: { zh: "危险", en: "Danger" },
  dangerBody: { zh: "此操作可能造成不可逆的影响。", en: "This is a dangerous warning." },
});

const code = `<elf-alert type="info" variant="soft" show-icon="false" title="${t("infoTitle")}" description="${t("infoBody")}"></elf-alert>
<elf-alert type="tip" variant="soft" show-icon="false" title="${t("tipTitle")}" description="${t("tipBody")}"></elf-alert>
<elf-alert type="warning" variant="soft" show-icon="false" title="${t("warningTitle")}" description="${t("warningBody")}"></elf-alert>
<elf-alert type="danger" variant="soft" show-icon="false" title="${t("dangerTitle")}" description="${t("dangerBody")}"></elf-alert>`;

const PageAlertEx4 = defineHtml(`
  <h2>${t("section")}</h2>
  <elf-playground title="soft / show-icon=false" :code=${code}>
    <div style="display:grid;width:min(100%,720px)">
      <elf-alert type="info" variant="soft" :showIcon.prop=${false} :title=${t("infoTitle")} :description=${t("infoBody")}></elf-alert>
      <elf-alert type="tip" variant="soft" :showIcon.prop=${false} :title=${t("tipTitle")} :description=${t("tipBody")}></elf-alert>
      <elf-alert type="warning" variant="soft" :showIcon.prop=${false} :title=${t("warningTitle")} :description=${t("warningBody")}></elf-alert>
      <elf-alert type="danger" variant="soft" :showIcon.prop=${false} :title=${t("dangerTitle")} :description=${t("dangerBody")}></elf-alert>
    </div>
  </elf-playground>
`);

export { PageAlertEx4 };
