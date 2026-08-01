import { defineHtml, useComponents } from "@elfui/core";
import { createDocsPicker } from "../../docsLocale";
import { PageInputOtpProps } from "./props";
import { PageInputOtpEx1 } from "./ex1";
import { PageInputOtpEx2 } from "./ex2";
import { PageInputOtpEx3 } from "./ex3";

const p = createDocsPicker();

useComponents({
  "page-input-otp-ex1": PageInputOtpEx1,
  "page-input-otp-ex2": PageInputOtpEx2,
  "page-input-otp-ex3": PageInputOtpEx3,
  "page-input-otp-props": PageInputOtpProps,
});

const PageInputOtp = defineHtml(`
  <elf-container>
    <elf-docs-hero category="form" tag="InputOtp" :title=${p("一次性密码", "One-time password input")} :description=${p("用于验证码和支付密码等分段输入场景，支持长度、数字模式、分隔符、只读与禁用状态。", "Use segmented input for verification or payment codes with configurable length, numeric mode, separators, and read-only or disabled states.")}></elf-docs-hero>

    <page-input-otp-ex1 />

    <page-input-otp-ex2 />

    <page-input-otp-ex3 />
    <page-input-otp-props></page-input-otp-props>
  </elf-container>
`);

export { PageInputOtp };
