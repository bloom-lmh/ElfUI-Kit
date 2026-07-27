import { defineHtml, useRef } from "@elfui/core";


const d = useRef(false);

const code1 = `<elf-drawer :modal="false" v-model:open="open">...</elf-drawer>`;

const code1Script = `const d = useRef(false);
const open = () => d.set(true);`;

const open = () => d.set(true);

const close = () => d.set(false);

const PageDrawerEx2 = defineHtml(`
    <h2>无遮罩模式</h2>
    <elf-playground title="无遮罩模式（modal=false）" :code="code1" :script=${code1Script}>
        <elf-button @click="open">打开无遮罩抽屉</elf-button>
        <elf-drawer v-model:open="d" title="非模态抽屉" :modal="false"
            ><div style="padding:16px"><p>展开时仍可操作背景。</p></div></elf-drawer
        >
    </elf-playground>
`);

export { PageDrawerEx2 };
