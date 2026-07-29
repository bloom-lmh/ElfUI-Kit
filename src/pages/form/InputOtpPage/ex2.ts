import { defineHtml, useRef } from "@elfui/core";
import { createDocsPicker } from "../../docsLocale";

const p = createDocsPicker();
const otp = useRef("4821");

const payCode = useRef("");

const code2 = `<elf-input-otp
  :modelValue=\${payCode}
  type="number"
  length="4"
  size="lg"
  @update:modelValue=\${onPayCodeUpdate}
/>`;

const script2 = `const payCode = useRef("");

const onPayCodeUpdate = (event) => {
  payCode.set(event.detail);
};`;

const onPayCodeUpdate = (event: CustomEvent): void => {
  payCode.set(String(event.detail || ""));
};
const payCodeStatus = (): string => payCode.value || p("未输入", "Empty");

const PageInputOtpEx2 = defineHtml(`
<elf-playground :title=${p("数字模式与大尺寸", "Numeric mode and large size")} :code=${code2} :script=${script2}>
      <span slot="status">${p("支付验证码", "Payment code")}: ${payCodeStatus()}</span>
      <elf-input-otp
        :modelValue=${payCode}
        type="number"
        length="4"
        size="lg"
        @update:modelValue=${onPayCodeUpdate}
      ></elf-input-otp>
    </elf-playground>
`);

export { PageInputOtpEx2 };
