import { defineHtml, useReactive } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "调试页", en: "Debug page" },
  hidden: { zh: "A：v-model=val1（隐藏状态）", en: "A: v-model=val1 (hidden state)" },
  visible: { zh: "B：v-model=val2（显示状态）", en: "B: v-model=val2 (visible state)" },
  bare: { zh: "C：无 v-model 的复选框", en: "C: Checkbox without v-model" },
});

const myId = (() => {
  const key = "__elfDebugPageId";
  const next = Number((globalThis as Record<string, unknown>)[key] ?? 1);
  (globalThis as Record<string, unknown>)[key] = next + 1;
  return next;
})();

const data = useReactive({ val1: false, val2: false });

const PageDebug = defineHtml(`
    <div style="padding:16px">
        <h1>${t("title")} v9（id={{ myId }}）</h1>
        <!-- A: v-model 绑定到 val1，但模板不展示 val1 -->
        <elf-checkbox v-model="data.val1" :label=${t("hidden")} />
        <!-- B: v-model 绑定到 val2，模板展示 val2 -->
        <elf-checkbox v-model="data.val2" :label=${t("visible")} />
        <span style="font-size:14px">val2 = {{ data.val2 ? '✓' : '✗' }}</span>
        <hr />
        <!-- C: 裸 Checkbox 无 v-model -->
        <elf-checkbox :label=${t("bare")} />
    </div>
`);

export { PageDebug };
