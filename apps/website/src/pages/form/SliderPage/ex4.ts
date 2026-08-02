import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "纵向滑块", en: "Vertical slider" },
  volume: { zh: "音量", en: "Volume" },
});
const volume = useRef(42);

const onVolume = (event: CustomEvent): void => {
  volume.set(Number(event.detail));
};

const code = `<elf-slider
  vertical
  height="240"
  :modelValue.prop=\${volume.value}
  @update:modelValue=\${onVolume}
></elf-slider>`;

const script = `const volume = useRef(42);

const onVolume = (event: CustomEvent<number>): void => {
  volume.set(Number(event.detail));
};`;

const PageSliderEx4 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <div style="display:grid;gap:12px;justify-items:center;min-height:280px;width:120px">
      <elf-slider vertical height="240" :modelValue.prop=${volume.value} @update:modelValue=${onVolume}></elf-slider>
      <span slot="status" class="demo-state">${t("volume")} {{ volume }}</span>
    </div>
  </elf-playground>
`);

export { PageSliderEx4 };
