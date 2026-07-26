import { defineHtml, defineStyle, useRef, useTemplateRef } from "@elfui/core";

import type { CarouselExposes } from "../../../components/Data/Carousel/types";
import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "自动播放与暂停策略", en: "Autoplay and pause strategy" },
  statusPlaying: { zh: "自动播放中", en: "Autoplay running" },
  statusPaused: { zh: "已暂停", en: "Paused" },
  current: { zh: "当前第", en: "Current slide" },
  of: { zh: "张，共 3 张", en: "of 3" },
  hint: {
    zh: "悬停、键盘焦点、页面隐藏或系统减少动画时自动暂停；右上角按钮允许用户明确控制。",
    en: "Pauses on hover, keyboard focus, hidden pages, or reduced motion; the top-right control gives the user explicit control."
  },
  previous: { zh: "上一张", en: "Previous" },
  next: { zh: "下一张", en: "Next" },
  valley: { zh: "山谷与河流", en: "Valley and river" },
  lake: { zh: "群山与湖泊", en: "Mountains and lake" },
  trail: { zh: "林间小路", en: "Forest trail" }
});

const playbackRef = useTemplateRef<HTMLElement & CarouselExposes>("playback");

// State
const current = useRef(0);
const playing = useRef(true);

// Derived state
const playbackStatus = (): string =>
  `${playing.value ? t("statusPlaying") : t("statusPaused")} · ${t("current")} ${current.value + 1} ${t("of")}`;

// Methods
const onChange = (event: CustomEvent<[number, number]>): void => {
  current.set(event.detail[0]);
};

const onPlayStateChange = (event: CustomEvent<[boolean]>): void => {
  const nextPlaying = event.detail[0];
  queueMicrotask(() => {
    playing.set(playbackRef.value?.isPlaying ?? nextPlaying);
  });
};

const onStatusAction = (event: Event): void => {
  const action = event
    .composedPath()
    .find((entry): entry is HTMLElement =>
      entry instanceof HTMLElement && Boolean(entry.dataset.action)
    )
    ?.dataset.action;
  if (action === "previous") playbackRef.value?.prev();
  if (action === "next") playbackRef.value?.next();
};

const playbackCode = `<elf-carousel
  ref="carousel"
  autoplay
  show-play-control
  pause-on-hover
  pause-on-focus
  respect-reduced-motion
  arrow="always"
  @change=\${onChange}
  @play-state-change=\${onPlayStateChange}
>
  <elf-carousel-item name="valley" label="Valley and river">
    <img src="/valley.jpg" alt="Valley and river" loading="lazy" />
  </elf-carousel-item>
</elf-carousel>`;

const playbackScript = `const carousel = useTemplateRef("carousel");
const current = useRef(0);
const playing = useRef(true);

const onChange = (event) => current.set(event.detail[0]);
const onPlayStateChange = (event) => playing.set(event.detail[0]);

carousel.value?.pause();
carousel.value?.play();
carousel.value?.prev();
carousel.value?.next();`;

defineStyle(styles);

const PageCarouselEx1 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${playbackCode} :script=${playbackScript}>
    <div
      slot="status"
      class="carousel-demo-actions"
      role="status"
      aria-live="polite"
      @click=${onStatusAction}
    >
      <span>${playbackStatus()}</span>
      <button type="button" data-action="previous">${t("previous")}</button>
      <button type="button" data-action="next">${t("next")}</button>
    </div>
    <div class="carousel-demo-frame">
      <elf-carousel
        ref="playback"
        height="clamp(240px, 36vw, 380px)"
        interval="3200"
        arrow="always"
        show-play-control
        pause-on-hover
        pause-on-focus
        respect-reduced-motion
        :aria-label=${t("title")}
        @change=${onChange}
        @play-state-change=${onPlayStateChange}
      >
        <elf-carousel-item name="valley" :label=${t("valley")}>
          <img
            src="https://picsum.photos/id/1018/1200/520"
            :alt=${t("valley")}
            loading="lazy"
            decoding="async"
          />
        </elf-carousel-item>
        <elf-carousel-item name="lake" :label=${t("lake")}>
          <img
            src="https://picsum.photos/id/1015/1200/520"
            :alt=${t("lake")}
            loading="lazy"
            decoding="async"
          />
        </elf-carousel-item>
        <elf-carousel-item name="trail" :label=${t("trail")}>
          <img
            src="https://picsum.photos/id/1019/1200/520"
            :alt=${t("trail")}
            loading="lazy"
            decoding="async"
          />
        </elf-carousel-item>
      </elf-carousel>
      <p class="carousel-demo-hint">${t("hint")}</p>
    </div>
  </elf-playground>
`);

export { PageCarouselEx1 };
