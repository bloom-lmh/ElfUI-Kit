import { defineHtml, onBeforeUnmount, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "动态目标卸载保护", en: "Dynamic target removal" },
  simulate: { zh: "模拟目标消失", en: "Remove the target" },
  card: { zh: "正在同步的数据卡片", en: "Synchronizing data card" },
  cardDescription: {
    zh: "该区域会在引导打开后自动卸载。",
    en: "This region is removed after the tour opens.",
  },
  removed: { zh: "数据卡片已离开文档树", en: "The data card left the document tree" },
  stepTitle: { zh: "动态目标保护", en: "Dynamic target protection" },
  stepContent: {
    zh: "目标卸载后，引导会回退到居中的安全面板，而不会停留在旧坐标。",
    en: "If the target is removed, the tour falls back to a safe centered panel instead of using stale coordinates.",
  },
  ready: { zh: "目标已就绪", en: "Target ready" },
  following: { zh: "正在跟随目标", en: "Following the target" },
  resilient: { zh: "目标已卸载 · 引导仍可继续", en: "Target removed · Tour can continue" },
});

const code = `<elf-button @click="startResilientTour">${t("simulate")}</elf-button>
<div v-if="showTarget" id="tour-live-target">${t("card")}</div>
<elf-tour
  :steps.prop="steps"
  :visible="visible"
  @close="closeTour"
/>`;

const script = `const visible = useRef(false);
const showTarget = useRef(true);
const status = useRef("${t("ready")}");
const steps = [{
  target: "#tour-live-target",
  title: "${t("stepTitle")}",
  content: "${t("stepContent")}"
}];

let removalTimer;
const startResilientTour = () => {
  showTarget.set(true);
  status.set("${t("following")}");
  visible.set(true);
  removalTimer = setTimeout(() => {
    showTarget.set(false);
    status.set("${t("resilient")}");
  }, 900);
};

const closeTour = () => visible.set(false);
onBeforeUnmount(() => clearTimeout(removalTimer));`;

const visible = useRef(false);
const showTarget = useRef(true);
const status = useRef(t("ready"));

const steps = [
  {
    target: "#tour-live-target",
    title: t("stepTitle"),
    content: t("stepContent"),
    placement: "bottom" as const,
  },
];

let removalTimer: ReturnType<typeof setTimeout> | null = null;

const clearRemovalTimer = (): void => {
  if (removalTimer) clearTimeout(removalTimer);
  removalTimer = null;
};

const startResilientTour = (): void => {
  clearRemovalTimer();
  showTarget.set(true);
  status.set(t("following"));
  visible.set(true);
  removalTimer = setTimeout(() => {
    showTarget.set(false);
    status.set(t("resilient"));
    removalTimer = null;
  }, 900);
};

const closeTour = (): void => {
  clearRemovalTimer();
  visible.set(false);
};

onBeforeUnmount(clearRemovalTimer);

const PageTourEx3 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <span slot="status" class="demo-state">{{ status }}</span>
    <div style="display:grid;grid-template-columns:minmax(0,1fr) auto;gap:16px;align-items:center;padding:20px;border:1px solid var(--elf-border);border-radius:8px">
      <div v-if=${showTarget} id="tour-live-target" style="padding:18px;border-radius:8px;background:color-mix(in srgb,var(--elf-primary) 10%,var(--elf-bg-paper));border:1px solid color-mix(in srgb,var(--elf-primary) 30%,var(--elf-border))">
        <strong>${t("card")}</strong>
        <div style="margin-top:6px;color:var(--elf-text-secondary);font-size:13px">${t("cardDescription")}</div>
      </div>
      <div v-else style="padding:18px;color:var(--elf-text-secondary)">${t("removed")}</div>
      <elf-button color="primary" @click=${startResilientTour}>${t("simulate")}</elf-button>
    </div>
    <elf-tour :steps=${steps} :visible=${visible} @close=${closeTour} @finish=${closeTour}></elf-tour>
  </elf-playground>
`);

export { PageTourEx3 };
