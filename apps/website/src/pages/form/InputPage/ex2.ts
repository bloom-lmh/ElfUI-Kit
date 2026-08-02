import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  sizes: { zh: "尺寸", en: "Sizes" },
  states: { zh: "状态", en: "States" },
  clearable: { zh: "可清空", en: "Clearable" },
  readonly: { zh: "只读内容", en: "Read-only content" },
  disabled: { zh: "禁用", en: "Disabled" },
  clearHint: { zh: "输入后出现清空按钮", en: "Type to show the clear button" },
  current: { zh: "当前", en: "Current" },
  empty: { zh: "空", en: "Empty" },
});

const clearValue = useRef("");
const readonlyText = useRef(t("readonly"));

const code1 = `<elf-input size="small" placeholder="small" />
<elf-input size="default" placeholder="default" />
<elf-input size="large" placeholder="large" />`;

const code2 = `<div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap">
  <elf-input style="width:200px" disabled placeholder="${t("disabled")}" />
  <elf-input style="width:200px" readonly :modelValue.prop=\${readonlyText.value} />
</div>`;

const script2 = `const readonlyText = useRef("${t("readonly")}");`;

const code3 = `<div style="width:240px">
  <elf-input
    :modelValue.prop=\${clearValue.value}
    clearable
    clear-icon="clear"
    placeholder="${t("clearHint")}"
    @update:modelValue=\${onClearUpdate}
  />
</div>
<span slot="status" class="demo-state">${t("current")}：{{ clearValue || '${t("empty")}' }}</span>`;

const script3 = `const clearValue = useRef("");

const onClearUpdate = (event) => {
  clearValue.set(event.detail);
};`;

const onClearUpdate = (event: CustomEvent): void => {
  clearValue.set(String(event.detail || ""));
};

const PageInputEx2 = defineHtml(`
  <h2>${t("sizes")}</h2>
  <elf-playground title="small / default / large" :code=${code1}>
    <div style="width:200px;margin-bottom:8px">
      <elf-input size="small" placeholder="small"></elf-input>
    </div>
    <div style="width:200px;margin-bottom:8px">
      <elf-input size="default" placeholder="default"></elf-input>
    </div>
    <div style="width:200px"><elf-input size="large" placeholder="large"></elf-input></div>
  </elf-playground>

  <h2>${t("states")}</h2>
  <elf-playground title="disabled / readonly" :code=${code2} :script=${script2}>
    <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;width:100%;justify-content:center">
      <div style="width:200px">
      <elf-input disabled :placeholder=${t("disabled")}></elf-input>
      </div>
      <div style="width:200px"><elf-input readonly :modelValue.prop=${readonlyText.value}></elf-input></div>
    </div>
  </elf-playground>

  <h2>${t("clearable")}</h2>
  <elf-playground title="clearable / clear-icon" :code=${code3} :script=${script3}>
    <div style="width:240px">
      <elf-input
        :modelValue.prop=${clearValue.value}
        clearable
        clear-icon="clear"
        :placeholder=${t("clearHint")}
        @update:modelValue=${onClearUpdate}
      ></elf-input>
    </div>
    <span slot="status" class="demo-state">${t("current")}：{{ clearValue || '${t("empty")}' }}</span>
  </elf-playground>
`);

export { PageInputEx2 };
