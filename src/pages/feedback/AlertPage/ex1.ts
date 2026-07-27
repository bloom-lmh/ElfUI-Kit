import { defineHtml } from "@elfui/core";

const code1 = `<elf-alert type="info" title="信息提示"></elf-alert>
<elf-alert type="success" title="操作成功"></elf-alert>
<elf-alert type="warning" title="警告"></elf-alert>
<elf-alert type="danger" title="错误"></elf-alert>`;

const PageAlertEx1 = defineHtml(`
    <h2>四种类型</h2>
    <elf-playground title="info / success / warning / danger" :code=${code1}>
        <div style="width:50%;display:flex;flex-direction:column;gap:12px">
            <elf-alert type="info" title="信息提示"></elf-alert>
            <elf-alert type="success" title="操作成功"></elf-alert>
            <elf-alert type="warning" title="警告"></elf-alert>
            <elf-alert type="danger" title="错误"></elf-alert>
        </div>
    </elf-playground>
`);

export { PageAlertEx1 };
