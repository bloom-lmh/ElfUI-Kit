import { describe, expect, it } from "vitest";

import { countSelections, generateMarkup, handlerName } from "./codegen";
import type { CodegenInput } from "./codegen";

const roleRows: CodegenInput["roleRows"] = [
  {
    role: "props",
    component: "",
    rows: [
      {
        name: "variant",
        type: "elevated | outlined | filled | tonal | flat",
        default: "elevated",
        desc: "",
      },
      { name: "disabled", type: "boolean", default: "false", desc: "" },
      { name: "title", type: "string", default: "''", desc: "" },
    ],
  },
  {
    role: "events",
    component: "",
    rows: [
      { name: "click", desc: "" },
      { name: "image-load", type: "Event", desc: "" },
    ],
  },
  {
    role: "slots",
    component: "",
    rows: [
      { name: "default", desc: "" },
      { name: "footer", desc: "" },
    ],
  },
  { role: "exposes", component: "", rows: [{ name: "openPreview()", desc: "" }] },
];

const emptySelection = (): CodegenInput["selections"] => ({
  props: { "elf-card": {} },
  events: { "elf-card": {} },
  slots: { "elf-card": {} },
  exposes: { "elf-card": {} },
});

describe("generateMarkup", () => {
  it("renders attrs, boolean flags, events, slots, and method comments", () => {
    const selections = emptySelection();
    selections.props["elf-card"].variant = { name: "variant", value: "" };
    selections.props["elf-card"].disabled = { name: "disabled", value: "" };
    selections.props["elf-card"].title = { name: "title", value: "" };
    selections.events["elf-card"].click = { name: "click", value: "" };
    selections.slots["elf-card"].footer = { name: "footer", value: "" };
    selections.exposes["elf-card"]["openPreview()"] = { name: "openPreview()", value: "" };

    const markup = generateMarkup({ component: "elf-card", roleRows, selections });

    // 每个属性/事件单独一行
    expect(markup).toContain('<elf-card\nvariant="elevated"\ndisabled\ntitle="\'\'"');
    expect(markup).toContain('@click="handleClick"\n>');
    expect(markup).toContain('<span slot="footer">Footer</span>');
    expect(markup).toContain("<!-- ref.value.openPreview() -->");
    expect(markup).not.toContain("image-load");
  });

  it("always emits paired closing tags", () => {
    const selections = emptySelection();
    selections.props["elf-card"].variant = { name: "variant", value: "" };
    const markup = generateMarkup({ component: "elf-card", roleRows, selections });
    expect(markup).toContain('<elf-card\nvariant="elevated"\n>');
    expect(markup).toContain("</elf-card>");
    expect(markup).not.toContain("/>");
  });

  it("escapes attribute values", () => {
    const selections = emptySelection();
    selections.props["elf-card"].title = { name: "title", value: "" };
    // 默认值原样输出；若含引号会被转义
    const markup = generateMarkup({ component: "elf-card", roleRows, selections });
    expect(markup).toContain("title=\"''\"");
  });

  it("groups selections by component into separate snippets", () => {
    const multiRows: CodegenInput["roleRows"] = [
      {
        role: "props",
        component: "elf-checkbox",
        rows: [{ name: "label", type: "string", default: "''", desc: "" }],
      },
      {
        role: "props",
        component: "elf-checkbox-group",
        rows: [{ name: "min", type: "number", default: "0", desc: "" }],
      },
    ];
    const selections: CodegenInput["selections"] = {
      props: {
        "elf-checkbox": { label: { name: "label", value: "" } },
        "elf-checkbox-group": { min: { name: "min", value: "" } },
      },
    };
    const markup = generateMarkup({ component: "elf-checkbox", roleRows: multiRows, selections });
    expect(markup).toContain("<elf-checkbox\nlabel=\"''\"\n>");
    expect(markup).toContain("</elf-checkbox>");
    expect(markup).toContain('<elf-checkbox-group\nmin="0"\n>');
    expect(markup).toContain("</elf-checkbox-group>");
    expect(markup.indexOf("elf-checkbox-group")).toBeGreaterThan(markup.indexOf("elf-checkbox\n"));
  });
});

describe("handlerName", () => {
  it("camelizes kebab-case event names", () => {
    expect(handlerName("preview-open")).toBe("handlePreviewOpen");
    expect(handlerName("click")).toBe("handleClick");
  });
});

describe("countSelections", () => {
  it("counts selected items across roles", () => {
    const selections = emptySelection();
    selections.props["elf-card"].variant = { name: "variant", value: "" };
    selections.slots["elf-card"].footer = { name: "footer", value: "" };
    expect(countSelections(selections)).toBe(2);
  });
});
