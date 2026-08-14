import { createInjectionKey } from "@elfui/core";

import type { FormContext, FormItemContext } from "../types/form";

export const FORM_KEY = createInjectionKey<FormContext>("elfui.form");
export const FORM_ITEM_KEY = createInjectionKey<FormItemContext>("elfui.form-item");
