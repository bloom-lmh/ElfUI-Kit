// 共享 composables
//
// useFormControl — v-model + form-item 校验联动 + 原生事件派发
// useDisabled    — 自身 disabled 或父级 form 全局 disabled 继承
// useSize        — 自身 > form-item > form 的 size 继承链
// useFormItem    — 统一的 form + form-item 上下文读取

import { inject } from "@elfui/core";
import { useModel, type ModelRef } from "@elfui/core";

import { FORM_ITEM_KEY, FORM_KEY } from "./form-context";
import type { RuleTrigger } from "../types/form";

// ── useFormControl ────────────────────────────────────────

export interface UseFormControlOptions {
  prop?: string;
  triggers?: {
    input?: RuleTrigger | false;
    change?: RuleTrigger | false;
    blur?: RuleTrigger | false;
  };
}

export interface FormControl<T> {
  model: ModelRef<T>;
  setValue(v: T): void;
  dispatchInput(v: T): void;
  dispatchChange(v: T): void;
  dispatchBlur(e?: Event): void;
  dispatchFocus(e?: Event): void;
}

type EmitFn = (event: string, ...args: unknown[]) => void;
type AnyEmitFn = (...args: any[]) => void;

interface MinimalCtx {
  emit: EmitFn;
}

const DEFAULT_TRIGGERS: Required<NonNullable<UseFormControlOptions["triggers"]>> = {
  input: "input",
  change: "change",
  blur: "blur",
};

export function useFormControl<T = unknown>(
  props: Record<string, unknown>,
  ctx: MinimalCtx,
  options?: UseFormControlOptions,
): FormControl<T>;
export function useFormControl<T = unknown, TEmit extends AnyEmitFn = AnyEmitFn>(
  props: Record<string, unknown>,
  emit: TEmit,
  options?: UseFormControlOptions,
): FormControl<T>;
export function useFormControl<T = unknown>(
  props: Record<string, unknown>,
  ctxOrEmit: MinimalCtx | AnyEmitFn,
  options: UseFormControlOptions = {},
): FormControl<T> {
  const ctx: MinimalCtx =
    typeof ctxOrEmit === "function" ? { emit: ctxOrEmit as EmitFn } : ctxOrEmit;
  const propName = options.prop ?? "modelValue";
  const triggers = { ...DEFAULT_TRIGGERS, ...(options.triggers ?? {}) };
  const model = useModel<T>(props, ctx, propName);
  const formItem = inject(FORM_ITEM_KEY);

  const fireTrigger = (kind: keyof typeof DEFAULT_TRIGGERS): void => {
    const trigger = triggers[kind];
    if (trigger === false || !trigger) return;
    formItem?.validateTrigger(trigger);
  };

  return {
    model,
    setValue(v) {
      model.set(v);
    },
    dispatchInput(v) {
      model.set(v);
      ctx.emit("input", v);
      fireTrigger("input");
    },
    dispatchChange(v) {
      ctx.emit("change", v);
      fireTrigger("change");
    },
    dispatchBlur(e) {
      ctx.emit("blur", e);
      fireTrigger("blur");
    },
    dispatchFocus(e) {
      ctx.emit("focus", e);
    },
  };
}

// ── useDisabled ───────────────────────────────────────────

export const useDisabled = (selfGetter: () => boolean): (() => boolean) => {
  const form = inject(FORM_KEY);
  return () => {
    if (selfGetter()) return true;
    if (form?.disabled) return true;
    return false;
  };
};

// ── useSize（自身 > form-item > form → "md"） ─────────────

export const useSize = (selfGetter: () => string | undefined | ""): (() => "sm" | "md" | "lg") => {
  const formItem = inject(FORM_ITEM_KEY);
  const form = inject(FORM_KEY);
  return () => {
    const own = selfGetter();
    if (own && own !== "") return own as "sm" | "md" | "lg";
    if (formItem?.size) return formItem.size;
    if (form?.size) return form.size;
    return "md";
  };
};

// ── useFormItem ───────────────────────────────────────────

export interface FormItemInfo {
  state: "" | "validating" | "success" | "error";
  message: string;
  formDisabled: boolean;
  formSize: "sm" | "md" | "lg";
}

export const useFormItem = (selfSize: () => string | undefined | ""): FormItemInfo => {
  const form = inject(FORM_KEY);
  const formItem = inject(FORM_ITEM_KEY);

  const size = (): "sm" | "md" | "lg" => {
    const own = selfSize();
    if (own && own !== "") return own as "sm" | "md" | "lg";
    if (formItem?.size) return formItem.size;
    if (form?.size) return form.size;
    return "md";
  };

  return {
    get state() {
      return formItem?.state ?? "";
    },
    get message() {
      return formItem?.message ?? "";
    },
    get formDisabled() {
      return form?.disabled ?? false;
    },
    get formSize() {
      return size();
    },
  };
};
