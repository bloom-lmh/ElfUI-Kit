import { defineHtml, defineStyle, useComputed, useRef, useTemplateRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "创意卡片", en: "Creative cards" },
  status: { zh: "3D 倾斜 · 翻转 · 徽章 · 层叠", en: "3D tilt · Flip · Badge · Stacked" },
  tiltTitle: { zh: "云端漫步", en: "Mountain escape" },
  tiltSubtitle: { zh: "川西 · 海拔 4200m", en: "Western Sichuan · 4,200m" },
  tiltAlt: { zh: "雪山与云海", en: "Snow peaks above the clouds" },
  tiltCopy: {
    zh: "鼠标在卡片上移动时，卡片朝指针所在的一角倾斜，四个角都跟随。",
    en: "Move the cursor across the card and it tilts toward the nearest corner, following the pointer on all four corners.",
  },
  flipTitle: { zh: "城市夜景", en: "City lights" },
  flipSubtitle: { zh: "上海 · 外滩", en: "Shanghai · The Bund" },
  flipAlt: { zh: "外滩城市夜景", en: "The Bund skyline at night" },
  flipBackTitle: { zh: "行程已加入", en: "Trip saved" },
  flipBackCopy: {
    zh: "翻转卡片查看行程摘要，点击按钮打开完整攻略。",
    en: "Flip the card for the itinerary summary, then open the full guide.",
  },
  flipAction: { zh: "查看攻略", en: "View guide" },
  glowTitle: { zh: "灵感徽章", en: "Idea badge" },
  glowCopy: {
    zh: "小徽章点缀、大字标题与柔和渐变光晕，简洁突出推荐与精选内容。",
    en: "A tiny badge, a strong headline, and a soft gradient glow keep featured content focused.",
  },
  glowTag: { zh: "推荐", en: "Featured" },
  stackTitle: { zh: "年度精选", en: "Year in review" },
  stackSubtitle: { zh: "12 个瞬间 · 4 个城市", en: "12 moments · 4 cities" },
  stackAlt: { zh: "海边日落", en: "Coastal sunset" },
  stackCopy: {
    zh: "层叠卡片模拟相册堆叠，主卡悬停时浮起并轻微翻转。",
    en: "Stacked layers mimic a photo pile; the main card lifts and tilts on hover.",
  },
  stackTag: { zh: "年度回顾", en: "Yearly recap" },
});

const MOUNTAIN_COVER = "/cards/mountain.jpg";
const CITY_COVER = "/cards/city.jpg";
const TRAVEL_COVER = "/cards/travel.jpg";

const pressCardRef = useTemplateRef<HTMLElement>("pressCard");
const tiltX = useRef(0);
const tiltY = useRef(0);

const pressStyle = useComputed(() => ({
  transform: `perspective(720px) rotateX(${tiltY.value.toFixed(2)}deg) rotateY(${tiltX.value.toFixed(2)}deg)`,
}));

/** 鼠标在卡片上移动时，卡片朝指针所在的一角倾斜，四个角都跟随。 */
const onPressMove = (event: MouseEvent): void => {
  const el = pressCardRef.value;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;
  tiltX.set(x * 16);
  tiltY.set(y * -16);
};

const onPressLeave = (): void => {
  tiltX.set(0);
  tiltY.set(0);
};

const creativeCode = `<div class="card-press" ref="pressCard" tabindex="0" aria-label="Tilt the card" @mousemove="onMove" @mouseleave="onLeave">
  <elf-card variant="flat" title="Mountain escape" subtitle="Western Sichuan · 4,200m"
    image="/cards/mountain.jpg" image-alt="Snow peaks above the clouds" :style.prop="cardStyle">
    <p>Move the cursor across the card and it tilts toward the nearest corner.</p>
  </elf-card>
</div>

<div class="card-3d card-3d-flip" tabindex="0" aria-label="Flip card">
  <div class="card-flip-scene">
    <div class="card-flip-face">
      <elf-card title="City lights" subtitle="Shanghai · The Bund"
        image="/cards/city.jpg" image-alt="The Bund skyline at night" image-height="260px"></elf-card>
    </div>
    <div class="card-flip-face card-flip-back">
      <elf-card variant="tonal" title="Trip saved">
        <p>Flip the card for the itinerary summary, then open the full guide.</p>
        <template #footer>
          <elf-button size="sm" type="primary">View guide</elf-button>
        </template>
      </elf-card>
    </div>
  </div>
</div>

<div class="card-glow">
  <elf-card variant="flat" title="Idea badge">
    <template #title>
      <span class="card-badge">
        <span class="card-badge-icon" aria-hidden="true">✦</span>
        <span class="card-badge-heading">
          <small>IDEA</small>
          <strong>Idea badge</strong>
        </span>
      </span>
    </template>
    <p class="card-badge-copy">A tiny badge, a strong headline, and a soft gradient glow keep featured content focused.</p>
    <template #footer>
      <span class="card-badge-chip">✦ Featured</span>
    </template>
  </elf-card>
</div>

<div class="card-stack">
  <div class="card-stack-layer" aria-hidden="true"></div>
  <div class="card-stack-layer card-stack-layer-2" aria-hidden="true"></div>
  <elf-card title="Year in review" subtitle="12 moments · 4 cities"
    image="/cards/travel.jpg" image-alt="Coastal sunset" image-height="200px">
    <p>Stacked layers mimic a photo pile; the main card lifts and tilts on hover.</p>
    <template #footer>
      <elf-tag type="info" size="sm">Yearly recap</elf-tag>
    </template>
  </elf-card>
</div>`;

const creativeScript = `const cardRef = useTemplateRef("pressCard");
const tiltX = useRef(0);
const tiltY = useRef(0);
const cardStyle = useComputed(() => ({
  transform: \`perspective(720px) rotateX(\${tiltY.value}deg) rotateY(\${tiltX.value}deg)\`,
}));

const onMove = (event: MouseEvent): void => {
  const rect = event.currentTarget.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;
  tiltX.set(x * 16);
  tiltY.set(y * -16);
};
const onLeave = (): void => { tiltX.set(0); tiltY.set(0); };`;

defineStyle(styles);

const PageCardEx5 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${creativeCode} :script=${creativeScript}>
    <span slot="status" class="card-demo-status">${t("status")}</span>
    <div class="card-creative-grid">
      <div class="card-press" ref="pressCard" tabindex="0" :aria-label=${t("tiltTitle")} @mousemove=${onPressMove} @mouseleave=${onPressLeave}>
        <elf-card
          :style=${pressStyle}
          variant="flat"
          :title=${t("tiltTitle")}
          :subtitle=${t("tiltSubtitle")}
          :image.prop=${MOUNTAIN_COVER}
          :image-alt=${t("tiltAlt")}
          image-height="180px"
        >
          <p>${t("tiltCopy")}</p>
        </elf-card>
      </div>

      <div class="card-3d card-3d-flip" tabindex="0" :aria-label=${t("flipTitle")}>
        <div class="card-flip-scene">
          <div class="card-flip-face">
            <elf-card
              :title=${t("flipTitle")}
              :subtitle=${t("flipSubtitle")}
              :image.prop=${CITY_COVER}
              :image-alt=${t("flipAlt")}
              image-height="260px"
            ></elf-card>
          </div>
          <div class="card-flip-face card-flip-back">
            <elf-card variant="tonal" :title=${t("flipBackTitle")}>
              <p>${t("flipBackCopy")}</p>
              <template #footer>
                <elf-button size="sm" type="primary">${t("flipAction")}</elf-button>
              </template>
            </elf-card>
          </div>
        </div>
      </div>

      <div class="card-glow">
        <elf-card variant="flat" :title=${t("glowTitle")}>
          <template #title>
            <span class="card-badge">
              <span class="card-badge-icon" aria-hidden="true">✦</span>
              <span class="card-badge-heading">
                <small>IDEA</small>
                <strong>${t("glowTitle")}</strong>
              </span>
            </span>
          </template>
          <p class="card-badge-copy">${t("glowCopy")}</p>
          <template #footer>
            <span class="card-badge-chip">✦ ${t("glowTag")}</span>
          </template>
        </elf-card>
      </div>

      <div class="card-stack">
        <div class="card-stack-layer" aria-hidden="true"></div>
        <div class="card-stack-layer card-stack-layer-2" aria-hidden="true"></div>
        <elf-card
          :title=${t("stackTitle")}
          :subtitle=${t("stackSubtitle")}
          :image.prop=${TRAVEL_COVER}
          :image-alt=${t("stackAlt")}
          image-height="200px"
        >
          <p>${t("stackCopy")}</p>
          <template #footer>
            <elf-tag type="info" size="sm">${t("stackTag")}</elf-tag>
          </template>
        </elf-card>
      </div>
    </div>
  </elf-playground>
`);

export { PageCardEx5 };
