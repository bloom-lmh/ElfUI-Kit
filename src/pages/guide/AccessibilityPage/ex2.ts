import { defineHtml, defineStyle, onMounted, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import pageStyles from "./style.scss?inline";

const t = createDocsTranslator({
  title: { zh: "快捷键与生命周期", en: "Hotkeys and lifecycle" },
  waiting: { zh: "等待 Ctrl/⌘ + K", en: "Waiting for Ctrl/⌘ + K" },
  triggered: { zh: "快捷键已触发", en: "Hotkey triggered" },
  clicked: { zh: "按钮点击已触发", en: "Button click triggered" },
  open: { zh: "打开命令面板", en: "Open command palette" }
});

defineStyle(pageStyles);

const status = useRef(t("waiting"));

const onKeydown = (event: KeyboardEvent): void => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    status.set(t("triggered"));
  }
};

onMounted(() => {
  window.addEventListener("keydown", onKeydown);
  return () => window.removeEventListener("keydown", onKeydown);
});

const templateCode = `<button type="button" aria-keyshortcuts="Control+K Meta+K">
  ${t("open")}
</button>
<output aria-live="polite">\${status}</output>`;

const scriptCode = `const status = useRef("${t("waiting")}");

const onKeydown = (event: KeyboardEvent) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    status.set("${t("triggered")}");
  }
};

onMounted(() => {
  window.addEventListener("keydown", onKeydown);
  return () => window.removeEventListener("keydown", onKeydown);
});`;

const PageAccessibilityEx2 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground
    :title=${t("title")}
    :code=${templateCode}
    :script=${scriptCode}
  >
    <div class="hotkey-demo">
      <elf-button
        variant="contained"
        aria-keyshortcuts="Control+K Meta+K"
        @click=${() => status.set(t("clicked"))}
      >${t("open")}</elf-button>
      <kbd>Ctrl/⌘ + K</kbd>
      <output aria-live="polite">${status}</output>
    </div>
  </elf-playground>
`);

export { PageAccessibilityEx2 };
