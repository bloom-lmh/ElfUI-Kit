// elf-form — 表单容器
//
// 对标 Element Plus，提供 model + rules 校验联动。
// 通过 provide FORM_KEY 给 form-item 共享配置，form-item 注册到 form。
//
// 用法:
//   <elf-form .model="formData" .rules="rules" label-position="top">
//     <elf-form-item prop="name" label="姓名">
//       <elf-input v-model="formData.name" placeholder="..." clearable />
//     </elf-form-item>
//   </elf-form>

import {
  defineEmits,
  defineExpose,
  defineProps,
  defineStyle,
  onMounted,
  provide,
  useEffect,
  useHost,
  useHostAttr,
  useHostFlag,
  defineHtml
} from "@elfui/core";

import { FORM_KEY, type FormContext, type FormItemContext } from "../context";
import { getPath } from "../../../utils/path";
import styles from "./style.scss?inline";

import type { FormEmits, FormProps, FormRules, RuleTrigger } from "./types";

export type {
  FormEmits,
  FormExpose,
  FormField,
  FormProps,
  FormRule,
  FormRules,
  RuleTrigger,
  ValidateField
} from "./types";

const isScrollIntoViewOptions = (value: unknown): value is ScrollIntoViewOptions =>
  typeof value === "object" && value !== null;

const props = defineProps<FormProps>({
  model: { type: Object, default: () => ({}) },
  rules: { type: Object, default: () => ({}) },
  size: { type: String, default: "md" },
  disabled: { type: Boolean, default: false },
  labelPosition: { type: String, default: "right" },
  labelWidth: { type: String, default: "100px" },
  labelSuffix: { type: String, default: "" },
  inline: { type: Boolean, default: false },
  hideRequiredAsterisk: { type: Boolean, default: false },
  requireAsteriskPosition: { type: String, default: "left" },
  showMessage: { type: Boolean, default: true },
  inlineMessage: { type: Boolean, default: false },
  statusIcon: { type: Boolean, default: false },
  validateOnRuleChange: { type: Boolean, default: true },
  scrollToError: { type: Boolean, default: false },
  scrollIntoViewOptions: { type: [Object, Boolean], default: () => ({ behavior: "smooth", block: "center" }) },
  preventSubmit: { type: Boolean, default: true }
});

const emit = defineEmits<FormEmits>();

const host = useHost();

const items: FormItemContext[] = [];
let rulesReady = false;

const findItems = (propPath?: string | string[]): FormItemContext[] => {
  if (!propPath) return [...items];
  const arr = Array.isArray(propPath) ? propPath : [propPath];
  return items.filter((it) => arr.includes(it.prop));
};

const getField = (prop: string): FormItemContext | undefined =>
  items.find((item) => item.prop === prop);

const findItemElement = (prop: string): HTMLElement | undefined =>
  Array.from(host.querySelectorAll<HTMLElement>("elf-form-item")).find((element) => {
    const value = (element as HTMLElement & { prop?: string }).prop;
    return value === prop || element.getAttribute("prop") === prop;
  });

const scrollToField = (
  prop: string,
  options: ScrollIntoViewOptions | boolean = props.scrollIntoViewOptions
): void => {
  const element = findItemElement(prop);
  if (!element) return;
  if (options === false) element.scrollIntoView({ block: "nearest" });
  else if (isScrollIntoViewOptions(options)) element.scrollIntoView(options);
  else element.scrollIntoView();
};

const validate = async (): Promise<boolean> => {
  const results = await Promise.all(items.map((it) => it.validate()));
  const ok = results.every(Boolean);

  if (!ok && props.scrollToError) {
    const firstError = items.find((item) => item.state === "error");
    if (firstError) scrollToField(firstError.prop);
  }
  return ok;
};

const validateField = async (
  propPath: string | string[],
  trigger?: RuleTrigger
): Promise<boolean> => {
  const matched = findItems(propPath);
  const results = await Promise.all(matched.map((it) => it.validate(trigger)));
  return results.every(Boolean);
};

const resetFields = (propPath?: string | string[]): void => {
  for (const item of findItems(propPath)) item.resetField();
};

const clearValidate = (propPath?: string | string[]): void => {
  for (const it of findItems(propPath)) it.clearValidate();
};

const setInitialValues = (values: Record<string, unknown> = props.model): void => {
  for (const item of items) {
    item.setInitialValue(getPath(values, item.prop));
  }
};

const notifyValidate = (prop: string, isValid: boolean, message: string): void => {
  emit("validate", prop, isValid, message);
};

const onSubmit = (event: Event): void => {
  if (props.preventSubmit) event.preventDefault();
  emit("submit", event);
};

const formCtx: FormContext = {
  get model(): Record<string, unknown> {
    return props.model as Record<string, unknown>;
  },
  get rules(): FormRules {
    return props.rules as FormRules;
  },
  get size() {
    return props.size as FormContext["size"];
  },
  get disabled(): boolean {
    return Boolean(props.disabled);
  },
  get labelPosition() {
    return props.labelPosition as FormContext["labelPosition"];
  },
  get labelWidth(): string {
    return String(props.labelWidth);
  },
  get labelSuffix(): string {
    return String(props.labelSuffix || "");
  },
  get hideRequiredAsterisk(): boolean {
    return Boolean(props.hideRequiredAsterisk);
  },
  get requireAsteriskPosition(): "left" | "right" {
    return props.requireAsteriskPosition === "right" ? "right" : "left";
  },
  get showMessage(): boolean {
    return props.showMessage !== false;
  },
  get inlineMessage(): boolean {
    return Boolean(props.inlineMessage);
  },
  get statusIcon(): boolean {
    return Boolean(props.statusIcon);
  },
  get inline(): boolean {
    return Boolean(props.inline);
  },
  get scrollIntoViewOptions(): ScrollIntoViewOptions | boolean {
    return props.scrollIntoViewOptions as ScrollIntoViewOptions | boolean;
  },
  registerItem(item) {
    items.push(item);
    return () => {
      const idx = items.indexOf(item);
      if (idx >= 0) items.splice(idx, 1);
    };
  },
  unregisterItem(item) {
    const idx = items.indexOf(item);
    if (idx >= 0) items.splice(idx, 1);
  },
  validateField,
  validate,
  resetFields,
  clearValidate,
  notifyValidate
};

provide(FORM_KEY, formCtx);

onMounted(() => {
  rulesReady = true;
});

useEffect(() => {
  void props.rules;
  if (!rulesReady || !props.validateOnRuleChange) return;
  queueMicrotask(() => void validate());
});

useHostAttr("size", () => String(props.size || "md"));
useHostFlag("disabled", () => Boolean(props.disabled));
useHostFlag("inline", () => Boolean(props.inline));

defineExpose({
  validate,
  validateField,
  resetFields,
  scrollToField,
  clearValidate,
  getField,
  setInitialValues,
  get fields() {
    return [...items];
  }
});

defineStyle(styles);

const Form = defineHtml(`<form @submit=${onSubmit}><slot></slot></form>`);

export { Form };
