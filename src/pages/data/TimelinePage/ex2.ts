import { defineHtml } from "@elfui/core";

const steps = [
  { title: "需求分析", timestamp: "Week 1", color: "primary", icon: "📋" },
  { title: "UI 设计", timestamp: "Week 2", color: "info", icon: "🎨" },
  { title: "编码实现", timestamp: "Week 3-4", color: "warning", icon: "💻" },
  { title: "测试验收", timestamp: "Week 5", color: "danger", icon: "🧪" },
  { title: "发布上线", timestamp: "Week 6", color: "success", icon: "🚀" }
];

const code1 = `<elf-timeline :items.prop=\${steps} mode="horizontal" />`;

const code2 = `<elf-timeline :items.prop=\${steps} mode="horizontal" reverse />`;

const script = `const steps = [
  { title: "需求分析", timestamp: "Week 1", color: "primary", icon: "📋" },
  { title: "UI 设计", timestamp: "Week 2", color: "info", icon: "🎨" },
  { title: "发布上线", timestamp: "Week 6", color: "success", icon: "🚀" }
];`;

const PageTimelineEx2 = defineHtml(`
  <h2>横向时间轴</h2>
  <elf-playground title="mode='horizontal'：水平流向，上下交替" :code=${code1} :script=${script}>
    <elf-timeline :items.prop=${steps} mode="horizontal"></elf-timeline>
  </elf-playground>

  <h2>横向反转</h2>
  <elf-playground title="horizontal + reverse" :code=${code2} :script=${script}>
    <elf-timeline :items.prop=${steps} mode="horizontal" reverse></elf-timeline>
  </elf-playground>
`);

export { PageTimelineEx2 };
