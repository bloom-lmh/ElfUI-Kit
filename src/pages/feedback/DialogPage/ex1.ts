import { defineHtml, useRef } from "@elfui/core";


const d1 = useRef(false),
  d2 = useRef(false),
  d3 = useRef(false);

const code1 = `<elf-dialog v-model:open="open" title="提示">
  <p>内容</p>
</elf-dialog>`;

const code2 = `<elf-dialog size="fullscreen" v-model:open="open">...</elf-dialog>`;

const code1Script = `const open = useRef(false);

const showDialog = () => open.set(true);
const closeDialog = () => open.set(false);`;

const code2Script = `const open = useRef(false);

const showFullscreenDialog = () => open.set(true);
const closeFullscreenDialog = () => open.set(false);`;

const open1 = () => d1.set(true);

const close1 = () => d1.set(false);

const open2 = () => d2.set(true);

const close2 = () => d2.set(false);

const open3 = () => d3.set(true);

const close3 = () => d3.set(false);

const PageDialogEx1 = defineHtml(`
  <h2>基础用法</h2>
  <elf-playground title="基本弹窗" :code="code1" :script=${code1Script}>
    <elf-button @click="open1">打开对话框</elf-button>
    <elf-dialog v-model:open="d1" title="提示" size="md">
      <p>这是一段对话框内容，内置响应式机制。</p>
      <template #footer
        ><elf-button @click="close1">取消</elf-button
        ><elf-button type="primary" @click="close1">确定</elf-button></template
      >
    </elf-dialog>
  </elf-playground>

  <h2>不同尺寸</h2>
  <elf-playground title="弹窗尺寸（sm / md / lg / fullscreen）" :code="code2" :script=${code2Script}>
    <div style="display:flex;gap:12px">
      <elf-button @click="open2">全屏 (fullscreen)</elf-button
      ><elf-button @click="open3">小尺寸 (sm)</elf-button>
    </div>
    <elf-dialog v-model:open="d2" title="全屏工作区" size="fullscreen">
      <div style="padding:24px;text-align:center">
        <h3>全屏弹窗</h3>
      </div>
      <template #footer
        ><elf-button @click="close2">返回</elf-button
        ><elf-button type="primary" @click="close2">保存</elf-button></template
      >
    </elf-dialog>
    <elf-dialog v-model:open="d3" title="删除确认" size="sm">
      <p style="color:#d32f2f;font-weight:500">此操作将永久删除该资源，确定继续？</p>
      <template #footer
        ><elf-button size="small" @click="close3">取消</elf-button
        ><elf-button size="small" type="primary" @click="close3">确认删除</elf-button></template
      >
    </elf-dialog>
  </elf-playground>
`);

export { PageDialogEx1 };
