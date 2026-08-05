import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

let componentTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { MdPage } = await import("./index");
  componentTag = ensureCustomElement(MdPage);
}, 30_000);

afterEach(() => {
  document.body.innerHTML = "";
  vi.unstubAllGlobals();
});

const tick = async (): Promise<void> => {
  await new Promise<void>((resolve) => queueMicrotask(resolve));
  await new Promise<void>((resolve) => queueMicrotask(resolve));
};

const waitFor = async (predicate: () => boolean, timeout = 4000): Promise<void> => {
  const started = Date.now();
  while (!predicate()) {
    if (Date.now() - started > timeout) throw new Error("Timed out waiting for condition");
    await new Promise<void>((resolve) => setTimeout(resolve, 50));
  }
};

const stubIntersectionObserver = (): Array<{
  root: Element | Document | null;
  rootMargin: string;
}> => {
  const records: Array<{ root: Element | Document | null; rootMargin: string }> = [];
  class FakeObserver {
    readonly root: Element | Document | null;
    readonly rootMargin: string;
    readonly thresholds: ReadonlyArray<number> = [];
    constructor(
      private readonly callback: IntersectionObserverCallback,
      options?: IntersectionObserverInit,
    ) {
      this.root = options?.root ?? null;
      this.rootMargin = options?.rootMargin ?? "";
      records.push({ root: this.root, rootMargin: this.rootMargin });
    }
    observe(target: Element): void {
      this.callback(
        [{ target, isIntersecting: true } as unknown as IntersectionObserverEntry],
        this as unknown as IntersectionObserver,
      );
    }
    unobserve(): void {}
    disconnect(): void {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }
  vi.stubGlobal("IntersectionObserver", FakeObserver);
  return records;
};

const mount = async (
  markdown: string,
  attributes: Record<string, string> = {},
): Promise<HTMLElement> => {
  const element = document.createElement(componentTag);
  for (const [name, value] of Object.entries(attributes)) {
    element.setAttribute(name, value);
  }
  element.textContent = markdown;
  document.body.appendChild(element);
  await tick();
  return element;
};

describe("MdPage", () => {
  it("renders slot markdown with the base heading offset", async () => {
    const element = await mount("# Title\n\nParagraph with **bold** text.");

    const content = element.shadowRoot!.querySelector<HTMLElement>(".md-content")!;
    expect(content.querySelector("h2")?.textContent).toBe("Title");
    expect(content.querySelector("h1")).toBeNull();
    expect(content.textContent).toContain("Paragraph with bold text.");
  });

  it("strips the macro continuation offset from slotted markdown", async () => {
    const element = document.createElement(componentTag);
    element.textContent = "# Title\n  ## Sub\n\n  paragraph";
    document.body.appendChild(element);
    await tick();

    const content = element.shadowRoot!.querySelector<HTMLElement>(".md-content")!;
    expect(content.querySelector("h2")?.textContent).toBe("Title");
    expect(content.querySelector("h3")?.textContent).toBe("Sub");
    expect(content.textContent).toContain("paragraph");
  });

  it("parses frontmatter title and emits title-change", async () => {
    const element = document.createElement(componentTag);
    element.textContent = "---\ntitle: Release guide\n---\n\n# Heading";
    const title: string[] = [];
    element.addEventListener("title-change", ((event: CustomEvent<string>) => {
      title.push(event.detail);
    }) as EventListener);
    document.body.appendChild(element);
    await tick();

    expect(title).toContain("Release guide");
    expect(element.shadowRoot!.querySelector(".md-content h2")?.textContent).toBe("Heading");
  });

  it("emits toc-change with anchored heading entries", async () => {
    const element = document.createElement(componentTag);
    element.textContent = "# Alpha\n\n## Beta beta\n\n### 中文标题";
    const entries: Array<{ id: string; text: string; depth: number }> = [];
    element.addEventListener("toc-change", ((event: CustomEvent) => {
      entries.push(...event.detail);
    }) as EventListener);
    document.body.appendChild(element);
    await tick();

    expect(entries).toEqual([
      { id: "alpha", text: "Alpha", depth: 2 },
      { id: "beta-beta", text: "Beta beta", depth: 3 },
      { id: "中文标题", text: "中文标题", depth: 4 },
    ]);
    expect(element.shadowRoot!.querySelector("#alpha")).toBeTruthy();
  });

  it("escapes raw HTML when allow-html is disabled", async () => {
    const element = await mount("<b>Bold</b>", { "allow-html": "false" });
    const content = element.shadowRoot!.querySelector<HTMLElement>(".md-content")!;
    expect(content.querySelector("b")).toBeNull();
    expect(content.textContent).toContain("Bold");
  });

  it("keeps raw HTML and upgrades embedded custom elements when allow-html is on", async () => {
    const element = await mount('<p>Hello <elf-tag type="success">ElfUI</elf-tag></p>');
    const content = element.shadowRoot!.querySelector<HTMLElement>(".md-content")!;
    expect(content.querySelector("elf-tag")?.textContent).toBe("ElfUI");
  });

  it("uses the content prop when the slot is empty", async () => {
    const element = document.createElement(componentTag);
    element.setAttribute("content", "# From prop");
    document.body.appendChild(element);
    await tick();

    expect(element.shadowRoot!.querySelector(".md-content h2")?.textContent).toBe("From prop");
  });

  it("loads markdown from src and reports errors", async () => {
    const fetchMock = vi.fn((url: string) => {
      if (String(url).includes("broken")) {
        return Promise.resolve({ ok: false, status: 404, text: () => Promise.resolve("") });
      }
      return Promise.resolve({ ok: true, status: 200, text: () => Promise.resolve("# Fetched") });
    });
    vi.stubGlobal("fetch", fetchMock);

    const element = document.createElement(componentTag);
    element.setAttribute("src", "/docs/guide.md");
    document.body.appendChild(element);
    await tick();
    await tick();

    expect(element.shadowRoot!.querySelector(".md-content h2")?.textContent).toBe("Fetched");

    element.setAttribute("src", "/docs/broken.md");
    await tick();
    await tick();
    expect(element.shadowRoot!.querySelector(".md-state.is-error")?.textContent).toContain("404");
  });

  it("exposes outline and rendered HTML", async () => {
    const element = await mount("# One\n\n## Two");
    const page = element as unknown as {
      outline: () => Array<{ id: string; depth: number }>;
      getHtml: () => string;
    };
    expect(page.outline()).toHaveLength(2);
    expect(page.getHtml()).toContain("<h2");
  });

  it("renders task lists, callout containers, and footnotes by default", async () => {
    const element = await mount(
      "- [x] done\n- [ ] todo\n\n::: tip 提示\n\nCallout body\n\n:::\n\nText[^1]\n\n[^1]: Footnote body",
    );
    const content = element.shadowRoot!.querySelector<HTMLElement>(".md-content")!;
    expect(content.querySelector('input[type="checkbox"]')).toBeTruthy();
    expect(content.querySelector(".md-container.is-tip .md-container-title")?.textContent).toBe(
      "提示",
    );
    expect(content.querySelector(".footnote-ref")).toBeTruthy();
    expect(content.querySelector(".footnotes")?.textContent).toContain("Footnote body");
  });

  it("supports an extend hook that mutates markdown-it rules", async () => {
    const element = document.createElement(componentTag);
    (element as unknown as { extend?: unknown }).extend = (md: {
      core: {
        ruler: {
          after: (
            name: string,
            id: string,
            rule: (state: {
              tokens: Array<{ type: string; children?: Array<{ type: string; content: string }> }>;
            }) => void,
          ) => void;
        };
      };
    }) => {
      md.core.ruler.after("inline", "shout", (state) => {
        for (const token of state.tokens) {
          if (token.type !== "inline") continue;
          for (const child of token.children ?? []) {
            if (child.type === "text") child.content = child.content.replace("FOO", "BAR");
          }
        }
      });
    };
    element.textContent = "Before FOO after";
    document.body.appendChild(element);
    await tick();

    expect(element.shadowRoot!.querySelector(".md-content")?.textContent).toContain(
      "Before BAR after",
    );
  });

  it("supports a full parser override and a render hook", async () => {
    const element = document.createElement(componentTag);
    (element as unknown as { parser?: unknown }).parser = () => ({
      html: '<h2 id="custom">Custom heading</h2><p>body</p>',
      toc: [{ id: "custom", text: "Custom heading", depth: 2 }],
      title: "Custom",
    });
    (element as unknown as { render?: unknown }).render = (html: string) =>
      html.replace("body", "hooked");
    element.textContent = "# ignored";
    const titles: string[] = [];
    element.addEventListener("title-change", ((event: CustomEvent<string>) => {
      titles.push(event.detail);
    }) as EventListener);
    document.body.appendChild(element);
    await tick();

    const page = element as unknown as {
      outline: () => Array<{ id: string }>;
      getHtml: () => string;
    };
    expect(page.outline()).toEqual([{ id: "custom", text: "Custom heading", depth: 2 }]);
    expect(page.getHtml()).toContain("hooked");
    expect(titles).toContain("Custom");
  });

  it("builds code toolbars with line highlighting when code tools are on", async () => {
    stubIntersectionObserver();
    const element = await mount("```ts {1}\nconst a = 1;\nconst b = 2;\n```");
    const content = element.shadowRoot!.querySelector<HTMLElement>(".md-content")!;
    await waitFor(() => Boolean(content.querySelector(".md-code-block")));

    expect(content.querySelector(".md-code-lang")?.textContent).toBe("ts");
    expect(content.querySelector(".md-code-copy")).toBeTruthy();
    expect(content.querySelector('.md-code-line[data-line="1"].is-highlighted')).toBeTruthy();
    expect(content.querySelector('.md-code-line[data-line="2"].is-highlighted')).toBeNull();
  });

  it("resolves relative links and images against base for fetched markdown", async () => {
    stubIntersectionObserver();
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          text: () => Promise.resolve("# Fetched\n\n[guide](guide.md)\n\n![pic](pic.png)"),
        }),
      ),
    );
    const element = document.createElement(componentTag);
    element.setAttribute("src", "/docs/guide.md");
    element.setAttribute("base", "https://example.com/docs/");
    document.body.appendChild(element);
    await tick();
    await tick();
    try {
      await waitFor(() =>
        Boolean(
          element.shadowRoot
            ?.querySelector(".md-content img")
            ?.getAttribute("src")
            ?.startsWith("https://example.com/docs/"),
        ),
      );
    } catch (error) {
      const content = element.shadowRoot?.querySelector(".md-content");
      console.log(
        "DIAG",
        JSON.stringify({
          baseAttr: element.getAttribute("base"),
          baseProp: (element as unknown as { base?: string }).base,
          html: content?.innerHTML.slice(0, 300),
          imgSrc: content?.querySelector("img")?.getAttribute("src"),
          linkHref: content?.querySelector("a")?.getAttribute("href"),
        }),
      );
      throw error;
    }

    const content = element.shadowRoot!.querySelector<HTMLElement>(".md-content")!;
    expect(content.querySelector("p a")?.getAttribute("href")).toBe(
      "https://example.com/docs/guide.md",
    );
    expect(content.querySelector("img")?.getAttribute("src")).toBe(
      "https://example.com/docs/pic.png",
    );
  });

  it("resolves links against a root-relative base", async () => {
    stubIntersectionObserver();
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          text: () => Promise.resolve("# Fetched\n\n[guide](guide.md)"),
        }),
      ),
    );
    const element = document.createElement(componentTag);
    element.setAttribute("src", "/docs/a.md");
    element.setAttribute("base", "/md/");
    document.body.appendChild(element);
    await tick();
    await tick();
    const link = element.shadowRoot!.querySelector<HTMLAnchorElement>(".md-content p a")!;
    await waitFor(() => Boolean(link.getAttribute("href")?.includes("/md/guide.md")));

    expect(link.getAttribute("href")).toContain("/md/guide.md");
  });

  it("emits a cancelable link-click event", async () => {
    const element = await mount("[Doc](https://example.com/doc)");
    const clicks: Array<{ href: string }> = [];
    element.addEventListener("link-click", ((event: CustomEvent) => {
      clicks.push(event.detail);
      event.preventDefault();
    }) as EventListener);
    const anchor = element.shadowRoot!.querySelector<HTMLAnchorElement>(".md-content a")!;
    anchor.click();
    await tick();

    expect(clicks).toEqual([{ href: "https://example.com/doc", target: "", text: "Doc" }]);
  });

  it("applies named themes and per-variable tokens", async () => {
    const element = await mount("# Title");
    element.setAttribute("theme", "paper");
    (element as unknown as { tokens?: Record<string, string> }).tokens = {
      "--elf-md-heading-2-size": "30px",
    };
    await tick();

    expect(element.getAttribute("theme")).toBe("paper");
    expect(element.style.getPropertyValue("--elf-md-heading-2-size")).toBe("30px");
  });

  it("sanitizes rendered HTML when sanitize is enabled", async () => {
    const element = await mount('<script>window.x=1</script><p onclick="x()">Unsafe</p><p>ok</p>', {
      sanitize: "true",
    });
    const content = element.shadowRoot!.querySelector<HTMLElement>(".md-content")!;
    await waitFor(() => !content.querySelector("script"));

    expect(content.querySelector("script")).toBeNull();
    expect(content.querySelector("[onclick]")).toBeNull();
    expect(content.textContent).toContain("ok");
  });

  it("renders heading anchor links and scrolls on click", async () => {
    const scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoView;
    const element = await mount("# Title");

    const anchor = element.shadowRoot!.querySelector<HTMLAnchorElement>(".md-anchor")!;
    expect(anchor.getAttribute("href")).toBe("#title");
    anchor.click();
    await tick();
    expect(scrollIntoView).toHaveBeenCalled();
  });

  it("disables heading anchors when anchors is false", async () => {
    const element = await mount("# Title", { anchors: "false" });
    expect(element.shadowRoot!.querySelector(".md-anchor")).toBeNull();
  });

  it("passes the resolved scroll root to observers", async () => {
    const records = stubIntersectionObserver();
    const scrollBox = document.createElement("div");
    scrollBox.className = "scroll-box";
    const element = document.createElement(componentTag);
    element.setAttribute("scroll-root", ".scroll-box");
    element.textContent = "# One\n\n## Two";
    document.body.append(scrollBox, element);
    await tick();

    expect(records.some((record) => record.root === scrollBox)).toBe(true);
  });

  it("overrides copy labels through the labels prop", async () => {
    stubIntersectionObserver();
    const element = document.createElement(componentTag);
    (element as unknown as { labels?: Record<string, string> }).labels = {
      copy: "Copy code",
      copied: "Copied!",
    };
    element.textContent = "```ts\nconst a = 1;\n```";
    document.body.appendChild(element);
    await tick();
    const content = element.shadowRoot!.querySelector<HTMLElement>(".md-content")!;
    await waitFor(() => Boolean(content.querySelector(".md-code-copy")));

    expect(content.querySelector(".md-code-copy")?.textContent).toBe("Copy code");
  });

  it("adds lazy loading to rendered images", async () => {
    const element = await mount("![alt](pic.png)");
    const image = element.shadowRoot!.querySelector<HTMLImageElement>(".md-content img")!;
    expect(image.getAttribute("loading")).toBe("lazy");
  });

  it("shows a loading skeleton while fetching src", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => new Promise<Response>(() => undefined)),
    );
    const element = document.createElement(componentTag);
    element.setAttribute("src", "/docs/guide.md");
    document.body.appendChild(element);
    await tick();

    expect(element.shadowRoot!.querySelector(".md-state.is-loading .md-skeleton")).toBeTruthy();
  });

  it("renders tabbed code groups and switches panels", async () => {
    stubIntersectionObserver();
    const element = await mount(
      "::: code-group\n```ts [config.ts]\nconst a = 1;\n```\n```bash [publish]\necho hi\n```\n:::",
    );
    const content = element.shadowRoot!.querySelector<HTMLElement>(".md-content")!;
    await waitFor(() => Boolean(content.querySelector(".md-code-group-panel .md-code-block")));

    const tabs = content.querySelectorAll<HTMLButtonElement>(".md-code-group-tab");
    expect(Array.from(tabs).map((tab) => tab.textContent)).toEqual(["config.ts", "publish"]);
    expect(
      content.querySelector('.md-code-group-panel[data-tab="0"]')?.classList.contains("is-active"),
    ).toBe(true);

    tabs[1]!.click();
    await tick();
    expect(
      content.querySelector('.md-code-group-panel[data-tab="1"]')?.classList.contains("is-active"),
    ).toBe(true);
    expect(tabs[1]!.getAttribute("aria-selected")).toBe("true");
  });

  it("renders inline markdown in container titles", async () => {
    const element = await mount("::: tip **Important**\n\nBody\n\n:::");
    const title = element.shadowRoot!.querySelector(".md-container-title")!;
    expect(title.querySelector("strong")?.textContent).toBe("Important");
  });

  it("navigates code-group tabs with arrow keys", async () => {
    stubIntersectionObserver();
    const element = await mount(
      "::: code-group\n```ts [a]\nconst a = 1;\n```\n```ts [b]\nconst b = 2;\n```\n:::",
    );
    const tabs = element.shadowRoot!.querySelectorAll<HTMLButtonElement>(".md-code-group-tab");
    tabs[0]!.focus();
    tabs[0]!.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    await tick();

    expect(tabs[1]!.getAttribute("aria-selected")).toBe("true");
    expect(tabs[0]!.getAttribute("aria-selected")).toBe("false");
  });
});
