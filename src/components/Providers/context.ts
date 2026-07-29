import { createInjectionKey, inject } from "@elfui/core";

export type ProviderDefaults = Record<string, Record<string, unknown>>;
export type DefaultsStrategy = "missing" | "overwrite";

export interface DefaultsProviderContext {
  readonly defaults: ProviderDefaults;
  readonly disabled: boolean;
  readonly strategy: DefaultsStrategy;
  applyDefaults(root?: ParentNode): void;
}

export type LocaleDirection = "ltr" | "rtl";
export type LocaleMessages = Record<string, unknown>;

export interface LocaleProviderContext {
  readonly name: string;
  readonly dir: LocaleDirection;
  readonly messages: LocaleMessages;
  t(path: string, params?: Record<string, string | number>): string;
  formatNumber(value: number, options?: Intl.NumberFormatOptions): string;
  formatDate(value: Date | number | string, options?: Intl.DateTimeFormatOptions): string;
}

export type ThemeTokenValue = string | number;

export type ThemeTokens = Partial<{
  primary: string;
  primaryHover: string;
  primaryActive: string;
  secondary: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  textPrimary: string;
  textSecondary: string;
  textDisabled: string;
  textOnPrimary: string;
  bgDefault: string;
  bgPaper: string;
  bgOverlay: string;
  fieldBg: string;
  fieldHoverBg: string;
  border: string;
  borderStrong: string;
  divider: string;
  overlayBackdrop: string;
  fontFamily: string;
  fontSizeXs: string;
  fontSizeSm: string;
  fontSizeMd: string;
  fontSizeLg: string;
  fontSizeXl: string;
  lineHeightMd: string | number;
  radiusSm: string;
  radiusMd: string;
  radiusLg: string;
  radiusPill: string;
  space1: string;
  space2: string;
  space3: string;
  space4: string;
  space5: string;
  space6: string;
  space8: string;
  shadow1: string;
  shadow2: string;
  shadow4: string;
  transitionFast: string;
  transitionBase: string;
  transitionSlow: string;
  zIndexDropdown: string | number;
  zIndexPopover: string | number;
  zIndexModal: string | number;
  zIndexToast: string | number;
  zIndexLoading: string | number;
}>;

export interface ThemeProviderContext {
  readonly theme: string;
  readonly isDark: boolean;
  readonly tokens: ThemeTokens;
  applyTo(target: HTMLElement): void;
}

export const THEME_TOKEN_VARS: Record<keyof ThemeTokens, string> = {
  primary: "--elf-primary",
  primaryHover: "--elf-primary-hover",
  primaryActive: "--elf-primary-active",
  secondary: "--elf-secondary",
  success: "--elf-success",
  warning: "--elf-warning",
  danger: "--elf-danger",
  info: "--elf-info",
  textPrimary: "--elf-text-primary",
  textSecondary: "--elf-text-secondary",
  textDisabled: "--elf-text-disabled",
  textOnPrimary: "--elf-text-on-primary",
  bgDefault: "--elf-bg-default",
  bgPaper: "--elf-bg-paper",
  bgOverlay: "--elf-bg-overlay",
  fieldBg: "--elf-field-bg",
  fieldHoverBg: "--elf-field-hover-bg",
  border: "--elf-border",
  borderStrong: "--elf-border-strong",
  divider: "--elf-divider",
  overlayBackdrop: "--elf-overlay-backdrop",
  fontFamily: "--elf-font-family",
  fontSizeXs: "--elf-font-size-xs",
  fontSizeSm: "--elf-font-size-sm",
  fontSizeMd: "--elf-font-size-md",
  fontSizeLg: "--elf-font-size-lg",
  fontSizeXl: "--elf-font-size-xl",
  lineHeightMd: "--elf-line-height-md",
  radiusSm: "--elf-radius-sm",
  radiusMd: "--elf-radius-md",
  radiusLg: "--elf-radius-lg",
  radiusPill: "--elf-radius-pill",
  space1: "--elf-space-1",
  space2: "--elf-space-2",
  space3: "--elf-space-3",
  space4: "--elf-space-4",
  space5: "--elf-space-5",
  space6: "--elf-space-6",
  space8: "--elf-space-8",
  shadow1: "--elf-shadow-1",
  shadow2: "--elf-shadow-2",
  shadow4: "--elf-shadow-4",
  transitionFast: "--elf-transition-fast",
  transitionBase: "--elf-transition-base",
  transitionSlow: "--elf-transition-slow",
  zIndexDropdown: "--elf-z-index-dropdown",
  zIndexPopover: "--elf-z-index-popover",
  zIndexModal: "--elf-z-index-modal",
  zIndexToast: "--elf-z-index-toast",
  zIndexLoading: "--elf-z-index-loading",
};

export const applyThemeTokens = (target: HTMLElement, tokens: ThemeTokens): void => {
  for (const [key, value] of Object.entries(tokens) as Array<
    [keyof ThemeTokens, ThemeTokenValue]
  >) {
    const variable = THEME_TOKEN_VARS[key];
    if (variable && value !== undefined && value !== null && value !== "") {
      target.style.setProperty(variable, String(value));
    }
  }
};

export const DEFAULTS_PROVIDER_KEY =
  createInjectionKey<DefaultsProviderContext>("elfui.defaults-provider");
export const LOCALE_PROVIDER_KEY =
  createInjectionKey<LocaleProviderContext>("elfui.locale-provider");
export const THEME_PROVIDER_KEY = createInjectionKey<ThemeProviderContext>("elfui.theme-provider");

export const DEFAULT_LOCALE_MESSAGES: LocaleMessages = {
  common: {
    confirm: "确认",
    cancel: "取消",
    clear: "清空",
    close: "关闭",
    submit: "提交",
    done: "完成",
    next: "下一步",
    previous: "上一步",
    skip: "跳过",
    reset: "重置",
    search: "搜索",
    noResults: "暂无结果",
    select: "请选择",
    preview: "预览",
    remove: "移除",
    retry: "重试",
    expand: "展开",
    collapse: "收起"
  },
  table: {
    empty: "暂无数据",
    loading: "加载中",
    sum: "合计",
    actions: "操作",
    selectAll: "全选",
    selectRow: "选择行",
    expandRow: "展开行",
    loadingChildren: "正在加载子节点",
    collapseChildren: "收起子节点",
    expandChildren: "展开子节点",
    currentColumn: "当前列",
    resizeColumn: "{column}，调整列宽",
    ascending: "升序",
    descending: "降序",
    unsorted: "未排序",
    sortState: "{column}：{state}",
    filter: "{column}，筛选",
    filterSelected: "{column}，已选择 {count} 个筛选条件",
    filterOptions: "{column}筛选选项"
  },
  field: {
    noMatch: "无匹配项",
    validating: "校验中..."
  },
  datePicker: {
    placeholder: "选择日期",
    endPlaceholder: "结束日期",
    selectedCount: "已选择 {count} 个日期",
    multiple: "多日期选择",
    range: "日期范围",
    month: "选择月份",
    yearSuffix: "{year}年",
    rangeSeparator: "至"
  },
  timePicker: {
    placeholder: "选择时间",
    startPlaceholder: "开始时间",
    endPlaceholder: "结束时间",
    rangeSeparator: "至",
    selectHour: "选择小时",
    selectMinute: "选择分钟",
    selectSecond: "选择秒"
  },
  calendar: {
    year: "{year}年",
    month: "{month}月",
    previousPeriod: "上一时间段",
    nextPeriod: "下一时间段",
    selectMonth: "选择月份",
    selectYear: "选择年份",
    today: "今天"
  },
  pagination: {
    navigation: "分页导航",
    total: "共 {total} 条",
    page: "第 {page} 页",
    jumpTo: "跳转到第 {page} 页",
    perPage: "{size} 条/页",
    previous: "上一页",
    next: "下一页",
    pageSize: "每页条数",
    goTo: "前往",
    jumpPage: "跳转页码",
    pageSuffix: "页"
  },
  upload: {
    choose: "选择文件",
    drop: "拖拽文件到这里，或点击上传",
    start: "开始上传",
    limit: "最多只能选择 {limit} 个文件",
    invalidType: "{name} 不符合文件类型要求",
    sizeExceeded: "{name} 超过大小限制",
    invalidPattern: "fileNamePattern 不是有效正则",
    invalidName: "{name} 不符合文件名规则",
    rejected: "{name} 未通过上传前检查",
    failed: "上传失败",
    missingFile: "缺少原始文件，无法分片上传",
    cancelled: "上传已取消",
    directoryHint: "目录上传依赖浏览器的文件夹选择能力；不支持时请改用多文件上传。"
  },
  tour: {
    close: "关闭引导"
  },
  menu: {
    label: "导航菜单",
    search: "搜索...",
    expand: "展开菜单",
    collapse: "折叠菜单"
  },
  carousel: {
    previous: "上一张",
    next: "下一张",
    pagination: "轮播页选择",
    goTo: "切换到第 {page} 张"
  },
  loading: {
    active: "正在加载",
    exitFullscreen: "退出全屏加载"
  },
  tree: {
    search: "搜索节点"
  },
  rate: {
    terrible: "极差",
    disappointed: "失望",
    fair: "一般",
    satisfied: "满意",
    surprised: "惊喜",
    score: "评分 {score}",
    clear: "清空评分"
  },
  a11y: {
    closeTag: "关闭标签",
    closeMessage: "关闭提示",
    closeNotification: "关闭通知",
    closeDrawer: "关闭抽屉",
    resizeDrawer: "调整抽屉尺寸",
    closeDialog: "关闭对话框",
    closeMessageBox: "关闭消息框",
    messageBoxTitle: "消息框",
    breadcrumb: "面包屑",
    status: "状态提示",
    addTab: "新增标签",
    expandFirstPanel: "展开第一个面板",
    collapseFirstPanel: "折叠第一个面板",
    collapsed: "已折叠",
    additionalAvatars: "{count} 个未显示头像",
    imagePending: "图片将在进入视口后加载",
    anchorNavigation: "锚点导航"
  },
  playground: {
    source: "示例源码",
    copy: "复制",
    copied: "已复制",
    controls: "配置",
    collapseControls: "收起配置面板",
    expandControls: "展开配置面板",
    name: "名称",
    type: "类型",
    default: "默认值",
    description: "说明"
  },
  splitter: {
    size: "{size}%"
  }
};

export const EN_LOCALE_MESSAGES: LocaleMessages = {
  common: {
    confirm: "Confirm",
    cancel: "Cancel",
    clear: "Clear",
    close: "Close",
    submit: "Submit",
    done: "Done",
    next: "Next",
    previous: "Previous",
    skip: "Skip",
    reset: "Reset",
    search: "Search",
    noResults: "No results",
    select: "Select",
    preview: "Preview",
    remove: "Remove",
    retry: "Retry",
    expand: "Expand",
    collapse: "Collapse"
  },
  table: {
    empty: "No data",
    loading: "Loading",
    sum: "Sum",
    actions: "Actions",
    selectAll: "Select all",
    selectRow: "Select row",
    expandRow: "Expand row",
    loadingChildren: "Loading child rows",
    collapseChildren: "Collapse child rows",
    expandChildren: "Expand child rows",
    currentColumn: "Current column",
    resizeColumn: "{column}, resize column",
    ascending: "ascending",
    descending: "descending",
    unsorted: "not sorted",
    sortState: "{column}: {state}",
    filter: "{column}, filter",
    filterSelected: "{column}, {count} filters selected",
    filterOptions: "{column} filter options"
  },
  field: {
    noMatch: "No matching data",
    validating: "Validating..."
  },
  datePicker: {
    placeholder: "Select date",
    endPlaceholder: "End date",
    selectedCount: "{count} dates selected",
    multiple: "Select multiple dates",
    range: "Select date range",
    month: "Select month",
    yearSuffix: "{year}",
    rangeSeparator: "to"
  },
  timePicker: {
    placeholder: "Select time",
    startPlaceholder: "Start time",
    endPlaceholder: "End time",
    rangeSeparator: "to",
    selectHour: "Select hour",
    selectMinute: "Select minute",
    selectSecond: "Select second"
  },
  calendar: {
    year: "{year}",
    month: "{month}",
    previousPeriod: "Previous period",
    nextPeriod: "Next period",
    selectMonth: "Select month",
    selectYear: "Select year",
    today: "Today"
  },
  pagination: {
    navigation: "Pagination",
    total: "{total} items",
    page: "Page {page}",
    jumpTo: "Jump to page {page}",
    perPage: "{size} / page",
    previous: "Previous page",
    next: "Next page",
    pageSize: "Items per page",
    goTo: "Go to",
    jumpPage: "Page number",
    pageSuffix: "page"
  },
  upload: {
    choose: "Choose file",
    drop: "Drop files here or click to upload",
    start: "Start upload",
    limit: "You can select up to {limit} files",
    invalidType: "{name} does not match the accepted file types",
    sizeExceeded: "{name} exceeds the size limit",
    invalidPattern: "fileNamePattern is not a valid regular expression",
    invalidName: "{name} does not match the file name rule",
    rejected: "{name} did not pass the pre-upload check",
    failed: "Upload failed",
    missingFile: "The original file is unavailable for chunked upload",
    cancelled: "Upload cancelled",
    directoryHint: "Folder upload depends on browser directory selection support; use multi-file upload as a fallback."
  },
  tour: {
    close: "Close tour"
  },
  menu: {
    label: "Navigation menu",
    search: "Search...",
    expand: "Expand menu",
    collapse: "Collapse menu"
  },
  carousel: {
    previous: "Previous slide",
    next: "Next slide",
    pagination: "Carousel pagination",
    goTo: "Go to slide {page}"
  },
  loading: {
    active: "Loading",
    exitFullscreen: "Exit fullscreen loading"
  },
  tree: {
    search: "Search nodes"
  },
  rate: {
    terrible: "Terrible",
    disappointed: "Disappointed",
    fair: "Fair",
    satisfied: "Satisfied",
    surprised: "Surprised",
    score: "Rating {score}",
    clear: "Clear rating"
  },
  a11y: {
    closeTag: "Close tag",
    closeMessage: "Close message",
    closeNotification: "Close notification",
    closeDrawer: "Close drawer",
    resizeDrawer: "Resize drawer",
    closeDialog: "Close dialog",
    closeMessageBox: "Close message box",
    messageBoxTitle: "Message box",
    breadcrumb: "Breadcrumb",
    status: "Status",
    addTab: "Add tab",
    expandFirstPanel: "Expand first panel",
    collapseFirstPanel: "Collapse first panel",
    collapsed: "Collapsed",
    additionalAvatars: "{count} additional avatars",
    imagePending: "Image will load when it enters the viewport",
    anchorNavigation: "Anchor navigation"
  },
  playground: {
    source: "Example source",
    copy: "Copy",
    copied: "Copied",
    controls: "Configuration",
    collapseControls: "Collapse configuration panel",
    expandControls: "Expand configuration panel",
    name: "Name",
    type: "Type",
    default: "Default",
    description: "Description"
  },
  splitter: {
    size: "{size}%"
  }
};

export const localeMessagesFor = (name: string): LocaleMessages =>
  String(name).toLowerCase().startsWith("en") ? EN_LOCALE_MESSAGES : DEFAULT_LOCALE_MESSAGES;

const readPath = (messages: LocaleMessages, path: string): unknown => {
  return path.split(".").reduce<unknown>((current, key) => {
    if (!current || typeof current !== "object") return undefined;
    return (current as Record<string, unknown>)[key];
  }, messages);
};

export const createTranslator =
  (messages: LocaleMessages) =>
  (path: string, params: Record<string, string | number> = {}): string => {
    const matched = readPath(messages, path);
    if (typeof matched !== "string") return path;
    return matched.replace(/\{(\w+)\}/g, (_, key: string) => String(params[key] ?? ""));
  };

export const mergeMessages = (
  base: LocaleMessages,
  overrides: LocaleMessages = {}
): LocaleMessages => {
  const output: LocaleMessages = { ...base };
  for (const [key, value] of Object.entries(overrides)) {
    const baseValue = output[key];
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      baseValue &&
      typeof baseValue === "object" &&
      !Array.isArray(baseValue)
    ) {
      output[key] = mergeMessages(baseValue as LocaleMessages, value as LocaleMessages);
    } else {
      output[key] = value;
    }
  }
  return output;
};

const readDocumentLocaleName = (): string => {
  if (typeof document === "undefined") return "zh-CN";
  return document.documentElement.lang.trim() || "zh-CN";
};

const readDocumentLocaleDir = (): LocaleDirection => {
  if (typeof document === "undefined") return "ltr";
  return document.documentElement.dir === "rtl" ? "rtl" : "ltr";
};

const readDefaultLocaleMessages = (): LocaleMessages =>
  localeMessagesFor(readDocumentLocaleName());

export const DEFAULT_LOCALE_CONTEXT: LocaleProviderContext = {
  get name() {
    return readDocumentLocaleName();
  },
  get dir() {
    return readDocumentLocaleDir();
  },
  get messages() {
    return readDefaultLocaleMessages();
  },
  t(path, params) {
    return createTranslator(readDefaultLocaleMessages())(path, params);
  },
  formatNumber(value, options) {
    return new Intl.NumberFormat(readDocumentLocaleName(), options).format(value);
  },
  formatDate(value, options) {
    return new Intl.DateTimeFormat(readDocumentLocaleName(), options).format(
      new Date(typeof value === "string" ? Date.parse(value) : value instanceof Date ? value.getTime() : value)
    );
  }
};

export const useDefaultsProvider = (): DefaultsProviderContext | undefined =>
  inject(DEFAULTS_PROVIDER_KEY);

export const useLocaleProvider = (): LocaleProviderContext =>
  inject(LOCALE_PROVIDER_KEY, DEFAULT_LOCALE_CONTEXT) ?? DEFAULT_LOCALE_CONTEXT;

export const useThemeProvider = (): ThemeProviderContext | undefined => inject(THEME_PROVIDER_KEY);
