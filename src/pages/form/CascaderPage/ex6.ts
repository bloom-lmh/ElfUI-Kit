import { defineHtml, useRef } from "@elfui/core";

const value = useRef<string[]>(["zhejiang", "hangzhou"]);

const searchValue = useRef<string[]>([]);

const status = useRef("浙江 / 杭州");

const onSearchUpdate = (event: CustomEvent<string[]>): void => {
  searchValue.set(Array.isArray(event.detail) ? event.detail : []);
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
];

const code6 = `<elf-cascader
  filterable
  :options.prop=\${options}
  :modelValue=\${searchValue}
  @update:modelValue=\${onSearchUpdate}
/>`;

const script6 = `const searchValue = useRef([]);

const onSearchUpdate = (event) => {
  searchValue.set(event.detail);
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

const PageCascaderEx6 = defineHtml(`
<elf-playground title="搜索级联路径" :code=${code6} :script=${script6}>
      <div style="display:grid;gap:12px;width:320px">
        <elf-cascader
          filterable
          :options.prop=${options}
          :modelValue=${searchValue}
          @update:modelValue=${onSearchUpdate}
        ></elf-cascader>
        <span slot="status" class="demo-state">输入城市或上级地区名称，搜索可选路径。</span>
      </div>
    </elf-playground>
`);

export { PageCascaderEx6 };
