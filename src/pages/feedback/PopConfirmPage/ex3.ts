import { defineHtml, useHost, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  section: { zh: "浮层与自定义操作", en: "Overlay and custom actions" },
  title: { zh: "顶层传送与自定义操作插槽", en: "Teleport and actions slot" },
  publishTitle: { zh: "发布当前版本？", en: "Publish this version?" },
  publishContent: {
    zh: "气泡使用浏览器顶层，不受裁切容器影响",
    en: "The Top Layer keeps the popover outside clipped containers.",
  },
  open: { zh: "打开确认气泡", en: "Open confirmation" },
  postpone: { zh: "暂不发布", en: "Not now" },
  confirm: { zh: "确认发布", en: "Publish" },
  waiting: { zh: "等待操作", en: "Waiting for an action" },
  draftKept: { zh: "已保留草稿", en: "Draft retained" },
  published: { zh: "版本已发布", en: "Version published" },
});

interface PopConfirmHost extends HTMLElement {
  confirm(): Promise<void>;
  cancel(): void;
}

const code = `<div class="clipped-panel">
  <elf-pop-confirm
    ref="popConfirm"
    class="custom-confirm"
    title="${t("publishTitle")}"
    content="${t("publishContent")}"
    placement="right"
    teleported
    @confirm="onConfirm"
    @cancel="onCancel"
  >
    <elf-button>${t("open")}</elf-button>
    <span slot="actions">
      <elf-button @click="cancel">${t("postpone")}</elf-button>
      <elf-button color="primary" @click="confirm">${t("confirm")}</elf-button>
    </span>
  </elf-pop-confirm>
</div>`;

const script = `const popConfirm = useTemplateRef("popConfirm");
const status = useRef("${t("waiting")}");

const cancel = () => popConfirm.value?.cancel();
const confirm = () => popConfirm.value?.confirm();
const onCancel = () => status.set("${t("draftKept")}");
const onConfirm = () => status.set("${t("published")}");`;

// state
const pageHost = useHost();
const status = useRef(t("waiting"));

// actions
const getPopConfirm = (): PopConfirmHost | null =>
  pageHost.shadowRoot?.querySelector<PopConfirmHost>(".custom-confirm") ?? null;

const cancel = (): void => {
  getPopConfirm()?.cancel();
};

const confirm = (): void => {
  void getPopConfirm()?.confirm();
};

const onCancel = (): void => {
  status.set(t("draftKept"));
};

const onConfirm = (): void => {
  status.set(t("published"));
};

const PagePopConfirmEx3 = defineHtml(`
  <h2>${t("section")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <span slot="status" class="demo-state">{{ status }}</span>
    <div style="width:min(100%,480px);height:150px;overflow:auto;border:1px solid var(--elf-border);border-radius:8px;background:var(--elf-bg-overlay)">
      <div style="display:flex;align-items:center;width:720px;height:210px;padding:24px;box-sizing:border-box">
        <elf-pop-confirm
          class="custom-confirm"
          :title=${t("publishTitle")}
          :content=${t("publishContent")}
          placement="right"
          teleported
          @confirm=${onConfirm}
          @cancel=${onCancel}
        >
          <elf-button color="primary">${t("open")}</elf-button>
          <span slot="actions" style="display:flex;gap:8px">
            <elf-button size="small" variant="text" @click=${cancel}>${t("postpone")}</elf-button>
            <elf-button size="small" color="primary" @click=${confirm}>${t("confirm")}</elf-button>
          </span>
        </elf-pop-confirm>
      </div>
    </div>
  </elf-playground>
`);

export { PagePopConfirmEx3 };
