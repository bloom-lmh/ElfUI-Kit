import { defineHtml, useComponents } from "@elfui/core";
import { PageInputOtpProps } from "./props";
import { PageInputOtpEx1 } from "./ex1";
import { PageInputOtpEx2 } from "./ex2";
import { PageInputOtpEx3 } from "./ex3";

useComponents({
  "page-input-otp-ex1": PageInputOtpEx1,
  "page-input-otp-ex2": PageInputOtpEx2,
  "page-input-otp-ex3": PageInputOtpEx3,
  "page-input-otp-props": PageInputOtpProps
});

const PageInputOtp = defineHtml(`
  <elf-container>
    <h1>InputOtp 一次性密码</h1>
    <p>用于验证码、支付密码等分段输入场景，支持长度、数字模式、分隔符、只读与禁用。</p>

    <page-input-otp-ex1 />

    <page-input-otp-ex2 />

    <page-input-otp-ex3 />
    <page-input-otp-props></page-input-otp-props>
  </elf-container>
`);

export { PageInputOtp };
