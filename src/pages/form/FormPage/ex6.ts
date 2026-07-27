import { defineHtml, defineStyle, useReactive } from "@elfui/core";

import type { FormRule } from "../../../components/Form";
import demoStyles from "./demo.scss?inline";

interface DomainEntry {
  key: number;
  value: string;
}

const model = useReactive({
  domains: [
    { key: 1, value: "api.elfui.dev" },
    { key: 2, value: "docs.elfui.dev" }
  ] as DomainEntry[]
});

const domainRules: FormRule[] = [
  { required: true, message: "请输入域名", trigger: "blur" },
  { pattern: /^(?:[a-z0-9-]+\.)+[a-z]{2,}$/i, message: "域名格式不正确", trigger: "blur" }
];

let nextKey = 3;

const addDomain = (): void => {
  model.domains.push({ key: nextKey++, value: "" });
};

const domainValue = (domain: DomainEntry): string => String(domain.value ?? "");

const removeDomain = (domain: DomainEntry): void => {
  if (model.domains.length === 1) return;
  const index = model.domains.findIndex((item) => item.key === domain.key);
  if (index >= 0) model.domains.splice(index, 1);
};

const updateDomain = (domain: DomainEntry, event: CustomEvent<string>): void => {
  const entry = model.domains.find((item) => item.key === domain.key);
  if (entry) entry.value = String(event.detail ?? "");
};

const code = `<div v-for="(domain, index) in model.domains" :key="domain.key">
  <elf-form-item :prop="'domains.' + index + '.value'" :rules.prop=\${domainRules}>
    <elf-input
      :modelValue="domainValue(domain)"
      @update:modelValue="updateDomain(domain, $event)"
    />
  </elf-form-item>
</div>`;

const script = `const addDomain = () => model.domains.push({ key: nextKey++, value: "" });
const removeDomain = (domain) => model.domains.splice(model.domains.findIndex((item) => item.key === domain.key), 1);

const domainRules = [
    { required: true, message: "请输入域名", trigger: "blur" },
    { pattern: /^(?:[a-z0-9-]+\\.)+[a-z]{2,}$/i, message: "域名格式不正确", trigger: "blur" }
];
const domainValue = (domain) => String(domain.value ?? "");
const updateDomain = (domain, event) => {
    const entry = model.domains.find((item) => item.key === domain.key);
    if (entry)
        entry.value = String(event.detail ?? "");
};`;

defineStyle(demoStyles);

const PageFormEx6 = defineHtml(`
  <h2>动态字段</h2>
  <elf-playground title="动态增删与字段级规则" :code=${code} :script=${script}>
    <span slot="status" class="demo-state">共 {{ model.domains.length }} 个域名</span>
    <elf-card
      class="form-demo-card"
      variant="outlined"
      title="允许访问的域名"
      subtitle="字段路径和校验规则会随列表索引同步"
    >
      <elf-form :model.prop=${model} label-position="top">
        <div class="dynamic-list">
          <div v-for="(domain, index) in model.domains" :key="domain.key" class="dynamic-row">
            <elf-form-item
              :prop="'domains.' + index + '.value'"
              :label="'域名 ' + (index + 1)"
              :rules.prop=${domainRules}
            >
              <elf-input
                :modelValue="domainValue(domain)"
                placeholder="example.elfui.dev"
                clearable
                @update:modelValue="updateDomain(domain, $event)"
              />
            </elf-form-item>
            <elf-button
              style="margin-top:26px"
              :disabled="model.domains.length === 1"
              @click="removeDomain(domain)"
            >移除</elf-button>
          </div>
        </div>
        <div class="form-demo-actions">
          <elf-button type="primary" plain @click=${addDomain}>添加域名</elf-button>
        </div>
      </elf-form>
    </elf-card>
  </elf-playground>
`);

export { PageFormEx6 };
