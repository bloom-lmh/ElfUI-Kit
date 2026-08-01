import { defineHtml, defineStyle, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";
defineStyle(styles);

const t = createDocsTranslator({
  title: { zh: "垂直分割", en: "Vertical split" },
  topPanel: { zh: "上方面板", en: "Top panel" },
  bottomPanel: { zh: "下方面板", en: "Bottom panel" },
  currentRatio: { zh: "上方面板比例", en: "Top panel ratio" },
});

const verticalSize = useRef(48);

const onVerticalUpdate = (event: CustomEvent): void => {
  verticalSize.set(Number(event.detail) || 48);
};

const code = `<elf-splitter
  vertical
  :modelValue.prop=\${verticalSize}
  @update:modelValue=\${onVerticalUpdate}
>
  <div slot="first">${t("topPanel")}</div>
  <div slot="second">${t("bottomPanel")}</div>
</elf-splitter>`;

const script = `const verticalSize = useRef(48);

const onVerticalUpdate = (event) => {
    verticalSize.set(Number(event.detail) || 48);
};`;

const PageSplitterEx2 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <span slot="status">${t("currentRatio")}: ${Math.round(verticalSize.value)}%</span>
    <div class="splitter-demo-stage">
      <elf-splitter vertical :modelValue.prop=${verticalSize.value} @update:modelValue=${onVerticalUpdate}>
        <div slot="first">${t("topPanel")}</div>
        <div slot="second">${t("bottomPanel")}</div>
      </elf-splitter>
    </div>
  </elf-playground>
`);

export { PageSplitterEx2 };
