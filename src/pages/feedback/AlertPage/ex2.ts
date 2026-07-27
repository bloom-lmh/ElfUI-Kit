import { defineHtml } from "@elfui/core";

const code2 = `<elf-alert type="success" title="保存成功" description="你的更改已经保存到服务器"></elf-alert>
<elf-alert type="warning" title="网络不稳定" description="检测到网络延迟，部分功能可能受影响"></elf-alert>`;

const code3 = `<elf-alert type="success" variant="tonal" title="tonal（默认）"></elf-alert>
<elf-alert type="success" variant="elevated" title="elevated"></elf-alert>
<elf-alert type="success" variant="outlined" title="outlined"></elf-alert>
<elf-alert type="success" variant="filled" title="filled"></elf-alert>
<elf-alert type="success" variant="plain" title="plain"></elf-alert>`;

const PageAlertEx2 = defineHtml(`
    <h2>带描述</h2>
    <elf-playground title="title + description" :code=${code2}>
        <div style="width:50%;display:flex;flex-direction:column;gap:12px">
            <elf-alert type="success" title="保存成功" description="你的更改已经保存到服务器"></elf-alert>
            <elf-alert type="warning" title="网络不稳定" description="检测到网络延迟，部分功能可能受影响"></elf-alert>
        </div>
    </elf-playground>

    <h2>变体</h2>
    <elf-playground title="tonal / elevated / outlined / filled / plain" :code=${code3}>
        <div style="width:50%;display:flex;flex-direction:column;gap:12px">
            <elf-alert type="success" variant="tonal" title="tonal（默认）"></elf-alert>
            <elf-alert type="success" variant="elevated" title="elevated — 带阴影"></elf-alert>
            <elf-alert type="success" variant="outlined" title="outlined — 边框"></elf-alert>
            <elf-alert type="success" variant="filled" title="filled — 实色填充"></elf-alert>
            <elf-alert type="success" variant="plain" title="plain — 纯文字"></elf-alert>
        </div>
    </elf-playground>
`);

export { PageAlertEx2 };
