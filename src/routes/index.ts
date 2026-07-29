// 路由表

import type { RouteRecord } from "@elfui/router";

export const routes: RouteRecord[] = [
  {
    path: "/",
    name: "home",
    component: () => import("../pages/HomePage/index")
  },

  // Guide
  {
    path: "/guide/accessibility",
    component: () => import("../pages/guide/AccessibilityPage/index")
  },
  {
    path: "/guide/build",
    component: () => import("../pages/guide/BuildStylesPage/index")
  },

  // Layout
  {
    path: "/layout/container",
    component: () => import("../pages/layout/GridPage/index")
  },
  {
    path: "/layout/flex",
    component: () => import("../pages/layout/FlexPage/index")
  },
  {
    path: "/layout/space",
    component: () => import("../pages/layout/FlexPage/index")
  },
  {
    path: "/layout/grid",
    component: () => import("../pages/layout/GridPage/index")
  },
  {
    path: "/layout/shell",
    component: () => import("../pages/layout/LayoutShellPage/index")
  },
  {
    path: "/layout/sticky",
    component: () => import("../pages/layout/StickyPage/index")
  },
  {
    path: "/layout/splitter",
    component: () => import("../pages/layout/SplitterPage/index")
  },
  {
    path: "/layout/scrollbar",
    component: () => import("../pages/layout/ScrollbarPage/index")
  },
  {
    path: "/layout/masonry",
    component: () => import("../pages/layout/MasonryPage/index")
  },

  // Basic
  {
    path: "/basic/button",
    component: () => import("../pages/basic/ButtonPage/index")
  },
  {
    path: "/basic/link",
    component: () => import("../pages/basic/LinkPage/index")
  },
  {
    path: "/basic/icon",
    component: () => import("../pages/basic/IconPage/index")
  },
  {
    path: "/basic/text",
    component: () => import("../pages/basic/TextPage/index")
  },
  {
    path: "/basic/tag",
    component: () => import("../pages/basic/TagPage/index")
  },
  {
    path: "/basic/badge",
    component: () => import("../pages/basic/BadgePage/index")
  },
  {
    path: "/basic/avatar",
    component: () => import("../pages/basic/AvatarPage/index")
  },

  // Form
  {
    path: "/form/input",
    component: () => import("../pages/form/InputPage/index")
  },
  {
    path: "/form/input-otp",
    component: () => import("../pages/form/InputOtpPage/index")
  },
  {
    path: "/form/input-tag",
    component: () => import("../pages/form/InputTagPage/index")
  },
  {
    path: "/form/autocomplete",
    component: () => import("../pages/form/AutocompletePage/index")
  },
  {
    path: "/form/mention",
    component: () => import("../pages/form/MentionPage/index")
  },
  {
    path: "/form/input-number",
    component: () => import("../pages/form/InputNumberPage/index")
  },
  {
    path: "/form/textarea",
    component: () => import("../pages/form/TextareaPage/index")
  },
  {
    path: "/form/switch",
    component: () => import("../pages/form/SwitchPage/index")
  },
  {
    path: "/form/checkbox",
    component: () => import("../pages/form/CheckboxPage/index")
  },
  {
    path: "/form/radio",
    component: () => import("../pages/form/RadioPage/index")
  },
  {
    path: "/form/select",
    component: () => import("../pages/form/SelectPage/index")
  },
  {
    path: "/form/tree-select",
    component: () => import("../pages/form/TreeSelectPage/index")
  },
  {
    path: "/form/segmented",
    component: () => import("../pages/form/SegmentedPage/index")
  },
  {
    path: "/form/cascader",
    component: () => import("../pages/form/CascaderPage/index")
  },
  {
    path: "/form/form",
    component: () => import("../pages/form/FormPage/index")
  },
  {
    path: "/form/upload",
    component: () => import("../pages/form/UploadPage/index")
  },
  {
    path: "/form/rate",
    component: () => import("../pages/form/RatePage/index")
  },
  {
    path: "/form/slider",
    component: () => import("../pages/form/SliderPage/index")
  },
  {
    path: "/form/debug",
    component: () => import("../pages/form/DebugPage/index")
  },

  // Feedback
  {
    path: "/feedback/alert",
    component: () => import("../pages/feedback/AlertPage/index")
  },
  {
    path: "/feedback/loading",
    component: () => import("../pages/feedback/LoadingPage/index")
  },
  {
    path: "/feedback/message",
    component: () => import("../pages/feedback/MessagePage/index")
  },
  {
    path: "/feedback/message-box",
    component: () => import("../pages/feedback/MessageBoxPage/index")
  },
  {
    path: "/feedback/dialog",
    component: () => import("../pages/feedback/DialogPage/index")
  },
  {
    path: "/feedback/drawer",
    component: () => import("../pages/feedback/DrawerPage/index")
  },
  {
    path: "/feedback/notification",
    component: () => import("../pages/feedback/NotificationPage/index")
  },
  {
    path: "/feedback/tooltip",
    component: () => import("../pages/feedback/TooltipPage/index")
  },
  {
    path: "/feedback/pop-confirm",
    component: () => import("../pages/feedback/PopConfirmPage/index")
  },
  {
    path: "/feedback/tour",
    component: () => import("../pages/feedback/TourPage/index")
  },

  // Data
  {
    path: "/data/divider",
    component: () => import("../pages/data/DividerPage/index")
  },
  {
    path: "/data/empty",
    component: () => import("../pages/data/EmptyPage/index")
  },
  {
    path: "/data/result",
    component: () => import("../pages/data/ResultPage/index")
  },
  {
    path: "/data/collapse",
    component: () => import("../pages/data/CollapsePage/index")
  },
  {
    path: "/data/descriptions",
    component: () => import("../pages/data/DescriptionsPage/index")
  },
  {
    path: "/data/statistic",
    component: () => import("../pages/data/StatisticPage/index")
  },
  {
    path: "/data/watermark",
    component: () => import("../pages/data/WatermarkPage/index")
  },
  {
    path: "/data/infinite-scroll",
    component: () => import("../pages/data/InfiniteScrollPage/index")
  },
  {
    path: "/data/image",
    component: () => import("../pages/data/ImagePage/index")
  },
  {
    path: "/data/parallax",
    component: () => import("../pages/data/ParallaxPage/index")
  },
  {
    path: "/data/transfer",
    component: () => import("../pages/data/TransferPage/index")
  },
  {
    path: "/data/card",
    component: () => import("../pages/data/CardPage/index")
  },
  {
    path: "/data/pagination",
    component: () => import("../pages/data/PaginationPage/index")
  },
  {
    path: "/data/progress",
    component: () => import("../pages/data/ProgressPage/index")
  },
  {
    path: "/data/table",
    component: () => import("../pages/data/TablePage/index")
  },
  {
    path: "/data/virtual-table",
    component: () => import("../pages/data/VirtualTablePage/index")
  },
  {
    path: "/data/list",
    component: () => import("../pages/data/ListPage/index")
  },
  {
    path: "/data/virtual-list",
    component: () => import("../pages/data/VirtualListPage/index")
  },
  {
    path: "/data/skeleton",
    component: () => import("../pages/data/SkeletonPage/index")
  },
  {
    path: "/data/carousel",
    component: () => import("../pages/data/CarouselPage/index")
  },
  {
    path: "/data/timeline",
    component: () => import("../pages/data/TimelinePage/index")
  },
  {
    path: "/data/tree",
    component: () => import("../pages/data/TreePage/index")
  },

  // Navigation
  {
    path: "/navigation/anchor",
    component: () => import("../pages/navigation/AnchorPage/index")
  },
  {
    path: "/navigation/backtop",
    component: () => import("../pages/navigation/BackTopPage/index")
  },
  {
    path: "/navigation/breadcrumb",
    component: () => import("../pages/navigation/BreadcrumbPage/index")
  },
  {
    path: "/navigation/dropdown",
    component: () => import("../pages/navigation/DropdownPage/index")
  },
  {
    path: "/navigation/menu",
    component: () => import("../pages/navigation/MenuPage/index")
  },
  {
    path: "/navigation/tabs",
    component: () => import("../pages/navigation/TabsPage/index")
  },
  {
    path: "/navigation/steps",
    component: () => import("../pages/navigation/StepsPage/index")
  },
  {
    path: "/navigation/page-header",
    component: () => import("../pages/navigation/PageHeaderPage/index")
  },

  // Picker
  {
    path: "/picker/color",
    component: () => import("../pages/picker/ColorPickerPage/index")
  },
  {
    path: "/picker/date",
    component: () => import("../pages/picker/DatePickerPage/index")
  },
  {
    path: "/picker/time",
    component: () => import("../pages/picker/TimePickerPage/index")
  },
  {
    path: "/picker/calendar",
    component: () => import("../pages/picker/CalendarPage/index")
  },

  // Providers
  {
    path: "/providers/config",
    component: () => import("../pages/providers/ConfigProviderPage/index")
  },
  {
    path: "/providers/defaults",
    component: () => import("../pages/providers/DefaultsProviderPage/index")
  },
  {
    path: "/providers/locale",
    component: () => import("../pages/providers/LocaleProviderPage/index")
  },
  {
    path: "/providers/theme",
    component: () => import("../pages/providers/ThemeProviderPage/index")
  },

  // Utilities
  {
    path: "/utilities",
    component: () => import("../pages/utilities/UtilitiesPage/index")
  },
  ...[
    "borders", "border-radius", "content", "cursor", "display", "elevation", "flex",
    "float", "opacity", "overflow", "position", "sizing", "spacing", "typography"
  ].map((section) => ({
    path: `/utilities/${section}`,
    component: () => import("../pages/utilities/UtilitiesPage/index")
  }))
];

export interface NavItem {
  to: string;
  text: string;
  group?: string;
}

export const navItems: NavItem[] = [
  { to: "/providers/config", text: "Global configuration 全局配置", group: "Guide 指南" },
  { to: "/providers/theme", text: "Theme & customization 主题与个性化", group: "Guide 指南" },
  { to: "/basic/icon", text: "Icons 图标配置", group: "Guide 指南" },
  { to: "/providers/locale", text: "Internationalization 国际化", group: "Guide 指南" },
  { to: "/guide/accessibility", text: "Accessibility 无障碍", group: "Guide 指南" },
  { to: "/guide/build", text: "Build & styles 构建与样式", group: "Guide 指南" },

  { to: "/layout/grid", text: "Grid 栅格", group: "Layout 布局" },
  { to: "/layout/flex", text: "Flex 弹性布局", group: "Layout 布局" },
  { to: "/layout/shell", text: "Layout 应用骨架", group: "Layout 布局" },
  { to: "/layout/sticky", text: "Sticky 吸附", group: "Layout 布局" },
  { to: "/layout/splitter", text: "Splitter 分割面板", group: "Layout 布局" },
  { to: "/layout/scrollbar", text: "Scrollbar 滚动条", group: "Layout 布局" },
  { to: "/layout/masonry", text: "Masonry 瀑布流", group: "Layout 布局" },

  { to: "/basic/button", text: "Button 按钮", group: "Basic 基础" },
  { to: "/basic/link", text: "Link 链接", group: "Basic 基础" },
  { to: "/basic/text", text: "Text 文本", group: "Basic 基础" },
  { to: "/basic/tag", text: "Tag 标签", group: "Basic 基础" },
  { to: "/basic/badge", text: "Badge 徽章", group: "Basic 基础" },
  { to: "/basic/avatar", text: "Avatar 头像", group: "Basic 基础" },

  { to: "/form/input", text: "Input 输入框", group: "Form 表单" },
  { to: "/form/input-otp", text: "InputOtp 一次性密码", group: "Form 表单" },
  { to: "/form/input-tag", text: "InputTag 标签输入", group: "Form 表单" },
  { to: "/form/autocomplete", text: "Autocomplete 自动补全", group: "Form 表单" },
  { to: "/form/mention", text: "Mention 提及", group: "Form 表单" },
  { to: "/form/input-number", text: "InputNumber 数字输入", group: "Form 表单" },
  { to: "/form/textarea", text: "Textarea 多行文本", group: "Form 表单" },
  { to: "/form/switch", text: "Switch 开关", group: "Form 表单" },
  { to: "/form/checkbox", text: "Checkbox 复选框", group: "Form 表单" },
  { to: "/form/radio", text: "Radio 单选", group: "Form 表单" },
  { to: "/form/select", text: "Select 选择器", group: "Form 表单" },
  { to: "/form/tree-select", text: "TreeSelect 树选择器", group: "Form 表单" },
  { to: "/form/segmented", text: "Segmented 分段控制", group: "Form 表单" },
  { to: "/form/cascader", text: "Cascader 级联选择器", group: "Form 表单" },
  { to: "/form/form", text: "Form 表单容器", group: "Form 表单" },
  { to: "/form/upload", text: "Upload 上传", group: "Form 表单" },
  { to: "/form/rate", text: "Rate 评分", group: "Form 表单" },
  { to: "/form/slider", text: "Slider 滑块", group: "Form 表单" },

  { to: "/feedback/alert", text: "Alert 警告提示", group: "Feedback 反馈" },
  { to: "/feedback/loading", text: "Loading 加载", group: "Feedback 反馈" },
  { to: "/feedback/message", text: "Message 全局提示", group: "Feedback 反馈" },
  { to: "/feedback/message-box", text: "MessageBox 消息框", group: "Feedback 反馈" },
  { to: "/feedback/dialog", text: "Dialog 对话框", group: "Feedback 反馈" },
  { to: "/feedback/drawer", text: "Drawer 抽屉", group: "Feedback 反馈" },
  { to: "/feedback/notification", text: "Notification 通知", group: "Feedback 反馈" },
  { to: "/feedback/tooltip", text: "Tooltip 文字提示", group: "Feedback 反馈" },
  { to: "/feedback/pop-confirm", text: "PopConfirm 气泡确认", group: "Feedback 反馈" },
  { to: "/feedback/tour", text: "Tour 漫游式引导", group: "Feedback 反馈" },

  { to: "/data/divider", text: "Divider 分割线", group: "Data 数据展示" },
  { to: "/data/empty", text: "Empty 空状态", group: "Data 数据展示" },
  { to: "/data/result", text: "Result 结果", group: "Data 数据展示" },
  { to: "/data/collapse", text: "Collapse 折叠面板", group: "Data 数据展示" },
  { to: "/data/descriptions", text: "Descriptions 描述列表", group: "Data 数据展示" },
  { to: "/data/statistic", text: "Statistic 统计数值", group: "Data 数据展示" },
  { to: "/data/watermark", text: "Watermark 水印", group: "Data 数据展示" },
  { to: "/data/infinite-scroll", text: "InfiniteScroll 无限滚动", group: "Data 数据展示" },
  { to: "/data/image", text: "Image 图片", group: "Data 数据展示" },
  { to: "/data/parallax", text: "Parallax 视差滚动", group: "Data 数据展示" },
  { to: "/data/transfer", text: "Transfer 穿梭框", group: "Data 数据展示" },
  { to: "/data/card", text: "Card 卡片", group: "Data 数据展示" },
  { to: "/data/pagination", text: "Pagination 分页", group: "Data 数据展示" },
  { to: "/data/progress", text: "Progress 进度条", group: "Data 数据展示" },
  { to: "/data/table", text: "Table 表格", group: "Data 数据展示" },
  { to: "/data/virtual-table", text: "VirtualTable 虚拟表格", group: "Data 数据展示" },
  { to: "/data/list", text: "List 列表", group: "Data 数据展示" },
  { to: "/data/virtual-list", text: "VirtualList 虚拟列表", group: "Data 数据展示" },
  { to: "/data/skeleton", text: "Skeleton 骨架屏", group: "Data 数据展示" },
  { to: "/data/carousel", text: "Carousel 轮播图", group: "Data 数据展示" },
  { to: "/data/timeline", text: "Timeline 时间轴", group: "Data 数据展示" },
  { to: "/data/tree", text: "Tree 树", group: "Data 数据展示" },

  { to: "/navigation/anchor", text: "Anchor 锚点", group: "Navigation 导航" },
  { to: "/navigation/backtop", text: "BackTop 回到顶部", group: "Navigation 导航" },
  { to: "/navigation/breadcrumb", text: "Breadcrumb 面包屑", group: "Navigation 导航" },
  { to: "/navigation/dropdown", text: "Dropdown 下拉菜单", group: "Navigation 导航" },
  { to: "/navigation/menu", text: "Menu 导航菜单", group: "Navigation 导航" },
  { to: "/navigation/tabs", text: "Tabs 标签页", group: "Navigation 导航" },
  { to: "/navigation/steps", text: "Steps 步骤条", group: "Navigation 导航" },
  { to: "/navigation/page-header", text: "PageHeader 页头", group: "Navigation 导航" },

  { to: "/picker/color", text: "ColorPicker 颜色", group: "Picker 选择器" },
  { to: "/picker/date", text: "DatePicker 日期", group: "Picker 选择器" },
  { to: "/picker/time", text: "TimePicker 时间", group: "Picker 选择器" },
  { to: "/picker/calendar", text: "Calendar 日历", group: "Picker 选择器" },

  { to: "/utilities", text: "Utilities 工具类", group: "Utilities 工具类" }
];
