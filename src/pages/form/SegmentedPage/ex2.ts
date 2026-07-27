import { defineHtml, useRef } from "@elfui/core";

const density = useRef("默认");

const code2 = `<elf-segmented size="sm" :options.prop=\${densityOptions} :modelValue.prop=\${density} />
<elf-segmented :options.prop=\${densityOptions} :modelValue.prop=\${density} />
<elf-segmented block size="lg" :options.prop=\${densityOptions} :modelValue.prop=\${density} />`;

const script2 = `const density = useRef("默认");
const densityOptions = ["紧凑", "默认", "宽松"];

const onDensityUpdate = (event) => density.set(event.detail);`;

const densityOptions = ["紧凑", "默认", "宽松"];

const onDensityUpdate = (event: CustomEvent): void => density.set(String(event.detail || ""));

const PageSegmentedEx2 = defineHtml(`
<elf-playground title="small / default / large / block" :code=${code2} :script=${script2}>
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
