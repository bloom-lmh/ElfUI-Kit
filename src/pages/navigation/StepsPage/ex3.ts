import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const active = useRef(0);
const t = createDocsTranslator({
  heading: { zh: "组合式步骤", en: "Composed steps" },
  title: { zh: "自定义步骤内容", en: "Custom step content" },
  status: { zh: "当前步骤", en: "Current step" },
  create: { zh: "创建项目", en: "Create project" },
  createDesc: { zh: "填写基础配置", en: "Enter the basics" },
  configure: { zh: "配置能力", en: "Configure access" },
  configureDesc: { zh: "选择权限范围", en: "Choose permissions" },
  publish: { zh: "发布上线", en: "Publish" },
  publishDesc: { zh: "确认并开始使用", en: "Confirm and launch" }
});
const onActive = (event: CustomEvent<number>): void => active.set(event.detail);
const onChange = (event: CustomEvent<{ active: number }>): void => active.set(event.detail.active);

const code = `<elf-steps :active.prop=\${active.value} @update:active=\${onActive}>
  <elf-step title="创建项目" description="填写基础配置" />
  <elf-step title="配置能力">
    <span slot="icon">2</span>
    <span slot="description">选择权限范围</span>
  </elf-step>
  <elf-step title="发布上线" description="确认并开始使用" />
</elf-steps>`;
const script = `const active = useRef(0);
const onActive = (event) => active.set(event.detail);`;

const PageStepsEx3 = defineHtml(`
  <h2>{{ t("heading") }}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <span slot="status" class="demo-state">{{ t("status") }}：{{ active + 1 }}</span>
    <elf-steps :active.prop=${active.value} @update:active=${onActive} @change=${onChange}>
      <elf-step :title.prop=${t("create")} :description.prop=${t("createDesc")}></elf-step>
      <elf-step :title.prop=${t("configure")}>
        <span slot="icon">2</span>
        <span slot="description">{{ t("configureDesc") }}</span>
      </elf-step>
      <elf-step :title.prop=${t("publish")} :description.prop=${t("publishDesc")}></elf-step>
    </elf-steps>
  </elf-playground>
`);

export { PageStepsEx3 };
