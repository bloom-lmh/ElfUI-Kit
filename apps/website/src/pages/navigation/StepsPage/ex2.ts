import { defineHtml } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  heading: { zh: "方向与状态", en: "Direction and status" },
  vertical: { zh: "垂直流程", en: "Vertical flow" },
  alternative: { zh: "替代标签与状态", en: "Alternative labels and status" },
  submit: { zh: "提交申请", en: "Submit request" },
  submitDesc: { zh: "申请已进入流程", en: "The request entered the workflow" },
  review: { zh: "主管审批", en: "Manager review" },
  reviewDesc: { zh: "等待主管处理", en: "Waiting for the manager" },
  finance: { zh: "财务复核", en: "Finance review" },
  financeDesc: { zh: "当前步骤不可用", en: "This step is unavailable" },
  archive: { zh: "归档", en: "Archive" },
  archiveDesc: { zh: "审批后自动归档", en: "Archive after approval" },
});

const items = () => [
  { title: t("submit"), description: t("submitDesc"), status: "finish" },
  { title: t("review"), description: t("reviewDesc"), status: "process" },
  { title: t("finance"), description: t("financeDesc"), disabled: true },
  { title: t("archive"), description: t("archiveDesc") },
];
const code = `<elf-steps direction="vertical" :active.prop=\${1} :items.prop=\${items} />`;
const script = `const items = [
  { title: "提交申请", description: "申请已进入流程", status: "finish" },
  { title: "主管审批", description: "等待主管处理", status: "process" },
  { title: "财务复核", description: "当前步骤不可用", disabled: true },
  { title: "归档", description: "审批后自动归档" }
];`;

const PageStepsEx2 = defineHtml(`
  <h2>{{ t("heading") }}</h2>
  <elf-playground :title=${t("vertical")} :code=${code} :script=${script}>
    <div style="width:min(540px,100%)"><elf-steps direction="vertical" :active.prop=${1} :items.prop=${items()}></elf-steps></div>
  </elf-playground>
  <elf-playground :title=${t("alternative")} :code=${code} :script=${script}>
    <elf-steps :active.prop=${1} :items.prop=${items()} alternative-label></elf-steps>
  </elf-playground>
`);

export { PageStepsEx2 };
