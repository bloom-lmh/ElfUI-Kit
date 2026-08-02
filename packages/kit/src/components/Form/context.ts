// Form 上下文注入键

import { createInjectionKey } from "@elfui/core";

import type {
  CheckboxGroupContext,
  FormContext,
  FormItemContext,
  RadioGroupContext,
} from "../../types/form-context";

// re-export so existing imports from "./context" still work
export type { CheckboxGroupContext, FormContext, FormItemContext, RadioGroupContext };

export const FORM_KEY = createInjectionKey<FormContext>("elfui.form");
export const FORM_ITEM_KEY = createInjectionKey<FormItemContext>("elfui.form-item");
export const CHECKBOX_GROUP_KEY = createInjectionKey<CheckboxGroupContext>("elfui.checkbox-group");
export const RADIO_GROUP_KEY = createInjectionKey<RadioGroupContext>("elfui.radio-group");
