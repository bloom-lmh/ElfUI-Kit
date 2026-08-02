import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "小、中、大尺寸与块级布局", en: "Small, default, large, and block layouts" },
  compact: { zh: "紧凑", en: "Compact" },
  standard: { zh: "默认", en: "Default" },
  relaxed: { zh: "宽松", en: "Relaxed" },
});

const density = useRef(t("standard"));

const code2 = `<elf-segmented size="sm" :options.prop=\${densityOptions} :modelValue.prop=\${density} />
<elf-segmented :options.prop=\${densityOptions} :modelValue.prop=\${density} />
<elf-segmented block size="lg" :options.prop=\${densityOptions} :modelValue.prop=\${density} />`;

const script2 = `const density = useRef("${t("standard")}");
const densityOptions = ["${t("compact")}", "${t("standard")}", "${t("relaxed")}"];

const onDensityUpdate = (event) => density.set(event.detail);`;

const densityOptions = [t("compact"), t("standard"), t("relaxed")];

const onDensityUpdate = (event: CustomEvent): void => density.set(String(event.detail || ""));

const PageSegmentedEx2 = defineHtml(`
<elf-playground :title=${t("title")} :code=${code2} :script=${script2}>
            <div style="display:grid;gap:12px;width:min(420px,100%)">
                <elf-segmented
                    size="sm"
                    :options.prop=${densityOptions}
                    :modelValue.prop=${density}
                    @update:modelValue=${onDensityUpdate}
                ></elf-segmented>
                <elf-segmented
                    :options.prop=${densityOptions}
                    :modelValue.prop=${density}
                    @update:modelValue=${onDensityUpdate}
                ></elf-segmented>
                <elf-segmented
                    block
                    size="lg"
                    :options.prop=${densityOptions}
                    :modelValue.prop=${density}
                    @update:modelValue=${onDensityUpdate}
                ></elf-segmented>
            </div>
        </elf-playground>
`);

export { PageSegmentedEx2 };
