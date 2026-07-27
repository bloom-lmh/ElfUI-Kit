import { defineHtml } from "@elfui/core";

const deadline = Date.now() + 86_461_000;

const countdownCode = `<elf-countdown
  title="发布倒计时"
  :value.prop="deadline"
  format="DD [days] HH:mm:ss"
  @finish="onFinish"
/>`;

const countdownScript = `const deadline = Date.now() + 86_461_000;
const onFinish = () => console.log("Countdown finished");`;

const PageStatisticEx4 = defineHtml(`
<elf-playground title="Countdown 倒计时" :code=${countdownCode} :script=${countdownScript}>
      <elf-countdown title="发布倒计时" :value=${deadline} format="DD [days] HH:mm:ss"></elf-countdown>
    </elf-playground>
`);

export { PageStatisticEx4 };
