import { defineHtml, useRef } from "@elfui/core";

const value = useRef<string[]>(["zhejiang", "hangzhou"]);

const checkableValue = useRef<string[][]>([["jiangsu", "nanjing"]]);

const status = useRef("浙江 / 杭州");

const checkableStatus = useRef("江苏 / 南京");

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

const code4 = `<elf-cascader
  checkable
  clearable
  :options.prop=\${options}
  :modelValue=\${checkableValue}
  @update:modelValue=\${onCheckableUpdate}
  @change=\${onCheckableChange}
/>`;

const script4 = `const checkableValue = useRef([["jiangsu", "nanjing"]]);
const checkableStatus = useRef("江苏 / 南京");

const onCheckableUpdate = (event) => {
  checkableValue.set(event.detail);
};

const onCheckableChange = (event) => {
  checkableStatus.set(event.detail.path.map((path) => path.join(" / ")).join("、") || "未选择");
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

const onCheckableUpdate = (event: CustomEvent): void => {
  checkableValue.set(event.detail as string[][]);
};

const onCheckableChange = (event: CustomEvent): void => {
  const detail = event.detail as { path?: string[][] };
  checkableStatus.set(joinPaths(detail.path));
};

const PageCascaderEx4 = defineHtml(`
<elf-playground title="选项框" :code=${code4} :script=${script4}>
      <div style="display:grid;gap:12px;width:320px">
        <elf-cascader
          checkable
          clearable
          :options.prop=${options}
          :modelValue=${checkableValue}
          @update:modelValue=${onCheckableUpdate}
          @change=${onCheckableChange}
        ></elf-cascader>
        <span slot="status" class="demo-state">当前路径：{{ checkableStatus }}</span>
      </div>
    </elf-playground>
`);

export { PageCascaderEx4 };
