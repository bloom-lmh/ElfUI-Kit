import { defineHtml, useRef } from "@elfui/core";

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

const PageInputOtpEx2 = defineHtml(`
<elf-playground title="数字模式 / 大尺寸" :code=${code2} :script=${script2}>
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
