import {
  defineExpose,
  defineHtml,
  defineProps,
  defineStyle,
  useHost,
  useHostFlag,
  useTemplateRef,
} from "@elfui/core";

import type { CollapseItemExposes, CollapseItemProps, CollapseItemSlots } from "../Collapse/types";
import styles from "./style.scss?inline";

export type { CollapseItemExposes, CollapseItemProps, CollapseItemSlots } from "../Collapse/types";

type NavigationAction = "next" | "previous" | "first" | "last";

const nextItemId = (): string => {
  const store = globalThis as typeof globalThis & { __elfCollapseItemIdSeed?: number };
  store.__elfCollapseItemIdSeed = (store.__elfCollapseItemIdSeed ?? 0) + 1;
  return `elf-collapse-item-${store.__elfCollapseItemIdSeed}`;
};

const props = defineProps<CollapseItemProps>({
  name: { type: null, default: "" },
  title: { type: String, default: "" },
  disabled: { type: Boolean, default: false },
  active: { type: Boolean, default: false },
});

const host = useHost();
const headerRef = useTemplateRef<HTMLButtonElement>("header");
const id = nextItemId();
const panelId = `${id}-panel`;
const headerId = `${id}-header`;

// Methods
const requestToggle = (): void => {
  if (props.disabled) return;
  host.dispatchEvent(
    new CustomEvent("elf-collapse-toggle", {
      bubbles: true,
      composed: true,
    }),
  );
};

const focusHeader = (): void => headerRef.value?.focus();

const onHeaderKeydown = (event: KeyboardEvent): void => {
  const actions: Partial<Record<string, NavigationAction>> = {
    ArrowDown: "next",
    ArrowUp: "previous",
    Home: "first",
    End: "last",
  };
  const action = actions[event.key];
  if (!action) return;
  event.preventDefault();
  host.dispatchEvent(
    new CustomEvent<NavigationAction>("elf-collapse-navigate", {
      detail: action,
      bubbles: true,
      composed: true,
    }),
  );
};

useHostFlag("data-active", () => Boolean(props.active));
useHostFlag("disabled", () => Boolean(props.disabled));

defineExpose<CollapseItemExposes>({ toggle: requestToggle, focusHeader });

defineStyle(styles);

const CollapseItem = defineHtml<CollapseItemProps, Record<string, never>, CollapseItemSlots>(`
  <section class="item" part="item">
    <button
      ref="header"
      class="header"
      part="header"
      type="button"
      :id=${headerId}
      :disabled=${props.disabled}
      :aria-expanded=${props.active ? "true" : "false"}
      :aria-controls=${panelId}
      @click=${requestToggle}
      @keydown=${onHeaderKeydown}
    >
      <span class="title" part="title"><slot name="title">${props.title}</slot></span>
      <span class="arrow" part="icon" aria-hidden="true">
        <slot name="icon"><span class="default-arrow"></span></slot>
      </span>
    </button>
    <div
      class="body"
      part="body"
      :id=${panelId}
      role="region"
      :aria-labelledby=${headerId}
      :aria-hidden=${props.active ? "false" : "true"}
      :inert=${!props.active}
    >
      <div class="body-content"><slot></slot></div>
    </div>
  </section>
`);

export { CollapseItem };
