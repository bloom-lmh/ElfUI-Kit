// elf-form-item — 表单项
//
// 对标 Element Plus：
// - inject FORM_KEY 拿 form 配置 + register/unregister 自身
// - rules 来源：form.rules[prop] + 自身 rules prop
// - provide FORM_ITEM_KEY 给子控件（input/select/...）
// - 校验状态反射到 host attribute（data-state），由子控件样式响应

import {
  defineEmits,
  defineExpose,
  defineProps,
  defineStyle,
  inject,
  onBeforeUnmount,
  onMounted,
  provide,
  useHostAttr,
  useHostCssVar,
  useHostFlag,
  useRef,
  defineHtml
} from "@elfui/core";

import { FORM_ITEM_KEY, FORM_KEY, type FormItemContext } from "../context";
import type { FormRule, RuleTrigger } from "../Form/types";
import { getPath, setPath } from "../../../utils/path";
import { validateFieldAsync } from "../../../utils/validator";
import styles from "./style.scss?inline";
import { useLocaleProvider } from "../../Providers/context";
import type { FormItemEmits, FormItemProps, FormItemValidateState } from "./types";

export type {
  FormItemEmits,
  FormItemExpose,
  FormItemProps,
  FormItemSize,
  FormItemValidateState,
  ValidateError
} from "./types";

const snapshotValue = (value: unknown): unknown => {
  if (value === null || typeof value !== "object") return value;
  if (typeof structuredClone !== "function") return value;
  try {
    return structuredClone(value);
  } catch {
    return value;
  }
};

const props = defineProps<FormItemProps>({
  prop: { type: String, default: "" },
  label: { type: String, default: "" },
  labelPosition: { type: String, default: "" },
  labelWidth: { type: String, default: "" },
  rules: { type: Array, default: () => [] as FormRule[] },
  required: { type: Boolean, default: false },
  size: { type: String, default: "" },
  error: { type: String, default: "" },
  for: { type: String, default: "" },
  validateStatus: { type: String, default: "" },
  trigger: { type: String, default: "" },
  inlineMessage: { type: Boolean, default: undefined },
  showMessage: { type: Boolean, default: undefined }
});

const emit = defineEmits<FormItemEmits>();

const locale = useLocaleProvider();

const form = inject(FORM_KEY);

const state = useRef<FormItemValidateState>("");

const message = useRef("");

let initialValue: unknown;
let validationRun = 0;

const collectRules = (): FormRule[] => {
  const formRules = form && props.prop ? (form.rules[props.prop as string] ?? []) : [];
  const ownRules = (props.rules as FormRule[]) ?? [];
  const combined = [...formRules, ...ownRules];
  // required 简写
  if (props.required && !combined.some((r) => r.required)) {
    combined.unshift({ required: true });
  }
  return combined;
};

const resolvedState = (): FormItemValidateState => {
  const override = String(props.validateStatus || "");
  if (override === "error" || override === "success" || override === "validating") return override;
  return state.value;
};

const hasError = (): boolean => resolvedState() === "error" || Boolean(props.error);
const hasSuccess = (): boolean => resolvedState() === "success";
const hasValidating = (): boolean => resolvedState() === "validating";
const isRequired = (): boolean => Boolean(props.required) || collectRules().some((rule) => rule.required);
const showMessage = (): boolean => props.showMessage ?? form?.showMessage ?? true;
const isInline = (): boolean => props.inlineMessage ?? form?.inlineMessage ?? false;
const showStatusIcon = (): boolean => Boolean(form?.statusIcon && resolvedState());
const resolvedLabelPosition = (): string => String(props.labelPosition || form?.labelPosition || "right");
const resolvedLabelWidth = (): string => String(props.labelWidth || form?.labelWidth || "100px");
const labelSuffix = (): string => form?.labelSuffix ?? "";

const feedbackClass = (): string => {
  const classes = ["feedback"];
  if (hasError()) classes.push("error");
  if (hasSuccess()) classes.push("success");
  if (hasValidating()) classes.push("validating");
  return classes.join(" ");
};

const validate = async (trigger?: RuleTrigger): Promise<boolean> => {
  if (!form || !props.prop) return true;
  const run = ++validationRun;

  const finish = (isValid: boolean, nextMessage = ""): boolean => {
    if (run !== validationRun) return resolvedState() !== "error";
    state.set(isValid ? "success" : "error");
    message.set(nextMessage);
    const prop = String(props.prop);
    emit("validate", prop, isValid, nextMessage);
    form.notifyValidate(prop, isValid, nextMessage);
    return isValid;
  };

  if (props.error) return finish(false, String(props.error));

  const rules = collectRules();
  if (rules.length === 0) {
    clearValidate();
    return true;
  }

  state.set("validating");
  const value = getPath(form.model, props.prop as string);

  const err = await validateFieldAsync(rules, value, form.model, trigger);
  return err ? finish(false, err) : finish(true);
};

const validateTrigger = (trigger: RuleTrigger): void => {
  const configuredTrigger = String(props.trigger || "");
  if (configuredTrigger && configuredTrigger !== trigger) return;
  void validate(trigger);
};

const clearValidate = (): void => {
  validationRun += 1;
  state.set("");
  message.set("");
};

const resetField = (): void => {
  if (form && props.prop) {
    setPath(form.model, props.prop as string, snapshotValue(initialValue));
  }
  clearValidate();
};

const setInitialValue = (...values: [unknown?]): void => {
  const next = values.length > 0
    ? values[0]
    : form && props.prop
      ? getPath(form.model, String(props.prop))
      : undefined;
  initialValue = snapshotValue(next);
};

const itemCtx: FormItemContext = {
  get prop() {
    return props.prop as string;
  },
  get initialValue() {
    return initialValue;
  },
  get state() {
    return state.value as "" | "validating" | "success" | "error";
  },
  get message() {
    return props.error ? (props.error as string) : message.value;
  },
  get rules() {
    return collectRules();
  },
  get size() {
    const s = props.size as string;
    return (s && s !== "" ? s : (form?.size ?? "md")) as FormItemContext["size"];
  },
  validateTrigger,
  validate,
  clearValidate,
  resetField,
  setInitialValue
};

provide(FORM_ITEM_KEY, itemCtx);

let unreg: (() => void) | null = null;

onMounted(() => {
  if (form) {
    if (props.prop) initialValue = snapshotValue(getPath(form.model, String(props.prop)));
    unreg = form.registerItem(itemCtx);
  }
});

onBeforeUnmount(() => {
  unreg?.();
});

useHostAttr("data-label-position", resolvedLabelPosition);
useHostAttr("data-state", resolvedState);
useHostCssVar("--_label-width", resolvedLabelWidth);
useHostFlag("data-hide-asterisk", () => Boolean(form?.hideRequiredAsterisk));
useHostFlag("data-asterisk-right", () => form?.requireAsteriskPosition === "right");
useHostFlag("data-inline", () => Boolean(form?.inline));

defineExpose({
  validate,
  resetField,
  clearValidate,
  setInitialValue,
  get validateMessage() {
    return itemCtx.message;
  },
  get validateState() {
    return resolvedState();
  }
});

defineStyle(styles);

const FormItem = defineHtml(`
  <div class="row">
    <label v-if=${props.label} :for=${props.for || undefined} :class=${{ required: isRequired() }}>
      <slot name="label">${props.label}</slot><span v-if=${labelSuffix()} class="label-suffix">${labelSuffix()}</span>
    </label>
    <div class="content">
      <div class="control">
        <slot></slot>
        <span v-if=${showStatusIcon()} :class=${"status-icon " + resolvedState()} aria-hidden="true">
          <span v-if=${hasSuccess()}>✓</span><span v-else-if=${hasError()}>!</span><span v-else>…</span>
        </span>
      </div>
      <div
        v-if=${showMessage() && !isInline()}
        :class=${feedbackClass()}
        :role=${hasError() ? "alert" : undefined}
        aria-live="polite"
      >
        <span v-if=${hasValidating()}>${locale.t("field.validating")}</span>
        <slot v-else-if=${hasError()} name="error">${message}</slot>
      </div>
    </div>
    <span
      v-if=${showMessage() && isInline()}
      :class=${feedbackClass() + " inline"}
      :role=${hasError() ? "alert" : undefined}
      aria-live="polite"
    >
      <slot v-if=${hasError()} name="error">${message}</slot>
    </span>
  </div>
`);

export { FormItem };
