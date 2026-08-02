# Breadcrumb Element Plus API 对标计划

- [x] 2026-07-17 组合式 BreadcrumbItem 保持独立 flex 尺寸和父级 current/last 状态；常用 Material separator-icon 名称归一为紧凑字形，避免长图标名挤压重叠。

更新时间：2026-07-15

## 对标定位

- ElfUI 组件：`Navigation/Breadcrumb` 与 `Navigation/BreadcrumbItem`。
- 2026-07-15 复核 Element Plus Breadcrumb：父级 `separator`、`separator-icon`、默认插槽；子项 `to`、`replace`、默认插槽。
- 保留 `items`、`router`、`currentPath`、`maxItems` 和字段映射作为 ElfUI 数据驱动扩展。

## 完成情况

- [x] 父级 `separator`、`separatorIcon` 和默认插槽完整实现。
- [x] 新增 `elf-breadcrumb-item`，补齐 `to`、`replace` 与默认插槽。
- [x] `to` 支持 string 和 `{ path, hash, name }` 路由对象。
- [x] 父级统一管理组合式子项的 current、last、separator 与 separatorIcon 状态。
- [x] 数据模式和组合模式共用导航入口，click 与 `update:currentPath` 只触发一次。
- [x] router 模式支持 push hash 与 replaceState；受控 currentPath、非受控内部路径和 hashchange 同步。
- [x] 数据模式继续支持字段别名、disabled 和 maxItems 折叠。
- [x] 原生 button 提供键盘与焦点语义，当前项使用 `aria-current="page"`，容器使用 nav / ol 结构。
- [x] 父子 Props、Slots、事件类型、分类注册和 PropsTable 同步。
- [x] 三个案例全部提供 Template / Script，动态绑定使用 `${...}`。

## 架构说明

- Props、状态、派生数据、子项同步、导航方法、监听器、生命周期和模板保持连续分区。
- 子项通过私有 composed 事件向父级请求导航，公共 click 只由父级发出，避免重复事件。
- 数据驱动模式与组合式模式互斥渲染，保持旧 API 兼容并提供 Element Plus 风格的组合能力。

## 验收记录

- [x] `Breadcrumb.test.ts` 9 项测试通过，覆盖分隔符、路由、受控/非受控、字段映射、折叠、图标、replace 和组合式子项。
- [x] `pnpm build` 通过。
- [x] Playwright 实测 3 个组合子项，点击后 current 切换到“首页”、last 保持正确、状态文本同步。
- [x] 页面 Template / Script 可见，浏览器控制台 0 error。
- [x] 视觉截图：`output/playwright/breadcrumb-upgrade.png`。
