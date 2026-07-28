import {
  defineHtml,
  defineStyle,
  useHost,
  useRef,
} from "@elfui/core";

import type { ScrollbarExpose } from "../../../components/Layout/Scrollbar/types";
import { useGoTo } from "../../../composables";
import styles from "./goToPreview.scss?inline";

const host = useHost();
const goTo = useGoTo();
const status = useRef("Ready");

const viewport = (): HTMLElement | null =>
  host.shadowRoot
    ?.querySelector<HTMLElement & ScrollbarExpose>("#config-goto-viewport")
    ?.wrapRef ?? null;

const scrollToReview = async (): Promise<void> => {
  const target = host.shadowRoot?.querySelector("#config-goto-review");
  if (!target) return;
  status.set("Scrolling");
  const result = await goTo(target, {
    container: viewport,
    root: host.shadowRoot,
  }).finished;
  status.set(result.status === "completed" ? "Review reached" : result.status);
};

defineStyle(styles);

const PageConfigProviderGoToPreview = defineHtml(`
  <div class="goto-demo">
    <div class="goto-demo__header">
      <div>
        <strong>Programmatic scrolling</strong>
        <small>${status.value}</small>
      </div>
      <elf-button size="sm" @click=${scrollToReview}>Go to review</elf-button>
    </div>
    <elf-scrollbar id="config-goto-viewport" height="260px" always>
      <section class="goto-demo__section is-start">
        <span>01</span>
        <h3>Project brief</h3>
        <p>The provider supplies duration and easing to every consumer.</p>
      </section>
      <section class="goto-demo__section is-middle">
        <span>02</span>
        <h3>Implementation</h3>
        <p>The component only supplies its target and container.</p>
      </section>
      <section id="config-goto-review" class="goto-demo__section is-end">
        <span>03</span>
        <h3>Review</h3>
        <p>Reduced-motion automatically changes the transition to immediate.</p>
      </section>
    </elf-scrollbar>
  </div>
`);

export { PageConfigProviderGoToPreview };
