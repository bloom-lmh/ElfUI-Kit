import { defineHtml, useRef } from "@elfui/core";

const scrollState = useRef("scrollTop: 0 / fixed: false");
const rows = Array.from({ length: 14 }, (_, index) => `目标容器内容 ${index + 1}`);

const onScroll = (event: CustomEvent<{ scrollTop: number; fixed: boolean }>): void => {
  const { scrollTop, fixed } = event.detail;
  scrollState.set(`scrollTop: ${Math.round(scrollTop)} / fixed: ${fixed}`);
};

const code = `<section class="affix-target">
  <elf-sticky
    target=".affix-target"
    offset="12"
    teleported
    append-to=".sticky-portal-target"
    @scroll=\${onScroll}
  >
    <div class="toolbar">目标容器工具栏</div>
  </elf-sticky>
</section>`;

const script = `const onScroll = (event) => {
  const { scrollTop, fixed } = event.detail;
  console.log(scrollTop, fixed);
};

// 实例同时暴露 update() 与 updateRoot()。`;

const PageStickyEx4 = defineHtml(`
  <h2>目标容器与 Teleport</h2>
  <elf-playground title="target / teleported / append-to / scroll" :code=${code} :script=${script}>
    <div style="position:relative;width:100%;max-width:720px">
      <div class="sticky-portal-target"></div>
      <section
        class="affix-target"
        style="height:280px;overflow:auto;border:1px solid var(--elf-border);border-radius:12px;background:var(--elf-bg-paper)"
      >
        <div style="height:84px;display:grid;place-items:center;color:var(--elf-text-secondary)">
          向下滚动以触发吸附
        </div>
        <elf-sticky
          target=".affix-target"
          offset="12"
          teleported
          append-to=".sticky-portal-target"
          @scroll=${onScroll}
          style="--sticky-shadow:0 12px 30px -18px rgba(0,0,0,.45)"
        >
          <div style="display:flex;align-items:center;justify-content:space-between;height:48px;padding:0 16px;border:1px solid var(--elf-border);border-radius:10px;background:var(--elf-bg-paper);box-sizing:border-box">
            <strong>目标容器工具栏</strong>
            <span style="font-size:12px;color:var(--elf-primary)">{{ scrollState }}</span>
          </div>
        </elf-sticky>
        <div style="display:grid;gap:8px;padding:16px">
          <div
            v-for="row in rows"
            :key="row"
            style="height:36px;display:flex;align-items:center;padding:0 12px;border-radius:8px;background:var(--elf-bg-overlay)"
          >
            {{ row }}
          </div>
        </div>
      </section>
    </div>
  </elf-playground>
`);

export { PageStickyEx4 };
