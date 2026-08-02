// 表单族组件集中注册入口

import { registerComponents } from "@elfui/core";

import { Checkbox } from "./Checkbox/index";
import { CheckboxGroup } from "./CheckboxGroup/index";
import { CascaderPanel } from "./Cascader/Panel";
import { Cascader } from "./Cascader/index";
import { Autocomplete } from "./Autocomplete/index";
import { Form } from "./Form/index";
import { FormItem } from "./FormItem/index";
import { Input } from "./Input/index";
import { InputNumber } from "./InputNumber/index";
import { InputOtp } from "./InputOtp/index";
import { InputTag } from "./InputTag/index";
import { Mention } from "./Mention/index";
import { Radio } from "./Radio/index";
import { RadioGroup } from "./RadioGroup/index";
import { Rate } from "./Rate/index";
import { Segmented } from "./Segmented/index";
import { Select } from "./Select/index";
import { Slider } from "./Slider/index";
import { Switch } from "./Switch/index";
import { Textarea } from "./Textarea/index";
import { TreeSelect } from "./TreeSelect/index";
import { Upload } from "./Upload/index";

registerComponents(
  Form,
  FormItem,
  Autocomplete,
  Input,
  InputNumber,
  InputOtp,
  InputTag,
  Mention,
  Textarea,
  Switch,
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup,
  Select,
  TreeSelect,
  Segmented,
  Cascader,
  CascaderPanel,
  Upload,
  Rate,
  Slider,
);
