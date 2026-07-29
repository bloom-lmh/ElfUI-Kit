import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "外部挂载与防篡改", en: "External mount and anti-tamper" },
  report: { zh: "季度设计系统报告", en: "Quarterly design system report" },
  action: { zh: "模拟删除水印", en: "Simulate watermark removal" },
  detail: { zh: "水印层附加到报告容器，不移动组件内容；删除后由受限 MutationObserver 恢复。", en: "The watermark attaches to the report container without moving content and is restored by a scoped MutationObserver." }
});

const protectedCount = useRef(0);
const removeOverlay = (event: Event): void => {
  const root = (event.currentTarget as HTMLElement).getRootNode() as Document | ShadowRoot;
  root.querySelector<HTMLElement>("#watermark-portal-demo [data-elf-watermark-overlay]")?.remove();
  protectedCount.set(protectedCount.peek() + 1);
};

const code = `<section id="report-surface">
  <elf-watermark
    append-to="#report-surface"
    anti-tamper
    :content.prop="['ELFUI', 'CONFIDENTIAL']"
  >
    <article>${t("report")}</article>
  </elf-watermark>
</section>`;
const script = `// anti-tamper observes only the target and overlay attributes.
// Removed or restyled overlays are restored in one queued microtask.`;

const PageWatermarkEx3 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <button slot="status" type="button" @click=${removeOverlay}>${t("action")} · ${protectedCount}</button>
    <section id="watermark-portal-demo" style="position:relative;width:100%;min-height:220px;border:1px solid var(--elf-border-color);border-radius:8px;overflow:hidden">
      <elf-watermark
        append-to="#watermark-portal-demo"
        anti-tamper
        :content.prop=${["ELFUI", "CONFIDENTIAL"]}
        :font.prop=${{ color: "rgba(37,99,235,.18)", fontWeight: 700 }}
      >
        <article style="padding:28px;min-height:164px;background:var(--elf-bg-paper)">
          <h3 style="margin:0 0 12px">${t("report")}</h3>
          <p style="margin:0;color:var(--elf-text-secondary)">${t("detail")}</p>
        </article>
      </elf-watermark>
    </section>
  </elf-playground>
`);

export { PageWatermarkEx3 };
