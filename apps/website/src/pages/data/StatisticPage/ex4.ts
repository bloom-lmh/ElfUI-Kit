import { defineHtml } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "倒计时", en: "Countdown" },
  release: { zh: "发布倒计时", en: "Release countdown" },
});
const deadline = Date.now() + 86_461_000;

const countdownCode = `<elf-countdown
  title="${t("release")}"
  :value.prop="deadline"
  format="DD [days] HH:mm:ss"
  @finish="onFinish"
/>`;

const countdownScript = `const deadline = Date.now() + 86_461_000;
const onFinish = () => console.log("Countdown finished");`;

const PageStatisticEx4 = defineHtml(`
<elf-playground :title=${t("title")} :code=${countdownCode} :script=${countdownScript}>
      <elf-countdown :title=${t("release")} :value=${deadline} format="DD [days] HH:mm:ss"></elf-countdown>
    </elf-playground>
`);

export { PageStatisticEx4 };
