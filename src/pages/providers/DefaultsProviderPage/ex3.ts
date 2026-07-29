import { defineHtml } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  section: { zh: "嵌套覆盖与恢复", en: "Nested overrides and reset" },
  outer: { zh: "外层默认", en: "Outer defaults" },
  outerButton: { zh: "secondary / outlined / sm", en: "Secondary / outlined / sm" },
  inheritedTag: { zh: "继承外层标签默认值", en: "Inherited tag defaults" },
  local: { zh: "局部覆盖", en: "Nested override" },
  localButton: { zh: "success / outlined / lg", en: "Success / outlined / lg" },
  tagStillInherited: { zh: "标签仍继承外层", en: "Tag still inherits the outer defaults" },
  reset: { zh: "重置继承", en: "Reset inheritance" },
  resetButton: { zh: "warning / 组件默认值", en: "Warning / component defaults" },
  tagReset: { zh: "标签恢复组件默认值", en: "Tag returns to component defaults" },
});

const outerDefaults = {
  "elf-button": { variant: "outlined", color: "secondary", size: "sm" },
  "elf-tag": { color: "info", variant: "light" }
};
const innerDefaults = {
  "elf-button": { color: "success", size: "lg" }
};
const resetDefaults = {
  "elf-button": { color: "warning" }
};

const code = `<elf-defaults-provider :defaults.prop="outerDefaults">
  <elf-button>${t("outer")}</elf-button>
  <elf-defaults-provider :defaults.prop="innerDefaults">
    <elf-button>${t("local")}</elf-button>
  </elf-defaults-provider>
  <elf-defaults-provider reset :defaults.prop="resetDefaults">
    <elf-button>${t("reset")}</elf-button>
  </elf-defaults-provider>
</elf-defaults-provider>`;

const script = `const outerDefaults = {
  "elf-button": { variant: "outlined", color: "secondary", size: "sm" }
};
const innerDefaults = {
  "elf-button": { color: "success", size: "lg" }
};`;

const PageDefaultsProviderEx3 = defineHtml(`
  <h2>${t("section")}</h2>
  <elf-playground :title=${t("section")} :code=${code} :script=${script}>
    <elf-defaults-provider :defaults.prop=${outerDefaults}>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:14px;width:100%;max-width:820px">
        <section style="display:grid;align-content:start;gap:12px;padding:16px;border:1px solid var(--elf-border);border-radius:8px;background:var(--elf-bg-paper)">
          <strong>${t("outer")}</strong>
          <elf-button>${t("outerButton")}</elf-button>
          <elf-tag>${t("inheritedTag")}</elf-tag>
        </section>
        <elf-defaults-provider :defaults.prop=${innerDefaults}>
          <section style="display:grid;align-content:start;gap:12px;padding:16px;border:1px solid var(--elf-border);border-radius:8px;background:var(--elf-bg-paper)">
            <strong>${t("local")}</strong>
            <elf-button>${t("localButton")}</elf-button>
            <elf-tag>${t("tagStillInherited")}</elf-tag>
          </section>
        </elf-defaults-provider>
        <elf-defaults-provider reset :defaults.prop=${resetDefaults}>
          <section style="display:grid;align-content:start;gap:12px;padding:16px;border:1px solid var(--elf-border);border-radius:8px;background:var(--elf-bg-paper)">
            <strong>${t("reset")}</strong>
            <elf-button>${t("resetButton")}</elf-button>
            <elf-tag>${t("tagReset")}</elf-tag>
          </section>
        </elf-defaults-provider>
      </div>
    </elf-defaults-provider>
  </elf-playground>
`);

export { PageDefaultsProviderEx3 };
