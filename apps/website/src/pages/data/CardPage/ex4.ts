import { mdiArrowRight, mdiHeart } from "@mdi/js";
import { defineHtml, defineStyle } from "@elfui/core";
import { createSvgIconSet } from "@elfui/kit";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "组合卡片", en: "Card compositions" },
  status: { zh: "媒体 · 资料 · 数据 · 横向布局", en: "Media · Profile · Data · Horizontal" },
  mediaTitle: { zh: "旅行相册", en: "Travel album" },
  mediaSubtitle: { zh: "8 月 · 32 张照片", en: "August · 32 photos" },
  mediaAlt: { zh: "海边日落与棕榈树", en: "Coastal sunset with palm trees" },
  mediaCopy: {
    zh: "把沿途的黄昏与海岸收进同一组封面，点击卡片即可进入完整相册。",
    en: "A seasonal cover leads into a full album of coastal evenings.",
  },
  mediaAction: { zh: "查看相册", en: "Open album" },
  profileName: { zh: "陈晨", en: "Chen Chen" },
  profileRole: { zh: "高级前端工程师", en: "Senior frontend engineer" },
  profileCopy: {
    zh: "专注设计系统与组件质量，喜欢把复杂的交互封装成简单 API。",
    en: "Focused on design systems and component quality, turning complex interactions into simple APIs.",
  },
  projects: { zh: "项目", en: "Projects" },
  commits: { zh: "提交", en: "Commits" },
  reviews: { zh: "评审", en: "Reviews" },
  follow: { zh: "关注", en: "Follow" },
  message: { zh: "发消息", en: "Message" },
  revenueTitle: { zh: "本月收入", en: "Monthly revenue" },
  revenueSubtitle: { zh: "较上月稳步增长", en: "Steady growth over last month" },
  revenueValue: { zh: "¥86,420", en: "¥86,420" },
  revenueTrend: { zh: "+18.4%", en: "+18.4%" },
  revenueCopy: {
    zh: "目标完成 72%，预计月底达到季度峰值。",
    en: "72% of the target is complete, tracking toward a quarterly peak.",
  },
  revenueNote: { zh: "数据更新于 10 分钟前", en: "Updated 10 minutes ago" },
  reviewTitle: { zh: "组件评审", en: "Component review" },
  reviewSubtitle: { zh: "周五 14:00 · 线上会议", en: "Friday 14:00 · Online" },
  reviewAlt: { zh: "工作台上的代码与设计稿", en: "Code and design files on a desk" },
  reviewCopy: {
    zh: "新一批表单与数据组件的视觉回归评审，欢迎带上你的观察。",
    en: "Visual regression review for the new form and data components; bring your observations.",
  },
  reviewTag: { zh: "需要你参与", en: "Needs you" },
});

const TRAVEL_COVER = "/cards/travel.jpg";
const REVIEW_COVER = "/cards/review.jpg";
const AVATAR = "/cards/avatar.jpg";

const iconOptions = {
  defaultSet: "mdi",
  sets: {
    mdi: createSvgIconSet({
      heart: mdiHeart,
      arrow: mdiArrowRight,
    }),
  },
};

const compositionCode = `<elf-icon-provider :options.prop="iconOptions">
  <elf-card title="Travel album" subtitle="August · 32 photos" image="/cards/travel.jpg" image-alt="Coastal sunset with palm trees" image-height="180px">
    <p>A seasonal cover leads into a full album of coastal evenings.</p>
    <template #footer>
      <elf-button size="sm" variant="outlined">
        <elf-icon name="arrow" size="14"></elf-icon> Open album
      </elf-button>
    </template>
  </elf-card>

  <elf-card variant="outlined" avatar="/cards/avatar.jpg" title="Chen Chen" subtitle="Senior frontend engineer">
    <div class="card-profile-stats">
      <div><strong>12</strong><span>Projects</span></div>
      <div><strong>486</strong><span>Commits</span></div>
      <div><strong>24</strong><span>Reviews</span></div>
    </div>
    <template #footer>
      <elf-button size="sm" type="primary">Follow</elf-button>
      <elf-button size="sm" variant="outlined">Message</elf-button>
    </template>
  </elf-card>

  <elf-card variant="tonal" title="Monthly revenue" subtitle="Steady growth over last month">
    <div class="card-revenue">
      <strong>¥86,420</strong>
      <elf-tag type="success" size="sm">+18.4%</elf-tag>
    </div>
    <elf-progress :percentage="72" color="success" hide-value></elf-progress>
  </elf-card>

  <elf-card
    title="Component review"
    subtitle="Friday 14:00 · Online"
    variant="outlined"
    image="/cards/review.jpg"
    image-alt="Code and design files on a desk"
    image-placement="left"
    image-width="38%"
  >
    <p>Visual regression review for the new form and data components.</p>
    <template #footer>
      <elf-tag type="warning" size="sm">Needs you</elf-tag>
    </template>
  </elf-card>
</elf-icon-provider>`;

const compositionScript = `import { createSvgIconSet } from "@elfui/kit";
import { mdiArrowRight, mdiHeart } from "@mdi/js";

const iconOptions = {
  defaultSet: "mdi",
  sets: {
    mdi: createSvgIconSet({
      heart: mdiHeart,
      arrow: mdiArrowRight,
    }),
  },
};

// Cards compose with real covers, avatars, tags, buttons, and progress.
// The image prop owns loading and error fallback; the avatar prop takes a portrait URL.`;

defineStyle(styles);

const PageCardEx4 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${compositionCode} :script=${compositionScript}>
    <span slot="status" class="card-demo-status">${t("status")}</span>
    <elf-icon-provider :options.prop=${iconOptions}>
      <div class="card-composition-grid">
        <elf-card
          :title=${t("mediaTitle")}
          :subtitle=${t("mediaSubtitle")}
          variant="elevated"
          :image.prop=${TRAVEL_COVER}
          :image-alt=${t("mediaAlt")}
          image-height="180px"
        >
          <span slot="extra" class="card-extra-icon" aria-hidden="true">
            <elf-icon name="heart" size="18"></elf-icon>
          </span>
          <p>${t("mediaCopy")}</p>
          <template #footer>
            <elf-button size="sm" variant="outlined">
              <elf-icon name="arrow" size="14"></elf-icon> ${t("mediaAction")}
            </elf-button>
          </template>
        </elf-card>

        <elf-card
          :avatar.prop=${AVATAR}
          :title=${t("profileName")}
          :subtitle=${t("profileRole")}
          variant="outlined"
        >
          <p>${t("profileCopy")}</p>
          <div class="card-profile-stats">
            <div><strong>12</strong><span>${t("projects")}</span></div>
            <div><strong>486</strong><span>${t("commits")}</span></div>
            <div><strong>24</strong><span>${t("reviews")}</span></div>
          </div>
          <template #footer>
            <elf-button size="sm" type="primary">${t("follow")}</elf-button>
            <elf-button size="sm" variant="outlined">${t("message")}</elf-button>
          </template>
        </elf-card>

        <elf-card
          :title=${t("revenueTitle")}
          :subtitle=${t("revenueSubtitle")}
          variant="tonal"
        >
          <div class="card-revenue">
            <strong>${t("revenueValue")}</strong>
            <elf-tag type="success" size="sm">${t("revenueTrend")}</elf-tag>
          </div>
          <elf-progress :percentage=${72} color="success" hide-value></elf-progress>
          <p>${t("revenueCopy")}</p>
          <template #footer>
            <span class="card-meta">${t("revenueNote")}</span>
          </template>
        </elf-card>

        <elf-card
          :title=${t("reviewTitle")}
          :subtitle=${t("reviewSubtitle")}
          variant="outlined"
          :image.prop=${REVIEW_COVER}
          :image-alt=${t("reviewAlt")}
          image-placement="left"
          image-width="38%"
        >
          <p>${t("reviewCopy")}</p>
          <template #footer>
            <elf-tag type="warning" size="sm">${t("reviewTag")}</elf-tag>
          </template>
        </elf-card>
      </div>
    </elf-icon-provider>
  </elf-playground>
`);

export { PageCardEx4 };
