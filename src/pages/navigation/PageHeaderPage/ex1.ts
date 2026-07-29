import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "基础页头与返回事件", en: "Basic page header and back event" },
  back: { zh: "返回", en: "Back" },
  order: { zh: "订单详情", en: "Order details" },
  edit: { zh: "编辑", en: "Edit" },
  waiting: { zh: "等待返回操作", en: "Waiting for a back action" },
  triggered: { zh: "已触发返回事件", en: "Back event emitted" },
});

const message = useRef(t("waiting"));

const code1 = `<elf-page-header
  title="${t("back")}"
  content="${t("order")}"
  @back=\${onBack}
>
  <elf-button slot="extra" size="sm">${t("edit")}</elf-button>
</elf-page-header>`;

const script1 = `const message = useRef("${t("waiting")}");

const onBack = () => {
  message.set("${t("triggered")}");
};`;

const onBack = (): void => {
  message.set(t("triggered"));
};

const PagePageHeaderEx1 = defineHtml(`
<elf-playground :title=${t("title")} :code=${code1} :script=${script1}>
      <elf-page-header :title=${t("back")} :content=${t("order")} @back=${onBack}>
        <elf-button slot="extra" size="sm">${t("edit")}</elf-button>
      </elf-page-header>
      <span slot="status" class="demo-state">${message}</span>
    </elf-playground>
`);

export { PagePageHeaderEx1 };
