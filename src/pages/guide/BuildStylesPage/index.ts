import { defineHtml, defineStyle, useComponents } from "@elfui/core";

import { PageBuildStylesEx1 } from "./ex1";
import { PageBuildStylesEx2 } from "./ex2";
import pageStyles from "./style.scss?inline";

const buildRows = [
  { name: "@elfui/kit", type: "JavaScript + types", default: "required", desc: "组件、Provider 和公开类型的稳定入口" },
  { name: "@elfui/kit/styles/utilities.css", type: "CSS", default: "optional", desc: "Utilities 工具类入口；未使用时无需引入" },
  { name: "CSS reset", type: "application concern", default: "not bundled", desc: "由应用控制，避免全局重置意外影响宿主页面" },
  { name: "Theme tokens", type: "ConfigProvider / ThemeProvider", default: "inherited", desc: "颜色、圆角、阴影和动效在主题章节统一配置" }
];

useComponents({
  "page-build-styles-ex1": PageBuildStylesEx1,
  "page-build-styles-ex2": PageBuildStylesEx2
});

defineStyle(pageStyles);

const PageBuildStyles = defineHtml(`
  <elf-container class="build-styles-page">
    <h1>Build & styles 构建与样式</h1>
    <p class="page-lead">
      本页只说明构建入口、全局样式边界和层级策略。主题 token 归入 Theme & customization，
      具体工具类归入 Utilities，避免同一能力在多个章节重复维护。
    </p>

    <page-build-styles-ex1 />
    <page-build-styles-ex2 />

    <h2>公开契约</h2>
    <elf-props-table title="Build contract" :rows=${buildRows} />
  </elf-container>
`);

export { PageBuildStyles };
