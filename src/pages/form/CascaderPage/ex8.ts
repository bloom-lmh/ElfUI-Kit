import { defineHtml, useHost, useReactive, useRef } from "@elfui/core";

import type { CascaderOption, CascaderPathValue } from "../../../components/Form/Cascader";
import type { FormRules } from "../../../components/Form";
import { createDocsPicker, createDocsTranslator } from "../../docsLocale";

interface FormHost extends HTMLElement {
  validate(): Promise<boolean>;
  resetFields(): void;
}

const lazyCode = `<elf-cascader
  :modelValue="value"
  :options.prop="options"
  :props.prop="lazyProps"
  @update:modelValue="onUpdate"
/>`;

const lazyScript = `const options = [
  { label: "Enterprise services", value: "enterprise" },
  { label: "Consumer business", value: "consumer" }
];

const value = useRef([]);
const onUpdate = (event) => value.set(event.detail);

const lazyProps = {
  lazy: true,
  lazyLoad(node, resolve, reject) {
    fetchTeams(node.pathValues).then(resolve).catch(reject);
  }
};`;

const treeCode = `<elf-form :model.prop="model" :rules.prop="rules">
  <elf-form-item prop="category" label="Release catalog" required>
    <elf-cascader
      :modelValue="model.category"
      :options.prop="options"
      panel-mode="auto"
      tree-threshold="3"
      :checkable="checkable"
      collapse-tags
      :max-collapse-tags="1"
      @update:modelValue="onUpdate"
    />
  </elf-form-item>
</elf-form>`;

const treeScript = `const model = useReactive({ category: [] });
const checkable = useRef(true);
const rules = {
  category: [{ required: true, message: "Choose a release catalog", trigger: "change" }]
};

const options = [{
  label: "Product engineering",
  value: "product",
  children: [{
    label: "Frontend platform",
    value: "frontend",
    children: [{
      label: "Design system",
      value: "design-system",
      children: [
        { label: "Stable", value: "stable" },
        { label: "Preview", value: "preview" }
      ]
    }]
  }]
}];

const onUpdate = (event) => {
  model.category = event.detail;
};`;

const pick = createDocsPicker();
const t = createDocsTranslator({
  asyncHeading: { zh: "异步数据", en: "Async data" },
  asyncTitle: { zh: "按需加载", en: "Lazy loading" },
  lazyIdle: { zh: "展开节点后按需请求下一级", en: "Expand a node to load its children" },
  loading: { zh: "正在加载团队…", en: "Loading teams…" },
  loaded: { zh: "子级已加载，可继续选择", en: "Children loaded. Continue selecting." },
  loadFailed: { zh: "加载失败，可点击节点重试", en: "Loading failed. Click the node to retry." },
  selected: { zh: "已选择", en: "Selected" },
  teamLabel: { zh: "所属团队", en: "Team" },
  teamPlaceholder: { zh: "按需加载团队", en: "Load teams on demand" },
  deepHeading: { zh: "深层数据", en: "Deep data" },
  deepTitle: { zh: "深层路径自动树化", en: "Automatic deep-path tree" },
  checkboxesReady: { zh: "树复选框已开启，可勾选父节点或叶子", en: "Tree checkboxes are on; choose a parent or leaf" },
  checkboxesOn: { zh: "树复选框已开启", en: "Tree checkboxes on" },
  singleTree: { zh: "单选树模式", en: "Single-select tree" },
  valid: { zh: "校验通过", en: "Validation passed" },
  invalid: { zh: "请选择完整目录", en: "Choose a complete catalog path" },
  resetDone: { zh: "已重置", en: "Reset" },
  checkbox: { zh: "复选框", en: "Checkboxes" },
  validate: { zh: "校验", en: "Validate" },
  reset: { zh: "重置", en: "Reset" },
  catalog: { zh: "发布目录", en: "Release catalog" },
  category: { zh: "分类路径", en: "Category path" },
  categoryPlaceholder: { zh: "选择发布目录", en: "Choose a release catalog" },
});

// state
const pageHost = useHost();
const lazyValue = useRef<CascaderPathValue>([]);
const lazyStatus = useRef(t("lazyIdle"));
const formStatus = useRef(t("checkboxesReady"));
const treeCheckable = useRef(true);
const model = useReactive({ category: [] as CascaderPathValue | CascaderPathValue[] });

const lazyOptions: CascaderOption[] = [
  { label: pick("企业服务", "Enterprise services"), value: "enterprise" },
  { label: pick("消费业务", "Consumer business"), value: "consumer" }
];

const lazyProps = {
  lazy: true,
  lazyLoad: (
    node: { pathValues?: CascaderPathValue },
    resolve: (children: CascaderOption[]) => void,
    reject: () => void
  ): void => {
    lazyStatus.set(t("loading"));
    setTimeout(() => {
      try {
        const root = String(node.pathValues?.[0] || "team");
        resolve([
          { label: pick("华东交付组", "East China delivery"), value: `${root}-east`, leaf: true },
          { label: pick("华南交付组", "South China delivery"), value: `${root}-south`, leaf: true }
        ]);
        lazyStatus.set(t("loaded"));
      } catch {
        reject();
        lazyStatus.set(t("loadFailed"));
      }
    }, 420);
  }
};

const deepOptions: CascaderOption[] = [
  {
    label: pick("产品研发", "Product engineering"),
    value: "product",
    children: [
      {
        label: pick("前端平台", "Frontend platform"),
        value: "frontend",
        children: [
          {
            label: pick("设计系统", "Design system"),
            value: "design-system",
            children: [
              { label: pick("稳定版", "Stable"), value: "stable" },
              { label: pick("预览版", "Preview"), value: "preview" }
            ]
          }
        ]
      }
    ]
  },
  { label: pick("业务运营", "Business operations"), value: "operation" }
];

const rules: FormRules = {
  category: [{ required: true, message: t("categoryPlaceholder"), trigger: "change" }]
};

// actions
const getForm = (): FormHost | null => pageHost.shadowRoot?.querySelector<FormHost>(".adaptive-form") ?? null;

const onLazyUpdate = (event: CustomEvent<CascaderPathValue>): void => {
  lazyValue.set(event.detail);
  lazyStatus.set(`${t("selected")} · ${event.detail.join(" / ")}`);
};

const onCategoryUpdate = (event: CustomEvent<CascaderPathValue | CascaderPathValue[]>): void => {
  model.category = event.detail;
  const paths = Array.isArray(event.detail[0])
    ? event.detail as CascaderPathValue[]
    : [event.detail as CascaderPathValue];
  formStatus.set(pick(`已选择 ${paths.length} 条路径`, `${paths.length} paths selected`));
};

const onCheckableUpdate = (event: CustomEvent<boolean>): void => {
  treeCheckable.set(Boolean(event.detail));
  model.category = [];
  formStatus.set(treeCheckable.value ? t("checkboxesOn") : t("singleTree"));
};

const submit = async (): Promise<void> => {
  const valid = await getForm()?.validate();
  formStatus.set(valid ? t("valid") : t("invalid"));
};

const reset = (): void => {
  getForm()?.resetFields();
  formStatus.set(t("resetDone"));
};

const PageCascaderEx8 = defineHtml(`
  <h2>${t("asyncHeading")}</h2>
    <elf-playground :title=${t("asyncTitle")} :code=${lazyCode} :script=${lazyScript}>
      <span slot="status" class="demo-state">{{ lazyStatus }}</span>
      <div style="width:min(100%,320px)">
        <elf-cascader
          :modelValue=${lazyValue}
          :options.prop=${lazyOptions}
          :props.prop=${lazyProps}
          :label=${t("teamLabel")}
          :placeholder=${t("teamPlaceholder")}
          :height=${136}
          fit-input-width
          @update:modelValue=${onLazyUpdate}
        ></elf-cascader>
      </div>
    </elf-playground>

    <h2>${t("deepHeading")}</h2>
    <elf-playground :title=${t("deepTitle")} :code=${treeCode} :script=${treeScript}>
      <span slot="status" style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
        <span class="demo-state">{{ formStatus }}</span>
        <span style="display:inline-flex;align-items:center;gap:6px">
          ${t("checkbox")}
          <elf-switch :modelValue.prop=${treeCheckable.value} @update:modelValue=${onCheckableUpdate}></elf-switch>
        </span>
        <elf-button size="small" color="primary" @click=${submit}>${t("validate")}</elf-button>
        <elf-button size="small" variant="outlined" @click=${reset}>${t("reset")}</elf-button>
      </span>
      <div style="width:min(100%,360px);padding:14px;border:1px solid var(--elf-border);border-radius:8px;background:var(--elf-bg-paper)">
        <elf-form class="adaptive-form" :model.prop=${model} :rules.prop=${rules} label-position="top">
          <elf-form-item prop="category" :label=${t("catalog")} required>
            <elf-cascader
              :modelValue=${model.category}
              :options.prop=${deepOptions}
              :label=${t("category")}
              :placeholder=${t("categoryPlaceholder")}
              panel-mode="auto"
              tree-threshold="3"
              :checkable.prop=${treeCheckable.value}
              :collapseTags.prop=${treeCheckable.value}
              :maxCollapseTags=${1}
              collapse-tags-tooltip
              fit-input-width
              @update:modelValue=${onCategoryUpdate}
            ></elf-cascader>
          </elf-form-item>
        </elf-form>
      </div>
    </elf-playground>
`);

export { PageCascaderEx8 };
