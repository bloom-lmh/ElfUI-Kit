import { defineHtml, useRef } from "@elfui/core";
import { createDocsPicker } from "../../docsLocale";

const p = createDocsPicker();
const hashContent = useRef(p("发布到 #", "Post to #"));

const topics = [
  { label: p("版本发布", "Releases"), value: "release" },
  { label: p("组件设计", "Component design"), value: "design" },
  { label: p("缺陷排查", "Bug investigation"), value: "bugfix" },
];

const code2 = `<elf-mention
  prefix="#"
  rows="4"
  :options.prop=\${topics}
  :modelValue.prop=\${hashContent}
  variant="outlined"
  placeholder="${p("输入 # 选择话题", "Type # to select a topic")}"
  @update:modelValue=\${onHashUpdate}
/>`;

const script2 = `const hashContent = useRef("${p("发布到 #", "Post to #")}");

const topics = [
  { label: "${p("版本发布", "Releases")}", value: "release" },
  { label: "${p("组件设计", "Component design")}", value: "design" },
  { label: "${p("缺陷排查", "Bug investigation")}", value: "bugfix" }
];

const onHashUpdate = (event) => {
    hashContent.set(String(event.detail || ""));
};`;

const onHashUpdate = (event: CustomEvent): void => {
  hashContent.set(String(event.detail || ""));
};

const PageMentionEx2 = defineHtml(`
<elf-playground :title=${p("自定义触发前缀与行数", "Custom trigger prefix and row count")} :code=${code2} :script=${script2}>
      <span slot="status">${p("当前内容", "Current content")}: {{ hashContent }}</span>
      <elf-mention
        prefix="#"
        rows="4"
        :options.prop=${topics}
        :modelValue.prop=${hashContent}
        variant="outlined"
        :placeholder=${p("输入 # 选择话题", "Type # to select a topic")}
        @update:modelValue=${onHashUpdate}
      ></elf-mention>
    </elf-playground>
`);

export { PageMentionEx2 };
