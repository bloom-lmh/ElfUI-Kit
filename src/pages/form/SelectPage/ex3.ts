import { defineHtml, useRef } from "@elfui/core";
import { opts } from "./shared";

const multi = useRef<string[]>([]);
const limited = useRef<string[]>(["vue"]);

const code1 = `<div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap">
  <elf-select style="width:320px"
    :options.prop=\${opts}
    :modelValue=\${multi}
    multiple
    placeholder="多选"
    @update:modelValue=\${onMultiUpdate}
  />
  <elf-select style="width:280px"
    :options.prop=\${opts}
    :modelValue=\${limited}
    multiple
    collapse-tags
    :max-collapse-tags=\${1}
    :multiple-limit=\${2}
    placeholder="最多选 2 项"
    @update:modelValue=\${onLimitedUpdate}
    @remove-tag=\${onRemoveTag}
  />
</div>`;

const script1 = `const multi = useRef([]);
const limited = useRef(["vue"]);

const opts = [
  { value: "vue", label: "Vue 3" },
  { value: "react", label: "React" },
  { value: "svelte", label: "Svelte" },
  { value: "solid", label: "Solid" }
];

const onMultiUpdate = (event) => {
  multi.set(event.detail);
};

const onLimitedUpdate = (event) => {
  limited.set(event.detail);
};

const onRemoveTag = (event) => {
  console.log("remove-tag", event.detail);
};`;

const onMultiUpdate = (event: CustomEvent): void => {
  multi.set((event.detail ?? []) as string[]);
};

const onLimitedUpdate = (event: CustomEvent): void => {
  limited.set((event.detail ?? []) as string[]);
};

const onRemoveTag = (): void => {
  // 示例里保留 remove-tag 事件入口，方便用户复制后接自己的业务逻辑。
};

const PageSelectEx3 = defineHtml(`
  <elf-playground title="多选 / 限制数量 / 折叠标签" :code=${code1} :script=${script1}>
    <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;width:100%;justify-content:center">
      <elf-select style="width:320px"
        :options.prop=${opts}
        :modelValue=${multi}
        multiple
        placeholder="多选"
        @update:modelValue=${onMultiUpdate}
      ></elf-select>
      <elf-select style="width:280px"
        :options.prop=${opts}
        :modelValue=${limited}
        multiple
        collapse-tags
        :maxCollapseTags=${1}
        :multipleLimit=${2}
        placeholder="最多选 2 项"
        @update:modelValue=${onLimitedUpdate}
        @remove-tag=${onRemoveTag}
      ></elf-select>
    </div>
  </elf-playground>
`);

export { PageSelectEx3 };
