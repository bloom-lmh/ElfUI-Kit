import { defineHtml, useRef } from "@elfui/core";

const loading = useRef(false);

const fullscreenLoading = useRef(false);

const code3 = `<elf-button @click=\${toggleFullscreen}>开启全屏加载</elf-button>
<elf-loading
  fullscreen
  closable
  :loading=\${fullscreenLoading}
  text="正在执行全屏任务"
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
<elf-playground title="全屏加载" :code=${code3} :script=${code3Script}>
      <elf-button @click=${toggleFullscreen}>开启全屏加载</elf-button>
      <elf-loading
        fullscreen
        closable
        :loading=${fullscreenLoading}
        text="正在执行全屏任务"
        @close=${closeFullscreen}
      ></elf-loading>
    </elf-playground>
`);

export { PageLoadingEx3 };
