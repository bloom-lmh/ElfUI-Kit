import { defineHtml } from "@elfui/core";

const commute = [
  {
    timestamp: "08:00",
    title: "出发",
    timestamp2: "08:30",
    title2: "到达",
    content: "北京南站",
    content2: "天津站",
    color: "primary",
    icon: "🚄",
    side: "both"
  },
  {
    timestamp: "09:00",
    title: "换乘",
    timestamp2: "09:15",
    title2: "出发",
    content: "天津站",
    content2: "滨海站",
    color: "warning",
    icon: "🚌",
    side: "both"
  },
  { timestamp: "10:00", title: "抵达", content: "滨海新区办公室", color: "success", icon: "📍" },
  {
    timestamp: "12:00",
    title: "午餐会议",
    content: "与客户讨论项目进度",
    color: "info",
    icon: "🍽"
  },
  { timestamp: "18:00", title: "返回", content: "乘坐高铁返回北京", color: "primary", icon: "🚄" }
];

const code = `<elf-timeline :items.prop=\${commute} mode="alternate" />`;

const script = `const commute = [
  { timestamp: "08:00", title: "出发", timestamp2: "08:30", title2: "到达", side: "both" },
  { timestamp: "10:00", title: "抵达", content: "滨海新区办公室", color: "success", icon: "📍" }
];`;

const PageTimelineEx3 = defineHtml(`
  <h2>出行时间线（双侧 + 单侧混用）</h2>
  <elf-playground title="side='both' 混用单侧信息" :code=${code} :script=${script}>
    <elf-timeline :items.prop=${commute} mode="alternate"></elf-timeline>
  </elf-playground>
`);

export { PageTimelineEx3 };
