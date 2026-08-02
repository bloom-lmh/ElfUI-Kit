// elf-timeline — Material Design 时间轴

import { defineProps, defineStyle, useComputed, useHostAttr, defineHtml } from "@elfui/core";

import styles from "./style.scss?inline";
import type { TimelineItem, TimelineMode, TimelineProps } from "./types";

export type {
  TimelineColor,
  TimelineItem,
  TimelineMode,
  TimelineNodeSize,
  TimelineProps,
} from "./types";

const props = defineProps({
  items: { type: Array, default: () => [] },
  mode: { type: String, default: "left" },
  reverse: { type: Boolean, default: false },
}) as unknown as Readonly<TimelineProps>;

type TimelineRenderItem = TimelineItem & {
  __key: string;
  __idx: number;
  __last: boolean;
  __side: string;
  __placement: "top" | "bottom";
};

const normalizedMode = (): Exclude<TimelineMode, "left" | "right"> => {
  if (props.mode === "left") return "start";
  if (props.mode === "right") return "end";
  if (
    props.mode === "alternate" ||
    props.mode === "alternate-reverse" ||
    props.mode === "horizontal"
  )
    return props.mode;
  return "start";
};

const list = useComputed(() => {
  const arr = props.items || [];
  const result = props.reverse ? [...arr].reverse() : arr;
  const len = result.length;
  const mode = normalizedMode();
  const isAlt = mode === "alternate" || mode === "alternate-reverse" || mode === "horizontal";
  return result.map((item: TimelineItem, i: number): TimelineRenderItem => ({
    ...item,
    __key: String(item.timestamp || item.title || i),
    __idx: i,
    __last: i === len - 1,
    __side: isAlt
      ? (i + (mode === "alternate-reverse" ? 1 : 0)) % 2 === 0
        ? "left"
        : "right"
      : "left",
    __placement: item.placement === "top" ? "top" : "bottom",
  }));
});

const nodeClass = (item: Record<string, unknown>): Record<string, boolean> => {
  const color = String(item.color || item.type || "primary");
  return {
    [`is-${color}`]: true,
    "is-large": item.size === "large",
    "is-hollow": Boolean(item.hollow),
    "is-centered": Boolean(item.center),
  };
};

const nodeStyle = (item: Record<string, unknown>): Record<string, string> => {
  const color = String(item.color || "");
  return ["primary", "success", "warning", "danger", "info"].includes(color)
    ? {}
    : color
      ? { "--_node-bg": color }
      : {};
};

useHostAttr("data-mode", normalizedMode);

defineStyle(styles);

const Timeline = defineHtml(`
  <ol class="timeline" role="list">
    <li
      v-for="item in list"
      :key="item.__key"
      class="item"
      :class="{
        'is-right': item.__side === 'right',
        'is-last': item.__last,
        'is-both': item.side === 'both'
      }"
    >
      <div class="line"></div>
      <div
        class="body body-left"
        :class="item.cardClass || ''"
        :style="item.cardStyle || {}"
        :part="'body-' + item.__idx"
        v-if="item.__side === 'right' || item.side === 'both' || item.side === 'left'"
      >
        <div class="timestamp" v-if="!item.hideTimestamp && item.__placement === 'top' && (item.timestamp2 || item.timestamp)">
          {{ item.timestamp2 || item.timestamp }}
        </div>
        <slot :name="'item-' + item.__idx + '-secondary'">
          <div class="title" v-if="item.title2 || item.title">{{ item.title2 || item.title }}</div>
          <span v-if="item.content2 || item.content" v-html="item.content2 || item.content"></span>
        </slot>
        <div class="timestamp" v-if="!item.hideTimestamp && item.__placement === 'bottom' && (item.timestamp2 || item.timestamp)">
          {{ item.timestamp2 || item.timestamp }}
        </div>
        <slot></slot>
      </div>

      <div class="node" :class="nodeClass(item)" :style="nodeStyle(item)" :part="'node-' + item.__idx" aria-hidden="true">
        <slot :name="'dot-' + item.__idx">
          <slot name="dot"><elf-icon v-if="item.icon" class="node-inner" :name="item.icon" size="18"></elf-icon></slot>
        </slot>
      </div>

      <div
        class="body body-right"
        :class="item.cardClass || ''"
        :style="item.cardStyle || {}"
        :part="'body-' + item.__idx"
        v-if="item.__side === 'left' || item.side === 'both' || item.side === 'right'"
      >
        <div class="timestamp" v-if="!item.hideTimestamp && item.__placement === 'top' && item.timestamp">{{ item.timestamp }}</div>
        <slot :name="'item-' + item.__idx">
          <div class="title" v-if="item.title">{{ item.title }}</div>
          <span v-if="item.content" v-html="item.content"></span>
        </slot>
        <div class="timestamp" v-if="!item.hideTimestamp && item.__placement === 'bottom' && item.timestamp">{{ item.timestamp }}</div>
        <slot></slot>
      </div>
    </li>
  </ol>
`);

export { Timeline };
