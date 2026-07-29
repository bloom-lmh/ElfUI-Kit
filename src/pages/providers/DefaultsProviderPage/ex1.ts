import { defineHtml } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "默认属性下发", en: "Propagating default props" },
  inheritedButton: { zh: "继承默认按钮", en: "Button with inherited defaults" },
  explicitButton: { zh: "显式属性优先", en: "Explicit props take priority" },
  inheritedTag: { zh: "继承标签默认值", en: "Tag with inherited defaults" },
});

const defaults = {
  "elf-button": {
    variant: "outlined",
    color: "secondary",
    size: "sm"
  },
  "elf-tag": {
    color: "success",
    variant: "light"
  }
};

const basicCode = `<elf-defaults-provider :defaults.prop="defaults">
  <elf-button>${t("inheritedButton")}</elf-button>
  <elf-button color="danger">${t("explicitButton")}</elf-button>
</elf-defaults-provider>`;

const basicScript = `const defaults = {
    "elf-button": {
        variant: "outlined",
        color: "secondary",
        size: "sm"
    },
    "elf-tag": {
        color: "success",
        variant: "light"
    }
};`;

const PageDefaultsProviderEx1 = defineHtml(`
<elf-playground :title=${t("title")} :code=${basicCode} :script=${basicScript}>
      <elf-defaults-provider :defaults.prop=${defaults}>
        <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
          <elf-button>${t("inheritedButton")}</elf-button>
          <elf-button color="danger">${t("explicitButton")}</elf-button>
          <elf-tag>${t("inheritedTag")}</elf-tag>
        </div>
      </elf-defaults-provider>
    </elf-playground>
`);

export { PageDefaultsProviderEx1 };
