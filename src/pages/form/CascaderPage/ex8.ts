import { defineHtml, useHost, useReactive, useRef } from "@elfui/core";

import type { CascaderOption, CascaderPathValue } from "../../../components/Form/Cascader";
import type { FormRules } from "../../../components/Form";

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
  { label: "企业服务", value: "enterprise" },
  { label: "消费业务", value: "consumer" }
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
  <elf-form-item prop="category" label="发布目录" required>
    <elf-cascader
      :modelValue="model.category"
      :options.prop="options"
      panel-mode="auto"
      tree-threshold="3"
      :checkable="checkable"
      @update:modelValue="onUpdate"
    />
  </elf-form-item>
</elf-form>`;

const treeScript = `const model = useReactive({ category: [] });
const checkable = useRef(true);
const rules = {
  category: [{ required: true, message: "请选择发布目录", trigger: "change" }]
};

const options = [{
  label: "产品研发",
  value: "product",
  children: [{
    label: "前端平台",
    value: "frontend",
    children: [{
      label: "设计系统",
      value: "design-system",
      children: [
        { label: "稳定版", value: "stable" },
        { label: "预览版", value: "preview" }
      ]
    }]
  }]
}];

const onUpdate = (event) => {
  model.category = event.detail;
};`;

// state
const pageHost = useHost();
const lazyValue = useRef<CascaderPathValue>([]);
const lazyStatus = useRef("展开节点后按需请求下一级");
const formStatus = useRef("树复选框已开启，可勾选父节点或叶子");
const treeCheckable = useRef(true);
const model = useReactive({ category: [] as CascaderPathValue | CascaderPathValue[] });

const lazyOptions: CascaderOption[] = [
  { label: "企业服务", value: "enterprise" },
  { label: "消费业务", value: "consumer" }
];

const lazyProps = {
  lazy: true,
  lazyLoad: (
    node: { pathValues?: CascaderPathValue },
    resolve: (children: CascaderOption[]) => void,
    reject: () => void
  ): void => {
    lazyStatus.set("正在加载团队…");
    setTimeout(() => {
      try {
        const root = String(node.pathValues?.[0] || "team");
        resolve([
          { label: "华东交付组", value: `${root}-east`, leaf: true },
          { label: "华南交付组", value: `${root}-south`, leaf: true }
        ]);
        lazyStatus.set("子级已加载，可继续选择");
      } catch {
        reject();
        lazyStatus.set("加载失败，可点击节点重试");
      }
    }, 420);
  }
};

const deepOptions: CascaderOption[] = [
  {
    label: "产品研发",
    value: "product",
    children: [
      {
        label: "前端平台",
        value: "frontend",
        children: [
          {
            label: "设计系统",
            value: "design-system",
            children: [
              { label: "稳定版", value: "stable" },
              { label: "预览版", value: "preview" }
            ]
          }
        ]
      }
    ]
  },
  { label: "业务运营", value: "operation" }
];

const rules: FormRules = {
  category: [{ required: true, message: "请选择发布目录", trigger: "change" }]
};

// actions
const getForm = (): FormHost | null => pageHost.shadowRoot?.querySelector<FormHost>(".adaptive-form") ?? null;

const onLazyUpdate = (event: CustomEvent<CascaderPathValue>): void => {
  lazyValue.set(event.detail);
  lazyStatus.set(`已选择：${event.detail.join(" / ")}`);
};

const onCategoryUpdate = (event: CustomEvent<CascaderPathValue | CascaderPathValue[]>): void => {
  model.category = event.detail;
  const paths = Array.isArray(event.detail[0])
    ? event.detail as CascaderPathValue[]
    : [event.detail as CascaderPathValue];
  formStatus.set(`已选择 ${paths.length} 条路径`);
};

const onCheckableUpdate = (event: CustomEvent<boolean>): void => {
  treeCheckable.set(Boolean(event.detail));
  model.category = [];
  formStatus.set(treeCheckable.value ? "树复选框已开启" : "单选树模式");
};

const submit = async (): Promise<void> => {
  const valid = await getForm()?.validate();
  formStatus.set(valid ? "校验通过" : "请选择完整目录");
};

const reset = (): void => {
  getForm()?.resetFields();
  formStatus.set("已重置");
};

const PageCascaderEx8 = defineHtml(`
  <h2>异步与深层数据</h2>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,380px),520px));gap:16px;align-items:start;justify-content:start">
    <elf-playground title="异步加载" :code=${lazyCode} :script=${lazyScript}>
      <span slot="status" class="demo-state">{{ lazyStatus }}</span>
      <div style="width:min(100%,320px)">
        <elf-cascader
          :modelValue=${lazyValue}
          :options.prop=${lazyOptions}
          :props.prop=${lazyProps}
          label="所属团队"
          placeholder="按需加载团队"
          fit-input-width
          @update:modelValue=${onLazyUpdate}
        ></elf-cascader>
      </div>
    </elf-playground>

    <elf-playground title="深层路径自动树化" :code=${treeCode} :script=${treeScript}>
      <span slot="status" style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
        <span class="demo-state">{{ formStatus }}</span>
        <span style="display:inline-flex;align-items:center;gap:6px">
          复选框
          <elf-switch :modelValue.prop=${treeCheckable.value} @update:modelValue=${onCheckableUpdate}></elf-switch>
        </span>
        <elf-button size="small" color="primary" @click=${submit}>校验</elf-button>
        <elf-button size="small" variant="outlined" @click=${reset}>重置</elf-button>
      </span>
      <div style="width:min(100%,360px);padding:14px;border:1px solid var(--elf-border);border-radius:8px;background:var(--elf-bg-paper)">
        <elf-form class="adaptive-form" :model.prop=${model} :rules.prop=${rules} label-position="top">
          <elf-form-item prop="category" label="发布目录" required>
            <elf-cascader
              :modelValue=${model.category}
              :options.prop=${deepOptions}
              label="分类路径"
              placeholder="选择发布目录"
              panel-mode="auto"
              tree-threshold="3"
              :checkable.prop=${treeCheckable.value}
              fit-input-width
              @update:modelValue=${onCategoryUpdate}
            ></elf-cascader>
          </elf-form-item>
        </elf-form>
      </div>
    </elf-playground>
  </div>
`);

export { PageCascaderEx8 };
