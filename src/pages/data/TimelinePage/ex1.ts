import { defineHtml } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  alternating: { zh: "双边交替", en: "Alternating sides" },
  alternatingPlayground: { zh: "中轴与左右交替", en: "A centered axis with alternating sides" },
  both: { zh: "节点双侧信息", en: "Two-sided node content" },
  bothPlayground: { zh: "一个节点左右两侧都有内容", en: "A single node with content on both sides" },
  attributes: { zh: "Element Plus 节点属性", en: "Element Plus item attributes" },
  project: { zh: "项目立项", en: "Project kickoff" },
  architecture: { zh: "确定技术方案", en: "Architecture approved" },
  development: { zh: "开发阶段", en: "Development" },
  developmentDetail: { zh: "核心模块开发，覆盖率 85%+", en: "Core modules developed with 85%+ coverage" },
  testing: { zh: "内部测试", en: "Internal testing" },
  testingDetail: { zh: "Alpha 版本发布", en: "Alpha release published" },
  release: { zh: "正式发布", en: "Public release" },
  releaseDetail: { zh: "v1.0.0 上线", en: "v1.0.0 is live" },
  arrive: { zh: "到达", en: "Arrival" },
  depart: { zh: "出发", en: "Departure" },
  beijing: { zh: "北京南站", en: "Beijing South Station" },
  shanghai: { zh: "上海虹桥", en: "Shanghai Hongqiao" },
  train: { zh: "次列车", en: " train" },
  hotel: { zh: "抵达酒店", en: "Hotel arrival" },
  hotelName: { zh: "浦东香格里拉", en: "Pudong Shangri-La" },
  top: { zh: "顶置时间", en: "Timestamp on top" },
  hidden: { zh: "隐藏时间", en: "Hidden timestamp" },
  comment: { zh: "item 支持 placement、hide-timestamp、type、size、hollow", en: "Items support placement, hide-timestamp, type, size, and hollow." }
});

const items = [
  {
    timestamp: "2024-06-01",
    title: t("project"),
    content: t("architecture"),
    color: "primary",
    icon: "✓"
  },
  {
    timestamp: "2024-07-15",
    title: t("development"),
    content: t("developmentDetail"),
    color: "info",
    icon: "⌨"
  },
  {
    timestamp: "2024-09-01",
    title: t("testing"),
    content: t("testingDetail"),
    color: "warning",
    icon: "⚠"
  },
  {
    timestamp: "2024-11-01",
    title: t("release"),
    content: t("releaseDetail"),
    color: "success",
    icon: "★"
  }
];

const bothItems = [
  {
    timestamp: "08:00",
    title: t("arrive"),
    timestamp2: "08:30",
    title2: t("depart"),
    content: t("beijing"),
    content2: `G123${t("train")}`,
    color: "primary",
    icon: "🚄",
    side: "both"
  },
  {
    timestamp: "12:00",
    title: t("arrive"),
    timestamp2: "13:00",
    title2: t("depart"),
    content: t("shanghai"),
    content2: `D456${t("train")}`,
    color: "info",
    icon: "🚄",
    side: "both"
  },
  { timestamp: "18:00", title: t("hotel"), content: t("hotelName"), color: "success", icon: "🏨" }
];

const code1 = `<elf-timeline :items.prop=\${items} mode="alternate" />`;

const code2 = `<elf-timeline :items.prop=\${bothItems} mode="alternate" />`;

const code3 = `<elf-timeline :items.prop=\${elementPlusItems} mode="alternate-reverse" />
<!-- ${t("comment")} -->`;

const script1 = `const items = [
  { timestamp: "2024-06-01", title: "${t("project")}", content: "${t("architecture")}", color: "primary", icon: "✓" },
  { timestamp: "2024-07-15", title: "${t("development")}", content: "${t("developmentDetail")}", color: "info", icon: "⌨" }
];`;

const script2 = `const bothItems = [
  {
    timestamp: "08:00",
    title: "${t("arrive")}",
    timestamp2: "08:30",
    title2: "${t("depart")}",
    content: "${t("beijing")}",
    content2: "G123${t("train")}",
    side: "both"
  }
];`;

const elementPlusItems = [
  { timestamp: "2026-07-13", title: t("top"), placement: "top", type: "success", size: "large", icon: "✓" },
  { timestamp: "2026-07-14", title: t("hidden"), hideTimestamp: true, type: "warning", hollow: true, icon: "!" }
];

const script3 = `const elementPlusItems = [
  { timestamp: "2026-07-13", title: "${t("top")}", placement: "top", type: "success", size: "large", icon: "✓" },
  { timestamp: "2026-07-14", title: "${t("hidden")}", hideTimestamp: true, type: "warning", hollow: true, icon: "!" }
];`;

const PageTimelineEx1 = defineHtml(`
  <h2>${t("alternating")}</h2>
  <elf-playground :title=${t("alternatingPlayground")} :code=${code1} :script=${script1}>
    <elf-timeline :items.prop=${items} mode="alternate"></elf-timeline>
  </elf-playground>

  <h2>${t("both")}</h2>
  <elf-playground :title=${t("bothPlayground")} :code=${code2} :script=${script2}>
    <elf-timeline :items.prop=${bothItems} mode="alternate"></elf-timeline>
  </elf-playground>

  <h2>${t("attributes")}</h2>
  <elf-playground title="alternate-reverse + item placement/type/size/hollow" :code=${code3} :script=${script3}>
    <elf-timeline
      :items.prop=${elementPlusItems}
      mode="alternate-reverse"
    ></elf-timeline>
  </elf-playground>
`);

export { PageTimelineEx1 };
