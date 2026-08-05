import { defineHtml, defineStyle, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const active = useRef(0);
const previousText = useRef("上一步");
const nextText = useRef("下一步");
const hideActions = useRef(false);
const editable = useRef(false);
const altLabels = useRef(false);

const t = createDocsTranslator({
  heading: { zh: "步骤操作台", en: "Stepper playground" },
  status: { zh: "当前步骤", en: "Current step" },
  controls: { zh: "步骤配置", en: "Stepper controls" },
  previous: { zh: "上一步文字", en: "Previous label" },
  next: { zh: "下一步文字", en: "Next label" },
  hide: { zh: "隐藏操作栏", en: "Hide actions" },
  editable: { zh: "允许任意步骤切换", en: "Editable steps" },
  alt: { zh: "替代标签布局", en: "Alternative labels" },
  create: { zh: "创建项目", en: "Create project" },
  createDesc: { zh: "填写基础信息", en: "Enter basic information" },
  createContent: {
    zh: "填写项目名称、归属团队和默认运行环境。",
    en: "Enter the project name, owning team, and default environment.",
  },
  configure: { zh: "配置能力", en: "Configure access" },
  configureDesc: { zh: "权限与资源", en: "Permissions and resources" },
  configureContent: {
    zh: "选择成员权限、资源范围与审批规则。",
    en: "Choose member permissions, resource scopes, and approval rules.",
  },
  publish: { zh: "发布上线", en: "Publish" },
  publishDesc: { zh: "检查并确认", en: "Review and confirm" },
  publishContent: {
    zh: "确认变更摘要后，将配置发布到生产环境。",
    en: "Review the changes, then publish the configuration to production.",
  },
});

const items = () => [
  { title: t("create"), description: t("createDesc"), content: t("createContent") },
  { title: t("configure"), description: t("configureDesc"), content: t("configureContent") },
  { title: t("publish"), description: t("publishDesc"), content: t("publishContent") },
];

const text = (event: CustomEvent): string => String(event.detail ?? "");
const flag = (event: CustomEvent): boolean => Boolean(event.detail);
const onActive = (event: CustomEvent<number>): void => active.set(event.detail);
const onChange = (event: CustomEvent<{ active: number }>): void => active.set(event.detail.active);
const onPreviousText = (event: CustomEvent): void => previousText.set(text(event));
const onNextText = (event: CustomEvent): void => nextText.set(text(event));
const onHideActions = (event: CustomEvent): void => hideActions.set(flag(event));
const onEditable = (event: CustomEvent): void => editable.set(flag(event));
const onAltLabels = (event: CustomEvent): void => altLabels.set(flag(event));

const code = `<elf-steps
  show-panels
  :items.prop=\${items}
  :active.prop=\${active.value}
  :previousText.prop=\${previousText.value}
  :nextText.prop=\${nextText.value}
  :hideActions.prop=\${hideActions.value}
  :editable.prop=\${editable.value}
  :altLabels.prop=\${altLabels.value}
  @update:active=\${onActive}
/>`;

const script = `const active = useRef(0);
const previousText = useRef("上一步");
const nextText = useRef("下一步");
const hideActions = useRef(false);
const editable = useRef(false);
const altLabels = useRef(false);

const items = [
  { title: "创建项目", description: "填写基础信息", content: "填写项目名称、归属团队和默认运行环境。" },
  { title: "配置能力", description: "权限与资源", content: "选择成员权限、资源范围与审批规则。" },
  { title: "发布上线", description: "检查并确认", content: "确认变更摘要后，将配置发布到生产环境。" }
];

const onActive = (event) => active.set(event.detail);`;

defineStyle(styles);

const PageStepsEx4 = defineHtml(`
  <h2>{{ t("heading") }}</h2>
  <elf-playground :title=${t("heading")} :code=${code} :script=${script}>
    <span slot="status" class="demo-state">{{ t("status") }}：{{ active + 1 }} / 3</span>
    <section class="steps-lab-preview">
      <elf-steps
        show-panels
        :items.prop=${items()}
        :active.prop=${active.value}
        :previousText.prop=${previousText.value}
        :nextText.prop=${nextText.value}
        :hideActions.prop=${hideActions.value}
        :editable.prop=${editable.value}
        :clickable.prop=${true}
        :altLabels.prop=${altLabels.value}
        @update:active=${onActive}
        @change=${onChange}
      ></elf-steps>
    </section>
    <aside slot="controls" class="steps-lab-config" :aria-label=${t("controls")}>
      <strong>{{ t("controls") }}</strong>
      <label><span>{{ t("previous") }}</span><elf-input variant="outlined" :modelValue.prop=${previousText.value} @update:modelValue=${onPreviousText}></elf-input></label>
      <label><span>{{ t("next") }}</span><elf-input variant="outlined" :modelValue.prop=${nextText.value} @update:modelValue=${onNextText}></elf-input></label>
      <elf-checkbox :modelValue.prop=${hideActions.value} :label=${t("hide")} @update:modelValue=${onHideActions}></elf-checkbox>
      <elf-checkbox :modelValue.prop=${editable.value} :label=${t("editable")} @update:modelValue=${onEditable}></elf-checkbox>
      <elf-checkbox :modelValue.prop=${altLabels.value} :label=${t("alt")} @update:modelValue=${onAltLabels}></elf-checkbox>
    </aside>
  </elf-playground>
`);

export { PageStepsEx4 };
