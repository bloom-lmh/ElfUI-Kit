import { defineHtml, useRef } from "@elfui/core";

const loading = useRef(false);

const code2 = `<elf-loading
  loading
  text="处理中"
  background="rgba(24, 144, 255, 0.12)"
>
  <div class="demo-panel">自定义遮罩背景</div>
</elf-loading>`;

const PageLoadingEx2 = defineHtml(`
<elf-playground title="自定义遮罩背景" :code=${code2}>
      <elf-loading loading text="处理中" background="rgba(24, 144, 255, 0.12)">
        <div
          style="height:120px;padding:24px;border:1px solid var(--elf-border-color);border-radius:8px"
        >
          自定义遮罩背景
        </div>
      </elf-loading>
    </elf-playground>
`);

export { PageLoadingEx2 };
