import { defineHtml, useReactive } from "@elfui/core";


const myId = (() => {
    const key = "__elfDebugPageId";
    const next = Number((globalThis as Record<string, unknown>)[key] ?? 1);
    (globalThis as Record<string, unknown>)[key] = next + 1;
    return next;
})();

const data = useReactive({ val1: false, val2: false });

const PageDebug = defineHtml(`
    <div style="padding:16px">
        <h1>Debug v9 (page id={{ myId }})</h1>
        <!-- A: v-model 绑定到 val1，但模板不展示 val1 -->
        <elf-checkbox v-model="data.val1" label="A: v-model=val1 (hidden)" />
        <!-- B: v-model 绑定到 val2，模板展示 val2 -->
        <elf-checkbox v-model="data.val2" label="B: v-model=val2 (visible)" />
        <span style="font-size:14px">val2 = {{ data.val2 ? '✓' : '✗' }}</span>
        <hr />
        <!-- C: 裸 Checkbox 无 v-model -->
        <elf-checkbox label="C: 裸 Checkbox(无v-model)" />
    </div>
`);

export { PageDebug };
