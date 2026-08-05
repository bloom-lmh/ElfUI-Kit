import { defineHtml } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "组件级英文覆盖", en: "Component-level English override" },
});

const options = [
  { label: "Design", value: "design" },
  { label: "Development", value: "development" },
];

const code = `<elf-locale-provider name="en-US">
  <elf-card variant="outlined" style="width:100%">
    <div style="display:grid;gap:16px">
      <elf-select :options.prop="options"></elf-select>
      <elf-date-picker></elf-date-picker>
      <elf-time-picker></elf-time-picker>
      <elf-cascader></elf-cascader>
      <elf-tree bordered></elf-tree>
      <elf-virtual-list height="96"></elf-virtual-list>
      <elf-upload :auto-upload="false"></elf-upload>
      <elf-pagination total="96" show-total show-jumper></elf-pagination>
    </div>
  </elf-card>
</elf-locale-provider>`;

const script = `const options = [
    { label: "Design", value: "design" },
    { label: "Development", value: "development" }
];`;

const PageLocaleProviderEx2 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <elf-locale-provider name="en-US">
      <elf-card variant="outlined" style="width:100%">
        <div style="display:grid;gap:16px">
          <elf-select :options.prop=${options}></elf-select>
          <elf-date-picker></elf-date-picker>
          <elf-time-picker></elf-time-picker>
          <elf-cascader></elf-cascader>
          <elf-tree bordered></elf-tree>
          <elf-virtual-list height="96"></elf-virtual-list>
          <elf-upload :auto-upload=${false}></elf-upload>
          <elf-pagination total="96" show-total show-jumper></elf-pagination>
        </div>
      </elf-card>
    </elf-locale-provider>
  </elf-playground>
`);

export { PageLocaleProviderEx2 };
