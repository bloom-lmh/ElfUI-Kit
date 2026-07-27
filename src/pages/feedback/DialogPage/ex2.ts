import { defineHtml, useRef } from "@elfui/core";


const d = useRef(false);

const beforeClose = (): boolean => confirm("确认关闭？未提交数据将丢失。");

const code1 = `<elf-dialog :before-close="beforeClose" v-model:open="open">...</elf-dialog>`;

const script1 = `import { useRef } from "@elfui/core";

const open = useRef(false);

const beforeClose = () => confirm("确认关闭？未提交数据将丢失。");

const show = () => open.set(true);
const requestClose = () => {
  if (beforeClose()) open.set(false);
};`;

const open = () => {
    d.set(true);
};

const guardedClose = () => {
    if (beforeClose()) d.set(false);
};

const onOpenChange = (event: CustomEvent<boolean>): void => {
    d.set(Boolean(event.detail));
};

const PageDialogEx2 = defineHtml(`
    <h2>拦截关闭 (before-close)</h2>
    <elf-playground title="点击关闭时拦截确认" :code=${code1} :script=${script1}>
        <elf-button @click=${open}>打开拦截关闭弹窗</elf-button>
        <elf-dialog :open=${d} title="拦截关闭确认" :before-close=${beforeClose} @update:open=${onOpenChange}>
            <p>绑定了 before-close 钩子，关闭时会弹窗确认。</p>
            <template #footer
                ><elf-button @click=${guardedClose}>取消</elf-button
                ><elf-button type="primary" @click=${guardedClose}>直接确认</elf-button></template
            >
        </elf-dialog>
    </elf-playground>
`);

export { PageDialogEx2 };
