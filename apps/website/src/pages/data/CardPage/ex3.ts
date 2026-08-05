import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const BROKEN_IMAGE = "data:image/png;base64,broken";
const RECOVERED_IMAGE = "/logo.png";

const t = createDocsTranslator({
  title: { zh: "加载、骨架与媒体恢复", en: "Loading, skeleton, and media recovery" },
  loading: { zh: "加载中", en: "Loading" },
  ready: { zh: "内容已就绪", en: "Content ready" },
  complete: { zh: "完成加载", en: "Finish loading" },
  reset: { zh: "重新加载", en: "Reload" },
  report: { zh: "本周质量报告", en: "Weekly quality report" },
  reportSubtitle: { zh: "正在汇总 12 个数据源", en: "Aggregating 12 data sources" },
  reportCopy: {
    zh: "Card 的 loading 负责锁定交互和加载状态；正文骨架由 Skeleton 组合提供。",
    en: "Card loading locks interaction and announces status; Skeleton composes the body placeholder.",
  },
  score: { zh: "通过率 98.6%", en: "Pass rate 98.6%" },
  media: { zh: "媒体失败与重试", en: "Media failure and retry" },
  mediaSubtitle: {
    zh: "封面回退",
    en: "Cover fallback",
  },
  mediaAlt: { zh: "ElfUI 项目封面", en: "ElfUI project cover" },
  unavailable: { zh: "封面暂时不可用", en: "Cover is temporarily unavailable" },
  retry: { zh: "重试图片", en: "Retry image" },
  retrying: { zh: "正在重试", en: "Retrying" },
  recovered: { zh: "图片已恢复", en: "Image recovered" },
});

// State
const loading = useRef(true);
const mediaSource = useRef(BROKEN_IMAGE);
const mediaStatus = useRef<"unavailable" | "retrying" | "recovered">("unavailable");

// Derived state
const loadingStatus = (): string => (loading.value ? t("loading") : t("ready"));
const mediaStatusText = (): string => t(mediaStatus.value);

// Methods
const toggleLoading = (): void => loading.set(!loading.value);

const retryImage = (event: MouseEvent): void => {
  event.stopPropagation();
  mediaStatus.set("retrying");
  mediaSource.set(RECOVERED_IMAGE);
};

const onImageError = (): void => mediaStatus.set("unavailable");
const onImageLoad = (): void => mediaStatus.set("recovered");

const statesCode = `<elf-card :loading.prop=\${loading} title="Weekly quality report">
  <elf-skeleton :loading.prop=\${loading} animated rows="3">
    <p>Pass rate 98.6%</p>
  </elf-skeleton>
</elf-card>

<elf-card
  :image.prop=\${mediaSource}
  image-alt="ElfUI project cover"
  @image-error=\${onImageError}
  @image-load=\${onImageLoad}
>
  <div slot="image-error">
    <span>Cover is temporarily unavailable</span>
    <button type="button" @click=\${retryImage}>Retry image</button>
  </div>
</elf-card>`;

const statesScript = `const loading = useRef(true);
const mediaSource = useRef("data:image/png;base64,broken");

const retryImage = (event) => {
  event.stopPropagation();
  mediaSource.set("/logo.png");
};

// Card owns loading/disabled semantics and image events.
// Skeleton remains a separate composable component for body placeholders.`;

defineStyle(styles);

const PageCardEx3 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${statesCode} :script=${statesScript}>
    <div slot="status" class="card-demo-actions">
      <span role="status" aria-live="polite">${loadingStatus()} · ${mediaStatusText()}</span>
      <button type="button" @click=${toggleLoading}>
        ${loading.value ? t("complete") : t("reset")}
      </button>
    </div>
    <div class="card-state-grid">
      <elf-card
        :loading.prop=${loading}
        :title=${t("report")}
        :subtitle=${t("reportSubtitle")}
        variant="outlined"
      >
        <elf-skeleton :loading.prop=${loading} animated rows="3">
          <div class="card-report-ready">
            <strong>${t("score")}</strong>
            <p>${t("reportCopy")}</p>
          </div>
        </elf-skeleton>
      </elf-card>

      <elf-card
        class="card-media"
        :image.prop=${mediaSource}
        :image-alt=${t("mediaAlt")}
        image-height="164px"
        :title=${t("media")}
        :subtitle=${t("mediaSubtitle")}
        variant="outlined"
        @image-error=${onImageError}
        @image-load=${onImageLoad}
      >
        <div slot="image-error" class="card-media-error">
          <span aria-hidden="true">⌁</span>
          <strong>${t("unavailable")}</strong>
          <button type="button" @click=${retryImage}>${t("retry")}</button>
        </div>
        <p>${mediaStatusText()}</p>
      </elf-card>
    </div>
  </elf-playground>
`);

export { PageCardEx3 };
