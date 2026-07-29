import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "局部加载与受控状态", en: "Local loading and controlled state" },
  loadingText: { zh: "正在加载组件数据", en: "Loading component data" },
  content: { zh: "局部内容区域", en: "Local content area" },
  toggle: { zh: "切换加载状态", en: "Toggle loading" },
});

const loading = useRef(false);

const code1 = `<elf-loading :loading=\${loading} text="${t("loadingText")}">
  <div class="demo-panel">${t("content")}</div>
</elf-loading>
<elf-button @click=\${toggle}>${t("toggle")}</elf-button>`;

const script1 = `const loading = useRef(false);

const toggle = () => {
  loading.set(!loading.value);
};`;

const toggle = (): void => {
  loading.set(!loading.value);
};

const PageLoadingEx1 = defineHtml(`
<elf-playground :title=${t("title")} :code=${code1} :script=${script1}>
      <div style="display:grid;gap:12px;max-width:520px">
        <elf-loading :loading=${loading} :text=${t("loadingText")}>
          <div
            style="height:120px;padding:24px;border:1px solid var(--elf-border-color);border-radius:8px"
          >
            ${t("content")}
          </div>
        </elf-loading>
        <elf-button @click=${toggle}>${t("toggle")}</elf-button>
      </div>
    </elf-playground>
`);

export { PageLoadingEx1 };
