import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "标题套装 · 霓虹", en: "Heading suite · Neon" },
  status: {
    zh: "neon · 大写宽字距 · 发光强调",
    en: "neon · Uppercase wide tracking · Glow accents",
  },
  meta: {
    zh: "科技活动、实时控制台与深色展示页可直接使用。",
    en: "Drop into tech events, live consoles, and dark showcase pages.",
  },
  eyebrow: { zh: "系统在线", en: "System online" },
  h1: { zh: "实时控制台", en: "Live console" },
  h2: { zh: "节点状态", en: "Node status" },
  h3: { zh: "边缘节点", en: "Edge nodes" },
  h4: { zh: "核心服务", en: "Core services" },
  h5: { zh: "实时指标", en: "Live metrics" },
  h6: { zh: "上次同步 12 秒前", en: "Synced 12s ago" },
});

const code = `<div class="heading-suite heading-suite-neon">
  <section class="heading-suite-section">
    <span class="heading-suite-meta">Neon · uppercase · glow · [01] numbering</span>
    <elf-heading family="neon" level="1" eyebrow="System online">Live console</elf-heading>
    <elf-heading family="neon" level="2" numbered accent>Node status</elf-heading>
    <elf-heading family="neon" level="3" chip>Edge nodes</elf-heading>
    <elf-heading family="neon" level="4">Core services</elf-heading>
    <elf-heading family="neon" level="5">Live metrics</elf-heading>
    <elf-heading family="neon" level="6">Synced 12s ago</elf-heading>
  </section>
</div>`;

const script = `// neon 套装的序号渲染为 [01] 等宽发光样式，accent 是发光竖条，chip 为霓虹描边标签。`;

defineStyle(styles);

const PageHeadingEx5 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <span slot="status" class="heading-suite-status">${t("status")}</span>
    <div class="heading-suite heading-suite-neon">
      <section class="heading-suite-section">
        <span class="heading-suite-meta">${t("meta")}</span>
        <elf-heading family="neon" level="1" eyebrow="${t("eyebrow")}">${t("h1")}</elf-heading>
        <elf-heading family="neon" level="2" numbered accent>${t("h2")}</elf-heading>
        <elf-heading family="neon" level="3" chip>${t("h3")}</elf-heading>
        <elf-heading family="neon" level="4">${t("h4")}</elf-heading>
        <elf-heading family="neon" level="5">${t("h5")}</elf-heading>
        <elf-heading family="neon" level="6">${t("h6")}</elf-heading>
      </section>
    </div>
  </elf-playground>
`);

export { PageHeadingEx5 };
