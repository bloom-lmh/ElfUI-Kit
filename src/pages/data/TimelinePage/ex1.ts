import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";
import { timelineIconOptions } from "./icons";

const t = createDocsTranslator({
  title: { zh: "填充警告", en: "Filled alerts" },
  playground: { zh: "同侧实色警告时间轴", en: "Solid alert timeline" },
  info: {
    zh: "信息通知用于呈现需要关注但不阻断当前流程的更新，内容保持简洁并给出明确上下文。",
    en: "The workspace sync completed successfully. Review the latest changes before publishing the release.",
  },
  danger: {
    zh: "重要警告用于说明可能影响当前任务的风险，请先检查相关信息再继续后续操作。",
    en: "Two deployment checks require attention. Resolve the failed validations before continuing.",
  },
});

const items = [
  { hideTimestamp: true, color: "#2196f3" },
  { hideTimestamp: true, color: "#c0002b" },
];

const code = `<elf-timeline :items.prop=\${items} mode="start">
  <article slot="item-0" class="reference-alert is-info">...</article>
  <article slot="item-1" class="reference-alert is-danger">...</article>
</elf-timeline>`;

const script = `const items = [
  { hideTimestamp: true, color: "#2196f3" },
  { hideTimestamp: true, color: "#c0002b" }
];`;

defineStyle(styles);

const PageTimelineEx1 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("playground")} :code=${code} :script=${script}>
    <elf-icon-provider :options.prop=${timelineIconOptions}>
      <div class="timeline-reference-stage alert-stage">
        <elf-timeline class="alert-timeline" :items.prop=${items} mode="start">
          <article slot="item-0" class="reference-alert is-info">
            <elf-icon name="information" size="24"></elf-icon>
            <span>${t("info")}</span>
          </article>
          <article slot="item-1" class="reference-alert is-danger">
            <elf-icon name="alert-circle" size="24"></elf-icon>
            <span>${t("danger")}</span>
          </article>
        </elf-timeline>
      </div>
    </elf-icon-provider>
  </elf-playground>
`);

export { PageTimelineEx1 };
