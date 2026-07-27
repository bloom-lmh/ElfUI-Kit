import { defineHtml } from "@elfui/core";

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
  <elf-button>Outer defaults</elf-button>
  <elf-defaults-provider :defaults.prop="innerDefaults">
    <elf-button>Nested override</elf-button>
  </elf-defaults-provider>
  <elf-defaults-provider reset :defaults.prop="resetDefaults">
    <elf-button>Reset inheritance</elf-button>
  </elf-defaults-provider>
</elf-defaults-provider>`;

const script = `const outerDefaults = {
  "elf-button": { variant: "outlined", color: "secondary", size: "sm" }
};
const innerDefaults = {
  "elf-button": { color: "success", size: "lg" }
};`;

const PageDefaultsProviderEx3 = defineHtml(`
  <h2>嵌套覆盖与恢复</h2>
  <elf-playground title="三层组件默认策略" :code=${code} :script=${script}>
    <elf-defaults-provider :defaults.prop=${outerDefaults}>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:14px;width:100%;max-width:820px">
        <section style="display:grid;align-content:start;gap:12px;padding:16px;border:1px solid var(--elf-border);border-radius:8px;background:var(--elf-bg-paper)">
          <strong>外层默认</strong>
          <elf-button>Secondary / outlined / sm</elf-button>
          <elf-tag>Inherited tag</elf-tag>
        </section>
        <elf-defaults-provider :defaults.prop=${innerDefaults}>
          <section style="display:grid;align-content:start;gap:12px;padding:16px;border:1px solid var(--elf-border);border-radius:8px;background:var(--elf-bg-paper)">
            <strong>局部覆盖</strong>
            <elf-button>Success / outlined / lg</elf-button>
            <elf-tag>Tag 仍继承外层</elf-tag>
          </section>
        </elf-defaults-provider>
        <elf-defaults-provider reset :defaults.prop=${resetDefaults}>
          <section style="display:grid;align-content:start;gap:12px;padding:16px;border:1px solid var(--elf-border);border-radius:8px;background:var(--elf-bg-paper)">
            <strong>重置继承</strong>
            <elf-button>Warning / component defaults</elf-button>
            <elf-tag>Tag 恢复组件默认</elf-tag>
          </section>
        </elf-defaults-provider>
      </div>
    </elf-defaults-provider>
  </elf-playground>
`);

export { PageDefaultsProviderEx3 };
