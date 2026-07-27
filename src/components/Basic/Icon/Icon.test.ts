import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

import {
    configureIcons,
    createClassIconSet,
    createSvgIconSet,
    Icon,
    resetIcons,
    resolveIcon,
} from "./index";

beforeAll(() => {
    registerComponents(Icon);
});

afterEach(() => {
    document.body.innerHTML = "";
    resetIcons();
});

const tick = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 10));

interface IconEl extends HTMLElement {
    name?: string;
    set?: string;
    fallback?: string;
    size?: number | string;
    color?: string;
    ariaLabel?: string;
    loading?: boolean;
}

describe("elf-icon", () => {
    it("name 渲染为文本内容", async () => {
        const el = document.createElement("elf-icon") as IconEl;
        el.name = "A";
        document.body.appendChild(el);
        await tick();
        expect(el.shadowRoot!.textContent).toContain("A");
    });

    it("size 数值映射为 px CSS 变量", async () => {
        const el = document.createElement("elf-icon") as IconEl;
        el.name = "X";
        el.size = 24;
        document.body.appendChild(el);
        await tick();
        expect(el.style.getPropertyValue("--_icon-size")).toBe("24px");
    });

    it("size 纯数字字符串自动补 px", async () => {
        const el = document.createElement("elf-icon") as IconEl;
        el.name = "X";
        el.size = "14";
        document.body.appendChild(el);
        await tick();
        expect(el.style.getPropertyValue("--_icon-size")).toBe("14px");
    });

    it("size 字符串直接透传 CSS 变量", async () => {
        const el = document.createElement("elf-icon") as IconEl;
        el.name = "X";
        el.size = "2em";
        document.body.appendChild(el);
        await tick();
        expect(el.style.getPropertyValue("--_icon-size")).toBe("2em");
    });

    it("color 映射为 CSS 变量", async () => {
        const el = document.createElement("elf-icon") as IconEl;
        el.name = "X";
        el.color = "red";
        document.body.appendChild(el);
        await tick();
        expect(el.style.getPropertyValue("--_icon-color")).toBe("red");
    });

    it("无 color 时 CSS 变量为 currentColor", async () => {
        const el = document.createElement("elf-icon") as IconEl;
        el.name = "X";
        document.body.appendChild(el);
        await tick();
        expect(el.style.getPropertyValue("--_icon-color")).toBe("currentColor");
    });

    it("默认 size CSS 变量为 1em", async () => {
        const el = document.createElement("elf-icon") as IconEl;
        el.name = "X";
        document.body.appendChild(el);
        await tick();
        expect(el.style.getPropertyValue("--_icon-size")).toBe("1em");
    });

    it("aria-label 为空时 aria-hidden=true", async () => {
        const el = document.createElement("elf-icon") as IconEl;
        el.name = "X";
        document.body.appendChild(el);
        await tick();
        const span = el.shadowRoot!.querySelector("span")!;
        expect(span.getAttribute("aria-hidden")).toBe("true");
        expect(span.getAttribute("role")).toBeNull();
    });

    it("aria-label 有值时 role=img", async () => {
        const el = document.createElement("elf-icon") as IconEl;
        el.name = "X";
        el.ariaLabel = "star icon";
        document.body.appendChild(el);
        await tick();
        const span = el.shadowRoot!.querySelector("span")!;
        expect(span.getAttribute("aria-label")).toBe("star icon");
        expect(span.getAttribute("aria-hidden")).toBe("false");
        expect(span.getAttribute("role")).toBe("img");
    });

    it("name 为空时 slot 元素存在", async () => {
        const el = document.createElement("elf-icon") as IconEl;
        document.body.appendChild(el);
        await tick();
        const slot = el.shadowRoot!.querySelector("slot");
        expect(slot).toBeTruthy();
    });

    it("part=icon 可被 ::part 选中", async () => {
        const el = document.createElement("elf-icon") as IconEl;
        document.body.appendChild(el);
        await tick();
        const span = el.shadowRoot!.querySelector("[part='icon']");
        expect(span).toBeTruthy();
    });

    it("数值 size 不小于 1px", async () => {
        const el = document.createElement("elf-icon") as IconEl;
        el.size = 0;
        document.body.appendChild(el);
        await tick();
        expect(el.style.getPropertyValue("--_icon-size")).toBe("1px");
    });

    it("loading 为内部图标添加旋转状态类", async () => {
        const el = document.createElement("elf-icon") as IconEl;
        el.loading = true;
        document.body.appendChild(el);
        await tick();
        expect(el.shadowRoot!.querySelector(".icon")?.classList.contains("is-loading")).toBe(true);
    });

    it("defaultSet 可解析第三方 SVG path 集合", async () => {
        configureIcons({
            defaultSet: "mdi",
            sets: {
                mdi: createSvgIconSet({ close: "M6 6l12 12M18 6L6 18" }),
            },
        });
        const el = document.createElement("elf-icon") as IconEl;
        el.name = "close";
        document.body.appendChild(el);
        await tick();

        expect(el.shadowRoot!.querySelector("svg")?.getAttribute("viewBox")).toBe("0 0 24 24");
        expect(el.shadowRoot!.querySelector("path")?.getAttribute("d")).toBe(
            "M6 6l12 12M18 6L6 18",
        );
    });

    it("set prop 可显式选择 CSS class 图标集合", async () => {
        configureIcons({
            sets: { fa: createClassIconSet({ baseClass: "fa-solid", prefix: "fa-" }) },
        });
        const el = document.createElement("elf-icon") as IconEl;
        el.name = "user";
        el.set = "fa";
        document.body.appendChild(el);
        await tick();

        const icon = el.shadowRoot!.querySelector("i")!;
        expect(icon.classList.contains("fa-solid")).toBe(true);
        expect(icon.classList.contains("fa-user")).toBe(true);
    });

    it("语义别名可跨集合解析", () => {
        configureIcons({
            defaultSet: "elf",
            aliases: { dismiss: "mdi:close" },
            sets: { mdi: createSvgIconSet({ close: { path: ["p1", "p2"], viewBox: "0 0 20 20" } }) },
        });

        expect(resolveIcon("$dismiss")).toEqual({
            kind: "svg",
            content: "",
            paths: ["p1", "p2"],
            classes: [],
            viewBox: "0 0 20 20",
        });
    });

    it("未知集合安全回退为文本图标", () => {
        expect(resolveIcon("missing:star")).toMatchObject({ kind: "text", content: "star" });
    });

    it("已知 SVG 集合中的未知名称显示默认回退", async () => {
        configureIcons({
            defaultSet: "mdi",
            sets: { mdi: createSvgIconSet({ account: "known-path" }) },
        });
        const el = document.createElement("elf-icon") as IconEl;
        el.name = "unknown";
        document.body.appendChild(el);
        await tick();

        expect(el.shadowRoot!.querySelector("svg")).toBeNull();
        expect(el.shadowRoot!.querySelector(".fallback-icon")?.textContent).toBe("?");
    });

    it("fallback 属性可替换未知图标占位内容", async () => {
        configureIcons({
            defaultSet: "mdi",
            sets: { mdi: createSvgIconSet({ account: "known-path" }) },
        });
        const el = document.createElement("elf-icon") as IconEl;
        el.name = "unknown";
        el.fallback = "×";
        document.body.appendChild(el);
        await tick();

        expect(el.shadowRoot!.querySelector(".fallback-icon")?.textContent).toBe("×");
    });

    it("fallback 插槽可替换未知图标占位", async () => {
        configureIcons({
            defaultSet: "mdi",
            sets: { mdi: createSvgIconSet({ account: "known-path" }) },
        });
        const el = document.createElement("elf-icon") as IconEl;
        el.name = "unknown";
        el.innerHTML = `<span slot="fallback">custom fallback</span>`;
        document.body.appendChild(el);
        await tick();

        const slot = el.shadowRoot!.querySelector<HTMLSlotElement>('slot[name="fallback"]')!;
        expect(slot.assignedNodes().map((node) => node.textContent).join("")).toContain("custom fallback");
    });
});
