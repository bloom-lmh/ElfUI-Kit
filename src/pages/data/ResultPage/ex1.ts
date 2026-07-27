import { defineHtml } from "@elfui/core";

const statusCode = `<elf-result icon="success" title="提交成功" sub-title="配置已保存" />
<elf-result icon="warning" title="需要确认" sub-title="请检查风险项" />
<elf-result icon="error" title="提交失败" sub-title="请稍后重试" />
<elf-result icon="info" title="处理中" sub-title="系统正在执行任务" />`;

const PageResultEx1 = defineHtml(`
<elf-playground title="四种状态" :code=${statusCode}>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;width:100%">
        <elf-result style="border:1px solid var(--elf-border);border-radius:16px;background:var(--elf-bg-paper)" icon="success" title="提交成功" sub-title="配置已保存"></elf-result>
        <elf-result style="border:1px solid var(--elf-border);border-radius:16px;background:var(--elf-bg-paper)" icon="warning" title="需要确认" sub-title="请检查风险项"></elf-result>
        <elf-result style="border:1px solid var(--elf-border);border-radius:16px;background:var(--elf-bg-paper)" icon="error" title="提交失败" sub-title="请稍后重试"></elf-result>
        <elf-result style="border:1px solid var(--elf-border);border-radius:16px;background:var(--elf-bg-paper)" icon="info" title="处理中" sub-title="系统正在执行任务"></elf-result>
      </div>
    </elf-playground>
`);

export { PageResultEx1 };
