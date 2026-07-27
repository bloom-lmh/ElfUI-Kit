import { defineHtml, useHost, useRef } from "@elfui/core";

interface PopConfirmHost extends HTMLElement {
  confirm(): Promise<void>;
  cancel(): void;
}

const code = `<div class="clipped-panel">
  <elf-pop-confirm
    ref="popConfirm"
    class="custom-confirm"
    title="发布当前版本？"
    content="气泡使用 Top Layer，不受裁切容器影响"
    placement="right"
    teleported
    @confirm="onConfirm"
    @cancel="onCancel"
  >
    <elf-button>打开确认气泡</elf-button>
    <span slot="actions">
      <elf-button @click="cancel">暂不发布</elf-button>
      <elf-button color="primary" @click="confirm">确认发布</elf-button>
    </span>
  </elf-pop-confirm>
</div>`;

const script = `const popConfirm = useTemplateRef("popConfirm");
const status = useRef("等待操作");

const cancel = () => popConfirm.value?.cancel();
const confirm = () => popConfirm.value?.confirm();
const onCancel = () => status.set("已保留草稿");
const onConfirm = () => status.set("版本已发布");`;

// state
const pageHost = useHost();
const status = useRef("等待操作");

// actions
const getPopConfirm = (): PopConfirmHost | null =>
  pageHost.shadowRoot?.querySelector<PopConfirmHost>(".custom-confirm") ?? null;

const cancel = (): void => {
  getPopConfirm()?.cancel();
};

const confirm = (): void => {
  void getPopConfirm()?.confirm();
};

const onCancel = (): void => {
  status.set("已保留草稿");
};

const onConfirm = (): void => {
  status.set("版本已发布");
};

const PagePopConfirmEx3 = defineHtml(`
  <h2>浮层与自定义操作</h2>
  <elf-playground title="Teleport 与 actions 插槽" :code=${code} :script=${script}>
    <span slot="status" class="demo-state">{{ status }}</span>
    <div style="width:min(100%,480px);height:150px;overflow:auto;border:1px solid var(--elf-border);border-radius:8px;background:var(--elf-bg-overlay)">
      <div style="display:flex;align-items:center;width:720px;height:210px;padding:24px;box-sizing:border-box">
        <elf-pop-confirm
          class="custom-confirm"
          title="发布当前版本？"
          content="气泡使用 Top Layer，不受裁切容器影响"
          placement="right"
          teleported
          @confirm=${onConfirm}
          @cancel=${onCancel}
        >
          <elf-button color="primary">打开确认气泡</elf-button>
          <span slot="actions" style="display:flex;gap:8px">
            <elf-button size="small" variant="text" @click=${cancel}>暂不发布</elf-button>
            <elf-button size="small" color="primary" @click=${confirm}>确认发布</elf-button>
          </span>
        </elf-pop-confirm>
      </div>
    </div>
  </elf-playground>
`);

export { PagePopConfirmEx3 };
