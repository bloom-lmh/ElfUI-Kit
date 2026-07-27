import { defineHtml, defineStyle, useReactive, useRef } from "@elfui/core";

import demoStyles from "./demo.scss?inline";


const query = useReactive({
  keyword: "",
  status: "",
  onlyMine: true
});

const result = useRef("等待筛选");

const statusOptions = [
  { label: "全部状态", value: "" },
  { label: "运行中", value: "running" },
  { label: "维护中", value: "maintenance" },
  { label: "告警", value: "warning" }
];

const search = (): void => {
  result.set(
    `筛选：${query.keyword || "全部"} / ${query.status || "全部状态"} / ${query.onlyMine ? "只看我" : "全部负责人"}`
  );
};

const code = `<elf-form :model.prop="query" inline label-position="left">
  <elf-form-item label="关键词"><elf-input v-model="query.keyword" /></elf-form-item>
  <elf-form-item label="状态"><elf-select v-model="query.status" :options.prop="statusOptions" /></elf-form-item>
</elf-form>`;

const script = `const query = useReactive({
    keyword: "",
    status: "",
    onlyMine: true
});
const statusOptions = [
    { label: "全部状态", value: "" },
    { label: "运行中", value: "running" },
    { label: "维护中", value: "maintenance" },
    { label: "告警", value: "warning" }
];`;

defineStyle(demoStyles);

const PageFormEx2 = defineHtml(`
  <h2>行内筛选</h2>
  <elf-playground title="inline / select / switch" :code="code" :script=${script}>
    <p slot="status" class="demo-state">{{ result }}</p>
    <elf-card
      class="form-demo-card is-wide"
      variant="outlined"
      title="服务筛选"
      subtitle="紧凑条件适合放在 Card 的内容区"
    >
      <elf-form :model.prop="query" inline label-position="left" label-width="72px">
        <elf-form-item class="inline-filter-item inline-filter-keyword" label="关键词">
          <elf-input v-model="query.keyword" placeholder="服务名 / 负责人" clearable></elf-input>
        </elf-form-item>
        <elf-form-item class="inline-filter-item inline-filter-status" label="状态">
          <elf-select v-model="query.status" :options.prop="statusOptions" clearable></elf-select>
        </elf-form-item>
        <elf-form-item class="inline-filter-item inline-filter-switch" label="只看我">
          <elf-switch v-model="query.onlyMine"></elf-switch>
        </elf-form-item>
        <elf-button type="primary" @click="search()">筛选</elf-button>
      </elf-form>
    </elf-card>
  </elf-playground>
`);

export { PageFormEx2 };
