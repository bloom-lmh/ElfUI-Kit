import { defineHtml } from "@elfui/core";

const themes = {
  ocean: {
    dark: false,
    tokens: {
      primary: "#1769aa",
      primaryHover: "#0d47a1",
      bgDefault: "#eff8ff",
      bgPaper: "#ffffff",
      radiusMd: "12px",
      shadow1: "0 2px 8px rgba(23, 105, 170, 0.14)",
    },
  },
};

const config = {
  theme: { theme: "ocean", themes },
};

const code = `<elf-config-provider :config.prop="config">
  <elf-card>
    <strong>Named theme</strong>
    <p>Colors, radius and elevation come from one token map.</p>
  </elf-card>
</elf-config-provider>`;

const script = `const config = {
  theme: {
    theme: "ocean",
    themes: {
      ocean: {
        tokens: {
          primary: "#1769aa",
          radiusMd: "12px",
          shadow1: "0 2px 8px rgba(23, 105, 170, 0.14)"
        }
      }
    }
  }
};`;

const PageConfigProviderEx2 = defineHtml(`
  <elf-playground
    title="Named theme · design tokens"
    :code=${code}
    :script=${script}
  >
    <elf-config-provider :config.prop=${config}>
      <elf-card class="theme-card">
        <strong>Named theme</strong>
        <p>Colors, radius and elevation come from one token map.</p>
      </elf-card>
    </elf-config-provider>
  </elf-playground>
`);

export { PageConfigProviderEx2 };
