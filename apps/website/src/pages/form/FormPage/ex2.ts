import { defineHtml, defineStyle, useReactive, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

import demoStyles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "行内筛选", en: "Inline filtering" },
  waiting: { zh: "等待筛选", en: "Waiting for filters" },
  all: { zh: "全部", en: "All" },
  allStatus: { zh: "全部状态", en: "All statuses" },
  running: { zh: "运行中", en: "Running" },
  maintenance: { zh: "维护中", en: "Maintenance" },
  warning: { zh: "告警", en: "Warning" },
  filter: { zh: "筛选", en: "Filters" },
  mine: { zh: "只看我", en: "Only mine" },
  owners: { zh: "全部负责人", en: "All owners" },
  card: { zh: "服务筛选", en: "Service filters" },
  subtitle: {
    zh: "紧凑条件区",
    en: "Compact conditions",
  },
  keyword: { zh: "关键词", en: "Keyword" },
  keywordHint: { zh: "服务名或负责人", en: "Service or owner" },
  status: { zh: "状态", en: "Status" },
});

const query = useReactive({
  keyword: "",
  status: "",
  onlyMine: true,
});

const result = useRef(t("waiting"));

const statusOptions = [
  { label: t("allStatus"), value: "" },
  { label: t("running"), value: "running" },
  { label: t("maintenance"), value: "maintenance" },
  { label: t("warning"), value: "warning" },
];

const search = (): void => {
  result.set(
    `${t("filter")}：${query.keyword || t("all")} / ${query.status || t("allStatus")} / ${query.onlyMine ? t("mine") : t("owners")}`,
  );
};

const code = `<elf-form :model.prop="query" inline label-position="left">
  <elf-form-item label="${t("keyword")}"><elf-input v-model="query.keyword" /></elf-form-item>
  <elf-form-item label="${t("status")}"><elf-select v-model="query.status" :options.prop="statusOptions" /></elf-form-item>
</elf-form>`;

const script = `const query = useReactive({
    keyword: "",
    status: "",
    onlyMine: true
});
const statusOptions = [
    { label: "${t("allStatus")}", value: "" },
    { label: "${t("running")}", value: "running" },
    { label: "${t("maintenance")}", value: "maintenance" },
    { label: "${t("warning")}", value: "warning" }
];`;

defineStyle(demoStyles);

const PageFormEx2 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground title="inline / select / switch" :code="code" :script=${script}>
    <p slot="status" class="demo-state">{{ result }}</p>
    <elf-card
      class="form-demo-card is-wide"
      variant="outlined"
      :title=${t("card")}
      :subtitle=${t("subtitle")}
    >
      <elf-form :model.prop="query" inline label-position="left" label-width="72px">
        <elf-form-item class="inline-filter-item inline-filter-keyword" :label=${t("keyword")}>
          <elf-input v-model="query.keyword" :placeholder=${t("keywordHint")} clearable></elf-input>
        </elf-form-item>
        <elf-form-item class="inline-filter-item inline-filter-status" :label=${t("status")}>
          <elf-select v-model="query.status" :options.prop="statusOptions" clearable></elf-select>
        </elf-form-item>
        <elf-form-item class="inline-filter-item inline-filter-switch" :label=${t("mine")}>
          <elf-switch v-model="query.onlyMine"></elf-switch>
        </elf-form-item>
        <elf-button type="primary" @click="search()">${t("filter")}</elf-button>
      </elf-form>
    </elf-card>
  </elf-playground>
`);

export { PageFormEx2 };
