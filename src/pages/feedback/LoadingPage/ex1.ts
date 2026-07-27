import { defineHtml, useRef } from "@elfui/core";

const loading = useRef(false);

const code1 = `<elf-loading :loading=\${loading} text="加载组件数据中">
  <div class="demo-panel">局部内容区域</div>
</elf-loading>
<elf-button @click=\${toggle}>切换 loading</elf-button>`;

const script1 = `const loading = useRef(false);

const toggle = () => {
  loading.set(!loading.value);
};`;

const toggle = (): void => {
  loading.set(!loading.value);
};

const PageLoadingEx1 = defineHtml(`
<elf-playground title="局部加载 / 受控" :code=${code1} :script=${script1}>
      <div style="display:grid;gap:12px;max-width:520px">
        <elf-loading :loading=${loading} text="加载组件数据中">
          <div
            style="height:120px;padding:24px;border:1px solid var(--elf-border-color);border-radius:8px"
          >
            局部内容区域
          </div>
        </elf-loading>
        <elf-button @click=${toggle}>切换 loading</elf-button>
      </div>
    </elf-playground>
`);

export { PageLoadingEx1 };
