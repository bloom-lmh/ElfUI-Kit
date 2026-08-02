import { defineHtml, defineStyle, useReactive } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

import type { FormRule } from "@elfui/kit-src/components/Form";
import demoStyles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "动态字段", en: "Dynamic fields" },
  playground: {
    zh: "动态增删与字段级规则",
    en: "Dynamic additions, removals, and field-level rules",
  },
  required: { zh: "请输入域名", en: "Enter a domain" },
  invalid: { zh: "域名格式不正确", en: "Invalid domain format" },
  count: { zh: "共", en: "Total" },
  domains: { zh: "个域名", en: "domains" },
  card: { zh: "允许访问的域名", en: "Allowed domains" },
  subtitle: {
    zh: "字段路径和校验规则会随列表索引同步",
    en: "Field paths and validation rules stay synchronized with list indexes.",
  },
  domain: { zh: "域名", en: "Domain" },
  remove: { zh: "移除", en: "Remove" },
  add: { zh: "添加域名", en: "Add domain" },
});
interface DomainEntry {
  key: number;
  value: string;
}

const model = useReactive({
  domains: [
    { key: 1, value: "api.elfui.dev" },
    { key: 2, value: "docs.elfui.dev" },
  ] as DomainEntry[],
});

const domainRules: FormRule[] = [
  { required: true, message: t("required"), trigger: "blur" },
  { pattern: /^(?:[a-z0-9-]+\.)+[a-z]{2,}$/i, message: t("invalid"), trigger: "blur" },
];

let nextKey = 3;

const addDomain = (): void => {
  model.domains.push({ key: nextKey++, value: "" });
};

const domainValue = (domain: DomainEntry): string => String(domain.value ?? "");
const domainLabel = (index: number): string => `${t("domain")} ${index + 1}`;

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
    { required: true, message: "${t("required")}", trigger: "blur" },
    { pattern: /^(?:[a-z0-9-]+\\.)+[a-z]{2,}$/i, message: "${t("invalid")}", trigger: "blur" }
];
const domainValue = (domain) => String(domain.value ?? "");
const updateDomain = (domain, event) => {
    const entry = model.domains.find((item) => item.key === domain.key);
    if (entry)
        entry.value = String(event.detail ?? "");
};`;

defineStyle(demoStyles);

const PageFormEx6 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("playground")} :code=${code} :script=${script}>
    <span slot="status" class="demo-state">${t("count")} {{ model.domains.length }} ${t("domains")}</span>
    <elf-card
      class="form-demo-card"
      variant="outlined"
      :title=${t("card")}
      :subtitle=${t("subtitle")}
    >
      <elf-form :model.prop=${model} label-position="top">
        <div class="dynamic-list">
          <div v-for="(domain, index) in model.domains" :key="domain.key" class="dynamic-row">
            <elf-form-item
              :prop="'domains.' + index + '.value'"
              :label="domainLabel(index)"
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
            >${t("remove")}</elf-button>
          </div>
        </div>
        <div class="form-demo-actions">
          <elf-button type="primary" plain @click=${addDomain}>${t("add")}</elf-button>
        </div>
      </elf-form>
    </elf-card>
  </elf-playground>
`);

export { PageFormEx6 };
