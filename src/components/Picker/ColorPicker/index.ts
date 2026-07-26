import {
    defineEmits,
    defineHtml,
    defineProps,
    defineStyle,
    html,
    useHostAttr,
    useHostFlag,
    useRef,
    watchEffect,
} from "@elfui/core";

import styles from "./style.scss?inline";
import { normalizeFieldVariant } from "../../../types/field";
import type { ColorFormat, ColorPreset } from "./types";

export type { ColorFormat, ColorPickerProps, ColorPickerVariant, ColorPreset } from "./types";

const props = defineProps({
    modelValue: { type: String, default: "#6750a4" },
    format: { type: String, default: "hex" },
    variant: { type: String, default: "filled" },
    label: { type: String, default: "" },
    presets: { type: Array, default: () => [] },
    showAlpha: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    clearable: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue", "change", "clear"]);

const color = useRef("#6750a4");

const alpha = useRef(100);

const normalizeHex = (value: unknown): string => {
    const raw = String(value || "").trim();
    if (/^#[0-9a-fA-F]{6}$/.test(raw)) return raw.toLowerCase();
    if (/^#[0-9a-fA-F]{3}$/.test(raw)) {
        const [, r, g, b] = raw;
        return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
    }
    return "#6750a4";
};

const hexToRgb = (hex: string): [number, number, number] => [
    Number.parseInt(hex.slice(1, 3), 16),
    Number.parseInt(hex.slice(3, 5), 16),
    Number.parseInt(hex.slice(5, 7), 16),
];

const outputValue = (): string => {
    const hex = normalizeHex(color.value);
    const [r, g, b] = hexToRgb(hex);
    if ((props.format as ColorFormat) === "rgb" || (props.showAlpha && alpha.value < 100)) {
        const a = Math.max(0, Math.min(100, alpha.value)) / 100;
        return props.showAlpha ? `rgba(${r}, ${g}, ${b}, ${a})` : `rgb(${r}, ${g}, ${b})`;
    }
    return hex;
};

watchEffect(() => {
    color.set(normalizeHex(props.modelValue || color.peek()));
});

const commit = (next: string): void => {
    if (props.disabled) return;
    color.set(normalizeHex(next));
    const value = outputValue();
    emit("update:modelValue", value);
    emit("change", value);
};

const onNative = (event: Event): void => commit((event.target as HTMLInputElement).value);

const onText = (event: Event): void => commit((event.target as HTMLInputElement).value);

const onAlpha = (event: Event): void => {
    alpha.set(Number((event.target as HTMLInputElement).value) || 100);
    const value = outputValue();
    emit("update:modelValue", value);
    emit("change", value);
};

const clear = (): void => {
    if (props.disabled) return;
    emit("update:modelValue", "");
    emit("change", "");
    emit("clear");
};

const presetItems = (): ColorPreset[] =>
    (Array.isArray(props.presets) ? props.presets : []).map((item) =>
        typeof item === "string"
            ? { value: item, label: item }
            : ({
                  value: String((item as ColorPreset).value || ""),
                  label: String((item as ColorPreset).label || (item as ColorPreset).value || ""),
              } as ColorPreset),
    );

const onPresetClick = (event: Event): void => {
    const index = Number((event.currentTarget as HTMLElement).dataset.index);
    const preset = presetItems()[index];
    if (preset) commit(preset.value);
};

const presetStyle = (preset: ColorPreset): Record<string, string> => ({
    background: normalizeHex(preset.value),
});

useHostAttr("variant", () => normalizeFieldVariant(props.variant));
useHostFlag("disabled", () => Boolean(props.disabled));
useHostFlag("data-dirty", () => Boolean(props.modelValue));
useHostFlag("data-has-label", () => Boolean(props.label));

defineStyle(styles);

const ColorPicker = defineHtml(html`
    <div :class=${["color-picker", { "is-disabled": props.disabled }]}>
        <label class="trigger">
            <fieldset v-if=${props.label} class="field-outline" aria-hidden="true">
                <legend><span>${props.label}</span></legend>
            </fieldset>
            <span v-if=${props.label} class="field-label">${props.label}</span>
            <span class="swatch" aria-hidden="true"
                ><span class="swatch-fill" :style=${{ background: outputValue() }}></span
            ></span>
            <input class="native" type="color" :value.prop=${color} :disabled=${props.disabled} @input=${onNative} />
            <input class="value" :value.prop=${outputValue()} :disabled=${props.disabled} @change=${onText} />
            <input
                v-if=${props.showAlpha}
                class="alpha"
                type="range"
                min="0"
                max="100"
                :value.prop=${alpha}
                @input=${onAlpha}
            />
            <button v-if=${props.clearable} class="clear" type="button" aria-label="Clear color" @click=${clear}>
                <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M4 4l8 8M12 4l-8 8"></path></svg>
            </button>
        </label>
        <div v-if=${presetItems().length > 0} class="presets">
            <button
                v-for="(item, index) in presetItems()"
                :key="item.value"
                type="button"
                class="preset"
                :data-index="index"
                :title="item.label"
                :style="presetStyle(item)"
                @click=${onPresetClick}
            ></button>
        </div>
    </div>
`);

export { ColorPicker };
