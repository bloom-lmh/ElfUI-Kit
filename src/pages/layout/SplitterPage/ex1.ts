import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "水平分割与受控比例", en: "Horizontal split with a controlled ratio" },
  listPanel: { zh: "列表面板", en: "List panel" },
  detailPanel: { zh: "详情面板", en: "Details panel" },
  currentRatio: { zh: "首个面板比例", en: "First panel ratio" }
});

const size = useRef(36);

const onSizeUpdate = (event: CustomEvent): void => {
  size.set(Number(event.detail) || 36);
};

const code = `<elf-splitter
  :modelValue.prop=\${size}
  :min=\${20}
  :max=\${70}
  @update:modelValue=\${onSizeUpdate}
>
  <div slot="first">${t("listPanel")}</div>
  <div slot="second">${t("detailPanel")}</div>
</elf-splitter>`;

const script = `const size = useRef(36);

const onSizeUpdate = (event) => {
  size.set(event.detail);
};`;

const PageSplitterEx1 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <span slot="status">${t("currentRatio")}: ${Math.round(size.value)}%</span>
    <elf-splitter :modelValue.prop=${size.value} :min=${20} :max=${70} @update:modelValue=${onSizeUpdate}>
      <div slot="first" style="padding:16px">${t("listPanel")} ${Math.round(size.value)}%</div>
      <div slot="second" style="padding:16px">${t("detailPanel")}</div>
    </elf-splitter>
  </elf-playground>
`);

export { PageSplitterEx1 };
