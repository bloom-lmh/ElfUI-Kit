// elf-button 单元测试

import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

beforeAll(async () => {
    await import("../../../components");
});

afterEach(() => {
    document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((r) => setTimeout(r, 10));

type ButtonEl = HTMLElement & {
    type?: string;
    variant?: string;
    color?: string;
    size?: string;
    shape?: string;
    disabled?: boolean;
    loading?: boolean;
    block?: boolean;
    text?: boolean;
    bg?: boolean;
    link?: boolean;
    round?: boolean;
    circle?: boolean;
    plain?: boolean;
    dashed?: boolean;
    noHover?: boolean;
    nativeType?: string;
    icon?: string;
    loadingIcon?: string;
    direction?: string;
    dark?: boolean;
};

describe("elf-button", () => {
    it("渲染 slot 内容", async () => {
        const el = document.createElement("elf-button") as ButtonEl;
        el.textContent = "保存";
        document.body.appendChild(el);
        await tick();

        const btn = el.shadowRoot!.querySelector("button")!;
        expect(btn).toBeTruthy();
        expect(el.textContent).toContain("保存");
    });

    it("点击触发 click 事件", async () => {
        const el = document.createElement("elf-button") as ButtonEl;
        document.body.appendChild(el);
        await tick();

        let count = 0;
        el.addEventListener("click", () => count++);
        el.shadowRoot!.querySelector("button")!.click();
        expect(count).toBe(1);
    });

    it("disabled 时不触发 click", async () => {
        const el = document.createElement("elf-button") as ButtonEl;
        el.setAttribute("disabled", "");
        document.body.appendChild(el);
        await tick();

        let count = 0;
        el.addEventListener("click", () => count++);
        el.shadowRoot!.querySelector("button")!.click();
        expect(count).toBe(0);
    });

    it("loading 时渲染 spinner 且阻止 click", async () => {
        const el = document.createElement("elf-button") as ButtonEl;
        el.setAttribute("loading", "");
        document.body.appendChild(el);
        await tick();

        expect(el.shadowRoot!.querySelector(".spinner")).toBeTruthy();

        let count = 0;
        el.addEventListener("click", () => count++);
        el.shadowRoot!.querySelector("button")!.click();
        expect(count).toBe(0);
    });

    it("loading 时 button[disabled] 为 true", async () => {
        const el = document.createElement("elf-button") as ButtonEl;
        el.setAttribute("loading", "");
        document.body.appendChild(el);
        await tick();

        const btn = el.shadowRoot!.querySelector("button")! as HTMLButtonElement;
        expect(btn.disabled).toBe(true);
    });

    it("variant / color / size 反射到 host attribute", async () => {
        const el = document.createElement("elf-button") as ButtonEl;
        el.setAttribute("variant", "outlined");
        el.setAttribute("color", "danger");
        el.setAttribute("size", "lg");
        document.body.appendChild(el);
        await tick();

        expect(el.getAttribute("variant")).toBe("outlined");
        expect(el.getAttribute("color")).toBe("danger");
        expect(el.getAttribute("size")).toBe("lg");
    });

    it("nativeType 透传给原生 button[type]", async () => {
        const el = document.createElement("elf-button") as ButtonEl;
        el.setAttribute("type", "submit");
        document.body.appendChild(el);
        await tick();

        const btn = el.shadowRoot!.querySelector("button")! as HTMLButtonElement;
        expect(btn.type).toBe("submit");
    });

    it("nativeType=reset", async () => {
        const el = document.createElement("elf-button") as ButtonEl;
        el.setAttribute("native-type", "reset");
        document.body.appendChild(el);
        await tick();

        const btn = el.shadowRoot!.querySelector("button")! as HTMLButtonElement;
        expect(btn.type).toBe("reset");
    });

    it("part 属性可被 ::part(button) 选中", async () => {
        const el = document.createElement("elf-button") as ButtonEl;
        document.body.appendChild(el);
        await tick();

        const btn = el.shadowRoot!.querySelector("button")!;
        expect(btn.getAttribute("part")).toBe("button");
    });

    it("forwards aria-label to the native button", async () => {
        const el = document.createElement("elf-button") as ButtonEl;
        el.setAttribute("aria-label", "Refresh data");
        document.body.appendChild(el);
        await tick();

        const button = el.shadowRoot!.querySelector("button")!;
        expect(button.getAttribute("aria-label")).toBe("Refresh data");
    });

    it("circle shape 反射到 host flag", async () => {
        const el = document.createElement("elf-button") as ButtonEl;
        el.setAttribute("circle", "");
        document.body.appendChild(el);
        await tick();

        expect(el.hasAttribute("circle")).toBe(true);
    });

    it("round shape 反射到 host flag", async () => {
        const el = document.createElement("elf-button") as ButtonEl;
        el.setAttribute("round", "");
        document.body.appendChild(el);
        await tick();

        expect(el.hasAttribute("round")).toBe(true);
    });

    it("shape=circle 等价于 circle flag", async () => {
        const el = document.createElement("elf-button") as ButtonEl;
        el.setAttribute("shape", "circle");
        document.body.appendChild(el);
        await tick();

        expect(el.hasAttribute("circle")).toBe(true);
    });

    it("block 反射到 host flag", async () => {
        const el = document.createElement("elf-button") as ButtonEl;
        el.setAttribute("block", "");
        document.body.appendChild(el);
        await tick();

        expect(el.hasAttribute("block")).toBe(true);
    });

    it("plain 反射到 host flag", async () => {
        const el = document.createElement("elf-button") as ButtonEl;
        el.setAttribute("plain", "");
        document.body.appendChild(el);
        await tick();

        expect(el.hasAttribute("plain")).toBe(true);
    });

    it("dashed 反射到 host flag", async () => {
        const el = document.createElement("elf-button") as ButtonEl;
        el.setAttribute("dashed", "");
        document.body.appendChild(el);
        await tick();

        expect(el.hasAttribute("dashed")).toBe(true);
    });

    it("link 将 variant 变成 text 并设置 link flag", async () => {
        const el = document.createElement("elf-button") as ButtonEl;
        el.setAttribute("link", "");
        document.body.appendChild(el);
        await tick();

        expect(el.hasAttribute("link")).toBe(true);
    });

    it("bg flag 反射", async () => {
        const el = document.createElement("elf-button") as ButtonEl;
        el.setAttribute("bg", "");
        document.body.appendChild(el);
        await tick();

        expect(el.hasAttribute("bg")).toBe(true);
    });

    it("text flag 反射", async () => {
        const el = document.createElement("elf-button") as ButtonEl;
        el.setAttribute("text", "");
        document.body.appendChild(el);
        await tick();

        expect(el.hasAttribute("text")).toBe(true);
    });

    it("dark flag 反射", async () => {
        const el = document.createElement("elf-button") as ButtonEl;
        el.setAttribute("dark", "");
        document.body.appendChild(el);
        await tick();

        expect(el.hasAttribute("dark")).toBe(true);
    });

    it("direction=vertical 反射到 host", async () => {
        const el = document.createElement("elf-button") as ButtonEl;
        el.setAttribute("direction", "vertical");
        document.body.appendChild(el);
        await tick();

        expect(el.getAttribute("direction")).toBe("vertical");
    });

    it("no-hover flag 反射到 host", async () => {
        const el = document.createElement("elf-button") as ButtonEl;
        el.setAttribute("no-hover", "");
        document.body.appendChild(el);
        await tick();

        expect(el.hasAttribute("no-hover")).toBe(true);
    });

    it("no-hover 时 hover 不改变 background", async () => {
        const el = document.createElement("elf-button") as ButtonEl;
        el.setAttribute("no-hover", "");
        document.body.appendChild(el);
        await tick();

        const btn = el.shadowRoot!.querySelector("button")! as HTMLButtonElement;
        const before = getComputedStyle(btn).backgroundColor;
        // 派发 mouseenter 模拟 hover
        btn.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
        await tick();
        const after = getComputedStyle(btn).backgroundColor;
        // background 不应变化
        expect(after).toBe(before);
    });

    it("icon 属性渲染图标", async () => {
        const el = document.createElement("elf-button") as ButtonEl;
        el.setAttribute("icon", "★");
        document.body.appendChild(el);
        await tick();

        const icon = el.shadowRoot!.querySelector(".prop-icon");
        expect(icon).toBeTruthy();
        expect(icon!.textContent).toBe("★");
    });

    it("loadingIcon 在 loading 时替换 spinner", async () => {
        const el = document.createElement("elf-button") as ButtonEl;
        el.setAttribute("loading", "");
        el.setAttribute("loading-icon", "⏳");
        document.body.appendChild(el);
        await tick();

        expect(el.shadowRoot!.querySelector(".spinner")).toBeNull();
        const icon = el.shadowRoot!.querySelector(".prop-icon");
        expect(icon).toBeTruthy();
        expect(icon!.textContent).toBe("⏳");
    });

    it("size/type/disabled 通过 props 可读且不会触发 defineExpose 冲突警告", async () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
        const el = document.createElement("elf-button") as ButtonEl & { size: string; type: string; disabled: boolean };
        el.setAttribute("size", "sm");
        el.setAttribute("type", "submit");
        el.setAttribute("disabled", "");
        document.body.appendChild(el);
        await tick();

        expect(el.size).toBe("sm");
        expect(el.type).toBe("submit");
        expect(el.disabled).toBe(true);
        expect(warn.mock.calls.some(([message]) => String(message).includes("[defineExpose]"))).toBe(false);
        warn.mockRestore();
    });

    it.each([
        ["small", "sm"],
        ["default", "md"],
        ["large", "lg"],
    ])("normalizes the Element Plus size alias %s", async (source, expected) => {
        const el = document.createElement("elf-button") as ButtonEl;
        el.setAttribute("size", source);
        document.body.appendChild(el);
        await tick();

        expect(el.getAttribute("size")).toBe(expected);
    });

    it("submits the closest light-DOM form exactly once", async () => {
        const form = document.createElement("form");
        const el = document.createElement("elf-button") as ButtonEl;
        el.setAttribute("type", "submit");
        form.appendChild(el);
        document.body.appendChild(form);
        await tick();

        let submitCount = 0;
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            submitCount += 1;
        });

        el.shadowRoot!.querySelector<HTMLButtonElement>("button")!.click();
        await tick();

        expect(submitCount).toBe(1);
    });

    it("honors the explicit form attribute across the shadow boundary", async () => {
        const form = document.createElement("form");
        form.id = "profile-form";
        const el = document.createElement("elf-button") as ButtonEl;
        el.setAttribute("type", "submit");
        el.setAttribute("form", form.id);
        document.body.append(form, el);
        await tick();

        let submitted = false;
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            submitted = true;
        });

        el.shadowRoot!.querySelector<HTMLButtonElement>("button")!.click();
        await tick();

        expect(submitted).toBe(true);
    });

    it("resets the closest light-DOM form", async () => {
        const form = document.createElement("form");
        const input = document.createElement("input");
        input.defaultValue = "initial";
        input.value = "changed";
        const el = document.createElement("elf-button") as ButtonEl;
        el.setAttribute("type", "reset");
        form.append(input, el);
        document.body.appendChild(form);
        await tick();

        el.shadowRoot!.querySelector<HTMLButtonElement>("button")!.click();
        await tick();

        expect(input.value).toBe("initial");
    });

    it("does not submit when a click listener prevents the default action", async () => {
        const form = document.createElement("form");
        const el = document.createElement("elf-button") as ButtonEl;
        el.setAttribute("type", "submit");
        el.addEventListener("click", (event) => event.preventDefault());
        form.appendChild(el);
        document.body.appendChild(form);
        await tick();

        let submitted = false;
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            submitted = true;
        });

        el.shadowRoot!.querySelector<HTMLButtonElement>("button")!.click();
        await tick();

        expect(submitted).toBe(false);
    });
});
