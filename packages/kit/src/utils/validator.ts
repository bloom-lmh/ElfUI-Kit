// 表单校验：纯函数 + 无副作用
//
// validateField  — 同步校验单字段（多条 rule，first-fail）
// validateFieldAsync — 异步校验（支持 validator 返回 Promise）
//
// 扩展的规则字段（对标 Element Plus）：
// - type: integer / float / date / enum
// - enum: 值必须在列表中
// - fields: 多字段联动（如两次密码一致），传入 model 做跨字段比较
// - validator 支持返回 Promise<string|true|undefined>

import type { FormRule, RuleTrigger } from "../types/form";

// ── 空值判断 ──
const isEmpty = (v: unknown): boolean => {
  if (v === undefined || v === null) return true;
  if (typeof v === "string" && v === "") return true;
  if (Array.isArray(v) && v.length === 0) return true;
  return false;
};

// ── 类型检查 ──
const TYPE_DEFS: Record<string, { test: (v: unknown) => boolean; label: string }> = {
  string: { test: (v) => typeof v === "string", label: "字符串" },
  number: { test: (v) => typeof v === "number", label: "数字" },
  integer: { test: (v) => typeof v === "number" && Number.isInteger(v), label: "整数" },
  float: { test: (v) => typeof v === "number" && !Number.isNaN(v), label: "浮点数" },
  boolean: { test: (v) => typeof v === "boolean", label: "布尔值" },
  array: { test: (v) => Array.isArray(v), label: "数组" },
  date: { test: (v) => v instanceof Date && !Number.isNaN(v.getTime()), label: "日期" },
  email: {
    test: (v) => typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    label: "邮箱",
  },
  url: {
    test: (v) => typeof v === "string" && /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(v),
    label: "URL",
  },
};

// ── trigger 匹配 ──
const matchTrigger = (rule: FormRule, trigger?: RuleTrigger): boolean => {
  if (!trigger) return true;
  const t = rule.trigger;
  if (!t) return trigger === "change" || trigger === "blur";
  return Array.isArray(t) ? t.includes(trigger) : t === trigger;
};

// ── 取值的"长度"（用于 min/max/length） ──
const lengthOf = (v: unknown): number | null => {
  if (typeof v === "string" || Array.isArray(v)) return v.length;
  if (typeof v === "number") return v;
  return null;
};

// ── 单条 rule 检查 ──
const checkRule = (
  rule: FormRule,
  value: unknown,
  model: Record<string, unknown>,
): string | null => {
  // required
  if (rule.required && isEmpty(value)) {
    return rule.message ?? "此项为必填";
  }

  // 非必填 + 空值 → 跳过其余规则
  if (isEmpty(value) && !rule.required) return null;

  // type
  if (rule.type) {
    const def = TYPE_DEFS[rule.type];
    if (def && !def.test(value)) {
      return rule.message ?? `必须是${def.label}`;
    }
  }

  // enum
  if (rule.enum && !rule.enum.includes(value)) {
    return rule.message ?? "值不在允许的范围内";
  }

  // length
  if (rule.length !== undefined) {
    const len = typeof value === "string" ? value.length : null;
    if (len !== null && len !== rule.length) {
      return rule.message ?? `长度必须为 ${rule.length}`;
    }
  }

  // min / max
  const len = lengthOf(value);
  if (rule.min !== undefined && len !== null && len < rule.min) {
    return rule.message ?? `不能小于 ${rule.min}`;
  }
  if (rule.max !== undefined && len !== null && len > rule.max) {
    return rule.message ?? `不能大于 ${rule.max}`;
  }

  // pattern
  if (rule.pattern && typeof value === "string" && !rule.pattern.test(value)) {
    return rule.message ?? "格式不匹配";
  }

  // fields（跨字段联动 — 如两次密码一致）
  if (rule.fields) {
    const other = model[rule.fields];
    if (value !== other) {
      return rule.message ?? "两次输入不一致";
    }
  }

  // 自定义同步 validator
  if (rule.validator) {
    const r = rule.validator(value, model);
    if (typeof r === "string") return r;
    if (r === undefined || r === true) return null;
  }

  return null;
};

// ── 同步校验 ──
export const validateField = (
  rules: FormRule[],
  value: unknown,
  model: Record<string, unknown>,
  trigger?: RuleTrigger,
): string | null => {
  for (const rule of rules) {
    if (!matchTrigger(rule, trigger)) continue;
    const err = checkRule(rule, value, model);
    if (err) return err;
  }
  return null;
};

// ── 异步校验 ──
export const validateFieldAsync = async (
  rules: FormRule[],
  value: unknown,
  model: Record<string, unknown>,
  trigger?: RuleTrigger,
): Promise<string | null> => {
  for (const rule of rules) {
    if (!matchTrigger(rule, trigger)) continue;
    // 自定义异步 validator
    if (rule.validator) {
      const r = rule.validator(value, model);
      if (r instanceof Promise) {
        const result = await r;
        if (typeof result === "string") return result;
        if (result === undefined || result === true) continue;
      } else {
        if (typeof r === "string") return r;
        if (r === undefined || r === true) continue;
      }
    }
    const err = checkRule(rule, value, model);
    if (err) return err;
  }
  return null;
};
