import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "线型与文字位置", en: "Line styles and content positions" },
  status: {
    zh: "4 种线型 · 3 个文字位置 · dashed 别名兼容",
    en: "4 line styles · 3 content positions · dashed alias compatible"
  },
  solid: { zh: "实线 · 靠左", en: "Solid · left" },
  dashed: { zh: "虚线 · 居中", en: "Dashed · center" },
  dotted: { zh: "点线 · 靠右", en: "Dotted · right" },
  double: { zh: "双线 · 居中", en: "Double · center" }
});

const stylesCode = `<elf-divider content-position="left">Solid · left</elf-divider>
<elf-divider border-style="dashed">Dashed · center</elf-divider>
<elf-divider border-style="dotted" content-position="right">
  Dotted · right
</elf-divider>
<elf-divider border-style="double">Double · center</elf-divider>`;

const stylesScript = `// border-style: solid | dashed | dotted | double
// content-position: left | center | right
// The legacy dashed boolean remains an alias for border-style="dashed".`;

defineStyle(styles);

const PageDividerEx1 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${stylesCode} :script=${stylesScript}>
    <span slot="status" class="divider-demo-status">${t("status")}</span>
    <div class="divider-style-grid">
      <article>
        <span>01</span>
        <elf-divider content-position="left">${t("solid")}</elf-divider>
      </article>
      <article>
        <span>02</span>
        <elf-divider border-style="dashed">${t("dashed")}</elf-divider>
      </article>
      <article>
        <span>03</span>
        <elf-divider border-style="dotted" content-position="right">
          ${t("dotted")}
        </elf-divider>
      </article>
      <article>
        <span>04</span>
        <elf-divider border-style="double">${t("double")}</elf-divider>
      </article>
    </div>
  </elf-playground>
`);

export { PageDividerEx1 };
