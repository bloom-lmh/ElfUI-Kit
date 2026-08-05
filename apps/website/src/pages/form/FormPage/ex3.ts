import { defineHtml, defineStyle, useHost, useReactive, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

import type { FormRules } from "@elfui/kit-src/components/Form";
import demoStyles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "提交校验", en: "Submit validation" },
  playground: {
    zh: "异步校验、滚动首错与命令方法",
    en: "Async validation, scroll-to-error, and command methods",
  },
  waiting: { zh: "等待提交", en: "Waiting to submit" },
  project: { zh: "项目名称", en: "Project name" },
  projectRequired: { zh: "请输入项目名称", en: "Enter a project name" },
  occupied: { zh: "该项目名称已被占用", en: "This project name is already in use" },
  owner: { zh: "负责人", en: "Owner" },
  ownerRequired: { zh: "请选择负责人", en: "Select an owner" },
  desc: { zh: "说明", en: "Description" },
  descMin: { zh: "至少 6 个字符", en: "At least 6 characters" },
  validating: { zh: "正在校验项目名称…", en: "Validating the project name…" },
  submitted: { zh: "已提交", en: "Submitted" },
  invalid: { zh: "校验未通过", en: "Validation failed" },
  checking: { zh: "正在检查项目名称…", en: "Checking the project name…" },
  available: { zh: "项目名称可以使用", en: "Project name is available" },
  change: { zh: "请修改项目名称", en: "Change the project name" },
  resetDone: { zh: "已重置", en: "Reset complete" },
  cleared: { zh: "已清除校验状态", en: "Validation state cleared" },
  located: { zh: "已定位到项目名称", en: "Project name located" },
  baseline: { zh: "已保存重置基线", en: "Reset baseline saved" },
  fields: { zh: "个字段", en: "fields" },
  card: { zh: "新建项目", en: "Create project" },
  subtitle: {
    zh: "校验与操作",
    en: "Validation and actions",
  },
  selectOwner: { zh: "请选择负责人", en: "Select an owner" },
  submit: { zh: "提交", en: "Submit" },
  validateOnly: { zh: "只校验项目名", en: "Validate project only" },
  reset: { zh: "重置", en: "Reset" },
  clear: { zh: "清除校验", en: "Clear validation" },
  locate: { zh: "定位项目名", en: "Locate project" },
  setBaseline: { zh: "设为重置基线", en: "Set reset baseline" },
  lin: { zh: "林舟", en: "Lin Zhou" },
  zhou: { zh: "周然", en: "Zhou Ran" },
  xu: { zh: "许宁", en: "Xu Ning" },
});

interface FormHost extends HTMLElement {
  validate(): Promise<boolean>;
  validateField(prop: string | string[]): Promise<boolean>;
  resetFields(prop?: string | string[]): void;
  clearValidate(prop?: string | string[]): void;
  scrollToField(prop: string, options?: ScrollIntoViewOptions | boolean): void;
  getField(prop: string): { state: string; message: string } | undefined;
  setInitialValues(values?: Record<string, unknown>): void;
  readonly fields: readonly unknown[];
}

const pageHost = useHost();

const getForm = (): FormHost | null =>
  pageHost.shadowRoot?.querySelector<FormHost>("elf-form") ?? null;

const message = useRef(t("waiting"));

const model = useReactive({
  project: "",
  owner: "",
  desc: "",
});

const rules: FormRules = {
  project: [
    { required: true, message: t("projectRequired"), trigger: "blur" },
    {
      trigger: "blur",
      validator: async (value) => {
        await new Promise((resolve) => setTimeout(resolve, 320));
        return ["elfui", "admin"].includes(String(value).toLowerCase()) ? t("occupied") : true;
      },
    },
  ],
  owner: [{ required: true, message: t("ownerRequired"), trigger: "change" }],
  desc: [{ min: 6, message: t("descMin"), trigger: "change" }],
};

const owners = [
  { label: t("lin"), value: "lin" },
  { label: t("zhou"), value: "zhou" },
  { label: t("xu"), value: "xu" },
];

const submit = async (): Promise<void> => {
  message.set(t("validating"));
  const ok = await getForm()?.validate();
  message.set(ok ? `${t("submitted")}：${model.project}` : t("invalid"));
};

const validateProject = async (): Promise<void> => {
  message.set(t("checking"));
  const ok = await getForm()?.validateField("project");
  message.set(ok ? t("available") : t("change"));
};

const reset = (): void => {
  getForm()?.resetFields();
  message.set(t("resetDone"));
};

const clear = (): void => {
  getForm()?.clearValidate();
  message.set(t("cleared"));
};

const scrollProject = (): void => {
  getForm()?.scrollToField("project", { behavior: "smooth", block: "center" });
  message.set(t("located"));
};

const saveBaseline = (): void => {
  const form = getForm();
  form?.setInitialValues(model);
  message.set(`${t("baseline")} · ${form?.fields.length ?? 0} ${t("fields")}`);
};

const code = `<elf-form
  ref="projectForm"
  :model.prop="model"
  :rules.prop="rules"
  scroll-to-error
  status-icon
  require-asterisk-position="right"
>
  <elf-form-item prop="project" label="${t("project")}" required>
    <elf-input v-model="model.project" />
  </elf-form-item>
</elf-form>`;

const script = `const formRef = useTemplateRef("projectForm");
const model = useReactive({ project: "", owner: "", desc: "" });

const rules = {
  project: [
    { required: true, message: "${t("projectRequired")}", trigger: "blur" },
    {
      trigger: "blur",
      validator: async (value) => {
        await new Promise((resolve) => setTimeout(resolve, 320));
        return ["elfui", "admin"].includes(String(value).toLowerCase())
          ? "${t("occupied")}"
          : true;
      }
    }
  ]
};

const submit = async () => {
  const valid = await formRef.value?.validate();
};
const validateProject = () => formRef.value?.validateField("project");
const reset = () => formRef.value?.resetFields();
const clear = () => formRef.value?.clearValidate();
const scrollProject = () => formRef.value?.scrollToField("project");
const saveBaseline = () => formRef.value?.setInitialValues(model);`;

defineStyle(demoStyles);

const PageFormEx3 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("playground")} :code=${code} :script=${script}>
    <p slot="status" class="demo-state">{{ message }}</p>
    <elf-card
      class="form-demo-card"
      variant="outlined"
      :title=${t("card")}
      :subtitle=${t("subtitle")}
    >
      <elf-form
        :model.prop="model"
        :rules.prop="rules"
        label-position="top"
        scroll-to-error
        status-icon
        require-asterisk-position="right"
      >
        <elf-form-item prop="project" :label=${t("project")} required>
          <elf-input v-model="model.project" :placeholder=${t("projectRequired")}></elf-input>
        </elf-form-item>
        <elf-form-item prop="owner" :label=${t("owner")} required>
          <elf-select
            v-model="model.owner"
            :options.prop="owners"
            :placeholder=${t("selectOwner")}
          ></elf-select>
        </elf-form-item>
        <elf-form-item prop="desc" :label=${t("desc")}>
          <elf-textarea v-model="model.desc" rows="3" :placeholder=${t("descMin")}></elf-textarea>
        </elf-form-item>
      </elf-form>
      <div class="form-demo-actions">
        <elf-button type="primary" @click="submit()">${t("submit")}</elf-button>
        <elf-button @click="validateProject()">${t("validateOnly")}</elf-button>
        <elf-button @click="reset()">${t("reset")}</elf-button>
        <elf-button @click="clear()">${t("clear")}</elf-button>
        <elf-button @click=${scrollProject}>${t("locate")}</elf-button>
        <elf-button @click=${saveBaseline}>${t("setBaseline")}</elf-button>
      </div>
    </elf-card>
  </elf-playground>
`);

export { PageFormEx3 };
