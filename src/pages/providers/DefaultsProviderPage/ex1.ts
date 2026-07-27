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

const basicCode = `<elf-defaults-provider :defaults.prop="defaults">
  <elf-button>继承默认按钮</elf-button>
  <elf-button color="danger">显式属性优先</elf-button>
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
<elf-playground title="默认属性下发" :code="basicCode" :script=${basicScript}>
      <elf-defaults-provider :defaults.prop="defaults">
        <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
          <elf-button>继承默认按钮</elf-button>
          <elf-button color="danger">显式属性优先</elf-button>
          <elf-tag>继承 Tag 默认值</elf-tag>
        </div>
      </elf-defaults-provider>
    </elf-playground>
`);

export { PageDefaultsProviderEx1 };
