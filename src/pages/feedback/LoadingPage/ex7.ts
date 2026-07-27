import { defineHtml } from "@elfui/core";

import { ElfLoading } from "../../../components/Feedback/Loading/service";

const code = `<elf-button @click=\${openFullscreen}>启动全屏 Loading service</elf-button>`;

const script = `import { ElfLoading } from "@elfui/kit";

const openFullscreen = () => {
  ElfLoading({
    text: "正在同步工作区",
    variant: "bars",
    closable: true,
    lock: true
  });
};`;

const openFullscreen = (): void => {
  ElfLoading({
    text: "正在同步工作区",
    variant: "bars",
    closable: true,
    lock: true
  });
};

const PageLoadingEx7 = defineHtml(`
  <h2>Loading service</h2>
  <elf-playground title="命令式全屏加载支持主动退出并恢复焦点" :code=${code} :script=${script}>
    <elf-button @click=${openFullscreen}>启动全屏 Loading service</elf-button>
  </elf-playground>
`);

export { PageLoadingEx7 };
