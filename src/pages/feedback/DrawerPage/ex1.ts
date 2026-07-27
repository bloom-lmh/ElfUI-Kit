import { defineHtml, useRef } from "@elfui/core";


const d1 = useRef(false),
  d2 = useRef(false),
  d3 = useRef(false),
  d4 = useRef(false),
  d5 = useRef(false);

const code1 = `<elf-drawer direction="rtl" v-model:open="open">...</elf-drawer>`;

const code2 = `<elf-drawer size="50%" v-model:open="open">...</elf-drawer>`;

const code1Script = `const open = useRef(false);

const showDrawer = () => open.set(true);
const closeDrawer = () => open.set(false);`;

const code2Script = `const open = useRef(false);

const showWideDrawer = () => open.set(true);
const closeWideDrawer = () => open.set(false);`;

const open1 = () => d1.set(true);

const open2 = () => d2.set(true);

const open3 = () => d3.set(true);

const open4 = () => d4.set(true);

const open5 = () => d5.set(true);

const close = () => {
  d1.set(false);
  d2.set(false);
  d3.set(false);
  d4.set(false);
  d5.set(false);
};

const PageDrawerEx1 = defineHtml(`
  <h2>基础用法（不同弹出方向）</h2>
  <elf-playground title="弹出方向（rtl / ltr / ttb / btt）" :code="code1" :script=${code1Script}>
    <div style="display:flex;gap:12px;flex-wrap:wrap">
      <elf-button @click="open1">右滑 (RTL)</elf-button
      ><elf-button @click="open2">左滑 (LTR)</elf-button
      ><elf-button @click="open3">上滑 (TTB)</elf-button
      ><elf-button @click="open4">下滑 (BTT)</elf-button>
    </div>
    <elf-drawer v-model:open="d1" title="右侧详情" direction="rtl"
      ><div style="padding:16px">
        <h3>右侧抽屉</h3>
        <p>适合放置商品详情、属性设置。</p>
      </div></elf-drawer
    >
    <elf-drawer v-model:open="d2" title="左侧菜单" direction="ltr"
      ><div style="padding:16px">
        <h3>左侧导航</h3>
        <p>适合侧边菜单栏。</p>
      </div></elf-drawer
    >
    <elf-drawer v-model:open="d3" title="顶部过滤" direction="ttb" size="250px"
      ><div style="padding:16px"><h3>顶部面板</h3></div></elf-drawer
    >
    <elf-drawer v-model:open="d4" title="底部控制" direction="btt" size="300px"
      ><div style="padding:16px"><h3>底部面板</h3></div></elf-drawer
    >
  </elf-playground>
  <h2>自定义大小</h2>
  <elf-playground title="自定义宽度（50%）" :code="code2" :script=${code2Script}>
    <elf-button @click="open5">打开 50% 宽抽屉</elf-button>
    <elf-drawer v-model:open="d5" title="大幅面设置" size="50%"
      ><div style="padding:16px"><h3>50% 屏幕宽度</h3></div></elf-drawer
    >
  </elf-playground>
`);

export { PageDrawerEx1 };
