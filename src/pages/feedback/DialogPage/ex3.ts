import { defineHtml, useRef } from "@elfui/core";

const open = useRef(false);
const focusStatus = useRef("等待打开");

const code = `<elf-button @click="showDialog">打开键盘对话框</elf-button>
<elf-dialog
  v-model:open="open"
  title="创建工作区"
  @open-auto-focus="onAutoFocus"
  @close-auto-focus="onRestoreFocus"
>
  <label>
    工作区名称
    <input autofocus placeholder="例如：设计系统" />
  </label>
  <template #footer>
    <elf-button @click="closeDialog">取消</elf-button>
    <elf-button @click="closeDialog">创建</elf-button>
  </template>
</elf-dialog>`;

const script = `const open = useRef(false);
const focusStatus = useRef("等待打开");

const showDialog = () => open.set(true);
const closeDialog = () => open.set(false);
const onAutoFocus = () => focusStatus.set("焦点已进入对话框；Tab 不会离开");
const onRestoreFocus = () => focusStatus.set("焦点已返回打开按钮");`;

const showDialog = (): void => {
  focusStatus.set("正在打开");
  open.set(true);
};

const closeDialog = (): void => {
  open.set(false);
};

const onOpenUpdate = (event: CustomEvent<boolean>): void => {
  open.set(Boolean(event.detail));
};

const onAutoFocus = (): void => {
  focusStatus.set("焦点已进入对话框；Tab 不会离开");
};

const onRestoreFocus = (): void => {
  focusStatus.set("焦点已返回打开按钮");
};

const PageDialogEx3 = defineHtml(`
  <h2>键盘与焦点</h2>
  <elf-playground title="焦点陷阱与关闭后恢复" :code=${code} :script=${script}>
    <span slot="status" class="demo-state">{{ focusStatus }}</span>
    <elf-button @click=${showDialog}>打开键盘对话框</elf-button>
    <elf-dialog
      :open=${open}
      title="创建工作区"
      @update:open=${onOpenUpdate}
      @open-auto-focus=${onAutoFocus}
      @close-auto-focus=${onRestoreFocus}
    >
      <div style="display:grid;gap:8px;min-width:min(360px,70vw)">
        <label for="dialog-workspace-name" style="font-weight:600">工作区名称</label>
        <input
          id="dialog-workspace-name"
          autofocus
          placeholder="例如：设计系统"
          style="box-sizing:border-box;width:100%;padding:10px 12px;border:1px solid var(--elf-border);border-radius:6px;background:var(--elf-bg-paper);color:var(--elf-text-primary);outline:none"
        />
        <small style="color:var(--elf-text-secondary)">按 Tab / Shift+Tab 检查循环焦点，按 Esc 关闭。</small>
      </div>
      <template #footer>
        <elf-button variant="text" @click=${closeDialog}>取消</elf-button>
        <elf-button @click=${closeDialog}>创建</elf-button>
      </template>
    </elf-dialog>
  </elf-playground>
`);

export { PageDialogEx3 };
