import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const active = useRef(0);
const t = createDocsTranslator({
  heading: { zh: "线性步骤", en: "Linear stepper" },
  title: { zh: "按顺序完成流程", en: "Complete a guided flow" },
  status: { zh: "当前步骤", en: "Current step" },
  account: { zh: "账户", en: "Account" },
  accountDesc: { zh: "填写账户信息", en: "Enter account details" },
  profile: { zh: "资料", en: "Profile" },
  profileDesc: { zh: "完善个人资料", en: "Complete your profile" },
  confirm: { zh: "确认", en: "Confirm" },
  confirmDesc: { zh: "检查并提交", en: "Review and submit" },
});

const items = () => [
  { title: t("account"), description: t("accountDesc"), content: t("accountDesc") },
  { title: t("profile"), description: t("profileDesc"), content: t("profileDesc") },
  { title: t("confirm"), description: t("confirmDesc"), content: t("confirmDesc") },
];
const onActive = (event: CustomEvent<number>): void => active.set(event.detail);
const onChange = (event: CustomEvent<{ active: number }>): void => active.set(event.detail.active);

const code = `<elf-steps
  show-panels
  :active.prop=\${active.value}
  :items.prop=\${items}
  @update:active=\${onActive}
/>`;
const script = `const active = useRef(0);
const items = [
  { title: "账户", description: "填写账户信息", content: "填写账户信息" },
  { title: "资料", description: "完善个人资料", content: "完善个人资料" },
  { title: "确认", description: "检查并提交", content: "检查并提交" }
];
const onActive = (event) => active.set(event.detail);`;

const PageStepsEx1 = defineHtml(`
  <h2>{{ t("heading") }}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <span slot="status" class="demo-state">{{ t("status") }}：{{ active + 1 }}</span>
    <elf-steps
      show-panels
      :active.prop=${active.value}
      :items.prop=${items()}
      @update:active=${onActive}
      @change=${onChange}
    ></elf-steps>
  </elf-playground>
`);

export { PageStepsEx1 };
