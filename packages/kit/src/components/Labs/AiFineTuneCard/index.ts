import {
  defineEmits,
  defineExpose,
  defineHtml,
  defineProps,
  defineStyle,
  useEffect,
  useHostAttr,
  useRef,
} from "@elfui/core";

import styles from "./style.scss?inline";
import type {
  AiFineTuneCardEmits,
  AiFineTuneCardExpose,
  AiFineTuneCardProps,
  AiFineTuneChangeDetail,
  AiFineTuneLabels,
  AiFineTuneOption,
  AiFineTuneProperty,
} from "./types";

export type {
  AiFineTuneCardElement,
  AiFineTuneCardEmits,
  AiFineTuneCardExpose,
  AiFineTuneCardProps,
  AiFineTuneChangeDetail,
  AiFineTuneLabels,
  AiFineTuneOption,
  AiFineTuneProperty,
  AiFineTunePropertyKind,
} from "./types";

const DEFAULT_LABELS: AiFineTuneLabels = {
  adjust: "Adjust",
  type: "Type",
};

const props = defineProps<AiFineTuneCardProps>({
  title: { type: String, default: "" },
  adjustLabel: { type: String, default: "" },
  properties: { type: Array, default: () => [] },
  labels: { type: Object, default: () => ({}) },
  ariaLabel: { type: String, default: "" },
});

const emit = defineEmits<AiFineTuneCardEmits>(["change"]);
const values = useRef<Record<string, number | string>>({});
let lastSignature = "";

const label = (key: keyof AiFineTuneLabels): string =>
  props.labels?.[key] || DEFAULT_LABELS[key] || key;
const adjustText = (): string => props.adjustLabel || label("adjust");
const properties = (): AiFineTuneProperty[] => props.properties;
const propertyKey = (property: AiFineTuneProperty): string => property.key;
const propertyValue = (property: AiFineTuneProperty): number | string =>
  values.value[property.key] ?? property.value;
const propertyUnit = (property: AiFineTuneProperty): string => property.unit || "";
const propertyMin = (property: AiFineTuneProperty): number => Number(property.min ?? 0);
const propertyMax = (property: AiFineTuneProperty): number => Number(property.max ?? 100);
const propertyStep = (property: AiFineTuneProperty): number => Number(property.step ?? 1);
const propertyOptions = (property: AiFineTuneProperty): AiFineTuneOption[] =>
  property.options || [];
const optionActive = (property: AiFineTuneProperty, option: AiFineTuneOption): boolean =>
  String(propertyValue(property)) === option.value;
const hostLabel = (): string => props.ariaLabel || `${props.title} · ${adjustText()}`;

const signature = (): string =>
  props.properties
    .map((property) => `${property.key}:${property.value}:${property.kind}`)
    .join("\u0000");

useEffect(() => {
  const current = signature();
  if (current !== lastSignature) {
    lastSignature = current;
    const next: Record<string, number | string> = {};
    props.properties.forEach((property) => {
      next[property.key] = property.value;
    });
    values.set(next);
  }
});

const update = (property: AiFineTuneProperty, value: number | string): void => {
  values.set({ ...values.value, [property.key]: value });
  const detail: AiFineTuneChangeDetail = { key: property.key, value, property };
  emit("change", detail);
};

const onNumberInput = (event: Event): void => {
  const target = event.currentTarget as HTMLInputElement;
  const property = properties().find((entry) => entry.key === target.dataset.key);
  if (property) update(property, Number(target.value));
};
const onTextInput = (event: Event): void => {
  const target = event.currentTarget as HTMLInputElement;
  const property = properties().find((entry) => entry.key === target.dataset.key);
  if (property) update(property, target.value);
};
const onSelectClick = (event: Event): void => {
  const target = event.currentTarget as HTMLElement;
  const property = properties().find((entry) => entry.key === target.dataset.key);
  if (property) update(property, target.dataset.value || "");
};

const getValues = (): Record<string, number | string> => ({ ...values.value });
const setValue = (key: string, value: number | string): void => {
  const property = properties().find((entry) => entry.key === key);
  if (!property) return;
  update(property, value);
};

useHostAttr("aria-label", hostLabel);

defineExpose<AiFineTuneCardExpose>({ getValues, setValue });

defineStyle(styles);

const AiFineTuneCard = defineHtml(`
  <article class="fine-tune" role="group">
    <header class="head">
      <span class="title">${props.title}</span>
      <span class="adjust">${adjustText()}</span>
      <slot name="header-extra"></slot>
    </header>
    <div class="body">
      <div v-for="property in properties()" :key="propertyKey(property)" class="property">
        <span class="property-label">{{ property.label }}</span>
        <div v-if="property.kind === 'number'" class="number-control">
          <input
            class="range"
            type="range"
            :data-key="property.key"
            :min="propertyMin(property)"
            :max="propertyMax(property)"
            :step="propertyStep(property)"
            :value="String(propertyValue(property))"
            @input=${onNumberInput}
          >
          <span class="value-box">
            <input
              class="value-input"
              type="number"
              :data-key="property.key"
              :min="propertyMin(property)"
              :max="propertyMax(property)"
              :step="propertyStep(property)"
              :value="String(propertyValue(property))"
              @input=${onNumberInput}
            >
            <span v-if="property.unit" class="unit">{{ propertyUnit(property) }}</span>
          </span>
        </div>
        <div v-else-if="property.kind === 'select'" class="select-control">
          <button
            v-for="option in propertyOptions(property)"
            :key="option.value"
            class="option"
            :class="{ active: optionActive(property, option) }"
            type="button"
            :data-key="property.key"
            :data-value="option.value"
            :aria-pressed="String(optionActive(property, option))"
            @click=${onSelectClick}
          >{{ option.label }}</button>
        </div>
        <input
          v-else
          class="text-input"
          type="text"
          :data-key="property.key"
          :value="String(propertyValue(property))"
          @input=${onTextInput}
        >
      </div>
    </div>
    <footer class="foot"><slot name="footer"></slot></footer>
  </article>
`);

export { AiFineTuneCard };
