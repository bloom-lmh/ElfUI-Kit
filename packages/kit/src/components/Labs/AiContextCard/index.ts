import {
  defineEmits,
  defineHtml,
  defineProps,
  defineStyle,
  useHostAttr,
  useHostFlag,
} from "@elfui/core";

import styles from "./style.scss?inline";
import type {
  AiContextCardEmits,
  AiContextCardLabels,
  AiContextCardProps,
  AiContextSourceKind,
} from "./types";

export type {
  AiContextCardElement,
  AiContextCardEmits,
  AiContextCardLabels,
  AiContextCardProps,
  AiContextSourceKind,
} from "./types";

const DEFAULT_LABELS: AiContextCardLabels = {
  characters: "characters",
  source: "Source",
  select: "Use chunk",
};

const KINDS: readonly AiContextSourceKind[] = ["pdf", "csv", "web", "doc"];

const props = defineProps<AiContextCardProps>({
  title: { type: String, default: "" },
  content: { type: String, default: "" },
  characters: { type: Number, default: 0 },
  sourceKind: { type: String, default: "pdf" },
  sourceName: { type: String, default: "" },
  selectable: { type: Boolean, default: false },
  labels: { type: Object, default: () => ({}) },
  ariaLabel: { type: String, default: "" },
});

const emit = defineEmits<AiContextCardEmits>(["select"]);

const label = (key: keyof AiContextCardLabels): string =>
  props.labels?.[key] || DEFAULT_LABELS[key] || key;
const resolvedKind = (): AiContextSourceKind =>
  KINDS.includes(props.sourceKind as AiContextSourceKind)
    ? (props.sourceKind as AiContextSourceKind)
    : "pdf";
const characterText = (): string => `${props.characters.toLocaleString()} ${label("characters")}`;
const hasSource = (): boolean => Boolean(props.sourceName);
const hostLabel = (): string => props.ariaLabel || `${props.title} · ${props.sourceName}`;

const onSelect = (): void => {
  emit("select");
};

useHostAttr("data-kind", resolvedKind);
useHostFlag("data-selectable", () => props.selectable);
useHostAttr("aria-label", hostLabel);

defineStyle(styles);

const AiContextCard = defineHtml(`
  <article class="context-card" role="group">
    <header class="head">
      <h3 class="title">${props.title}</h3>
      <span class="characters">${characterText()}</span>
    </header>
    <p class="content">${props.content}</p>
    <footer class="foot">
      <span class="source">
        <span class="source-icon" aria-hidden="true"></span>
        <span class="source-kind" aria-hidden="true">${resolvedKind()}</span>
        <span v-if=${hasSource()} class="source-name">${props.sourceName}</span>
      </span>
      <button
        v-if=${props.selectable}
        class="select"
        type="button"
        :aria-label=${label("select")}
        @click=${onSelect}
      >${label("select")}</button>
    </footer>
  </article>
`);

export { AiContextCard };
