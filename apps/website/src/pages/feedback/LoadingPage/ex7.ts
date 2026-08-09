import { defineHtml } from "@elfui/core";

import { ElfLoading } from "@elfui/kit";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "命令式服务", en: "Imperative service" },
  open: { zh: "启动全屏加载服务", en: "Start fullscreen loading service" },
  syncing: { zh: "正在同步工作区", en: "Syncing workspace" },
});

const code = `<elf-button @click=\${openFullscreen}>${t("open")}</elf-button>`;

const script = `import { ElfLoading } from "@elfui/kit";

const openFullscreen = () => {
  ElfLoading({
    text: "${t("syncing")}",
    variant: "bars",
    closable: true,
    lock: true
  });
};`;

const openFullscreen = (): void => {
  ElfLoading({
    text: t("syncing"),
    variant: "bars",
    closable: true,
    lock: true,
  });
};

const PageLoadingEx7 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <elf-button @click=${openFullscreen}>${t("open")}</elf-button>
  </elf-playground>
`);

export { PageLoadingEx7 };
