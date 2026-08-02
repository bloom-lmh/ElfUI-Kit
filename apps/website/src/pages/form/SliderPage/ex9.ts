import { mdiSnowflake, mdiWeatherSunny } from "@mdi/js";
import { defineHtml, useRef } from "@elfui/core";
import { createSvgIconSet } from "@elfui/kit-src/components/Basic/Icon";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "四季刻度与自定义滑块标签", en: "Season ticks and custom thumb labels" },
  winter: { zh: "冬季", en: "Winter" },
  spring: { zh: "春季", en: "Spring" },
  summer: { zh: "夏季", en: "Summer" },
  fall: { zh: "秋季", en: "Fall" },
});

const value = useRef<[number, number]>([0, 2]);
const updateValue = (event: CustomEvent<[number, number]>): void => value.set(event.detail);
const labels = (): string[] => [t("winter"), t("spring"), t("summer"), t("fall")];
const iconOptions = {
  defaultSet: "mdi",
  sets: { mdi: createSvgIconSet({ snow: mdiSnowflake, sun: mdiWeatherSunny }) },
};

const code = `<elf-slider range segmented :min="0" :max="3" :step="1" :modelValue.prop="[0, 2]" :tickLabels.prop="['Winter', 'Spring', 'Summer', 'Fall']">
  <elf-icon slot="thumb-label-start" name="snow" />
  <elf-icon slot="thumb-label-end" name="sun" />
</elf-slider>`;

const PageSliderEx9 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("title")} :code=${code}>
    <div style="width:min(100%,760px);padding:44px 28px 22px">
      <elf-icon-provider :options.prop=${iconOptions}>
        <elf-slider range segmented :min=${0} :max=${3} :step=${1} :modelValue.prop=${value.value} :tickLabels.prop=${labels()} @update:modelValue=${updateValue}>
          <elf-icon slot="thumb-label-start" name="snow" size="16"></elf-icon>
          <elf-icon slot="thumb-label-end" name="sun" size="16"></elf-icon>
        </elf-slider>
      </elf-icon-provider>
    </div>
  </elf-playground>
`);

export { PageSliderEx9 };
