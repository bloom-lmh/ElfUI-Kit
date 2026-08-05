import { defineHtml } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  section: { zh: "说明块", en: "Callouts" },
  infoTitle: { zh: "结算说明", en: "Billing note" },
  infoBody: {
    zh: "含税金额与运费会在结算页一并计算，提交订单前可再次核对。",
    en: "Tax and shipping are calculated together on checkout; review them before placing the order.",
  },
  tipTitle: { zh: "快捷键", en: "Keyboard shortcut" },
  tipBody: {
    zh: "使用 Ctrl/⌘ + K 可以快速打开全局搜索，不必移动鼠标。",
    en: "Press Ctrl/⌘ + K to open global search without reaching for the mouse.",
  },
  warningTitle: { zh: "注意", en: "Heads up" },
  warningBody: {
    zh: "删除项目前请先导出备份，删除后无法恢复。",
    en: "Export a backup before deleting a project; deletion cannot be undone.",
  },
  dangerTitle: { zh: "危险操作", en: "Danger zone" },
  dangerBody: {
    zh: "清空数据不可撤销，请确认已完成备份并拥有负责人授权。",
    en: "Clearing data cannot be undone; confirm the backup and an owner-approved authorization.",
  },
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
