import { defineHtml } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "出行时间线（双侧与单侧混用）", en: "Travel timeline with mixed sides" },
  playground: { zh: "双侧节点与单侧信息混用", en: "Mix two-sided nodes with single-sided entries" },
  depart: { zh: "出发", en: "Departure" },
  arrive: { zh: "到达", en: "Arrival" },
  transfer: { zh: "换乘", en: "Transfer" },
  reached: { zh: "抵达", en: "Reached destination" },
  lunch: { zh: "午餐会议", en: "Lunch meeting" },
  lunchDetail: { zh: "与客户讨论项目进度", en: "Discuss project progress with the client" },
  return: { zh: "返回", en: "Return" },
  returnDetail: { zh: "乘坐高铁返回北京", en: "Return to Beijing by high-speed rail" },
  beijing: { zh: "北京南站", en: "Beijing South Station" },
  tianjin: { zh: "天津站", en: "Tianjin Station" },
  binhai: { zh: "滨海站", en: "Binhai Station" },
  office: { zh: "滨海新区办公室", en: "Binhai New Area office" }
});

const commute = [
  {
    timestamp: "08:00",
    title: t("depart"),
    timestamp2: "08:30",
    title2: t("arrive"),
    content: t("beijing"),
    content2: t("tianjin"),
    color: "primary",
    icon: "🚄",
    side: "both"
  },
  {
    timestamp: "09:00",
    title: t("transfer"),
    timestamp2: "09:15",
    title2: t("depart"),
    content: t("tianjin"),
    content2: t("binhai"),
    color: "warning",
    icon: "🚌",
    side: "both"
  },
  { timestamp: "10:00", title: t("reached"), content: t("office"), color: "success", icon: "📍" },
  {
    timestamp: "12:00",
    title: t("lunch"),
    content: t("lunchDetail"),
    color: "info",
    icon: "🍽"
  },
  { timestamp: "18:00", title: t("return"), content: t("returnDetail"), color: "primary", icon: "🚄" }
];

const code = `<elf-timeline :items.prop=\${commute} mode="alternate" />`;

const script = `const commute = [
  { timestamp: "08:00", title: "${t("depart")}", timestamp2: "08:30", title2: "${t("arrive")}", side: "both" },
  { timestamp: "10:00", title: "${t("reached")}", content: "${t("office")}", color: "success", icon: "📍" }
];`;

const PageTimelineEx3 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("playground")} :code=${code} :script=${script}>
    <elf-timeline :items.prop=${commute} mode="alternate"></elf-timeline>
  </elf-playground>
`);

export { PageTimelineEx3 };
