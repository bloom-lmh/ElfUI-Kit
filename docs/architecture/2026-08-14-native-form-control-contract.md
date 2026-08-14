<!-- cspell:words datetime fileList FormData ElementInternals -->

# Native form control contract

- Date: 2026-08-14
- Applies to: `@elfui/kit@0.0.2-beta.5` and Core `0.1.0-beta.21`
- Owner: Core owns the browser platform boundary; Kit owns field models and validation policy

## Ownership boundary

| Concern                                                                                | Authoritative owner              |
| -------------------------------------------------------------------------------------- | -------------------------------- |
| `ElementInternals`, form association, browser callbacks and native form value/validity | Core `useFormControlContext()`   |
| Rules, triggers, field registration, messages, size and layout                         | Kit Form/FormItem                |
| Model parsing, formatting, clear value and public events                               | Concrete Kit field               |
| Serialization, typed reset/restore bridge and group de-duplication                     | `src/composables/native-form.ts` |

Kit never calls `attachInternals()`, `setFormValue()` or `setValidity()` directly and does not
maintain a second native-control registry. The Kit adapter supplies serialized values and rules to
the Core context, while Form/FormItem remains the only higher-level field registry.

## Associated controls

The following public value owners declare `defineOptions({ formControl: true })`:

- Text: Input, Textarea, Autocomplete, Mention, InputTag and InputOtp.
- Numeric and choice: InputNumber, Checkbox, CheckboxGroup, Radio, RadioGroup, Switch, Select,
  TreeSelect, Cascader, Slider, Rate and Segmented.
- Date and time: DatePicker, DateTimePicker, TimePicker and TimeSelect.
- Other values: ColorPicker and Upload.

Checkbox and Radio are associated only while standalone. Inside their corresponding group they
publish no native value; CheckboxGroup or RadioGroup is the sole form value owner. Form, FormItem,
Option, OptionGroup and CascaderPanel are structural and are intentionally not associated. Button
is a form action rather than a value owner and keeps its native action contract separate.

Every associated control accepts `name`, `form`, `required` and `disabled` on its host and exposes
`checkValidity()`, `reportValidity()` and `setCustomValidity(message)`.

## Serialization

| Model value                                       | Native value                                                                    |
| ------------------------------------------------- | ------------------------------------------------------------------------------- |
| Missing `name`, `null` or `undefined`             | omitted (`null`)                                                                |
| String, including the empty string                | unchanged                                                                       |
| Finite number or bigint                           | decimal string                                                                  |
| Boolean                                           | `"true"` or `"false"`                                                           |
| Unchecked standalone Checkbox or unselected Radio | omitted                                                                         |
| Array                                             | repeated `FormData` entries using the control name; an empty array is omitted   |
| Nested array or plain structured item             | JSON string in its repeated entry                                               |
| Valid `Date`                                      | UTC ISO string; an invalid date is omitted                                      |
| `File`                                            | the original file                                                               |
| Upload list                                       | repeated raw `File` entries; remote items without a raw file are not fabricated |
| Existing `FormData`                               | preserved                                                                       |

`multiple` therefore never joins values with commas. A named empty string participates in
`FormData`, but fails required validation. False is submitted for Switch and other Boolean value
owners; Checkbox uses native checked/unchecked omission semantics.

## State and priority

1. A property/attribute update from the consumer is the controlled source and synchronizes the
   component model.
2. User interaction updates the local model, emits `update:modelValue`, then emits its semantic
   input/change event and triggers FormItem validation.
3. Native reset restores the model snapshot captured when the element connects and emits only the
   model update event; it does not fabricate user input/change events.
4. State restore is delivered by Core and coerced using the current model shape (string, number,
   Boolean, array, date or file) before the model update is emitted.
5. Upload keeps its existing controlled priority: `fileList` overrides `modelValue` when supplied.
6. Explicit component/Form disabled state and native disabled-fieldset state both exclude the value.

The browser owns external association through the host `form` attribute. Shadow DOM internals are
presentation and interaction details; the custom-element host is the submitted control.

## Migration notes

- Put `name`, `form` and `required` on the `elf-*` host. Do not depend on a private Shadow DOM input.
- Read repeated values with `FormData.getAll(name)` for multi-value controls.
- Unchecked Checkbox and unselected Radio values are now absent rather than serialized as false.
- Upload submits only real raw files. Persisted server records without `raw` remain UI state and are
  not converted into fake files.
- A form reset emits `update:modelValue`; controlled consumers should accept that update or write
  their chosen value back explicitly.
