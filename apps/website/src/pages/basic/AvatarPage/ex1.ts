import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "身份与外观矩阵", en: "Identity and appearance matrix" },
  status: { zh: "文字 · 图片 · 图标 · 尺寸 · 形状", en: "Text · image · icon · size · shape" },
  identity: { zh: "身份回退", en: "Identity fallback" },
  identityNote: {
    zh: "未提供图片时，按 alt 生成首字母并着色。",
    en: "Without an image, initials derived from alt are shown on a tinted surface.",
  },
  media: { zh: "图片与图标", en: "Image and icon" },
  mediaNote: {
    zh: "真实头像照片、符号图标与插槽徽标。",
    en: "Real photos, symbol icons, and slot badges.",
  },
  scale: { zh: "尺寸与形状", en: "Size and shape" },
  scaleNote: {
    zh: "sm / md / lg / xl 与圆角、方形两种形状。",
    en: "sm / md / lg / xl with round and square shapes.",
  },
  ada: { zh: "Ada，文字回退头像", en: "Ada, text fallback avatar" },
  adaRole: { zh: "数学与计算先驱", en: "Mathematician and computing pioneer" },
  grace: { zh: "Grace，文字回退头像", en: "Grace, text fallback avatar" },
  graceRole: { zh: "编译器与 COBOL 先驱", en: "Compiler and COBOL pioneer" },
  linus: { zh: "Linus，文字回退头像", en: "Linus, text fallback avatar" },
  linusRole: { zh: "Linux 内核维护者", en: "Linux kernel maintainer" },
  profile: { zh: "个人头像", en: "Profile avatar" },
  favorite: { zh: "收藏", en: "Favorite" },
  vip: { zh: "VIP 徽标", en: "VIP badge" },
});

const appearanceCode = `<elf-avatar alt="Ada Lovelace" color="primary"></elf-avatar>
<elf-avatar src="/avatars/profile.jpg" alt="Grace Hopper"></elf-avatar>
<elf-avatar icon="★" alt="Favorite" color="warning"></elf-avatar>

<elf-avatar size="sm" alt="Small"></elf-avatar>
<elf-avatar size="md" shape="square" alt="Medium"></elf-avatar>
<elf-avatar size="lg" alt="Large"></elf-avatar>
<elf-avatar size="xl" shape="square" alt="Extra large"></elf-avatar>`;

const appearanceScript = `// alt 同时提供图片替代文本和 fallback 的无障碍名称。
// 图片不可用时，Avatar 会自动显示由 alt 生成的首字母。`;

defineStyle(styles);

const PageAvatarEx1 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${appearanceCode} :script=${appearanceScript}>
    <span slot="status" class="avatar-demo-status">${t("status")}</span>
    <div class="avatar-demo-grid">
      <article class="avatar-demo-card">
        <header class="avatar-demo-card-head">
          <strong>${t("identity")}</strong>
          <span>${t("identityNote")}</span>
        </header>
        <ul class="avatar-member-list">
          <li class="avatar-member-row">
            <elf-avatar alt="Ada Lovelace" color="primary" :aria-label=${t("ada")}></elf-avatar>
            <span class="avatar-member-copy">
              <strong>Ada Lovelace</strong>
              <small>${t("adaRole")}</small>
            </span>
          </li>
          <li class="avatar-member-row">
            <elf-avatar alt="Grace Hopper" color="success" :aria-label=${t("grace")}></elf-avatar>
            <span class="avatar-member-copy">
              <strong>Grace Hopper</strong>
              <small>${t("graceRole")}</small>
            </span>
          </li>
          <li class="avatar-member-row">
            <elf-avatar alt="Linus Torvalds" color="#7b1fa2" :aria-label=${t("linus")}></elf-avatar>
            <span class="avatar-member-copy">
              <strong>Linus Torvalds</strong>
              <small>${t("linusRole")}</small>
            </span>
          </li>
        </ul>
      </article>

      <article class="avatar-demo-card">
        <header class="avatar-demo-card-head">
          <strong>${t("media")}</strong>
          <span>${t("mediaNote")}</span>
        </header>
        <div class="avatar-profile-strip">
          <div class="avatar-profile-item">
            <elf-avatar
              size="lg"
              src="https://i.pravatar.cc/120?img=47"
              :alt=${t("profile")}
            ></elf-avatar>
            <span class="avatar-profile-label">${t("profile")}</span>
          </div>
          <div class="avatar-profile-item">
            <elf-avatar size="lg" icon="★" color="warning" :alt=${t("favorite")}></elf-avatar>
            <span class="avatar-profile-label">${t("favorite")}</span>
          </div>
          <div class="avatar-profile-item">
            <elf-avatar size="lg" color="danger" alt="VIP"><span>VIP</span></elf-avatar>
            <span class="avatar-profile-label">${t("vip")}</span>
          </div>
        </div>
      </article>

      <article class="avatar-demo-card avatar-demo-card-wide">
        <header class="avatar-demo-card-head">
          <strong>${t("scale")}</strong>
          <span>${t("scaleNote")}</span>
        </header>
        <div class="avatar-demo-row avatar-demo-scale">
          <div class="avatar-scale-item">
            <elf-avatar size="sm" alt="SM"></elf-avatar>
            <span>SM</span>
          </div>
          <div class="avatar-scale-item">
            <elf-avatar size="md" shape="square" alt="MD"></elf-avatar>
            <span>MD</span>
          </div>
          <div class="avatar-scale-item">
            <elf-avatar size="lg" alt="LG"></elf-avatar>
            <span>LG</span>
          </div>
          <div class="avatar-scale-item">
            <elf-avatar size="xl" shape="square" alt="XL"></elf-avatar>
            <span>XL</span>
          </div>
        </div>
      </article>
    </div>
  </elf-playground>
`);

export { PageAvatarEx1 };
