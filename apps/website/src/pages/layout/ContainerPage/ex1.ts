import { defineHtml } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "最大宽度档位", en: "Maximum-width presets" },
});

const code1 = `<elf-container max-width="xs">xs (480px)</elf-container>
<elf-container max-width="sm">sm (600px)</elf-container>
<elf-container max-width="md">md (900px)</elf-container>
<elf-container max-width="lg">lg (1200px)</elf-container>
<elf-container max-width="xl">xl (1536px)</elf-container>`;

const PageContainerEx1 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("title")} :code=${code1}>
    <elf-container max-width="xs" style="border:1px dashed var(--elf-border-strong);border-radius:4px;background:transparent;margin:4px 0"
      >xs (480px)</elf-container
    >
    <elf-container max-width="sm" style="border:1px dashed var(--elf-border-strong);border-radius:4px;background:transparent;margin:4px 0"
      >sm (600px)</elf-container
    >
    <elf-container max-width="md" style="border:1px dashed var(--elf-border-strong);border-radius:4px;background:transparent;margin:4px 0"
      >md (900px)</elf-container
    >
    <elf-container max-width="lg" style="border:1px dashed var(--elf-border-strong);border-radius:4px;background:transparent;margin:4px 0"
      >lg (1200px)</elf-container
    >
    <elf-container max-width="xl" style="border:1px dashed var(--elf-border-strong);border-radius:4px;background:transparent;margin:4px 0"
      >xl (1536px)</elf-container
    >
  </elf-playground>
`);

export { PageContainerEx1 };
