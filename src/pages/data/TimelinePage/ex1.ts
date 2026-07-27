import { defineHtml } from "@elfui/core";

const items = [
  {
    timestamp: "2024-06-01",
    title: "项目立项",
    content: "确定技术方案",
    color: "primary",
    icon: "✓"
  },
  {
    timestamp: "2024-07-15",
    title: "开发阶段",
    content: "核心模块开发，覆盖率 85%+",
    color: "info",
    icon: "⌨"
  },
  {
    timestamp: "2024-09-01",
    title: "内部测试",
    content: "Alpha 版本发布",
    color: "warning",
    icon: "⚠"
  },
  {
    timestamp: "2024-11-01",
    title: "正式发布",
    content: "v1.0.0 上线",
    color: "success",
    icon: "★"
  }
];

const bothItems = [
  {
    timestamp: "08:00",
    title: "到达",
    timestamp2: "08:30",
    title2: "出发",
    content: "北京南站",
    content2: "G123 次列车",
    color: "primary",
    icon: "🚄",
    side: "both"
  },
  {
    timestamp: "12:00",
    title: "到达",
    timestamp2: "13:00",
    title2: "出发",
    content: "上海虹桥",
    content2: "D456 次列车",
    color: "info",
    icon: "🚄",
    side: "both"
  },
  { timestamp: "18:00", title: "抵达酒店", content: "浦东香格里拉", color: "success", icon: "🏨" }
];

const code1 = `<elf-timeline :items.prop=\${items} mode="alternate" />`;

const code2 = `<elf-timeline :items.prop=\${bothItems} mode="alternate" />`;

const code3 = `<elf-timeline :items.prop=\${elementPlusItems} mode="alternate-reverse" />
<!-- item 支持 placement、hide-timestamp、type、size、hollow -->`;

const script1 = `const items = [
  { timestamp: "2024-06-01", title: "项目立项", content: "确定技术方案", color: "primary", icon: "✓" },
  { timestamp: "2024-07-15", title: "开发阶段", content: "核心模块开发", color: "info", icon: "⌨" }
];`;

const script2 = `const bothItems = [
  {
    timestamp: "08:00",
    title: "到达",
    timestamp2: "08:30",
    title2: "出发",
    content: "北京南站",
    content2: "G123 次列车",
    side: "both"
  }
];`;

const elementPlusItems = [
  { timestamp: "2026-07-13", title: "顶置时间", placement: "top", type: "success", size: "large", icon: "✓" },
  { timestamp: "2026-07-14", title: "隐藏时间", hideTimestamp: true, type: "warning", hollow: true, icon: "!" }
];

const script3 = `const elementPlusItems = [
  { timestamp: "2026-07-13", title: "顶置时间", placement: "top", type: "success", size: "large", icon: "✓" },
  { timestamp: "2026-07-14", title: "隐藏时间", hideTimestamp: true, type: "warning", hollow: true, icon: "!" }
];`;

const PageTimelineEx1 = defineHtml(`
  <h2>双边交替</h2>
  <elf-playground title="mode='alternate'：中轴 + 左右交替" :code=${code1} :script=${script1}>
    <elf-timeline :items.prop=${items} mode="alternate"></elf-timeline>
  </elf-playground>

  <h2>节点双侧信息</h2>
  <elf-playground title="side='both'：一个节点左右两侧都有内容" :code=${code2} :script=${script2}>
    <elf-timeline :items.prop=${bothItems} mode="alternate"></elf-timeline>
  </elf-playground>

  <h2>Element Plus 节点属性</h2>
  <elf-playground title="alternate-reverse + item placement/type/size/hollow" :code=${code3} :script=${script3}>
    <elf-timeline
      :items.prop=${elementPlusItems}
      mode="alternate-reverse"
    ></elf-timeline>
  </elf-playground>
`);

export { PageTimelineEx1 };
