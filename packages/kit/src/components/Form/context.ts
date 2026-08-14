// Compatibility entry for existing component and consumer imports.

import { createInjectionKey } from "@elfui/core";

import type { CheckboxGroupContext, RadioGroupContext } from "../../types/form";

export { FORM_ITEM_KEY, FORM_KEY } from "../../composables/form-context";
export type {
  CheckboxGroupContext,
  FormContext,
  FormItemContext,
  RadioGroupContext,
} from "../../types/form";

export const CHECKBOX_GROUP_KEY = createInjectionKey<CheckboxGroupContext>("elfui.checkbox-group");
export const RADIO_GROUP_KEY = createInjectionKey<RadioGroupContext>("elfui.radio-group");
