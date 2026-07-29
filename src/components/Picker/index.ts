// Picker 选择器组件
import { registerComponents } from "@elfui/core";

import { Calendar } from "./Calendar/index";
import { ColorPicker } from "./ColorPicker/index";
import { DatePicker } from "./DatePicker/index";
import { TimePicker } from "./TimePicker/index";
import { TimeSelect } from "./TimeSelect/index";

registerComponents(Calendar, ColorPicker, DatePicker, TimePicker, TimeSelect);

export { Calendar } from "./Calendar/index";
export { ColorPicker } from "./ColorPicker/index";
export { DatePicker } from "./DatePicker/index";
export { TimePicker } from "./TimePicker/index";
export { TimeSelect } from "./TimeSelect/index";
export type {
  TimeSelectElement,
  TimeSelectEmits,
  TimeSelectExpose,
  TimeSelectProps,
  TimeSelectSize,
  TimeSelectVariant,
} from "./TimeSelect/types";
