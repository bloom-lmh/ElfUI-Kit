import { defineHtml } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "覆盖策略", en: "Overwrite strategy" },
  colorOverridden: { zh: "颜色会覆盖为 success", en: "Color is overwritten with success" },
  variantOverridden: { zh: "变体会统一为 contained", en: "Variant is overwritten with contained" },
});

const defaults = {
  "elf-button": {
    variant: "outlined",
    color: "secondary",
    size: "sm",
  },
  "elf-tag": {
    color: "success",
    variant: "light",
  },
};

const overwriteDefaults = {
  Button: {
    color: "success",
    variant: "contained",
  },
};

const overwriteCode = `<elf-defaults-provider strategy="overwrite" :defaults.prop="overwriteDefaults">
  <elf-button color="danger">${t("colorOverridden")}</elf-button>
</elf-defaults-provider>`;

const overwriteScript = `const overwriteDefaults = {
    Button: {
        color: "success",
        variant: "contained"
    }
};`;

const PageDefaultsProviderEx2 = defineHtml(`
<elf-playground :title=${t("title")} :code=${overwriteCode} :script=${overwriteScript}>
      <elf-defaults-provider strategy="overwrite" :defaults.prop=${overwriteDefaults}>
        <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
          <elf-button color="danger">${t("colorOverridden")}</elf-button>
          <elf-button variant="text">${t("variantOverridden")}</elf-button>
        </div>
      </elf-defaults-provider>
    </elf-playground>
`);

export { PageDefaultsProviderEx2 };
