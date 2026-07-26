import { defineHtml, defineStyle, useHost, useReactive, useRef } from "@elfui/core";

import type { FormRules } from "../../../components/Form";
import demoStyles from "./demo.scss?inline";

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

const getForm = (): FormHost | null => pageHost.shadowRoot?.querySelector<FormHost>("elf-form") ?? null;

const message = useRef("等待提交");

const model = useReactive({
  project: "",
  owner: "",
  desc: ""
});

const rules: FormRules = {
  project: [
    { required: true, message: "请输入项目名称", trigger: "blur" },
    {
      trigger: "blur",
      validator: async (value) => {
        await new Promise((resolve) => setTimeout(resolve, 320));
        return ["elfui", "admin"].includes(String(value).toLowerCase())
          ? "该项目名称已被占用"
          : true;
      }
    }
  ],
  owner: [{ required: true, message: "请选择负责人", trigger: "change" }],
  desc: [{ min: 6, message: "至少 6 个字符", trigger: "change" }]
};

const owners = [
  { label: "林舟", value: "lin" },
  { label: "周然", value: "zhou" },
  { label: "许宁", value: "xu" }
];

const submit = async (): Promise<void> => {
  message.set("正在校验项目名称…");
  const ok = await getForm()?.validate();
  message.set(ok ? `已提交：${model.project}` : "校验未通过");
};

const validateProject = async (): Promise<void> => {
  message.set("正在检查项目名称…");
  const ok = await getForm()?.validateField("project");
  message.set(ok ? "项目名称可以使用" : "请修改项目名称");
};

const reset = (): void => {
  getForm()?.resetFields();
  message.set("已重置");
};

const clear = (): void => {
  getForm()?.clearValidate();
  message.set("已清除校验状态");
};

const scrollProject = (): void => {
  getForm()?.scrollToField("project", { behavior: "smooth", block: "center" });
  message.set("已定位到项目名称");
};

const saveBaseline = (): void => {
  const form = getForm();
  form?.setInitialValues(model);
  message.set(`已保存重置基线 · ${form?.fields.length ?? 0} 个字段`);
};

const code = `<elf-form
  ref="projectForm"
  :model.prop="model"
  :rules.prop="rules"
  scroll-to-error
  status-icon
  require-asterisk-position="right"
>
  <elf-form-item prop="project" label="项目名称" required>
    <elf-input v-model="model.project" />
  </elf-form-item>
</elf-form>`;

const script = `const formRef = useTemplateRef("projectForm");
const model = useReactive({ project: "", owner: "", desc: "" });

const rules = {
  project: [
    { required: true, message: "请输入项目名称", trigger: "blur" },
    {
      trigger: "blur",
      validator: async (value) => {
        await new Promise((resolve) => setTimeout(resolve, 320));
        return ["elfui", "admin"].includes(String(value).toLowerCase())
          ? "该项目名称已被占用"
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
  <h2>提交校验</h2>
  <elf-playground title="异步校验、滚动首错与命令方法" :code=${code} :script=${script}>
    <p slot="status" class="demo-state">{{ message }}</p>
    <elf-card
      class="form-demo-card"
      variant="outlined"
      title="新建项目"
      subtitle="校验结果与操作按钮保持在同一张 Card 中"
    >
      <elf-form
        :model.prop="model"
        :rules.prop="rules"
        label-position="top"
        scroll-to-error
        status-icon
        require-asterisk-position="right"
      >
        <elf-form-item prop="project" label="项目名称" required>
          <elf-input v-model="model.project" placeholder="请输入项目名称"></elf-input>
        </elf-form-item>
        <elf-form-item prop="owner" label="负责人" required>
          <elf-select
            v-model="model.owner"
            :options.prop="owners"
            placeholder="请选择负责人"
          ></elf-select>
        </elf-form-item>
        <elf-form-item prop="desc" label="说明">
          <elf-textarea v-model="model.desc" rows="3" placeholder="至少 6 个字符"></elf-textarea>
        </elf-form-item>
      </elf-form>
      <div class="form-demo-actions">
        <elf-button type="primary" @click="submit()">提交</elf-button>
        <elf-button @click="validateProject()">只校验项目名</elf-button>
        <elf-button @click="reset()">重置</elf-button>
        <elf-button @click="clear()">清除校验</elf-button>
        <elf-button @click=${scrollProject}>定位项目名</elf-button>
        <elf-button @click=${saveBaseline}>设为重置基线</elf-button>
      </div>
    </elf-card>
  </elf-playground>
`);

export { PageFormEx3 };
