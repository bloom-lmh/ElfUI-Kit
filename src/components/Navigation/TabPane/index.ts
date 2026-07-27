import {
  defineHtml,
  defineProps,
  defineStyle,
  useHostAttr,
  useHostFlag
} from "@elfui/core";

import styles from "./style.scss?inline";
import type { TabPaneName, TabPaneProps, TabPaneSlots } from "../Tabs/types";

export type { TabPaneProps, TabPaneSlots } from "../Tabs/types";

interface TabPaneRuntimeProps extends TabPaneProps {
  active: boolean;
  rendered: boolean;
  panelId: string;
  labelledBy: string;
}

const props = defineProps<TabPaneRuntimeProps>({
  label: { type: String, default: "" },
  name: { type: [String, Number], default: "" },
  disabled: { type: Boolean, default: false },
  closable: { type: Boolean, default: false },
  lazy: { type: Boolean, default: false },
  active: { type: Boolean, default: false },
  rendered: { type: Boolean, default: false },
  panelId: { type: String, default: "" },
  labelledBy: { type: String, default: "" }
});

const shouldRender = (): boolean => !props.lazy || props.active || props.rendered;

useHostAttr("role", () => "tabpanel");
useHostAttr("id", () => props.panelId || null);
useHostAttr("aria-labelledby", () => props.labelledBy || null);
useHostAttr("aria-hidden", () => props.active ? "false" : "true");
useHostFlag("hidden", () => !props.active);
useHostFlag("data-active", () => props.active);
useHostFlag("data-lazy", () => Boolean(props.lazy));

defineStyle(styles);

const TabPane = defineHtml<TabPaneRuntimeProps, Record<string, never>, TabPaneSlots>(`
  <section v-if=${shouldRender()} class="tab-pane" part="panel">
    <slot></slot>
  </section>
`);

export { TabPane };
