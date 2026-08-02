import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "整卡交互与键盘", en: "Whole-card interaction and keyboard" },
  activations: { zh: "整卡激活", en: "Card activations" },
  favoriteOn: { zh: "已收藏", en: "Favorited" },
  favoriteOff: { zh: "未收藏", en: "Not favorited" },
  project: { zh: "设计系统迁移", en: "Design system migration" },
  subtitle: { zh: "本周五交付 · 8 位协作者", en: "Due Friday · 8 collaborators" },
  description: {
    zh: "Tab 聚焦卡片后可使用 Enter 或 Space 打开；内部收藏按钮拥有独立状态，不会额外激活整卡。",
    en: "After Tab focuses the card, Enter or Space opens it. The nested favorite action keeps independent state without activating the card again.",
  },
  open: { zh: "打开项目", en: "Open project" },
  favorite: { zh: "收藏项目", en: "Favorite project" },
  disabled: { zh: "已归档项目", en: "Archived project" },
  disabledHint: {
    zh: "禁用卡片保留语义，但退出 Tab 顺序。",
    en: "A disabled card keeps its semantics but leaves the Tab order.",
  },
  disabledCopy: {
    zh: "适合展示只读历史记录，不响应鼠标或键盘激活。",
    en: "Useful for read-only history without pointer or keyboard activation.",
  },
});

// State
const activationCount = useRef(0);
const favorite = useRef(false);

// Derived state
const activityText = (): string =>
  `${t("activations")} ${activationCount.value} · ${favorite.value ? t("favoriteOn") : t("favoriteOff")}`;

// Methods
const onCardActivate = (): void => activationCount.set(activationCount.value + 1);

const onFavoriteClick = (event: MouseEvent): void => {
  event.stopPropagation();
  favorite.set(!favorite.value);
};

const interactionCode = `<elf-card
  clickable
  variant="outlined"
  title="Design system migration"
  subtitle="Due Friday · 8 collaborators"
  @click=\${openProject}
>
  <button
    slot="extra"
    type="button"
    :aria-pressed=\${favorite}
    aria-label="Favorite project"
    @click=\${toggleFavorite}
  >
    ★
  </button>
  <p>Tab, Enter, and Space activate the whole card.</p>
</elf-card>`;

const interactionScript = `const activationCount = useRef(0);
const favorite = useRef(false);

const openProject = () => activationCount.set(activationCount.value + 1);

const toggleFavorite = (event) => {
  // A nested action owns its click and must not activate the whole card.
  event.stopPropagation();
  favorite.set(!favorite.value);
};`;

defineStyle(styles);

const PageCardEx2 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${interactionCode} :script=${interactionScript}>
    <span slot="status" class="card-demo-status" role="status" aria-live="polite">${activityText()}</span>
    <div class="card-interaction-grid">
      <elf-card
        class="card-project"
        clickable
        variant="outlined"
        :title=${t("project")}
        :subtitle=${t("subtitle")}
        @click=${onCardActivate}
      >
        <button
          slot="extra"
          type="button"
          :class=${{ "card-favorite": true, "is-active": favorite.value }}
          :aria-pressed=${String(favorite.value)}
          :aria-label=${t("favorite")}
          @click=${onFavoriteClick}
        >
          <span aria-hidden="true">★</span>
        </button>
        <p>${t("description")}</p>
        <template #footer>
          <elf-tag type="success" size="sm">${t("open")}</elf-tag>
        </template>
      </elf-card>
      <elf-card
        clickable
        disabled
        variant="filled"
        :title=${t("disabled")}
        :subtitle=${t("disabledHint")}
      >
        <p>${t("disabledCopy")}</p>
      </elf-card>
    </div>
  </elf-playground>
`);

export { PageCardEx2 };
