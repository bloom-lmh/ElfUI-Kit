import { defineHtml } from "@elfui/core";

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

const overwriteDefaults = {
  Button: {
    color: "success",
    variant: "contained"
  }
};

const overwriteCode = `<elf-defaults-provider strategy="overwrite" :defaults.prop="overwriteDefaults">
  <elf-button color="danger">会被覆盖成 success</elf-button>
</elf-defaults-provider>`;

const overwriteScript = `const overwriteDefaults = {
    Button: {
        color: "success",
        variant: "contained"
    }
};`;

const PageDefaultsProviderEx2 = defineHtml(`
<elf-playground title="overwrite 覆盖策略" :code="overwriteCode" :script=${overwriteScript}>
      <elf-defaults-provider strategy="overwrite" :defaults.prop="overwriteDefaults">
        <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
          <elf-button color="danger">会被覆盖成 success</elf-button>
          <elf-button variant="text">也会统一成 contained</elf-button>
        </div>
      </elf-defaults-provider>
    </elf-playground>
`);

export { PageDefaultsProviderEx2 };
