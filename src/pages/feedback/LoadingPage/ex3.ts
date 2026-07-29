import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "全屏加载", en: "Fullscreen loading" },
  open: { zh: "开启全屏加载", en: "Start fullscreen loading" },
  task: { zh: "正在执行全屏任务", en: "Running a fullscreen task" },
});

const loading = useRef(false);

const fullscreenLoading = useRef(false);

const code3 = `<elf-button @click=\${toggleFullscreen}>${t("open")}</elf-button>
<elf-loading
  fullscreen
  closable
  :loading=\${fullscreenLoading}
  text="${t("task")}"
  @close=\${closeFullscreen}
/>`;

const code3Script = `const fullscreenLoading = useRef(false);
const toggleFullscreen = () => {
    fullscreenLoading.set(!fullscreenLoading.value);
};
const closeFullscreen = () => {
    fullscreenLoading.set(false);
};`;

const toggleFullscreen = (): void => {
  fullscreenLoading.set(!fullscreenLoading.value);
};

const closeFullscreen = (): void => {
  fullscreenLoading.set(false);
};

const PageLoadingEx3 = defineHtml(`
<elf-playground :title=${t("title")} :code=${code3} :script=${code3Script}>
      <elf-button @click=${toggleFullscreen}>${t("open")}</elf-button>
      <elf-loading
        fullscreen
        closable
        :loading=${fullscreenLoading}
        :text=${t("task")}
        @close=${closeFullscreen}
      ></elf-loading>
    </elf-playground>
`);

export { PageLoadingEx3 };
