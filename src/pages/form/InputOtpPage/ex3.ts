import { defineHtml, useRef } from "@elfui/core";

const otp = useRef("4821");

const code3 = `<elf-input-otp model-value="******" type="password" readonly />
<elf-input-otp model-value="123456" disabled />`;

const PageInputOtpEx3 = defineHtml(`
<elf-playground title="只读 / 禁用" :code=${code3}>
      <div style="display:grid;gap:12px">
        <elf-input-otp model-value="******" type="password" readonly></elf-input-otp>
        <elf-input-otp model-value="123456" disabled></elf-input-otp>
      </div>
    </elf-playground>
`);

export { PageInputOtpEx3 };
