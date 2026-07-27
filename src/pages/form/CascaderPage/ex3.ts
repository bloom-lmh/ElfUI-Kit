import { defineHtml, useRef } from "@elfui/core";

const value = useRef<string[]>(["zhejiang", "hangzhou"]);

const multipleValue = useRef<string[][]>([["zhejiang", "hangzhou"]]);

const status = useRef("浙江 / 杭州");

const multipleStatus = useRef("浙江 / 杭州");

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

const code3 = `<elf-cascader
  multiple
  clearable
  :options.prop=\${options}
  :modelValue=\${multipleValue}
  @update:modelValue=\${onMultipleUpdate}
  @change=\${onMultipleChange}
/>`;

const script3 = `const multipleValue = useRef([["zhejiang", "hangzhou"]]);
const multipleStatus = useRef("浙江 / 杭州");

const onMultipleUpdate = (event) => {
  multipleValue.set(event.detail);
};

const onMultipleChange = (event) => {
  multipleStatus.set(event.detail.path.map((path) => path.join(" / ")).join("、") || "未选择");
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

const onMultipleUpdate = (event: CustomEvent): void => {
  multipleValue.set(event.detail as string[][]);
};

const onMultipleChange = (event: CustomEvent): void => {
  const detail = event.detail as { path?: string[][] };
  multipleStatus.set(joinPaths(detail.path));
};

const PageCascaderEx3 = defineHtml(`
<elf-playground title="多选" :code=${code3} :script=${script3}>
      <div style="display:grid;gap:12px;width:320px">
        <elf-cascader
          multiple
          clearable
          :options.prop=${options}
          :modelValue=${multipleValue}
          @update:modelValue=${onMultipleUpdate}
          @change=${onMultipleChange}
        ></elf-cascader>
        <span slot="status" class="demo-state">当前路径：{{ multipleStatus }}</span>
      </div>
    </elf-playground>
`);

export { PageCascaderEx3 };
