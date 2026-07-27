import { defineHtml, useRef } from "@elfui/core";

const code1 = `<elf-pop-confirm placement="right" title="确认退出？">
  <elf-button>右侧弹出</elf-button>
</elf-pop-confirm>`;

const code2 = `<elf-pop-confirm
  trigger="manual"
  :visible="visible"
  title="提交审批？"
  content="提交后将进入审批流程"
  loading-text="校验中"
  :before-confirm="verifyApproval"
  @update:visible="visible = $event.detail"
  @confirm="onSubmitted"
  @confirm-error="onSubmitError"
>
  <elf-button color="primary">手动控制</elf-button>
</elf-pop-confirm>
<elf-button variant="outlined" @click="toggleVisible">切换气泡</elf-button>`;

const code2Script = `const visible = useRef(false);
const status = useRef("等待提交");
const attempts = useRef(0);

const toggleVisible = () => visible.set(!visible.value);

const verifyApproval = async () => {
  attempts.set(attempts.value + 1);
  status.set("正在校验审批条件…");
  await new Promise((resolve) => setTimeout(resolve, 900));
  if (attempts.value === 1) throw new Error("审批服务暂时不可用");
};

const onSubmitError = () => status.set("校验失败，请在气泡内重试");
const onSubmitted = () => status.set("已提交审批");`;

// state
const visible = useRef(false);
const status = useRef("等待提交");
const attempts = useRef(0);

// actions
const toggleVisible = (): void => {
  visible.set(!visible.value);
};

const onVisibleChange = (event: Event): void => {
  visible.set(Boolean((event as CustomEvent<boolean>).detail));
};

const verifyApproval = async (): Promise<void> => {
  attempts.set(attempts.value + 1);
  status.set("正在校验审批条件…");
  await new Promise((resolve) => setTimeout(resolve, 900));
  if (attempts.value === 1) throw new Error("审批服务暂时不可用");
};

const onSubmitError = (): void => {
  status.set("校验失败，请在气泡内重试");
};

const onSubmitted = (): void => {
  status.set("已提交审批");
};

const PagePopConfirmEx2 = defineHtml(`
  <h2>定位与异步确认</h2>
  <elf-playground title="四个方向" :code=${code1}>
    <div style="display:flex;gap:12px;flex-wrap:wrap;padding:24px 0">
      <elf-pop-confirm title="上方弹出" content="默认方向" placement="top">
        <elf-button>上方</elf-button>
      </elf-pop-confirm>
      <elf-pop-confirm title="下方弹出" content="适合顶部工具栏" placement="bottom">
        <elf-button>下方</elf-button>
      </elf-pop-confirm>
      <elf-pop-confirm title="左侧弹出" content="适合右侧操作列" placement="left">
        <elf-button>左侧</elf-button>
      </elf-pop-confirm>
      <elf-pop-confirm title="右侧弹出" content="适合左侧导航" placement="right">
        <elf-button>右侧</elf-button>
      </elf-pop-confirm>
    </div>
  </elf-playground>

  <elf-playground title="异步确认与失败重试" :code=${code2} :script=${code2Script}>
    <span slot="status" class="demo-state">{{ status }}</span>
    <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
      <elf-pop-confirm
        trigger="manual"
        :visible=${visible}
        title="提交审批？"
        content="提交后将进入审批流程"
        confirm-text="提交"
        cancel-text="再看看"
        loading-text="校验中"
        :before-confirm=${verifyApproval}
        @update:visible=${onVisibleChange}
        @confirm=${onSubmitted}
        @confirm-error=${onSubmitError}
      >
        <elf-button color="primary">手动控制</elf-button>
      </elf-pop-confirm>
      <elf-button variant="outlined" @click=${toggleVisible}>切换气泡</elf-button>
    </div>
  </elf-playground>
`);

export { PagePopConfirmEx2 };
