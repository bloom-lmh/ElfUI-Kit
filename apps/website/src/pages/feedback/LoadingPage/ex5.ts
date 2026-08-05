import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "卡片内容刷新", en: "Refreshing card content" },
  loadingText: { zh: "正在刷新动态", en: "Refreshing activity" },
  cardTitle: { zh: "团队动态", en: "Team activity" },
  subtitle: {
    zh: "局部刷新",
    en: "Local refresh",
  },
  designReviewed: { zh: "设计稿已评审", en: "Design review completed" },
  buildCompleted: { zh: "构建任务已完成", en: "Build task completed" },
  releaseConfirmed: { zh: "发布窗口已确认", en: "Release window confirmed" },
  timestamp: { zh: "刚刚 · ElfUI 项目组", en: "Just now · ElfUI team" },
  refresh: { zh: "刷新卡片", en: "Refresh card" },
});

const refreshing = useRef(false);

const refresh = (): void => {
  if (refreshing.peek()) return;
  refreshing.set(true);
  window.setTimeout(() => refreshing.set(false), 900);
};

const code = `<elf-loading :loading="refreshing" variant="dots" text="${t("loadingText")}">
  <elf-card title="${t("cardTitle")}">...</elf-card>
</elf-loading>`;

const script = `const refreshing = useRef(false);

const refresh = () => {
  if (refreshing.value) return;
  refreshing.set(true);
  window.setTimeout(() => refreshing.set(false), 900);
};`;

const activityNames = [t("designReviewed"), t("buildCompleted"), t("releaseConfirmed")];

const PageLoadingEx5 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <div style="display:grid;gap:12px;width:100%;max-width:620px">
      <elf-loading :loading=${refreshing} variant="dots" :text=${t("loadingText")}>
        <elf-card variant="outlined" :title=${t("cardTitle")} :subtitle=${t("subtitle")}>
          <div style="display:grid;gap:14px">
            <div v-for="name in activityNames" :key="name">
              <strong>{{ name }}</strong>
              <p style="margin:3px 0 0;color:var(--elf-text-secondary)">${t("timestamp")}</p>
            </div>
          </div>
        </elf-card>
      </elf-loading>
      <elf-button type="primary" @click=${refresh}>${t("refresh")}</elf-button>
    </div>
  </elf-playground>
`);

export { PageLoadingEx5 };
