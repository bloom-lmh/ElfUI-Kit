import { defineHtml } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  horizontal: { zh: "横向时间轴", en: "Horizontal timeline" },
  horizontalPlayground: { zh: "水平流向并上下交替", en: "Horizontal flow alternating above and below" },
  reverse: { zh: "横向反转", en: "Reversed horizontal timeline" },
  analysis: { zh: "需求分析", en: "Requirements" },
  design: { zh: "界面设计", en: "UI design" },
  coding: { zh: "编码实现", en: "Implementation" },
  testing: { zh: "测试验收", en: "Acceptance testing" },
  release: { zh: "发布上线", en: "Release" }
});

const steps = [
  { title: t("analysis"), timestamp: "Week 1", color: "primary", icon: "📋" },
  { title: t("design"), timestamp: "Week 2", color: "info", icon: "🎨" },
  { title: t("coding"), timestamp: "Week 3-4", color: "warning", icon: "💻" },
  { title: t("testing"), timestamp: "Week 5", color: "danger", icon: "🧪" },
  { title: t("release"), timestamp: "Week 6", color: "success", icon: "🚀" }
];

const code1 = `<elf-timeline :items.prop=\${steps} mode="horizontal" />`;

const code2 = `<elf-timeline :items.prop=\${steps} mode="horizontal" reverse />`;

const script = `const steps = [
  { title: "${t("analysis")}", timestamp: "Week 1", color: "primary", icon: "📋" },
  { title: "${t("design")}", timestamp: "Week 2", color: "info", icon: "🎨" },
  { title: "${t("release")}", timestamp: "Week 6", color: "success", icon: "🚀" }
];`;

const PageTimelineEx2 = defineHtml(`
  <h2>${t("horizontal")}</h2>
  <elf-playground :title=${t("horizontalPlayground")} :code=${code1} :script=${script}>
    <elf-timeline :items.prop=${steps} mode="horizontal"></elf-timeline>
  </elf-playground>

  <h2>${t("reverse")}</h2>
  <elf-playground title="horizontal + reverse" :code=${code2} :script=${script}>
    <elf-timeline :items.prop=${steps} mode="horizontal" reverse></elf-timeline>
  </elf-playground>
`);

export { PageTimelineEx2 };
