import { defineHtml, useRef } from "@elfui/core";

const otp = useRef("4821");

const code1 = `<elf-input-otp
  :modelValue=\${otp}
  length="6"
  separator="-"
  placeholder="0"
  @update:modelValue=\${onOtpUpdate}
/>
<span slot="status" class="demo-state">当前：\${otp || "未输入"}</span>`;

const script1 = `const otp = useRef("4821");

const onOtpUpdate = (event) => {
  otp.set(event.detail);
};`;

const onOtpUpdate = (event: CustomEvent): void => {
  otp.set(String(event.detail || ""));
};

const PageInputOtpEx1 = defineHtml(`
<elf-playground title="受控值 / 分隔符" :code=${code1} :script=${script1}>
      <elf-input-otp
        :modelValue=${otp}
        length="6"
        separator="-"
        placeholder="0"
        @update:modelValue=${onOtpUpdate}
      ></elf-input-otp>
      <span slot="status" class="demo-state">当前：${otp || "未输入"}</span>
    </elf-playground>
`);

export { PageInputOtpEx1 };
