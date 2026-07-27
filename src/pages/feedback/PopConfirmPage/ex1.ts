import { defineHtml, useRef } from "@elfui/core";

const code1 = `<elf-pop-confirm
  title="确认删除？"
  content="删除后不可恢复"
  @confirm="onConfirm"
  @cancel="onCancel"
>
  <elf-button color="danger">删除</elf-button>
</elf-pop-confirm>`;

const code1Script = `const lastAction = useRef("尚未操作");

const onConfirm = () => lastAction.set("已确认删除");
const onCancel = () => lastAction.set("已取消");`;

const code2 = `<elf-pop-confirm title="确认保存？" trigger="hover">
  <elf-button variant="outlined">悬浮触发</elf-button>
</elf-pop-confirm>`;

const lastAction = useRef("尚未操作");

const onConfirm = (): void => {
  lastAction.set("已确认删除");
};

const onCancel = (): void => {
  lastAction.set("已取消");
};

const PagePopConfirmEx1 = defineHtml(`
  <h2>基础用法</h2>
  <elf-playground title="点击确认" :code=${code1} :script=${code1Script}>
    <span slot="status" class="demo-state">上次操作：{{ lastAction }}</span>
    <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
      <elf-pop-confirm
        title="确认删除？"
        content="删除后不可恢复"
        @confirm=${onConfirm}
        @cancel=${onCancel}
      >
        <elf-button color="danger">删除</elf-button>
      </elf-pop-confirm>
    </div>
  </elf-playground>

  <elf-playground title="悬浮触发" :code=${code2}>
    <elf-pop-confirm title="确认保存？" content="保存当前草稿" trigger="hover">
      <elf-button variant="outlined">悬浮触发</elf-button>
    </elf-pop-confirm>
  </elf-playground>
`);

export { PagePopConfirmEx1 };
