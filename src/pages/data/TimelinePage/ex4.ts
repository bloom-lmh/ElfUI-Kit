import { defineHtml } from "@elfui/core";

const items = [
  { timestamp: "2026-07-02 09:30", color: "primary", cardClass: "release-card" },
  { timestamp: "2026-07-08 14:00", color: "info", cardClass: "release-card" },
  { timestamp: "2026-07-18 16:20", color: "success", cardClass: "release-card" }
];

const cardStyle =
  "padding:16px;border:1px solid var(--elf-divider);border-radius:8px;background:var(--elf-bg-paper);box-shadow:0 4px 14px rgb(0 0 0 / 6%)";

const code = `<elf-timeline :items.prop=\${items}>
  <article slot="item-0" class="release-card">...</article>
  <svg slot="dot-0" viewBox="0 0 20 20" aria-hidden="true">...</svg>

  <article slot="item-1" class="release-card">...</article>
  <svg slot="dot-1" viewBox="0 0 20 20" aria-hidden="true">...</svg>
</elf-timeline>`;

const script = `const items = [
  { timestamp: "2026-07-02 09:30", color: "primary", cardClass: "release-card" },
  { timestamp: "2026-07-08 14:00", color: "info", cardClass: "release-card" }
];

// item-N replaces the Nth card body; dot-N replaces its decorative node icon.
// Slotted cards remain in the light DOM, so ordinary page classes can style them.`;

const PageTimelineEx4 = defineHtml(`
  <h2>自定义卡片与节点图标</h2>
  <elf-playground title="item-N / dot-N 命名插槽与卡片类名" :code=${code} :script=${script}>
    <elf-timeline :items.prop=${items}>
      <article slot="item-0" class="release-card" :style=${cardStyle}>
        <strong style="display:block;margin-bottom:6px">需求评审完成</strong>
        <p style="margin:0;color:var(--elf-text-secondary)">范围与验收标准已确认，可以进入界面设计阶段。</p>
      </article>
      <svg slot="dot-0" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="m5 10 3 3 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>

      <article slot="item-1" class="release-card" :style=${cardStyle}>
        <strong style="display:block;margin-bottom:6px">设计稿已交付</strong>
        <p style="margin:0 0 10px;color:var(--elf-text-secondary)">桌面端与移动端关键页面已覆盖。</p>
        <elf-tag size="sm" color="info">等待开发</elf-tag>
      </article>
      <svg slot="dot-1" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M4 5.5h12M4 10h12M4 14.5h7" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      </svg>

      <article slot="item-2" class="release-card" :style=${cardStyle}>
        <strong style="display:block;margin-bottom:6px">版本发布</strong>
        <p style="margin:0;color:var(--elf-text-secondary)">所有自动化检查通过，版本已进入稳定通道。</p>
      </article>
      <svg slot="dot-2" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M10 3v10m0-10 4 4m-4-4L6 7M4 16h12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </elf-timeline>
  </elf-playground>
`);

export { PageTimelineEx4 };
