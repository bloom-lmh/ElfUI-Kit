import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  section: { zh: "非模态模式", en: "Non-modal mode" },
  open: { zh: "打开非模态抽屉", en: "Open non-modal drawer" },
  title: { zh: "非模态抽屉", en: "Non-modal drawer" },
  body: { zh: "抽屉展开时仍可操作背景内容。", en: "Background content remains interactive while the drawer is open." },
});

const open = useRef(false);
const showDrawer = (): void => open.set(true);

const code = `<elf-button @click=\${showDrawer}>${t("open")}</elf-button>
<elf-drawer :modal="false" v-model:open="open" title="${t("title")}">
  <p>${t("body")}</p>
</elf-drawer>`;

const script = `const open = useRef(false);
const showDrawer = () => open.set(true);`;

const PageDrawerEx2 = defineHtml(`
  <h2>${t("section")}</h2>
  <elf-playground :title=${t("section")} :code=${code} :script=${script}>
    <elf-button @click=${showDrawer}>${t("open")}</elf-button>
    <elf-drawer v-model:open="open" :title=${t("title")} :modal="false">
      <div style="padding:16px"><p>${t("body")}</p></div>
    </elf-drawer>
  </elf-playground>
`);

export { PageDrawerEx2 };
