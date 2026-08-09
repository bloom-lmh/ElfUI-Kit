import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { createSvgIconSet, resetIcons, resolveIcon } from "../../Basic/Icon";

beforeAll(async () => {
  await import("../../../register-all").then(({ registerAllComponents }) =>
    registerAllComponents(),
  );
});

afterEach(() => {
  document.body.innerHTML = "";
  resetIcons();
});

const tick = async (): Promise<void> => {
  await new Promise<void>((resolve) => queueMicrotask(resolve));
  await new Promise<void>((resolve) => queueMicrotask(resolve));
};

type IconProviderElement = HTMLElement & {
  options?: {
    defaultSet?: string;
    aliases?: Record<string, string>;
    sets?: Record<string, ReturnType<typeof createSvgIconSet>>;
  };
};

describe("elf-icon-provider", () => {
  it("provides a local default set without mutating the global registry", async () => {
    const provider = document.createElement("elf-icon-provider") as IconProviderElement;
    provider.options = {
      defaultSet: "outline",
      sets: {
        outline: createSvgIconSet({ account: "provider-path" }),
      },
    };
    provider.innerHTML = `<elf-icon name="account"></elf-icon>`;
    document.body.appendChild(provider);
    await tick();

    const icon = provider.querySelector("elf-icon")!;
    expect(icon.shadowRoot!.querySelector("path")?.getAttribute("d")).toBe("provider-path");
    expect(provider.getAttribute("data-icon-set")).toBe("outline");
    expect(resolveIcon("account")).toMatchObject({ kind: "text", content: "account" });
  });

  it("allows a nested provider to replace the default set while inheriting aliases", async () => {
    const outer = document.createElement("elf-icon-provider") as IconProviderElement;
    outer.options = {
      defaultSet: "outline",
      aliases: { profile: "outline:account" },
      sets: {
        outline: createSvgIconSet({ account: "outer-path" }),
      },
    };
    outer.innerHTML = `
      <elf-icon id="outer-icon" name="$profile"></elf-icon>
      <elf-icon-provider id="inner-provider">
        <elf-icon id="inner-icon" name="account"></elf-icon>
        <elf-icon id="alias-icon" name="$profile"></elf-icon>
      </elf-icon-provider>
    `;
    const inner = outer.querySelector("#inner-provider") as IconProviderElement;
    inner.options = {
      defaultSet: "filled",
      sets: {
        filled: createSvgIconSet({ account: "inner-path" }),
      },
    };

    document.body.appendChild(outer);
    await tick();

    expect(
      outer.querySelector("#outer-icon")!.shadowRoot!.querySelector("path")?.getAttribute("d"),
    ).toBe("outer-path");
    expect(
      outer.querySelector("#inner-icon")!.shadowRoot!.querySelector("path")?.getAttribute("d"),
    ).toBe("inner-path");
    expect(
      outer.querySelector("#alias-icon")!.shadowRoot!.querySelector("path")?.getAttribute("d"),
    ).toBe("outer-path");
  });
});
