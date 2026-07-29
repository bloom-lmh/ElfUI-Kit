import { defineHtml } from "@elfui/core";
import { ElfMessage } from "../../../components/Feedback";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  section: { zh: "堆叠", en: "Stacking" },
  first: { zh: "第 1 条：任务已加入队列", en: "Message 1: The task was added to the queue." },
  second: { zh: "第 2 条：资源上传完成", en: "Message 2: The asset upload is complete." },
  third: { zh: "第 3 条：还有一项配置待确认", en: "Message 3: One configuration still needs confirmation." },
  trigger: { zh: "连续触发 3 条", en: "Trigger three messages" },
});

const showStack = (): void => {
  ElfMessage.info(t("first"));
  setTimeout(() => ElfMessage.success(t("second")), 200);
  setTimeout(() => ElfMessage.warning(t("third")), 400);
};

const code = `<elf-button @click=\${showStack}>${t("trigger")}</elf-button>`;
const script = `const showStack = () => {
  ElfMessage.info("${t("first")}");
  setTimeout(() => ElfMessage.success("${t("second")}"), 200);
  setTimeout(() => ElfMessage.warning("${t("third")}"), 400);
};`;

const PageMessageEx3 = defineHtml(`
  <h2>${t("section")}</h2>
  <elf-playground :title=${t("section")} :code=${code} :script=${script}>
    <elf-button @click=${showStack}>${t("trigger")}</elf-button>
  </elf-playground>
`);

export { PageMessageEx3 };
