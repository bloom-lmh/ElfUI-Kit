import { defineHtml, useRef } from "@elfui/core";

const value = useRef<string[]>(["zhejiang", "hangzhou"]);

const clearableValue = useRef<string[]>([]);

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

const code2 = `<elf-cascader
  :options.prop=\${options}
  :modelValue=\${clearableValue}
  clearable
  placeholder="请选择地区"
  @update:modelValue=\${onClearableUpdate}
/>`;

const script2 = `const clearableValue = useRef([]);

const onClearableUpdate = (event) => {
  clearableValue.set(event.detail);
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

const onClearableUpdate = (event: CustomEvent): void => {
  clearableValue.set(event.detail as string[]);
};

const PageCascaderEx2 = defineHtml(`
<elf-playground title="可清空 / 禁用项" :code=${code2} :script=${script2}>
      <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
        <div style="width:260px">
          <elf-cascader
            :options.prop=${options}
            :modelValue=${clearableValue}
            clearable
            placeholder="请选择地区"
            @update:modelValue=${onClearableUpdate}
          ></elf-cascader>
        </div>
        <div style="width:260px">
          <elf-cascader :options.prop=${options} disabled placeholder="禁用状态"></elf-cascader>
        </div>
      </div>
    </elf-playground>
`);

export { PageCascaderEx2 };
