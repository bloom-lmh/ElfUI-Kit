import {
  defineHtml,
  defineProps,
  defineStyle,
  useHost,
  useHostAttr,
  useHostCssVar,
  useHostFlag,
} from "@elfui/core";

import styles from "./style.scss?inline";
import type { TextProps, TextSize, TextSlots, TextTag, TextType } from "./types";

export type { TextProps, TextSize, TextSlots, TextTag, TextType } from "./types";

const TEXT_TYPES: readonly TextType[] = ["primary", "success", "warning", "danger", "info"];
const TEXT_SIZES: readonly TextSize[] = ["small", "default", "large", "sm", "md", "lg"];
const TEXT_TAGS: readonly TextTag[] = [
  "span",
  "p",
  "div",
  "b",
  "strong",
  "i",
  "em",
  "sub",
  "sup",
  "mark",
  "del",
  "ins",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
];

const props = defineProps<TextProps>({
  type: { type: String, default: "" },
  size: { type: String, default: "" },
  truncated: { type: Boolean, default: false },
  lineClamp: { type: [Number, String], default: undefined },
  tag: { type: String, default: "span" },
  mark: { type: Boolean, default: false },
  deleted: { type: Boolean, default: false },
  inserted: { type: Boolean, default: false },
  strong: { type: Boolean, default: false },
  italic: { type: Boolean, default: false },
});

const host = useHost();

const normalizedType = (): TextType => {
  const value = String(props.type || "") as TextType;
  return TEXT_TYPES.includes(value) ? value : "";
};

const normalizedSize = (): TextSize => {
  const value = String(props.size || "") as TextSize;
  return TEXT_SIZES.includes(value) ? value : "";
};

const normalizedTag = (): TextTag => {
  const value = String(props.tag || "span").toLowerCase() as TextTag;
  return TEXT_TAGS.includes(value) ? value : "span";
};

const hasLineClamp = (): boolean => {
  const value = props.lineClamp;
  return (
    (value !== undefined && value !== null && String(value).trim() !== "") ||
    host.hasAttribute("line-clamp")
  );
};

const lineClampValue = (): number => {
  const rawValue = props.lineClamp ?? host.getAttribute("line-clamp") ?? 1;
  const value = Number.parseInt(String(rawValue), 10);
  return Number.isFinite(value) ? Math.max(1, value) : 1;
};

useHostAttr("type", normalizedType);
useHostAttr("size", normalizedSize);
useHostAttr("tag", normalizedTag);
useHostFlag("truncated", () => Boolean(props.truncated));
useHostFlag("data-line-clamp", hasLineClamp);
useHostFlag("mark", () => Boolean(props.mark));
useHostFlag("deleted", () => Boolean(props.deleted));
useHostFlag("inserted", () => Boolean(props.inserted));
useHostFlag("strong", () => Boolean(props.strong));
useHostFlag("italic", () => Boolean(props.italic));
useHostCssVar("--_line-clamp", () => String(lineClampValue()));

defineStyle(styles);

const Text = defineHtml<TextProps, Record<string, never>, TextSlots>(`
  <p v-if=${normalizedTag() === "p"} class="text" part="text"><slot></slot></p>
  <div v-else-if=${normalizedTag() === "div"} class="text" part="text"><slot></slot></div>
  <b v-else-if=${normalizedTag() === "b"} class="text" part="text"><slot></slot></b>
  <strong v-else-if=${normalizedTag() === "strong"} class="text" part="text"><slot></slot></strong>
  <i v-else-if=${normalizedTag() === "i"} class="text" part="text"><slot></slot></i>
  <em v-else-if=${normalizedTag() === "em"} class="text" part="text"><slot></slot></em>
  <sub v-else-if=${normalizedTag() === "sub"} class="text" part="text"><slot></slot></sub>
  <sup v-else-if=${normalizedTag() === "sup"} class="text" part="text"><slot></slot></sup>
  <mark v-else-if=${normalizedTag() === "mark"} class="text" part="text"><slot></slot></mark>
  <del v-else-if=${normalizedTag() === "del"} class="text" part="text"><slot></slot></del>
  <ins v-else-if=${normalizedTag() === "ins"} class="text" part="text"><slot></slot></ins>
  <h1 v-else-if=${normalizedTag() === "h1"} class="text" part="text"><slot></slot></h1>
  <h2 v-else-if=${normalizedTag() === "h2"} class="text" part="text"><slot></slot></h2>
  <h3 v-else-if=${normalizedTag() === "h3"} class="text" part="text"><slot></slot></h3>
  <h4 v-else-if=${normalizedTag() === "h4"} class="text" part="text"><slot></slot></h4>
  <h5 v-else-if=${normalizedTag() === "h5"} class="text" part="text"><slot></slot></h5>
  <h6 v-else-if=${normalizedTag() === "h6"} class="text" part="text"><slot></slot></h6>
  <span v-else class="text" part="text"><slot></slot></span>
`);

export { Text };
