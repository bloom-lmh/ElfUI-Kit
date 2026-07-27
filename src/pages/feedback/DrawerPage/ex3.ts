import { defineHtml, defineStyle, globalStyle, useRef } from "@elfui/core";
import drawerDemoStyles from "./demo.scss?inline";

const open = useRef(false);
const status = useRef("等待打开");

const showDrawer = (): void => {
  status.set("正在打开");
  open.set(true);
};

const closeDrawer = (): void => {
  open.set(false);
};

const onAutoFocus = (): void => {
  status.set("焦点已进入抽屉，页面滚动已锁定");
};

const onRestoreFocus = (): void => {
  status.set("焦点已返回打开按钮");
};

const code = `<elf-button @click="showDrawer">打开筛选抽屉</elf-button>
<elf-drawer
  v-model:open="open"
  title="团队筛选"
  direction="rtl"
  size="min(420px, 100vw)"
  @open-auto-focus="onAutoFocus"
  @close-auto-focus="onRestoreFocus"
>
  <label>
    关键词
    <input autofocus placeholder="姓名或团队" />
  </label>
  <elf-button @click="closeDrawer">应用筛选</elf-button>
</elf-drawer>`;

const script = `const open = useRef(false);
const status = useRef("等待打开");

const showDrawer = () => open.set(true);
const closeDrawer = () => open.set(false);

const onAutoFocus = () => {
  status.set("焦点已进入抽屉，页面滚动已锁定");
};

const onRestoreFocus = () => {
  status.set("焦点已返回打开按钮");
};`;

// Drawer 会把轻 DOM 内容投影到 body；同一组唯一前缀样式需同时覆盖页面与投影层。
defineStyle(drawerDemoStyles);
globalStyle(drawerDemoStyles);

const PageDrawerEx3 = defineHtml(`
  <h2>焦点与移动端</h2>
  <elf-playground title="焦点恢复、滚动锁与窄屏尺寸" :code=${code} :script=${script}>
    <span slot="status">{{ status }}</span>
    <div class="drawer-focus-trigger">
      <elf-button type="primary" @click="showDrawer()">打开筛选抽屉</elf-button>
    </div>

    <elf-drawer
      v-model:open="open"
      title="团队筛选"
      direction="rtl"
      size="min(420px, 100vw)"
      @open-auto-focus="onAutoFocus()"
      @close-auto-focus="onRestoreFocus()"
    >
      <form class="drawer-filter-form" @submit.prevent="closeDrawer()">
        <p class="drawer-filter-intro">
          Tab 与 Shift+Tab 始终停留在抽屉内；按 Esc 关闭后，焦点返回打开按钮。
        </p>
        <div class="drawer-filter-grid">
          <label class="drawer-filter-field">
            关键词
            <input autofocus placeholder="姓名或团队" />
          </label>
          <label class="drawer-filter-field">
            工作状态
            <select>
              <option>全部状态</option>
              <option>进行中</option>
              <option>等待评审</option>
            </select>
          </label>
        </div>
        <div class="drawer-filter-summary">
          <div><strong>24</strong><span>匹配成员</span></div>
          <div><strong>6</strong><span>活跃项目</span></div>
        </div>
        <div class="drawer-filter-actions">
          <elf-button @click="closeDrawer()">取消</elf-button>
          <elf-button type="primary" native-type="submit">应用筛选</elf-button>
        </div>
      </form>
    </elf-drawer>
  </elf-playground>
`);

export { PageDrawerEx3 };
