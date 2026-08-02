// validator 纯函数测试

import { describe, expect, it } from "vitest";

import type { FormRule } from "../../components/Form/Form/types";
import { validateField } from "../../utils/validator";

const model = {};

describe("validateField", () => {
  it("required 为空字符串报错", () => {
    const rules: FormRule[] = [{ required: true }];
    expect(validateField(rules, "", model)).toBe("此项为必填");
    expect(validateField(rules, null, model)).toBe("此项为必填");
    expect(validateField(rules, undefined, model)).toBe("此项为必填");
    expect(validateField(rules, [], model)).toBe("此项为必填");
  });

  it("required 通过", () => {
    expect(validateField([{ required: true }], "abc", model)).toBeNull();
    expect(validateField([{ required: true }], 0, model)).toBeNull();
    expect(validateField([{ required: true }], false, model)).toBeNull();
  });

  it("非 required 时空值跳过其它检查", () => {
    expect(validateField([{ min: 5 }], "", model)).toBeNull();
  });

  it("type=email", () => {
    const rules: FormRule[] = [{ type: "email" }];
    expect(validateField(rules, "abc", model)).toBe("必须是邮箱");
    expect(validateField(rules, "a@b.c", model)).toBeNull();
  });

  it("type=url", () => {
    const rules: FormRule[] = [{ type: "url" }];
    expect(validateField(rules, "abc", model)).toBe("必须是URL");
    expect(validateField(rules, "https://example.com", model)).toBeNull();
  });

  it("min/max 字符串长度", () => {
    expect(validateField([{ min: 3 }], "ab", model)).toBe("不能小于 3");
    expect(validateField([{ max: 3 }], "abcd", model)).toBe("不能大于 3");
    expect(validateField([{ min: 3, max: 5 }], "abc", model)).toBeNull();
  });

  it("自定义 validator", () => {
    const rules: FormRule[] = [
      {
        validator: (v) => (typeof v === "string" && v.startsWith("a") ? true : "必须以 a 开头"),
      },
    ];
    expect(validateField(rules, "abc", model)).toBeNull();
    expect(validateField(rules, "xyz", model)).toBe("必须以 a 开头");
  });

  it("trigger 过滤生效规则", () => {
    const rules: FormRule[] = [
      { required: true, message: "必填", trigger: "blur" },
      { min: 5, message: "至少 5 字", trigger: "change" },
    ];
    // blur 时只检查 required
    expect(validateField(rules, "", model, "blur")).toBe("必填");
    expect(validateField(rules, "ab", model, "blur")).toBeNull();
    // change 时只检查 min
    expect(validateField(rules, "ab", model, "change")).toBe("至少 5 字");
  });

  it("自定义 message 优先", () => {
    const rules: FormRule[] = [{ required: true, message: "请填写姓名" }];
    expect(validateField(rules, "", model)).toBe("请填写姓名");
  });
});
