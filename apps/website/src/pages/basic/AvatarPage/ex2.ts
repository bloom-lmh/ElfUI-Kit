import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const FAILED_SOURCE = "/__elfui_avatar_demo_missing__.png";
const RECOVERY_SOURCE = "https://i.pravatar.cc/160?img=32";

const source = useRef(FAILED_SOURCE);
const state = useRef<"loading" | "fallback" | "recovered">("loading");
const retryCount = useRef(0);

const t = createDocsTranslator({
  title: { zh: "图片失败与重试", en: "Image failure and retry" },
  loading: { zh: "正在加载图片", en: "Loading image" },
  fallback: { zh: "加载失败，已显示文字回退", en: "Load failed; text fallback is visible" },
  recovered: { zh: "已切换备用图片源", en: "Switched to the fallback image source" },
  retry: { zh: "重试", en: "Retry" },
  reset: { zh: "模拟失败", en: "Simulate failure" },
  name: { zh: "Ada Lovelace 的个人头像", en: "Profile avatar for Ada Lovelace" },
  role: { zh: "项目负责人", en: "Project lead" },
  status: { zh: "在线", en: "Online" },
  explanation: {
    zh: "图片加载失败时保留完整姓名作为无障碍名称，头像自动回退为文字；更换 src 后重新尝试加载。",
    en: "On image failure the full name stays as the accessible label and the avatar falls back to text. Changing src retries loading.",
  },
});

const onImageError = (): void => state.set("fallback");
const retry = (): void => {
  retryCount.set(retryCount.value + 1);
  state.set("recovered");
  source.set(`${RECOVERY_SOURCE}&retry=${retryCount.value}`);
};
const reset = (): void => {
  state.set("loading");
  source.set(`${FAILED_SOURCE}?retry=${retryCount.value}`);
};
const stateText = (): string => t(state.value);

const fallbackCode = `<elf-avatar
  size="xl"
  :src.prop=\${source.value}
  alt="Ada Lovelace"
  @error=\${onImageError}
></elf-avatar>
<elf-button @click=\${retry}>Retry</elf-button>`;

const fallbackScript = `const source = useRef("/avatars/missing.png");
const state = useRef("loading");

const onImageError = () => state.set("fallback");
const retry = () => {
  state.set("recovered");
  source.set("/avatars/ada-fallback.jpg");
};`;

defineStyle(styles);

const PageAvatarEx2 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${fallbackCode} :script=${fallbackScript}>
    <span slot="status" class="avatar-demo-status">${stateText()}</span>
    <div class="avatar-fallback-demo">
      <elf-avatar
        size="xl"
        :src.prop=${source.value}
        alt="Ada Lovelace"
        :aria-label=${t("name")}
        @error=${onImageError}
      ></elf-avatar>
      <div class="avatar-profile-copy">
        <div class="avatar-profile-title">
          <strong>Ada Lovelace</strong>
          <span class="avatar-status-chip">
            <i></i>${t("status")}
          </span>
        </div>
        <p class="avatar-profile-role">${t("role")}</p>
        <p>${t("explanation")}</p>
        <div class="avatar-profile-actions">
          <elf-button size="sm" variant="outlined" @click=${retry}>${t("retry")}</elf-button>
          <elf-button size="sm" variant="text" @click=${reset}>${t("reset")}</elf-button>
        </div>
      </div>
    </div>
  </elf-playground>
`);

export { PageAvatarEx2 };
