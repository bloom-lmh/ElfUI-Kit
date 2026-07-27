import { defineHtml, useRef } from "@elfui/core";
import type {
  TableColumn,
  TableRow,
  TableTooltipOptions
} from "../../../components/Data/Table";

// State
const tooltipState = useRef("悬停或使用 Tab 聚焦被截断的单元格");

const data: TableRow[] = [
  {
    id: "1",
    project: "ElfUI 企业级设计系统与多品牌主题基础设施升级",
    detail: "统一组件语义、可访问性规则与跨产品设计令牌",
    owner: "林舒"
  },
  {
    id: "2",
    project: "复杂表单编排与异步校验工作流重构",
    detail: "覆盖动态字段、远程校验、错误聚焦和草稿恢复",
    owner: "许宁"
  },
  {
    id: "3",
    project: "组件文档交互案例与自动化视觉回归平台",
    detail: "让每个公开契约都有可复制案例和稳定浏览器验收",
    owner: "周然"
  }
];

const tooltipOptions: TableTooltipOptions = {
  placement: "top-start",
  offset: 8,
  showAfter: 120,
  hideAfter: 80,
  maxWidth: 320
};

const columns = [
  {
    prop: "project",
    label: "项目",
    width: 220,
    tooltipFormatter: (row: TableRow) => `完整项目名：${row.project}`
  },
  { prop: "detail", label: "工作范围", width: 260 },
  { prop: "owner", label: "负责人", width: 110 }
] satisfies TableColumn[];

// Methods
const onCellEnter = (event: Event): void => {
  const [row, column] = (event as CustomEvent).detail as [TableRow, TableColumn];
  tooltipState.set(`当前单元格：${column.label || column.prop} · ${row.owner}`);
};

const code = `<elf-table
  :data.prop="data"
  :columns.prop="columns"
  show-overflow-tooltip
  :tooltipOptions.prop="tooltipOptions"
/>

const tooltipOptions = {
  placement: "top-start",
  showAfter: 120,
  hideAfter: 80,
  maxWidth: 320
};`;

const script = `const data = [
    {
        id: "1",
        project: "ElfUI 企业级设计系统与多品牌主题基础设施升级",
        detail: "统一组件语义、可访问性规则与跨产品设计令牌",
        owner: "林舒"
    },
    {
        id: "2",
        project: "复杂表单编排与异步校验工作流重构",
        detail: "覆盖动态字段、远程校验、错误聚焦和草稿恢复",
        owner: "许宁"
    },
    {
        id: "3",
        project: "组件文档交互案例与自动化视觉回归平台",
        detail: "让每个公开契约都有可复制案例和稳定浏览器验收",
        owner: "周然"
    }
];
const tooltipOptions = {
    placement: "top-start",
    offset: 8,
    showAfter: 120,
    hideAfter: 80,
    maxWidth: 320
};
const columns = [
    {
        prop: "project",
        label: "项目",
        width: 220,
        tooltipFormatter: (row) => \`完整项目名：\${row.project}\`
    },
    { prop: "detail", label: "工作范围", width: 260 },
    { prop: "owner", label: "负责人", width: 110 }
];`;

const PageTableEx20 = defineHtml(`
  <h2>可访问的溢出提示</h2>
  <elf-playground title="项目清单：鼠标与键盘共享同一浮层" :code="code" :script=${script}>
    <span slot="status" class="demo-state">{{ tooltipState }}</span>
    <div style="width:100%;max-width:650px">
      <elf-table
        :data.prop="data"
        :columns.prop="columns"
        :tooltipOptions.prop="tooltipOptions"
        show-overflow-tooltip
        border
        @cell-mouse-enter=${onCellEnter}
      ></elf-table>
    </div>
  </elf-playground>
`);

export { PageTableEx20 };
