import {
  defineHtml,
  defineProps,
  defineStyle,
  useEffect,
  useHostAttr,
  useHostFlag,
  useRef
} from "@elfui/core";

import type { SplitterPanelProps, SplitterPanelSlots } from "./types";

const props = defineProps<SplitterPanelProps>({
  size: { type: Number, default: 50 },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  collapsible: { type: Boolean, default: false },
  resizable: { type: Boolean, default: true },
  lazy: { type: Boolean, default: false },
  collapsed: { type: Boolean, default: false }
});

const activated = useRef(!props.lazy || !props.collapsed);

useEffect(() => {
  if (!props.collapsed && !activated.peek()) activated.set(true);
});

useHostFlag("collapsed", () => props.collapsed);
// The parent splitter cannot reliably observe a child custom element's
// boolean property during the same upgrade turn. Reflect an explicit string
// contract so slot discovery and later property updates stay in sync.
useHostAttr("data-resizable", () => (props.resizable ? "true" : "false"));

defineStyle(`
  :host {
    display: block;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
  }

  :host([collapsed]) {
    display: none;
  }
`);

const SplitterPanel = defineHtml<SplitterPanelProps, Record<string, never>, SplitterPanelSlots>(`
  <slot v-if=${!props.lazy || activated}></slot>
`);

export { SplitterPanel };
