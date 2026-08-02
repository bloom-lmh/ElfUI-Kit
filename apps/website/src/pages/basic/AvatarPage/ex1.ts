import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "身份与外观矩阵", en: "Identity and appearance matrix" },
  status: { zh: "文字 · 图片 · 图标 · 尺寸 · 形状", en: "Text · image · icon · size · shape" },
  identity: { zh: "身份回退", en: "Identity fallback" },
  media: { zh: "图片与图标", en: "Image and icon" },
  scale: { zh: "尺寸与形状", en: "Size and shape" },
  ada: { zh: "Ada，文字回退头像", en: "Ada, text fallback avatar" },
  grace: { zh: "Grace，文字回退头像", en: "Grace, text fallback avatar" },
  linus: { zh: "Linus，文字回退头像", en: "Linus, text fallback avatar" },
  profile: { zh: "个人头像", en: "Profile avatar" },
  favorite: { zh: "收藏", en: "Favorite" },
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
        <strong>${t("identity")}</strong>
        <div class="avatar-demo-row">
          <elf-avatar alt="Ada Lovelace" color="primary" :aria-label=${t("ada")}></elf-avatar>
          <elf-avatar alt="Grace Hopper" color="success" :aria-label=${t("grace")}></elf-avatar>
          <elf-avatar alt="Linus Torvalds" color="#7b1fa2" :aria-label=${t("linus")}></elf-avatar>
        </div>
      </article>
      <article class="avatar-demo-card">
        <strong>${t("media")}</strong>
        <div class="avatar-demo-row">
          <elf-avatar
            src="https://i.pravatar.cc/96?img=47"
            :alt=${t("profile")}
          ></elf-avatar>
          <elf-avatar icon="★" color="warning" :alt=${t("favorite")}></elf-avatar>
          <elf-avatar color="danger" alt="VIP"><span>VIP</span></elf-avatar>
        </div>
      </article>
      <article class="avatar-demo-card avatar-demo-card-wide">
        <strong>${t("scale")}</strong>
        <div class="avatar-demo-row avatar-demo-scale">
          <elf-avatar size="sm" alt="SM"></elf-avatar>
          <elf-avatar size="md" shape="square" alt="MD"></elf-avatar>
          <elf-avatar size="lg" alt="LG"></elf-avatar>
          <elf-avatar size="xl" shape="square" alt="XL"></elf-avatar>
        </div>
      </article>
    </div>
  </elf-playground>
`);

export { PageAvatarEx1 };
