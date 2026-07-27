import { defineHtml, useHost, useRef } from "@elfui/core";
import type { ScrollbarExpose } from "../../../components/Layout/Scrollbar/types";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  section: { zh: "自定义外观", en: "Custom appearance" },
  title: { zh: "方形按钮、自定义内容与点击状态", en: "Square action, custom content and click state" },
  clicks: { zh: "点击次数", en: "Clicks" },
  intro: { zh: "方形返回按钮", en: "Square BackTop" },
  introBody: { zh: "通过 shape、size 和默认插槽定制浮动操作按钮。", en: "Customize the floating action with shape, size and the default slot." },
  more: { zh: "更多内容", en: "More content" },
  moreBody: { zh: "使用 right、bottom 和 z-index 避开其它浮层。", en: "Use right, bottom and z-index to avoid other floating surfaces." },
  end: { zh: "结束", en: "End" },
  endBody: { zh: "同一个组件既可监听内容容器，也可监听整个窗口。", en: "The same component can observe a content container or the window." }
});

const times = useRef(0);
const host = useHost();
const getCustomScrollTarget = (): HTMLElement | null =>
  host.shadowRoot?.querySelector<HTMLElement & ScrollbarExpose>("#backtop-custom-scroll")?.wrapRef ?? null;
const onClick = (): void => times.set(times.value + 1);
const code = `<elf-back-top :target.prop="getCustomScrollTarget" shape="square" size="48px" bottom="136px" right="72px">Top</elf-back-top>`;
const script = `const host = useHost();
const times = useRef(0);
const getCustomScrollTarget = () =>
  host.shadowRoot?.querySelector("#backtop-custom-scroll")?.wrapRef ?? null;
const onClick = () => times.set(times.value + 1);`;

const PageBacktopEx2 = defineHtml(`
  <h2>${t("section")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <span slot="status" class="demo-state">${t("clicks")}: ${times.value}</span>
    <div style="display:grid;gap:12px;width:100%;max-width:760px">
      <elf-scrollbar id="backtop-custom-scroll" height="260px" always style="border:1px solid var(--elf-divider);background:var(--elf-bg-paper)">
        <section style="min-height:220px;padding:24px;background:color-mix(in srgb,var(--elf-info) 8%,var(--elf-bg-paper))"><h3>${t("intro")}</h3><p>${t("introBody")}</p></section>
        <section style="min-height:220px;padding:24px;background:color-mix(in srgb,var(--elf-success) 8%,var(--elf-bg-paper))"><h3>${t("more")}</h3><p>${t("moreBody")}</p></section>
        <section style="min-height:220px;padding:24px;background:color-mix(in srgb,var(--elf-warning) 9%,var(--elf-bg-paper))"><h3>${t("end")}</h3><p>${t("endBody")}</p></section>
      </elf-scrollbar>
      <elf-back-top :target.prop=${getCustomScrollTarget} shape="square" size="48px" bottom="136px" right="72px" @click=${onClick}>Top</elf-back-top>
    </div>
  </elf-playground>
`);

export { PageBacktopEx2 };
