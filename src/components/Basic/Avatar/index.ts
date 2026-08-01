// elf-avatar — Material Design 头像组件
//
// 使用：
//   <elf-avatar alt="张三"></elf-avatar>
//   <elf-avatar src="https://..." alt="李四"></elf-avatar>
//   <elf-avatar icon="★" color="primary"></elf-avatar>
//   <elf-avatar size="lg" shape="square" alt="Admin"></elf-avatar>
//
// part: avatar — 用户可用 ::part(avatar) 自定义外观
// 逻辑：
// - 有 src 且图片加载成功 → 显示图片
// - 有 icon → 显示图标
// - 否则 → 显示 alt 首字母缩写

import {
  defineEmits,
  defineProps,
  defineStyle,
  useComputed,
  useEffect,
  useHostAttr,
  useRef,
  defineHtml,
} from "@elfui/core";

import styles from "./style.scss?inline";
import type { AvatarEmits, AvatarFit, AvatarProps } from "./types";

export type { AvatarEmits, AvatarFit, AvatarProps, AvatarShape, AvatarSize } from "./types";

// ───── 颜色哈希（基于名字生成稳定的背景色） ────────
const COLORS = [
  "#1976d2",
  "#2e7d32",
  "#ed6c02",
  "#d32f2f",
  "#0288d1",
  "#7b1fa2",
  "#00838f",
  "#c62828",
];

const hashColor = (name: string): string => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length]!;
};

const toText = (value: unknown): string => {
  if (typeof value === "string") return value;
  if (value == null) return "";
  return String(value);
};

const props = defineProps({
  size: { type: String, default: "md" },
  shape: { type: String, default: "circle" },
  src: { type: String, default: "" },
  srcSet: { type: String, default: "" },
  alt: { type: String, default: "" },
  fit: { type: String, default: "cover" },
  icon: { type: String, default: "" },
  color: { type: String, default: "" },
}) as unknown as Readonly<AvatarProps>;

const emit = defineEmits<AvatarEmits>();
const imgError = useRef(false);

const onImgError = (event: Event): void => {
  emit("error", event);
  imgError.set(true);
};

// A new source must be allowed to render after an earlier source failed.
useEffect(() => {
  void props.src;
  imgError.set(false);
});

const showImage = useComputed(() => !!toText(props.src) && !imgError.value);
const fallbackRole = (): "img" | null => (showImage.value ? null : "img");
const fallbackAriaLabel = (): string | null =>
  !showImage.value && toText(props.alt) ? toText(props.alt) : null;

const initials = useComputed(() => {
  const name = toText(props.alt);
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0]![0]! + parts[1]![0]!).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
});

const bgColor = useComputed(() => {
  const color = toText(props.color);
  if (color) return color;
  return hashColor(toText(props.alt) || "?");
});

const normalizedFit = (): AvatarFit => {
  const value = String(props.fit || "cover") as AvatarFit;
  return ["fill", "contain", "cover", "none", "scale-down"].includes(value) ? value : "cover";
};

useHostAttr("fit", normalizedFit);

defineStyle(styles);

const Avatar = defineHtml(`
  <div class="avatar" part="avatar" :style=${{ backgroundColor: bgColor }}
    :role=${fallbackRole()} :aria-label=${fallbackAriaLabel()}>
    <img v-if=${showImage} :src=${props.src} :srcset=${props.srcSet || null}
      :alt=${props.alt} @error=${onImgError} />
    <slot v-else name="icon">
      <span v-if=${props.icon} class="icon">${props.icon}</span>
      <slot v-else><span class="initials">${initials}</span></slot>
    </slot>
  </div>
`);

export { Avatar };
