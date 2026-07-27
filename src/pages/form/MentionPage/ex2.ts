import { defineHtml, useRef } from "@elfui/core";

const hashContent = useRef("发布到 #");

const topics = [
  { label: "版本发布", value: "release" },
  { label: "组件设计", value: "design" },
  { label: "缺陷排查", value: "bugfix" }
];

const code2 = `<elf-mention
  prefix="#"
  rows="4"
  :options.prop=\${topics}
  :modelValue.prop=\${hashContent}
  variant="outlined"
  placeholder="输入 # 选择话题"
  @update:modelValue=\${onHashUpdate}
/>`;

const script2 = `const hashContent = useRef("发布到 #");

const topics = [
  { label: "版本发布", value: "release" },
  { label: "组件设计", value: "design" },
  { label: "缺陷排查", value: "bugfix" }
];

const onHashUpdate = (event) => {
    hashContent.set(String(event.detail || ""));
};`;

const onHashUpdate = (event: CustomEvent): void => {
  hashContent.set(String(event.detail || ""));
};

const PageMentionEx2 = defineHtml(`
<elf-playground title="自定义触发前缀与行数" :code=${code2} :script=${script2}>
      <elf-mention
        prefix="#"
        rows="4"
        :options.prop=${topics}
        :modelValue.prop=${hashContent}
        variant="outlined"
        placeholder="输入 # 选择话题"
        @update:modelValue=${onHashUpdate}
      ></elf-mention>
    </elf-playground>
`);

export { PageMentionEx2 };
