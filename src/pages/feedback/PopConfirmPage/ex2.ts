import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  section: { zh: "定位与异步确认", en: "Placement and async confirmation" },
  placements: { zh: "四个方向", en: "Four placements" },
  topTitle: { zh: "上方弹出", en: "Open above" },
  topContent: { zh: "默认方向", en: "The default placement." },
  top: { zh: "上方", en: "Top" },
  bottomTitle: { zh: "下方弹出", en: "Open below" },
  bottomContent: { zh: "适合顶部工具栏", en: "Useful in top toolbars." },
  bottom: { zh: "下方", en: "Bottom" },
  leftTitle: { zh: "左侧弹出", en: "Open to the left" },
  leftContent: { zh: "适合右侧操作列", en: "Useful in right-side action columns." },
  left: { zh: "左侧", en: "Left" },
  rightTitle: { zh: "右侧弹出", en: "Open to the right" },
  rightContent: { zh: "适合左侧导航", en: "Useful beside left navigation." },
  right: { zh: "右侧", en: "Right" },
  asyncTitle: { zh: "异步确认与失败重试", en: "Async confirmation and retry" },
  approvalTitle: { zh: "提交审批？", en: "Submit for approval?" },
  approvalContent: { zh: "提交后将进入审批流程", en: "Submission starts the approval workflow." },
  submit: { zh: "提交", en: "Submit" },
  reconsider: { zh: "再看看", en: "Not yet" },
  validating: { zh: "校验中", en: "Validating" },
  manual: { zh: "手动控制", en: "Manual control" },
  toggle: { zh: "切换气泡", en: "Toggle popover" },
  waiting: { zh: "等待提交", en: "Waiting to submit" },
  validatingStatus: { zh: "正在校验审批条件…", en: "Validating approval conditions…" },
  unavailable: { zh: "审批服务暂时不可用", en: "The approval service is temporarily unavailable." },
  retry: { zh: "校验失败，请在气泡内重试", en: "Validation failed. Retry inside the popover." },
  submitted: { zh: "已提交审批", en: "Submitted for approval" },
});

const code1 = `<elf-pop-confirm placement="top" title="${t("topTitle")}" content="${t("topContent")}">
  <elf-button>${t("top")}</elf-button>
</elf-pop-confirm>
<elf-pop-confirm placement="bottom" title="${t("bottomTitle")}" content="${t("bottomContent")}">
  <elf-button>${t("bottom")}</elf-button>
</elf-pop-confirm>
<elf-pop-confirm placement="left" title="${t("leftTitle")}" content="${t("leftContent")}">
  <elf-button>${t("left")}</elf-button>
</elf-pop-confirm>
<elf-pop-confirm placement="right" title="${t("rightTitle")}" content="${t("rightContent")}">
  <elf-button>${t("right")}</elf-button>
</elf-pop-confirm>`;

const code2 = `<elf-pop-confirm
  trigger="manual"
  :visible="visible"
  title="${t("approvalTitle")}"
  content="${t("approvalContent")}"
  loading-text="${t("validating")}"
  :before-confirm="verifyApproval"
  @update:visible="visible = $event.detail"
  @confirm="onSubmitted"
  @confirm-error="onSubmitError"
>
  <elf-button color="primary">${t("manual")}</elf-button>
</elf-pop-confirm>
<elf-button variant="outlined" @click="toggleVisible">${t("toggle")}</elf-button>`;

const code2Script = `const visible = useRef(false);
const status = useRef("${t("waiting")}");
const attempts = useRef(0);

const toggleVisible = () => visible.set(!visible.value);

const verifyApproval = async () => {
  attempts.set(attempts.value + 1);
  status.set("${t("validatingStatus")}");
  await new Promise((resolve) => setTimeout(resolve, 900));
  if (attempts.value === 1) throw new Error("${t("unavailable")}");
};

const onSubmitError = () => status.set("${t("retry")}");
const onSubmitted = () => status.set("${t("submitted")}");`;

// state
const visible = useRef(false);
const status = useRef(t("waiting"));
const attempts = useRef(0);

// actions
const toggleVisible = (): void => {
  visible.set(!visible.value);
};

const onVisibleChange = (event: Event): void => {
  visible.set(Boolean((event as CustomEvent<boolean>).detail));
};

const verifyApproval = async (): Promise<void> => {
  attempts.set(attempts.value + 1);
  status.set(t("validatingStatus"));
  await new Promise((resolve) => setTimeout(resolve, 900));
  if (attempts.value === 1) throw new Error(t("unavailable"));
};

const onSubmitError = (): void => {
  status.set(t("retry"));
};

const onSubmitted = (): void => {
  status.set(t("submitted"));
};

const PagePopConfirmEx2 = defineHtml(`
  <h2>${t("section")}</h2>
  <elf-playground :title=${t("placements")} :code=${code1}>
    <div style="display:flex;gap:12px;flex-wrap:wrap;padding:24px 0">
      <elf-pop-confirm :title=${t("topTitle")} :content=${t("topContent")} placement="top">
        <elf-button>${t("top")}</elf-button>
      </elf-pop-confirm>
      <elf-pop-confirm :title=${t("bottomTitle")} :content=${t("bottomContent")} placement="bottom">
        <elf-button>${t("bottom")}</elf-button>
      </elf-pop-confirm>
      <elf-pop-confirm :title=${t("leftTitle")} :content=${t("leftContent")} placement="left">
        <elf-button>${t("left")}</elf-button>
      </elf-pop-confirm>
      <elf-pop-confirm :title=${t("rightTitle")} :content=${t("rightContent")} placement="right">
        <elf-button>${t("right")}</elf-button>
      </elf-pop-confirm>
    </div>
  </elf-playground>

  <elf-playground :title=${t("asyncTitle")} :code=${code2} :script=${code2Script}>
    <span slot="status" class="demo-state">{{ status }}</span>
    <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
      <elf-pop-confirm
        trigger="manual"
        :visible=${visible}
        :title=${t("approvalTitle")}
        :content=${t("approvalContent")}
        :confirm-text=${t("submit")}
        :cancel-text=${t("reconsider")}
        :loading-text=${t("validating")}
        :before-confirm=${verifyApproval}
        @update:visible=${onVisibleChange}
        @confirm=${onSubmitted}
        @confirm-error=${onSubmitError}
      >
        <elf-button color="primary">${t("manual")}</elf-button>
      </elf-pop-confirm>
      <elf-button variant="outlined" @click=${toggleVisible}>${t("toggle")}</elf-button>
    </div>
  </elf-playground>
`);

export { PagePopConfirmEx2 };
