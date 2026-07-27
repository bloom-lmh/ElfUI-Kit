import { defineHtml, useComponents } from "@elfui/core";
import { PageLocaleProviderPreview } from "./preview";

useComponents({ "page-locale-provider-preview": PageLocaleProviderPreview });

const enMessages = { provider: { title: "Outer English workspace" } };
const zhMessages = { provider: { title: "局部中文审批区" } };

const code = `<elf-locale-provider name="en-US" time-zone="UTC" :messages.prop="enMessages">
  <page-locale-provider-preview />
  <elf-locale-provider name="zh-CN" :messages.prop="zhMessages">
    <page-locale-provider-preview />
  </elf-locale-provider>
</elf-locale-provider>`;

const script = `const enMessages = { provider: { title: "Outer English workspace" } };
const zhMessages = { provider: { title: "局部中文审批区" } };`;

const PageLocaleProviderEx3 = defineHtml(`
  <h2>嵌套作用域与格式化</h2>
  <elf-playground title="英文工作区中的中文审批区" :code=${code} :script=${script}>
    <elf-locale-provider name="en-US" time-zone="UTC" :messages.prop=${enMessages}>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;width:100%;max-width:760px">
        <page-locale-provider-preview></page-locale-provider-preview>
        <elf-locale-provider name="zh-CN" time-zone="Asia/Shanghai" :messages.prop=${zhMessages}>
          <page-locale-provider-preview></page-locale-provider-preview>
        </elf-locale-provider>
      </div>
    </elf-locale-provider>
  </elf-playground>
`);

export { PageLocaleProviderEx3 };
