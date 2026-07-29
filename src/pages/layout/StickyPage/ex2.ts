import { defineHtml } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "底部吸附", en: "Bottom sticky" },
  playgroundTitle: { zh: "底部操作栏", en: "Bottom action bar" },
  row: { zh: "审批记录", en: "Approval record" },
  save: { zh: "保存草稿", en: "Save draft" },
  submit: { zh: "提交", en: "Submit" },
  actionSummary: { zh: "操作栏保持在容器底部", en: "The action bar stays at the bottom of the container" },
  comment: { zh: "position=\"bottom\" 与 offset 共同控制底部吸附。", en: "position=\"bottom\" and offset control bottom sticky behavior." }
});

const rows = Array.from({ length: 10 }, (_, index) => `${t("row")} ${index + 1}`);

const code = `<elf-sticky position="bottom" offset="0" z-index="20">
  <div class="actions">${t("save")} / ${t("submit")}</div>
</elf-sticky>`;

const script = `// ${t("comment")}`;

const PageStickyEx2 = defineHtml(`
  <h2>${t("playgroundTitle")}</h2>
  <elf-playground :title=${t("playgroundTitle")} :code=${code} :script=${script}>
    <span slot="status">${t("actionSummary")}</span>
    <div
      style="width:100%;max-width:720px;height:260px;overflow:auto;border:1px solid var(--elf-border);border-radius:8px;background:var(--elf-bg-paper)"
    >
      <div style="display:grid;gap:8px;padding:16px 16px 72px">
        <div
          v-for="row in rows"
          :key="row"
          style="height:40px;padding:0 12px;display:flex;align-items:center;border-radius:6px;background:var(--elf-bg-overlay)"
        >
          {{ row }}
        </div>
      </div>
      <elf-sticky position="bottom" offset="0" z-index="20">
        <div
          style="display:flex;justify-content:flex-end;gap:8px;padding:12px 16px;background:var(--elf-bg-paper);border-top:1px solid var(--elf-divider)"
        >
          <elf-button size="sm" variant="outlined">${t("save")}</elf-button>
          <elf-button size="sm">${t("submit")}</elf-button>
        </div>
      </elf-sticky>
    </div>
  </elf-playground>
`);

export { PageStickyEx2 };
