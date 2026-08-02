import { defineDirective, defineHtml, useRef } from "@elfui/core";
import { loadingDirective } from "@elfui/kit-src/components/Feedback/Loading/directive";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "v-loading 指令", en: "v-loading directive" },
  content: {
    zh: "v-loading 会在目标元素内创建局部遮罩。",
    en: "v-loading creates a local overlay inside the target element.",
  },
  toggle: { zh: "切换指令状态", en: "Toggle directive state" },
});

const loading = defineDirective(loadingDirective);

const directiveLoading = useRef(true);

const code = `<div
  v-loading=\${directiveLoading}
  style="min-height:160px"
>
  ${t("content")}
</div>
<elf-button @click=\${toggle}>${t("toggle")}</elf-button>`;

const script = `import { defineDirective, useRef } from "@elfui/core";
import { loadingDirective } from "@elfui/kit";

const loading = defineDirective(loadingDirective);

const directiveLoading = useRef(true);

const toggle = () => {
  directiveLoading.set(!directiveLoading.value);
};`;

const toggle = (): void => {
  directiveLoading.set(!directiveLoading.value);
};

const PageLoadingEx6 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <div style="display:grid;gap:12px;max-width:560px">
      <div
        v-loading=${directiveLoading}
        style="position:relative;min-height:160px;padding:24px;border:1px solid var(--elf-border-color);border-radius:12px"
      >
        ${t("content")}
      </div>
      <elf-button @click=${toggle}>${t("toggle")}</elf-button>
    </div>
  </elf-playground>
`);

export { PageLoadingEx6 };
