// 应用入口
//
// 1. 注册组件库（components/* 副作用导入）
// 2. 注册页面（pages/* 副作用导入，由 routes 间接触发）
// 3. 创建路由
// 4. 注册应用壳 elf-app
// 5. 引入自动生成的类型增强（HTMLElementTagNameMap）

import "./components";
/* import "./elements.generated"; */

import { createRouter } from "@elfui/router";
import { registerComponents } from "@elfui/core";
import { registerAllComponents } from "@elfui/kit";

import { App } from "./app/AppShell/index";
import { routes } from "./routes";

registerAllComponents();

// Create the router before upgrading the existing <elf-app> element so AppShell
// can subscribe to the initial route and keep its menu state controlled.
createRouter({
  mode: "hash",
  routes,
});

registerComponents(App);
