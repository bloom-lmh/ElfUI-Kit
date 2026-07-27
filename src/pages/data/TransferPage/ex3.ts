import { defineHtml, useRef } from "@elfui/core";

const data = [
  { key: "design", label: "设计系统与跨产品主题规范维护负责人" },
  { key: "frontend", label: "前端组件库构建、测试与发布流水线维护者" },
  { key: "quality", label: "质量保障与无障碍体验专项负责人" },
  { key: "docs", label: "文档站案例与 API 一致性维护者" }
];

const selected = useRef<string[]>(["quality", "docs"]);

const code = `<div style="width:100%;max-width:520px">
  <elf-transfer :data=\${data} :modelValue=\${selected}>
    <span slot="left-footer">候选成员会按权限过滤</span>
    <span slot="right-footer">已选成员将收到邀请</span>
  </elf-transfer>
</div>`;

const script = `const selected = useRef(["quality", "docs"]);

const data = [
  { key: "design", label: "设计系统与跨产品主题规范维护负责人" },
  // ...
];`;

const PageTransferEx3 = defineHtml(`
  <h2>长标签、Panel Footer 与窄容器</h2>
  <elf-playground title="窄容器自动切换为纵向布局" :code=${code} :script=${script}>
    <div style="width:100%;max-width:520px">
      <elf-transfer :data.prop=${data} :modelValue.prop=${selected.value}>
        <span slot="left-footer" style="display:block;padding:10px 12px;color:var(--elf-text-secondary)">
          候选成员会按权限过滤
        </span>
        <span slot="right-footer" style="display:block;padding:10px 12px;color:var(--elf-text-secondary)">
          已选成员将收到邀请
        </span>
      </elf-transfer>
    </div>
  </elf-playground>
`);

export { PageTransferEx3 };
