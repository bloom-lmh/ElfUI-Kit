import { defineHtml, useRef } from "@elfui/core";

const value = useRef<string[]>(["zhejiang", "hangzhou"]);

const panelValue = useRef<string[][]>([["zhejiang", "ningbo"]]);

const status = useRef("浙江 / 杭州");

const panelStatus = useRef("浙江 / 宁波");

const options = [
  {
    label: "浙江",
    value: "zhejiang",
    children: [
      { label: "杭州", value: "hangzhou" },
      { label: "宁波", value: "ningbo" }
    ]
  },
  {
    label: "江苏",
    value: "jiangsu",
    children: [
      { label: "南京", value: "nanjing" },
      { label: "苏州", value: "suzhou" }
    ]
  },
  {
    label: "广东",
    value: "guangdong",
    children: [
      { label: "广州", value: "guangzhou" },
      { label: "深圳", value: "shenzhen", disabled: true }
    ]
  }
];

const code5 = `<elf-cascader-panel
  checkable
  :options.prop=\${options}
  :modelValue=\${panelValue}
  @update:modelValue=\${onPanelUpdate}
  @change=\${onPanelChange}
/>`;

const script5 = `const panelValue = useRef([["zhejiang", "ningbo"]]);
const panelStatus = useRef("浙江 / 宁波");

const onPanelUpdate = (event) => {
  panelValue.set(event.detail);
};

const onPanelChange = (event) => {
  panelStatus.set(event.detail.path.map((path) => path.join(" / ")).join("、") || "未选择");
};

const options = [
    {
        label: "浙江",
        value: "zhejiang",
        children: [
            { label: "杭州", value: "hangzhou" },
            { label: "宁波", value: "ningbo" }
        ]
    },
    {
        label: "江苏",
        value: "jiangsu",
        children: [
            { label: "南京", value: "nanjing" },
            { label: "苏州", value: "suzhou" }
        ]
    },
    {
        label: "广东",
        value: "guangdong",
        children: [
            { label: "广州", value: "guangzhou" },
            { label: "深圳", value: "shenzhen", disabled: true }
        ]
    }
];`;

const joinPaths = (paths: unknown): string => {
  if (!Array.isArray(paths)) return "未选择";
  if (paths.length === 0) return "未选择";
  if (Array.isArray(paths[0])) {
    return (paths as string[][]).map((path) => path.join(" / ")).join("、") || "未选择";
  }
  return (paths as string[]).join(" / ") || "未选择";
};

const onPanelUpdate = (event: CustomEvent): void => {
  panelValue.set(event.detail as string[][]);
};

const onPanelChange = (event: CustomEvent): void => {
  const detail = event.detail as { path?: string[][] };
  panelStatus.set(joinPaths(detail.path));
};

const PageCascaderEx5 = defineHtml(`
<elf-playground title="独立级联选项面板" :code=${code5} :script=${script5}>
      <div style="display:grid;gap:12px;width:max-content">
        <elf-cascader-panel
          checkable
          :options.prop=${options}
          :modelValue=${panelValue}
          @update:modelValue=${onPanelUpdate}
          @change=${onPanelChange}
        ></elf-cascader-panel>
        <span slot="status" class="demo-state">当前路径：{{ panelStatus }}</span>
      </div>
    </elf-playground>
`);

export { PageCascaderEx5 };
