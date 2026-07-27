import { defineHtml, defineStyle, globalStyle, useRef } from "@elfui/core";
import drawerDemoStyles from "./demo.scss?inline";

const open = useRef(false);
const size = useRef(420);
const status = useRef("初始宽度 420px");

const showDrawer = (): void => {
  open.set(true);
};

const onResize = (event: CustomEvent<{ size: number }>): void => {
  size.set(event.detail.size);
  status.set(`当前宽度 ${event.detail.size}px`);
};

const onResizeEnd = (event: CustomEvent<{ size: number }>): void => {
  status.set(`已保存宽度 ${event.detail.size}px`);
};

const code = `<elf-button @click="showDrawer">打开可调抽屉</elf-button>
<elf-drawer
  v-model:open="open"
  title="工作区详情"
  size="420px"
  resizable
  :min-size="300"
  :max-size="640"
  @resize="onResize"
  @resize-end="onResizeEnd"
>
  <!-- 详情内容 -->
</elf-drawer>`;

const script = `const open = useRef(false);
const size = useRef(420);
const status = useRef("初始宽度 420px");

const showDrawer = () => open.set(true);

const onResize = (event) => {
  size.set(event.detail.size);
  status.set(\`当前宽度 \${event.detail.size}px\`);
};

const onResizeEnd = (event) => {
  status.set(\`已保存宽度 \${event.detail.size}px\`);
};`;

defineStyle(drawerDemoStyles);
globalStyle(drawerDemoStyles);

const PageDrawerEx4 = defineHtml(`
  <h2>可调整尺寸</h2>
  <elf-playground title="拖拽边缘与键盘调整" :code=${code} :script=${script}>
    <span slot="status">{{ status }}</span>
    <div class="drawer-resize-trigger">
      <div>
        <strong>自适应工作区</strong>
        <span>拖动抽屉内侧边缘，或聚焦手柄后使用方向键。</span>
      </div>
      <elf-button type="primary" @click=${showDrawer}>打开可调抽屉</elf-button>
    </div>

    <elf-drawer
      v-model:open="open"
      title="工作区详情"
      size="420px"
      resizable
      :min-size=${300}
      :max-size=${640}
      @resize=${onResize}
      @resize-end=${onResizeEnd}
    >
      <section class="drawer-resize-content">
        <div class="drawer-resize-hero">
          <span>当前面板</span>
          <strong>{{ size }}px</strong>
          <p>尺寸限制在 300–640px；键盘每次调整 10px，Home / End 可直达边界。</p>
        </div>
        <div class="drawer-resize-metrics">
          <article><span>待处理</span><strong>18</strong></article>
          <article><span>本周发布</span><strong>6</strong></article>
        </div>
      </section>
    </elf-drawer>
  </elf-playground>
`);

export { PageDrawerEx4 };
