import {
  defineHtml,
  defineStyle,
  useHost,
  useRef,
} from "@elfui/core";

import type { ScrollbarExpose } from "../../../components/Layout/Scrollbar/types";
import { useGoTo } from "../../../composables";
import { createDocsTranslator } from "../../docsLocale";
import styles from "./goToPreview.scss?inline";

const t = createDocsTranslator({
  ready: { zh: "就绪", en: "Ready" },
  scrolling: { zh: "滚动中", en: "Scrolling" },
  reached: { zh: "已到达评审", en: "Review reached" },
  title: { zh: "程序化滚动", en: "Programmatic scrolling" },
  action: { zh: "前往评审", en: "Go to review" },
  brief: { zh: "项目简报", en: "Project brief" },
  briefDescription: {
    zh: "Provider 为所有使用方提供持续时间与缓动配置。",
    en: "The provider supplies duration and easing to every consumer.",
  },
  implementation: { zh: "实现", en: "Implementation" },
  implementationDescription: {
    zh: "组件只需要提供目标元素与滚动容器。",
    en: "The component only supplies its target and container.",
  },
  review: { zh: "评审", en: "Review" },
  reviewDescription: {
    zh: "减少动效偏好会自动把过渡切换为立即完成。",
    en: "Reduced motion automatically changes the transition to immediate.",
  },
});

const host = useHost();
const goTo = useGoTo();
const status = useRef(t("ready"));

const viewport = (): HTMLElement | null =>
  host.shadowRoot
    ?.querySelector<HTMLElement & ScrollbarExpose>("#config-goto-viewport")
    ?.wrapRef ?? null;

const scrollToReview = async (): Promise<void> => {
  const target = host.shadowRoot?.querySelector("#config-goto-review");
  if (!target) return;
  status.set(t("scrolling"));
  const result = await goTo(target, {
    container: viewport,
    root: host.shadowRoot,
  }).finished;
  status.set(result.status === "completed" ? t("reached") : result.status);
};

defineStyle(styles);

const PageConfigProviderGoToPreview = defineHtml(`
  <div class="goto-demo">
    <div class="goto-demo__header">
      <div>
        <strong>${t("title")}</strong>
        <small>${status.value}</small>
      </div>
      <elf-button size="sm" @click=${scrollToReview}>${t("action")}</elf-button>
    </div>
    <elf-scrollbar id="config-goto-viewport" height="260px" always>
      <section class="goto-demo__section is-start">
        <span>01</span>
        <h3>${t("brief")}</h3>
        <p>${t("briefDescription")}</p>
      </section>
      <section class="goto-demo__section is-middle">
        <span>02</span>
        <h3>${t("implementation")}</h3>
        <p>${t("implementationDescription")}</p>
      </section>
      <section id="config-goto-review" class="goto-demo__section is-end">
        <span>03</span>
        <h3>${t("review")}</h3>
        <p>${t("reviewDescription")}</p>
      </section>
    </elf-scrollbar>
  </div>
`);

export { PageConfigProviderGoToPreview };
