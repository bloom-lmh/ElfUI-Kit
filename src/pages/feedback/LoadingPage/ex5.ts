import { defineHtml, useRef } from "@elfui/core";

const refreshing = useRef(false);

const refresh = (): void => {
  if (refreshing.peek()) return;
  refreshing.set(true);
  window.setTimeout(() => refreshing.set(false), 900);
};

const code = `<elf-loading :loading="refreshing" variant="dots" text="刷新动态中">
  <elf-card title="团队动态">...</elf-card>
</elf-loading>`;

const script = `const refreshing = useRef(false);`;

const PageLoadingEx5 = defineHtml(`
  <elf-playground title="卡片内容刷新" :code=${code} :script=${script}>
    <div style="display:grid;gap:12px;width:100%;max-width:620px">
      <elf-loading :loading=${refreshing} variant="dots" text="刷新动态中">
        <elf-card variant="outlined" title="团队动态" subtitle="局部刷新不会阻塞页面其他操作">
          <div style="display:grid;gap:14px">
            <div v-for="name in ['设计稿已评审', '构建任务已完成', '发布窗口已确认']" :key="name">
              <strong>{{ name }}</strong>
              <p style="margin:3px 0 0;color:var(--elf-text-secondary)">刚刚 · ElfUI 项目组</p>
            </div>
          </div>
        </elf-card>
      </elf-loading>
      <elf-button type="primary" @click=${refresh}>刷新卡片</elf-button>
    </div>
  </elf-playground>
`);

export { PageLoadingEx5 };
