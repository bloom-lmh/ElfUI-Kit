import { defineHtml } from "@elfui/core";

const blueprint = {
  defaults: {
    global: { size: "sm" },
    "elf-button": { variant: "outlined" },
  },
};

const config = {
  theme: { theme: "light" },
  locale: { name: "en-US" },
};

const code = `<elf-config-provider :blueprint.prop="blueprint" :config.prop="config">
  <elf-button>Uses the blueprint</elf-button>
  <elf-button variant="contained">Explicit props still win</elf-button>
</elf-config-provider>`;

const script = `const blueprint = {
  defaults: {
    global: { size: "sm" },
    "elf-button": { variant: "outlined" }
  }
};
const config = {
  theme: { theme: "light" },
  locale: { name: "en-US" }
};`;

const PageConfigProviderEx1 = defineHtml(`
  <elf-playground
    title="One entry point · blueprint and defaults"
    :code=${code}
    :script=${script}
  >
    <elf-config-provider :blueprint.prop=${blueprint} :config.prop=${config}>
      <div class="config-demo-actions">
        <elf-button>Uses the blueprint</elf-button>
        <elf-button variant="contained">Explicit props win</elf-button>
      </div>
    </elf-config-provider>
  </elf-playground>
`);

export { PageConfigProviderEx1 };
