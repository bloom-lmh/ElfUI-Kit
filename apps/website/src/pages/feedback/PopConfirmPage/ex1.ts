import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  section: { zh: "基础用法", en: "Basic usage" },
  clickTitle: { zh: "点击确认", en: "Click to confirm" },
  deleteTitle: { zh: "确认删除？", en: "Delete this item?" },
  deleteContent: { zh: "删除后不可恢复", en: "This action cannot be undone." },
  delete: { zh: "删除", en: "Delete" },
  lastAction: { zh: "上次操作", en: "Last action" },
  notOperated: { zh: "尚未操作", en: "No action yet" },
  confirmed: { zh: "已确认删除", en: "Deletion confirmed" },
  cancelled: { zh: "已取消", en: "Cancelled" },
  hoverTitle: { zh: "悬浮触发", en: "Hover trigger" },
  saveTitle: { zh: "确认保存？", en: "Save this draft?" },
  saveContent: { zh: "保存当前草稿", en: "Save the current draft." },
});

const code1 = `<elf-pop-confirm
  title="${t("deleteTitle")}"
  content="${t("deleteContent")}"
  @confirm="onConfirm"
  @cancel="onCancel"
>
  <elf-button color="danger">${t("delete")}</elf-button>
</elf-pop-confirm>`;

const code1Script = `const lastAction = useRef("${t("notOperated")}");

const onConfirm = () => lastAction.set("${t("confirmed")}");
const onCancel = () => lastAction.set("${t("cancelled")}");`;

const code2 = `<elf-pop-confirm title="${t("saveTitle")}" content="${t("saveContent")}" trigger="hover">
  <elf-button variant="outlined">${t("hoverTitle")}</elf-button>
</elf-pop-confirm>`;

const lastAction = useRef(t("notOperated"));

const onConfirm = (): void => {
  lastAction.set(t("confirmed"));
};

const onCancel = (): void => {
  lastAction.set(t("cancelled"));
};

const PagePopConfirmEx1 = defineHtml(`
  <h2>${t("section")}</h2>
  <elf-playground :title=${t("clickTitle")} :code=${code1} :script=${code1Script}>
    <span slot="status" class="demo-state">${t("lastAction")}：{{ lastAction }}</span>
    <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
      <elf-pop-confirm
        :title=${t("deleteTitle")}
        :content=${t("deleteContent")}
        @confirm=${onConfirm}
        @cancel=${onCancel}
      >
        <elf-button color="danger">${t("delete")}</elf-button>
      </elf-pop-confirm>
    </div>
  </elf-playground>

  <elf-playground :title=${t("hoverTitle")} :code=${code2}>
    <elf-pop-confirm :title=${t("saveTitle")} :content=${t("saveContent")} trigger="hover">
      <elf-button variant="outlined">${t("hoverTitle")}</elf-button>
    </elf-pop-confirm>
  </elf-playground>
`);

export { PagePopConfirmEx1 };
