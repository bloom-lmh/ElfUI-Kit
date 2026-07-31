import { beforeAll, afterEach, describe, expect, it, vi } from "vitest";

beforeAll(async () => {
  await import("../../index");
});

afterEach(() => {
  document.body.innerHTML = "";
  vi.unstubAllGlobals();
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface DefaultsProviderEl extends HTMLElement {
  defaults?: Record<string, Record<string, unknown>>;
  strategy?: string;
  disabled?: boolean;
  reset?: boolean;
}

describe("elf-defaults-provider", () => {
  it("为子组件写入默认 props，并保留显式属性", async () => {
    const provider = document.createElement("elf-defaults-provider") as DefaultsProviderEl;
    provider.defaults = {
      "elf-button": {
        color: "secondary",
        variant: "outlined",
        size: "sm",
        disabled: true,
      },
    };
    provider.innerHTML = `
      <elf-button id="a">默认按钮</elf-button>
      <elf-button id="b" color="danger">危险按钮</elf-button>
    `;

    document.body.appendChild(provider);
    await tick();
    await tick();

    const first = provider.querySelector("#a") as HTMLElement & {
      color?: string;
      variant?: string;
      size?: string;
      disabled?: boolean;
    };
    const second = provider.querySelector("#b") as HTMLElement & { color?: string };

    expect(first.color).toBe("secondary");
    expect(first.variant).toBe("outlined");
    expect(first.size).toBe("sm");
    expect(first.disabled).toBe(true);
    expect(first.hasAttribute("disabled")).toBe(true);
    expect(second.color).toBe("danger");
  });

  it("overwrite 策略可以覆盖显式属性", async () => {
    const provider = document.createElement("elf-defaults-provider") as DefaultsProviderEl;
    provider.strategy = "overwrite";
    provider.defaults = { Button: { color: "success" } };
    provider.innerHTML = `<elf-button color="danger">按钮</elf-button>`;

    document.body.appendChild(provider);
    await tick();
    await tick();

    const button = provider.querySelector("elf-button") as HTMLElement & { color?: string };
    expect(button.color).toBe("success");
    expect(button.getAttribute("color")).toBe("success");
  });

  it("嵌套 provider 合并外层默认值并优先使用局部覆盖", async () => {
    const outer = document.createElement("elf-defaults-provider") as DefaultsProviderEl;
    outer.defaults = { "elf-button": { variant: "outlined", color: "secondary", size: "sm" } };
    outer.innerHTML = `<elf-defaults-provider id="inner"><elf-button>Nested</elf-button></elf-defaults-provider>`;
    const inner = outer.querySelector("#inner") as DefaultsProviderEl;
    inner.defaults = { "elf-button": { color: "success", size: "lg" } };
    document.body.appendChild(outer);
    await tick();
    await tick();

    const button = inner.querySelector("elf-button") as HTMLElement & Record<string, unknown>;
    expect(button.variant).toBe("outlined");
    expect(button.color).toBe("success");
    expect(button.size).toBe("lg");
  });

  it("disabled 后恢复 provider 写入前的组件值", async () => {
    const provider = document.createElement("elf-defaults-provider") as DefaultsProviderEl;
    provider.defaults = { "elf-button": { color: "secondary", disabled: true } };
    provider.innerHTML = `<elf-button>Restored</elf-button>`;
    document.body.appendChild(provider);
    await tick();
    await tick();

    const button = provider.querySelector("elf-button") as HTMLElement & Record<string, unknown>;
    expect(button.color).toBe("secondary");
    expect(button.disabled).toBe(true);

    provider.disabled = true;
    await tick();
    await tick();
    expect(button.color).toBe("primary");
    expect(button.disabled).toBe(false);
    expect(button.hasAttribute("disabled")).toBe(false);
  });

  it("为运行时追加的深层组件应用默认值", async () => {
    const provider = document.createElement("elf-defaults-provider") as DefaultsProviderEl;
    provider.strategy = "overwrite";
    provider.defaults = { "elf-tag": { color: "warning" } };
    provider.innerHTML = `<section id="target"></section>`;
    document.body.appendChild(provider);
    await tick();
    await tick();

    const tag = document.createElement("elf-tag") as HTMLElement & Record<string, unknown>;
    provider.querySelector("#target")!.appendChild(tag);
    await new Promise((resolve) => setTimeout(resolve, 0));
    await tick();
    expect(tag.color).toBe("warning");
  });

  it("复用 Mutate controller 观察稳定宿主并在卸载时释放", async () => {
    interface ObserverRecord {
      callback: MutationObserverCallback;
      disconnect: ReturnType<typeof vi.fn>;
      observed: Array<[Node, MutationObserverInit | undefined]>;
    }

    const instances: ObserverRecord[] = [];
    vi.stubGlobal(
      "MutationObserver",
      class {
        private readonly record: ObserverRecord;

        constructor(next: MutationObserverCallback) {
          this.record = {
            callback: next,
            disconnect: vi.fn(),
            observed: [],
          };
          instances.push(this.record);
        }

        observe = (target: Node, options?: MutationObserverInit): void => {
          this.record.observed.push([target, options]);
        };

        disconnect = (): void => {
          this.record.disconnect();
        };
      },
    );

    const provider = document.createElement("elf-defaults-provider") as DefaultsProviderEl;
    provider.strategy = "overwrite";
    provider.defaults = { "elf-tag": { color: "warning" } };
    provider.innerHTML = `<section id="target"></section>`;
    document.body.appendChild(provider);
    await tick();
    await tick();

    const providerObserver = instances.find((instance) =>
      instance.observed.some(
        ([target, options]) =>
          target === provider && options?.childList === true && options.subtree === true,
      ),
    );
    expect(providerObserver).toBeDefined();

    const tag = document.createElement("elf-tag") as HTMLElement & Record<string, unknown>;
    provider.querySelector("#target")!.appendChild(tag);
    providerObserver!.callback([], {} as MutationObserver);
    await tick();
    expect(tag.color).toBe("warning");

    provider.remove();
    await tick();
    expect(providerObserver!.disconnect).toHaveBeenCalledOnce();
  });

  it("MutationObserver 不可用时保留初始默认值下发", async () => {
    vi.stubGlobal("MutationObserver", undefined);
    const provider = document.createElement("elf-defaults-provider") as DefaultsProviderEl;
    provider.defaults = { "elf-tag": { color: "warning" } };
    provider.innerHTML = `<elf-tag>Fallback</elf-tag>`;

    document.body.appendChild(provider);
    await tick();
    await tick();

    const tag = provider.querySelector("elf-tag") as HTMLElement & Record<string, unknown>;
    expect(tag.color).toBe("warning");
  });

  it("支持 global 默认值，并让组件级配置覆盖 global", async () => {
    const provider = document.createElement("elf-defaults-provider") as DefaultsProviderEl;
    provider.defaults = {
      global: { size: "sm" },
      "elf-button": { size: "lg" },
    };
    provider.innerHTML = `
      <elf-button id="button">Button</elf-button>
      <elf-tag id="tag">Tag</elf-tag>
    `;
    document.body.appendChild(provider);
    await tick();
    await tick();

    const button = provider.querySelector("#button") as HTMLElement & Record<string, unknown>;
    const tag = provider.querySelector("#tag") as HTMLElement & Record<string, unknown>;
    expect(button.size).toBe("lg");
    expect(tag.size).toBe("sm");
  });
});
