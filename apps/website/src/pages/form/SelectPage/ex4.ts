import { defineHtml, useRef } from "@elfui/core";

import type { SelectOption } from "@elfui/kit";
import { createDocsTranslator } from "../../docsLocale";
import { optionFields, opts } from "./shared";

const remoteOptions = useRef<SelectOption[]>([]);
const remoteLoading = useRef(false);

const t = createDocsTranslator({
  title: { zh: "搜索与字段映射", en: "Search and field mapping" },
  create: { zh: "输入后可创建", en: "Type to create" },
  remote: { zh: "搜索城市", en: "Search cities" },
  mapped: { zh: "自定义字段", en: "Custom fields" },
  designer: { zh: "设计师", en: "Designer" },
  engineer: { zh: "工程师", en: "Engineer" },
  product: { zh: "产品经理", en: "Product manager" },
  quality: { zh: "测试工程师", en: "QA engineer" },
  beijing: { zh: "北京", en: "Beijing" },
  shanghai: { zh: "上海", en: "Shanghai" },
  shenzhen: { zh: "深圳", en: "Shenzhen" },
  hangzhou: { zh: "杭州", en: "Hangzhou" },
  chengdu: { zh: "成都", en: "Chengdu" },
});

const customOptions = () => [
  { id: "designer", name: t("designer") },
  { id: "engineer", name: t("engineer") },
  { id: "pm", name: t("product"), locked: true },
  { id: "qa", name: t("quality") },
];

const remoteSource = (): SelectOption[] => [
  { value: "beijing", label: t("beijing") },
  { value: "shanghai", label: t("shanghai") },
  { value: "shenzhen", label: t("shenzhen") },
  { value: "hangzhou", label: t("hangzhou") },
  { value: "chengdu", label: t("chengdu") },
];

const remoteMethod = (query: string): void => {
  remoteLoading.set(true);
  const keyword = String(query || "")
    .trim()
    .toLowerCase();
  window.setTimeout(() => {
    remoteOptions.set(
      remoteSource().filter(
        (item) =>
          String(item.label ?? "")
            .toLowerCase()
            .includes(keyword) || String(item.value).includes(keyword),
      ),
    );
    remoteLoading.set(false);
  }, 260);
};

const code = `<elf-select filterable allow-create default-first-option />

<elf-select
  :options.prop="remoteOptions"
  :loading="remoteLoading"
  filterable
  remote
  :remoteMethod.prop="remoteMethod"
/>

<elf-select
  :options.prop="customOptions"
  :props.prop="{ value: 'id', label: 'name', disabled: 'locked' }"
  value-key="id"
/>`;

const script = `const remoteOptions = useRef([]);
const remoteLoading = useRef(false);
const remoteMethod = async (query) => {
  remoteLoading.set(true);
  remoteOptions.set(await searchCities(query));
  remoteLoading.set(false);
};`;

const PageSelectEx4 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <div style="display:flex;align-items:center;justify-content:center;gap:16px;flex-wrap:wrap;width:100%">
      <elf-select style="width:240px"
        :options.prop=${opts}
        filterable
        allow-create
        default-first-option
        :placeholder=${t("create")}
      ></elf-select>
      <elf-select style="width:240px"
        :options.prop=${remoteOptions.value}
        :loading=${remoteLoading.value}
        filterable
        remote
        :remoteMethod.prop=${remoteMethod}
        :placeholder=${t("remote")}
      ></elf-select>
      <elf-select style="width:240px"
        :options.prop=${customOptions()}
        :props.prop=${optionFields}
        value-key="id"
        :placeholder=${t("mapped")}
      ></elf-select>
    </div>
  </elf-playground>
`);

export { PageSelectEx4 };
