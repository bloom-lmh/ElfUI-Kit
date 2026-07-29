import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import type { TreeNode } from "../../Data/Tree/types";
import type {
  TreeSelectElement,
  TreeSelectModelValue,
  TreeSelectValue,
} from "./types";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> =>
  new Promise((resolve) => queueMicrotask(resolve));
const settle = async (): Promise<void> => {
  await tick();
  await tick();
};
const settleTask = async (): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 0));
  await settle();
};

type TreeSelectHost = TreeSelectElement & {
  data: TreeNode[];
  modelValue: TreeSelectModelValue;
  multiple: boolean;
  showCheckbox: boolean;
  checkStrictly: boolean;
  filterable: boolean;
  clearable: boolean;
  virtual: boolean;
  height: number;
  itemSize: number;
  lazy: boolean;
  load?: (node: TreeNode, resolve: (children: TreeNode[]) => void) => void;
  props: Record<string, string>;
  valueKey: string;
  defaultExpandAll: boolean;
  collapseTags: boolean;
  maxCollapseTags: number;
  offset: number;
};

const data: TreeNode[] = [
  {
    key: "platform",
    label: "Platform",
    children: [
      { key: "web", label: "Web" },
      { key: "mobile", label: "Mobile" },
    ],
  },
  {
    key: "quality",
    label: "Quality",
    children: [
      { key: "unit", label: "Unit tests" },
      { key: "e2e", label: "E2E", disabled: true },
    ],
  },
];

const mount = async (
  setup: (element: TreeSelectHost) => void = () => undefined,
): Promise<TreeSelectHost> => {
  const element = document.createElement("elf-tree-select") as TreeSelectHost;
  element.data = data;
  setup(element);
  document.body.appendChild(element);
  await settle();
  return element;
};

const open = async (element: TreeSelectHost): Promise<HTMLElement> => {
  element.open();
  await settle();
  return element.shadowRoot!.querySelector("elf-tree") as HTMLElement;
};

describe("elf-tree-select", () => {
  it("uses the shared field surface contract", async () => {
    const element = await mount();
    element.setAttribute("variant", "outlined");
    element.setAttribute("label", "Team");
    await settle();

    expect(element.getAttribute("variant")).toBe("outlined");
    expect(element.hasAttribute("data-has-label")).toBe(true);
    expect(element.shadowRoot!.querySelector(".field-label")?.textContent).toBe(
      "Team",
    );
    expect(
      element.shadowRoot!.querySelector(".field-outline legend")?.textContent,
    ).toBe("Team");
  });

  it("attaches the panel to the trigger by default", async () => {
    const element = await mount();
    expect(element.offset).toBe(0);
  });

  it("selects one node, closes the panel, and restores trigger focus", async () => {
    const element = await mount();
    const onUpdate = vi.fn();
    element.addEventListener("update:modelValue", onUpdate as EventListener);
    const tree = await open(element);
    const root = tree.shadowRoot!.querySelector<HTMLElement>(".tree-content")!;

    root.focus();
    root.click();
    await settle();

    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toBe("platform");
    expect(element.hasAttribute("data-open")).toBe(false);
    expect(element.shadowRoot!.activeElement).toBe(
      element.shadowRoot!.querySelector(".trigger"),
    );
    expect(element.selectedLabel()).toBe("Platform");
  });

  it("does not close before a pointer-focused Tree node can emit selection", async () => {
    const element = await mount((host) => {
      host.defaultExpandAll = true;
    });
    element.addEventListener("update:modelValue", ((
      event: CustomEvent<string>,
    ) => {
      element.modelValue = event.detail;
    }) as EventListener);
    const trigger = element.shadowRoot!.querySelector<HTMLElement>(".trigger")!;
    trigger.focus();
    trigger.click();
    await settle();

    const tree = element.shadowRoot!.querySelector("elf-tree") as HTMLElement;
    const child =
      tree.shadowRoot!.querySelectorAll<HTMLElement>(".tree-content")[1]!;
    child.focus();
    child.click();
    await settleTask();

    expect(element.modelValue).toBe("web");
    expect(element.hasAttribute("data-open")).toBe(false);
    expect(element.shadowRoot!.activeElement).toBe(trigger);
  });

  it("uses Tree cascade semantics for multiple selection and collapsed tags", async () => {
    const element = await mount((host) => {
      host.multiple = true;
      host.modelValue = [];
      host.collapseTags = true;
      host.maxCollapseTags = 1;
    });
    const onUpdate = vi.fn();
    element.addEventListener("update:modelValue", onUpdate as EventListener);
    const tree = await open(element);

    tree
      .shadowRoot!.querySelector<HTMLButtonElement>(".tree-checkbox")!
      .click();
    await settle();

    const value = (onUpdate.mock.calls[0]![0] as CustomEvent<TreeSelectValue[]>)
      .detail;
    expect(value).toEqual(["platform", "web", "mobile"]);
    expect(element.shadowRoot!.querySelectorAll(".tag")).toHaveLength(1);
    expect(
      element.shadowRoot!.querySelector(".collapse-tag")?.textContent,
    ).toBe("+2");
  });

  it("keeps parent and child checks independent in strict mode", async () => {
    const element = await mount((host) => {
      host.multiple = true;
      host.checkStrictly = true;
      host.modelValue = [];
    });
    element.addEventListener("update:modelValue", ((
      event: CustomEvent<TreeSelectValue[]>,
    ) => {
      element.modelValue = event.detail;
    }) as EventListener);
    const tree = await open(element);
    tree
      .shadowRoot!.querySelector<HTMLButtonElement>(".tree-checkbox")!
      .click();
    await settle();

    expect(element.modelValue).toEqual(["platform"]);
    expect(element.getCheckedKeys()).toEqual(["platform"]);
  });

  it("filters through the Tree public method without duplicating tree search state", async () => {
    const element = await mount((host) => {
      host.filterable = true;
    });
    const tree = await open(element);
    const input =
      element.shadowRoot!.querySelector<HTMLInputElement>(".filter-input")!;
    input.value = "unit";
    input.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    await settle();

    const labels = Array.from(
      tree.shadowRoot!.querySelectorAll(".tree-label"),
    ).map((node) => node.textContent?.trim());
    expect(labels).toEqual(["Quality", "Unit tests"]);
  });

  it("loads lazy children once and refreshes the selected label projection", async () => {
    const load = vi.fn(
      (node: TreeNode, resolve: (children: TreeNode[]) => void) => {
        resolve([{ key: `${String(node.key)}-child`, label: "Lazy child" }]);
      },
    );
    const element = await mount((host) => {
      host.data = [{ key: "lazy", label: "Lazy root", isLeaf: false }];
      host.lazy = true;
      host.load = load;
    });
    const tree = await open(element);
    tree.shadowRoot!.querySelector<HTMLButtonElement>(".tree-switch")!.click();
    await settle();
    await settle();

    expect(load).toHaveBeenCalledTimes(1);
    expect(tree.shadowRoot!.textContent).toContain("Lazy child");
    tree.shadowRoot!.querySelectorAll<HTMLElement>(".tree-content")[1]!.click();
    await settle();
    expect(element.selectedLabel()).toBe("Lazy child");
  });

  it("virtualizes large root collections through Tree rather than a second windowing algorithm", async () => {
    const element = await mount((host) => {
      host.data = Array.from({ length: 10_000 }, (_, index) => ({
        key: `node-${index}`,
        label: `Node ${index}`,
      }));
      host.virtual = true;
      host.height = 160;
      host.itemSize = 40;
    });
    const tree = await open(element);

    expect(tree.shadowRoot!.querySelectorAll(".tree-node").length).toBeLessThan(
      30,
    );
    expect(
      (tree.shadowRoot!.querySelector(".tree-body") as HTMLElement).style
        .height,
    ).toBe("160px");
  });

  it("clears through provider-aware field defaults and emits one semantic change", async () => {
    const element = await mount((host) => {
      host.modelValue = "web";
      host.clearable = true;
    });
    const onUpdate = vi.fn();
    const onClear = vi.fn();
    element.addEventListener("update:modelValue", onUpdate as EventListener);
    element.addEventListener("clear", onClear as EventListener);

    element.shadowRoot!.querySelector<HTMLButtonElement>(".clear")!.click();
    await settle();

    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toBe("");
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it("opens from ArrowDown and delegates traversal and Enter selection to Tree", async () => {
    const element = await mount();
    element.addEventListener("update:modelValue", ((
      event: CustomEvent<TreeSelectValue>,
    ) => {
      element.modelValue = event.detail;
    }) as EventListener);
    const trigger = element.shadowRoot!.querySelector<HTMLElement>(".trigger")!;
    trigger.focus();
    trigger.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "ArrowDown",
        bubbles: true,
        composed: true,
      }),
    );
    await settle();
    const tree = element.shadowRoot!.querySelector<HTMLElement>("elf-tree")!;
    const focused = tree.shadowRoot!.activeElement as HTMLElement;
    expect(focused?.classList.contains("tree-content")).toBe(true);

    focused.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Enter",
        bubbles: true,
        composed: true,
      }),
    );
    await settle();
    expect(element.modelValue).toBe("platform");
    expect(element.hasAttribute("data-open")).toBe(false);
  });
});
