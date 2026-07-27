import { defineHtml, useRef } from "@elfui/core";

const value = useRef<string[]>(["zhejiang", "hangzhou"]);

const status = useRef("浙江 / 杭州");

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

const code1 = `<elf-cascader
  :options.prop=\${options}
  :modelValue=\${value}
  @update:modelValue=\${onUpdate}
  @change=\${onChange}
/>`;

const script1 = `const value = useRef(["zhejiang", "hangzhou"]);
const status = useRef("浙江 / 杭州");

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
    children: [{ label: "南京", value: "nanjing" }]
  }
];

const onUpdate = (event) => {
  value.set(event.detail);
};

const onChange = (event) => {
  status.set(event.detail.path.join(" / ") || "未选择");
};`;

const joinPaths = (paths: unknown): string => {
  if (!Array.isArray(paths)) return "未选择";
  if (paths.length === 0) return "未选择";
  if (Array.isArray(paths[0])) {
    return (paths as string[][]).map((path) => path.join(" / ")).join("、") || "未选择";
  }
  return (paths as string[]).join(" / ") || "未选择";
};

const onUpdate = (event: CustomEvent): void => {
  value.set(event.detail as string[]);
};

const onChange = (event: CustomEvent): void => {
  const detail = event.detail as { path?: string[] };
  status.set(joinPaths(detail.path));
};

const PageCascaderEx1 = defineHtml(`
<elf-playground title="基础用法" :code=${code1} :script=${script1}>
      <div style="display:grid;gap:12px;width:260px">
        <elf-cascader
          :options.prop=${options}
          :modelValue=${value}
          label="地区"
          @update:modelValue=${onUpdate}
          @change=${onChange}
        ></elf-cascader>
        <span slot="status" class="demo-state">当前路径：{{ status }}</span>
      </div>
    </elf-playground>
`);

export { PageCascaderEx1 };
