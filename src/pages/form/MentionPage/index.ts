import { defineHtml, useComponents } from "@elfui/core";
import { PageMentionProps } from "./props";
import { PageMentionEx1 } from "./ex1";
import { PageMentionEx2 } from "./ex2";
import { PageMentionEx3 } from "./ex3";

useComponents({
  "page-mention-ex1": PageMentionEx1,
  "page-mention-ex2": PageMentionEx2,
  "page-mention-ex3": PageMentionEx3,
  "page-mention-props": PageMentionProps
});

const PageMention = defineHtml(`
  <elf-container>
    <h1>Mention 提及</h1>
    <p>在文本输入中通过前缀触发候选面板，适合选择成员、话题或实体。</p>

    <page-mention-ex1 />

    <page-mention-ex2 />
    <page-mention-ex3 />
    <page-mention-props></page-mention-props>
  </elf-container>
`);

export { PageMention };
