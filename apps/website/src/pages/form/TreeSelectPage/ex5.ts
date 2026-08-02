import { defineHtml, defineStyle, useReactive, useRef, useTemplateRef } from "@elfui/core";

import type { FormRules } from "@elfui/kit-src/components/Form";
import type { TreeNode } from "@elfui/kit-src/components/Data/Tree/types";
import { createDocsTranslator } from "../../docsLocale";
import demoStyles from "./demo.scss?inline";

interface FormHost extends HTMLElement {
  validate(): Promise<boolean>;
}

const formRef = useTemplateRef("treeSelectForm") as {
  readonly value: FormHost | null;
};
const form = useReactive({ team: "" });
const result = useRef("");
const t = createDocsTranslator({
  title: {
    zh: "表单、禁用与字段映射",
    en: "Form, disabled state, and field mapping",
  },
  field: { zh: "发布团队", en: "Release team" },
  placeholder: { zh: "选择发布团队", en: "Choose a release team" },
  required: { zh: "请选择发布团队", en: "Choose a release team." },
  submit: { zh: "校验表单", en: "Validate form" },
  passed: { zh: "校验通过", en: "Validation passed" },
  failed: { zh: "请完成必填项", en: "Complete the required field" },
  engineering: { zh: "研发组织", en: "Engineering organization" },
  frontend: { zh: "前端平台", en: "Frontend platform" },
  backend: { zh: "服务端平台", en: "Backend platform" },
  archived: { zh: "归档团队（禁用）", en: "Archived team (disabled)" },
  disabled: { zh: "全局禁用预览", en: "Disabled preview" },
});

const fieldNames = {
  key: "code",
  label: "title",
  children: "nodes",
  disabled: "inactive",
};
const nodes = (): TreeNode[] => [
  {
    code: "engineering",
    title: t("engineering"),
    nodes: [
      { code: "frontend", title: t("frontend") },
      { code: "backend", title: t("backend") },
      { code: "archived", title: t("archived"), inactive: true },
    ],
  },
];
const rules = (): FormRules => ({
  team: [{ required: true, message: t("required"), trigger: "change" }],
});
const updateTeam = (event: CustomEvent<string>): void => {
  form.team = event.detail;
};
const submit = async (): Promise<void> => {
  const valid = await formRef.value?.validate();
  result.set(valid ? t("passed") : t("failed"));
};

const code = `<elf-form ref="form" :model.prop="form" :rules.prop="rules" label-position="top">
  <elf-form-item prop="team" label="Release team" required>
    <elf-tree-select
      :data.prop="nodes"
      :props.prop="fieldNames"
      value-key="code"
      :modelValue="form.team"
      @update:modelValue="form.team = $event.detail"
    />
  </elf-form-item>
</elf-form>`;

const script = `const form = useReactive({ team: "" });
const fieldNames = {
  key: "code",
  label: "title",
  children: "nodes",
  disabled: "inactive",
};
const rules = {
  team: [{ required: true, message: "Choose a release team.", trigger: "change" }],
};`;

defineStyle(demoStyles);

const PageTreeSelectEx5 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <div class="form-card">
      <elf-form ref="treeSelectForm" :model.prop=${form} :rules.prop=${rules()} label-position="top">
        <elf-form-item prop="team" :label=${t("field")} required>
          <elf-tree-select :data.prop=${nodes()} :props.prop=${fieldNames} value-key="code"
            :modelValue=${form.team} :placeholder=${t("placeholder")} clearable default-expand-all
            @update:modelValue=${updateTeam}></elf-tree-select>
        </elf-form-item>
      </elf-form>
      <div class="form-actions"><elf-button type="primary" @click=${submit}>${t("submit")}</elf-button></div>
      <p v-if=${result} class="demo-note">${result.value}</p>
    </div>
    <div slot="controls" class="demo-column" style="width:240px">
      <strong>${t("disabled")}</strong>
      <elf-tree-select :data.prop=${nodes()} :props.prop=${fieldNames} value-key="code"
        model-value="frontend" disabled></elf-tree-select>
    </div>
  </elf-playground>
`);

export { PageTreeSelectEx5 };
