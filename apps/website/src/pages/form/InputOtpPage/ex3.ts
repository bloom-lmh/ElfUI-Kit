import { defineHtml, useRef } from "@elfui/core";
import { createDocsPicker } from "../../docsLocale";

const p = createDocsPicker();
const otp = useRef("4821");

const code3 = `<elf-input-otp model-value="******" type="password" readonly />
<elf-input-otp model-value="123456" disabled />`;
const script3 = `// ${p("只读输入保留焦点导航；禁用输入不接受交互。", "Read-only inputs retain focus navigation; disabled inputs do not accept interaction.")}`;

const PageInputOtpEx3 = defineHtml(`
<elf-playground :title=${p("只读与禁用", "Read-only and disabled")} :code=${code3} :script=${script3}>
      <span slot="status">${p("两种不可编辑状态", "Two non-editable states")}</span>
      <div style="display:grid;gap:12px">
        <elf-input-otp model-value="******" type="password" readonly></elf-input-otp>
        <elf-input-otp model-value="123456" disabled></elf-input-otp>
      </div>
    </elf-playground>
`);

export { PageInputOtpEx3 };
