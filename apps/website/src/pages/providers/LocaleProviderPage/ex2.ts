import { defineHtml } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "组件级英文覆盖", en: "Component-level English override" },
});

const code = `<elf-locale-provider name="en-US">
  <elf-card variant="outlined" title="Sign in to workspace" style="width:min(380px,100%)">
    <div style="display:grid;gap:16px">
      <elf-input label="Email" type="email" model-value="lin@elfui.dev" variant="outlined"></elf-input>
      <elf-input label="Password" type="password" model-value="12345678" variant="outlined"></elf-input>
      <elf-checkbox label="Remember me" model-value="true"></elf-checkbox>
      <elf-button type="primary" block>Sign in</elf-button>
    </div>
  </elf-card>
</elf-locale-provider>`;

const script = `// The English override only affects this subtree.
// 英文覆盖只影响当前子树。`;

const PageLocaleProviderEx2 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <elf-locale-provider name="en-US">
      <elf-card
        variant="outlined"
        title="Sign in to workspace"
        style="width:min(380px,100%);margin-inline:auto"
      >
        <div style="display:grid;gap:16px">
          <elf-input label="Email" type="email" model-value="lin@elfui.dev" variant="outlined"></elf-input>
          <elf-input label="Password" type="password" model-value="12345678" variant="outlined"></elf-input>
          <elf-checkbox label="Remember me" :modelValue.prop=${true}></elf-checkbox>
          <elf-button type="primary" block>Sign in</elf-button>
        </div>
      </elf-card>
    </elf-locale-provider>
  </elf-playground>
`);

export { PageLocaleProviderEx2 };
