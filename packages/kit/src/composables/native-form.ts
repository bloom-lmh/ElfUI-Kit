import {
  defineExpose,
  inject,
  useEffect,
  useFormControlContext,
  useHostAttr,
  useHostFlag,
  useRef,
  type FormControlValue,
} from "@elfui/core";

import { FORM_ITEM_KEY, FORM_KEY } from "./form-context";

export type NativeFormSerializable =
  string | number | boolean | bigint | Date | File | null | undefined;

export interface NativeFormSerializeOptions {
  name: string;
  /** Treat false as an absent value, matching native checkbox/radio submission. */
  omitFalse?: boolean;
}

export interface NativeFormControlBehavior<T> {
  /** Override the default scalar/array/date/file serializer. */
  serialize?: (value: T, options: NativeFormSerializeOptions) => FormControlValue;
  /** Restore a typed model from the state delivered by Core. */
  deserialize?: (state: FormControlValue, currentValue: T, name: string) => T;
  /** Override required-value detection for component-specific semantics. */
  isEmpty?: (value: T) => boolean;
  /** Exclude a logical child when its parent group owns native submission. */
  enabled?: () => boolean;
  omitFalse?: boolean;
  requiredMessage?: string;
}

export interface UseNativeFormControlOptions<T> extends NativeFormControlBehavior<T> {
  props: Record<string, unknown>;
  value: () => T;
  setValue: (value: T) => void;
}

export interface NativeFormControlBridge<T> {
  readonly disabled: boolean;
  readonly valid: boolean;
  readonly initialValue: T;
  setCustomValidity(message: string): void;
  validate(): Promise<boolean>;
  reportValidity(): boolean;
  reset(): void;
  restore(state: FormControlValue): void;
}

const isFile = (value: unknown): value is File =>
  typeof File !== "undefined" && value instanceof File;

const isFormData = (value: unknown): value is FormData =>
  typeof FormData !== "undefined" && value instanceof FormData;

const scalarFormValue = (
  value: unknown,
  options: NativeFormSerializeOptions,
): string | File | null => {
  if (value === null || value === undefined) return null;
  if (isFile(value)) return value;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value.toISOString();
  }
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : null;
  if (typeof value === "boolean") {
    return options.omitFalse && !value ? null : String(value);
  }
  if (typeof value === "string" || typeof value === "bigint") return String(value);
  try {
    const serialized = JSON.stringify(value);
    return typeof serialized === "string" ? serialized : null;
  } catch {
    return null;
  }
};

/**
 * Serialize a model for ElementInternals without touching ElementInternals in Kit.
 * Arrays become repeated FormData entries so native FormData preserves multiplicity.
 */
export const serializeNativeFormValue = (
  value: unknown,
  options: NativeFormSerializeOptions,
): FormControlValue => {
  if (isFormData(value)) return value;
  if (!options.name) return null;
  if (!Array.isArray(value)) return scalarFormValue(value, options);
  if (value.length === 0 || typeof FormData === "undefined") return null;

  const data = new FormData();
  for (const item of value) {
    const serialized = scalarFormValue(item, options);
    if (serialized !== null) data.append(options.name, serialized);
  }
  return Array.from(data.keys()).length > 0 ? data : null;
};

export const isNativeFormValueEmpty = (value: unknown): boolean => {
  if (value === null || value === undefined || value === "" || value === false) return true;
  if (Array.isArray(value)) return value.length === 0;
  if (value instanceof Date) return Number.isNaN(value.getTime());
  return false;
};

const cloneInitialValue = <T>(value: T): T => {
  if (value instanceof Date) return new Date(value.getTime()) as T;
  if (Array.isArray(value)) return value.map((item) => cloneInitialValue(item)) as T;
  if (isFormData(value)) {
    const copy = new FormData();
    value.forEach((entry, key) => copy.append(key, entry));
    return copy as T;
  }
  return value;
};

const firstRestoredEntry = (state: FormControlValue, name: string): string | File | null => {
  if (!isFormData(state)) return state;
  const entries = name ? state.getAll(name) : Array.from(state.values());
  return entries[0] ?? null;
};

const restoreScalar = (state: string | File | null, currentValue: unknown): unknown => {
  if (isFile(currentValue)) return isFile(state) ? state : currentValue;
  if (currentValue instanceof Date) {
    const restored = new Date(typeof state === "string" ? state : "");
    return Number.isNaN(restored.getTime()) ? currentValue : restored;
  }
  if (typeof currentValue === "number") {
    const restored = Number(state);
    return Number.isFinite(restored) ? restored : currentValue;
  }
  if (typeof currentValue === "boolean") return state === "true" || state === "1" || state === "on";
  if (state === null) return typeof currentValue === "string" ? "" : null;
  return isFile(state) ? state : String(state);
};

export const deserializeNativeFormValue = <T>(
  state: FormControlValue,
  currentValue: T,
  name: string,
): T => {
  if (Array.isArray(currentValue)) {
    const entries = isFormData(state)
      ? name
        ? state.getAll(name)
        : Array.from(state.values())
      : state === null
        ? []
        : [state];
    const sample = currentValue[0];
    return entries.map((entry) => restoreScalar(entry, sample)) as T;
  }
  return restoreScalar(firstRestoredEntry(state, name), currentValue) as T;
};

export const useNativeFormControl = <T>(
  options: UseNativeFormControlOptions<T>,
): NativeFormControlBridge<T> => {
  const core = useFormControlContext<FormControlValue>();
  const form = inject(FORM_KEY);
  const formItem = inject(FORM_ITEM_KEY);
  const initialValue = cloneInitialValue(options.value());
  const platformDisabled = useRef(false);
  const customValidity = useRef("");
  let explicitDisabled: boolean | undefined;

  const name = (): string => String(options.props.name ?? "");
  const enabled = (): boolean => options.enabled?.() ?? true;
  const disabled = (): boolean => Boolean(options.props.disabled) || Boolean(form?.disabled);
  const required = (): boolean => Boolean(options.props.required);

  useHostAttr("name", () => name() || null);
  useHostAttr("form", () => String(options.props.form ?? "") || null);
  useHostFlag("required", required);
  const serialize = (value: T): FormControlValue => {
    if (!enabled()) return null;
    const serializeOptions: NativeFormSerializeOptions = {
      name: name(),
      ...(options.omitFalse === undefined ? {} : { omitFalse: options.omitFalse }),
    };
    return options.serialize
      ? options.serialize(value, serializeOptions)
      : serializeNativeFormValue(value, serializeOptions);
  };
  const validationMessage = (value: T): string => {
    if (customValidity.value) return customValidity.value;
    if (required() && (options.isEmpty?.(value) ?? isNativeFormValueEmpty(value))) {
      return options.requiredMessage ?? "This field is required.";
    }
    if (formItem?.state === "error") return formItem.message || "Invalid value.";
    return "";
  };
  const synchronize = (value: T): void => {
    const nextDisabled = disabled();
    if (nextDisabled !== explicitDisabled) {
      explicitDisabled = nextDisabled;
      core.setDisabled(nextDisabled);
    }
    core.setValue(serialize(value));
    core.rules([
      {
        validator: () => validationMessage(value) || true,
      },
    ]);
    void core.validate();
  };

  const coreSetDisabled = core.setDisabled.bind(core);
  core.setDisabled = (next): void => {
    coreSetDisabled(next);
    platformDisabled.set(next);
  };

  const coreReset = core.reset.bind(core);
  core.reset = (): void => {
    coreReset();
    const next = cloneInitialValue(initialValue);
    options.setValue(next);
    synchronize(next);
  };

  const coreRestore = core.restore.bind(core);
  core.restore = (state): void => {
    coreRestore(state);
    const current = options.value();
    const next = options.deserialize
      ? options.deserialize(state, current, name())
      : deserializeNativeFormValue(state, current, name());
    options.setValue(next);
    synchronize(next);
  };

  useEffect(() => {
    synchronize(options.value());
  });

  const setCustomValidity = (message: string): void => {
    customValidity.set(String(message || ""));
    synchronize(options.value());
  };

  defineExpose({
    checkValidity: () => core.valid,
    reportValidity: () => core.report(),
    setCustomValidity,
  });

  return {
    get disabled() {
      return platformDisabled.value;
    },
    get valid() {
      return core.valid;
    },
    initialValue,
    setCustomValidity,
    async validate() {
      synchronize(options.value());
      return (await core.validate()).valid;
    },
    reportValidity: () => core.report(),
    reset: () => core.reset(),
    restore: (state) => core.restore(state),
  };
};
