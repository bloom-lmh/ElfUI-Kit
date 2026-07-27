import { defineDirective, defineHtml, useRef } from "@elfui/core";
import {
  loadingDirective } from "../../../components/Feedback/Loading/directive";

const loading = defineDirective(loadingDirective);

const directiveLoading = useRef(true);

const code = `<div
  v-loading=\${directiveLoading}
  style="min-height:160px"
>
  v-loading 会在目标元素内创建局部遮罩
</div>
<elf-button @click=\${toggle}>切换指令状态</elf-button>`;

const script = `import { defineDirective,
  useRef
} from "@elfui/core";
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
  <h2>v-loading 指令</h2>
  <elf-playground title="用指令给任意容器增加局部加载状态" :code=${code} :script=${script}>
    <div style="display:grid;gap:12px;max-width:560px">
      <div
        v-loading=${directiveLoading}
        style="position:relative;min-height:160px;padding:24px;border:1px solid var(--elf-border-color);border-radius:12px"
      >
        v-loading 会在目标元素内创建局部遮罩
      </div>
      <elf-button @click=${toggle}>切换指令状态</elf-button>
    </div>
  </elf-playground>
`);

export { PageLoadingEx6 };
