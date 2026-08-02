import { defineHtml, useRef } from "@elfui/core";
import { createDocsPicker } from "../../docsLocale";

const p = createDocsPicker();
const otp = useRef("4821");

const code1 = `<elf-input-otp
  :modelValue=\${otp}
  length="6"
  separator="-"
  placeholder="0"
  @update:modelValue=\${onOtpUpdate}
/>
<span slot="status" class="demo-state">${p("当前验证码", "Current code")}: \${otp || "${p("未输入", "Empty")}"}</span>`;

const script1 = `const otp = useRef("4821");

const onOtpUpdate = (event) => {
  otp.set(event.detail);
};`;

const onOtpUpdate = (event: CustomEvent): void => {
  otp.set(String(event.detail || ""));
};
const otpStatus = (): string => otp.value || p("未输入", "Empty");

const PageInputOtpEx1 = defineHtml(`
<elf-playground :title=${p("受控值与分隔符", "Controlled value and separator")} :code=${code1} :script=${script1}>
      <elf-input-otp
        :modelValue=${otp}
        length="6"
        separator="-"
        placeholder="0"
        @update:modelValue=${onOtpUpdate}
      ></elf-input-otp>
      <span slot="status" class="demo-state">${p("当前验证码", "Current code")}: ${otpStatus()}</span>
    </elf-playground>
`);

export { PageInputOtpEx1 };
