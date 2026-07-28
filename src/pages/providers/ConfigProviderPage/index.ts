import { defineHtml, defineStyle, useComponents } from "@elfui/core";

import { PageConfigProviderEx1 } from "./ex1";
import { PageConfigProviderEx2 } from "./ex2";
import { PageConfigProviderEx3 } from "./ex3";
import { PageConfigProviderEx4 } from "./ex4";
import pageStyles from "./style.scss?inline";

const propsRows = [
  { name: "config", type: "ElfUIConfig", default: "{}", desc: "统一配置 defaults、theme、locale、icons、display、motion 和 goTo" },
  { name: "blueprint", type: "ElfUIConfig", default: "{}", desc: "作为基础预设，在 config 之前合并" },
  { name: "inherit", type: "boolean", default: "true", desc: "是否继承外层 ConfigProvider" },
  { name: "theme", type: "string", default: "—", desc: "config.theme.theme 的快捷写法" },
  { name: "locale", type: "string", default: "—", desc: "config.locale.name 的快捷写法" },
  { name: "motion", type: "system | full | reduced", default: "system", desc: "统一动效偏好" },
];

useComponents({
  "page-config-provider-ex1": PageConfigProviderEx1,
  "page-config-provider-ex2": PageConfigProviderEx2,
  "page-config-provider-ex3": PageConfigProviderEx3,
  "page-config-provider-ex4": PageConfigProviderEx4,
});

defineStyle(pageStyles);

const PageConfigProvider = defineHtml(`
  <elf-container>
    <h1>Global configuration 全局配置</h1>
    <p>
      ConfigProvider 是应用级统一入口，用于下发默认 props、主题 token、语言、图标、响应式断点和动效偏好；
      DefaultsProvider 等细粒度 Provider 作为进阶实现保留，不再重复占用侧栏入口。
    </p>

    <page-config-provider-ex1 />
    <page-config-provider-ex2 />
    <page-config-provider-ex3 />
    <page-config-provider-ex4 />

    <h2>API</h2>
    <elf-props-table title="ConfigProvider Props" :rows="propsRows"></elf-props-table>
  </elf-container>
`);

export { PageConfigProvider };
