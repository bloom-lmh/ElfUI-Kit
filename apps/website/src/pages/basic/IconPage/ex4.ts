import { defineHtml, defineStyle } from "@elfui/core";
import {
  mdiAccountOutline,
  mdiAlertOutline,
  mdiBellOutline,
  mdiCalendarOutline,
  mdiCameraOutline,
  mdiCartOutline,
  mdiCheckCircleOutline,
  mdiClockOutline,
  mdiCloudOutline,
  mdiCogOutline,
  mdiDownloadOutline,
  mdiEmailOutline,
  mdiGithub,
  mdiHeartOutline,
  mdiHomeOutline,
  mdiImageOutline,
  mdiMapMarkerOutline,
  mdiMusicNoteOutline,
  mdiStarOutline,
  mdiUploadOutline,
  mdiVideoOutline,
} from "@mdi/js";

import { createSvgIconSet } from "@elfui/kit-src/components/Basic/Icon";
import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "图标画廊与第三方 SVG", en: "Icon gallery and third-party SVG" },
  status: {
    zh: "20+ 图标 · 尺寸阶梯 · 语义色 · 原始 SVG 插槽",
    en: "20+ icons · size ladder · semantic colors · raw SVG slot",
  },
  gallery: { zh: "常用图标", en: "Common icons" },
  rawSvg: { zh: "第三方 SVG", en: "Third-party SVG" },
  rawSvgBody: {
    zh: "需要品牌或私有图标时，直接把 SVG 放进默认插槽，尺寸和颜色仍由 elf-icon 控制。",
    en: "Pass brand or private SVG directly through the default slot; size and color stay controlled by elf-icon.",
  },
  github: { zh: "GitHub", en: "GitHub" },
});

const galleryOptions = {
  defaultSet: "mdi",
  sets: {
    mdi: createSvgIconSet({
      home: mdiHomeOutline,
      account: mdiAccountOutline,
      cog: mdiCogOutline,
      bell: mdiBellOutline,
      cart: mdiCartOutline,
      heart: mdiHeartOutline,
      star: mdiStarOutline,
      cloud: mdiCloudOutline,
      download: mdiDownloadOutline,
      upload: mdiUploadOutline,
      email: mdiEmailOutline,
      calendar: mdiCalendarOutline,
      clock: mdiClockOutline,
      map: mdiMapMarkerOutline,
      camera: mdiCameraOutline,
      image: mdiImageOutline,
      music: mdiMusicNoteOutline,
      video: mdiVideoOutline,
      success: mdiCheckCircleOutline,
      warning: mdiAlertOutline,
    }),
  },
};

const galleryItems = () => [
  { name: "home", size: 20 },
  { name: "account", size: 20 },
  { name: "cog", size: 20 },
  { name: "bell", size: 20 },
  { name: "cart", size: 20 },
  { name: "heart", size: 20 },
  { name: "star", size: 20 },
  { name: "cloud", size: 20 },
  { name: "download", size: 20 },
  { name: "upload", size: 20 },
  { name: "email", size: 20 },
  { name: "calendar", size: 20 },
  { name: "clock", size: 20 },
  { name: "map", size: 20 },
  { name: "camera", size: 20 },
  { name: "image", size: 20 },
  { name: "music", size: 20 },
  { name: "video", size: 20 },
];

const code = `<elf-icon-provider :options.prop="galleryOptions">
  <elf-icon name="home" size="20"></elf-icon>
  <elf-icon name="account" size="20"></elf-icon>
  <elf-icon name="cog" size="20"></elf-icon>
  <elf-icon name="star" size="24" color="var(--elf-warning)"></elf-icon>
  <elf-icon name="success" size="28" color="var(--elf-success)"></elf-icon>
</elf-icon-provider>

<elf-icon size="40" color="var(--elf-primary)">
  <svg viewBox="0 0 24 24"><path :d="githubPath"></path></svg>
</elf-icon>`;

const script = `import { createSvgIconSet } from "@elfui/kit";

const galleryOptions = {
  defaultSet: "mdi",
  sets: {
    mdi: createSvgIconSet({
      home: mdiHomeOutline,
      account: mdiAccountOutline,
      cog: mdiCogOutline
    })
  }
};

// Raw SVG in the default slot keeps the Icon container's size and color contract.`;

defineStyle(styles);

const PageIconEx4 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <span slot="status" class="icon-demo-status">${t("status")}</span>
    <elf-icon-provider :options.prop=${galleryOptions}>
      <div class="icon-gallery-panel">
        <article class="icon-gallery-card icon-gallery-card-wide">
          <strong>${t("gallery")}</strong>
          <div class="icon-gallery-grid">
            <span v-for="item in galleryItems()" :key="item.name" class="icon-gallery-token">
              <elf-icon :name="item.name" :size="item.size"></elf-icon>
              <small>{{ item.name }}</small>
            </span>
          </div>
        </article>

        <article class="icon-gallery-card">
          <strong>${t("rawSvg")}</strong>
          <p>${t("rawSvgBody")}</p>
          <div class="icon-raw-svg-preview">
            <elf-icon size="48" color="var(--elf-primary)">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path :d=${mdiGithub}></path></svg>
            </elf-icon>
            <span>${t("github")}</span>
          </div>
        </article>

        <article class="icon-gallery-card">
          <strong>${t("rawSvg")} · ${t("gallery")}</strong>
          <div class="icon-size-ladder">
            <elf-icon name="success" size="16" color="var(--elf-success)"></elf-icon>
            <elf-icon name="success" size="24" color="var(--elf-success)"></elf-icon>
            <elf-icon name="success" size="32" color="var(--elf-success)"></elf-icon>
            <elf-icon name="success" size="40" color="var(--elf-success)"></elf-icon>
            <elf-icon name="warning" size="24" color="var(--elf-warning)"></elf-icon>
            <elf-icon name="warning" size="32" color="var(--elf-warning)"></elf-icon>
            <elf-icon name="warning" size="40" color="var(--elf-warning)"></elf-icon>
          </div>
        </article>
      </div>
    </elf-icon-provider>
  </elf-playground>
`);

export { PageIconEx4 };
