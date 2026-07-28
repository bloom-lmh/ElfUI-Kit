import { defineHtml, defineStyle, onMounted, useRef } from "@elfui/core";

import pageStyles from "./style.scss?inline";

defineStyle(pageStyles);

const status = useRef("等待 Ctrl/⌘ + K");

const onKeydown = (event: KeyboardEvent): void => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    status.set("快捷键已触发");
  }
};

onMounted(() => {
  window.addEventListener("keydown", onKeydown);
  return () => window.removeEventListener("keydown", onKeydown);
});

const templateCode = `<button type="button" aria-keyshortcuts="Control+K Meta+K">
  打开命令面板
</button>
<output aria-live="polite">\${status}</output>`;

const scriptCode = `const status = useRef("等待 Ctrl/⌘ + K");

const onKeydown = (event: KeyboardEvent) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    status.set("快捷键已触发");
  }
};

onMounted(() => {
  window.addEventListener("keydown", onKeydown);
  return () => window.removeEventListener("keydown", onKeydown);
});`;

const PageAccessibilityEx2 = defineHtml(`
  <elf-playground
    title="快捷键与生命周期"
    :code=${templateCode}
    :script=${scriptCode}
  >
    <div class="hotkey-demo">
      <elf-button
        variant="contained"
        aria-keyshortcuts="Control+K Meta+K"
        @click=${() => status.set("按钮点击已触发")}
      >打开命令面板</elf-button>
      <kbd>Ctrl/⌘ + K</kbd>
      <output aria-live="polite">${status}</output>
    </div>
  </elf-playground>
`);

export { PageAccessibilityEx2 };
