import { navItems } from "../../routes";

// cspell:ignore sparkline

export type OverviewPreviewKind =
  | "action"
  | "avatar"
  | "badge"
  | "chart"
  | "chat"
  | "choice"
  | "data"
  | "directive"
  | "feedback"
  | "field"
  | "form"
  | "icon"
  | "layout"
  | "link"
  | "list"
  | "media"
  | "navigation"
  | "overlay"
  | "picker"
  | "progress"
  | "provider"
  | "surface"
  | "tag"
  | "text";

export interface OverviewCopy {
  zh: string;
  en: string;
}

export interface OverviewCatalogItem {
  to: string;
  name: OverviewCopy;
  preview: OverviewPreviewKind;
  previewDetail: string;
  badge: string;
  searchText: string;
}

export interface OverviewCatalogGroup {
  id: string;
  name: OverviewCopy;
  description: OverviewCopy;
  tone: string;
  items: readonly OverviewCatalogItem[];
}

interface GroupDefinition extends Omit<OverviewCatalogGroup, "items"> {
  pathPrefix: string;
  predicate?: (to: string) => boolean;
}

const isAiComponentPath = (to: string): boolean =>
  to.startsWith("/labs/ai-") || to.startsWith("/labs/chat-");

const GROUP_DEFINITIONS: readonly GroupDefinition[] = [
  {
    id: "basic",
    name: { zh: "Basic 基础组件", en: "Basic" },
    description: { zh: "文字、操作与身份表达。", en: "Text, actions, and identity." },
    tone: "blue",
    pathPrefix: "/basic/",
  },
  {
    id: "layout",
    name: { zh: "Layout 布局组件", en: "Layout" },
    description: { zh: "建立页面结构与响应式空间。", en: "Build structure and responsive space." },
    tone: "cyan",
    pathPrefix: "/layout/",
  },
  {
    id: "form",
    name: { zh: "Form 表单组件", en: "Form" },
    description: { zh: "采集、选择并校验用户输入。", en: "Collect, select, and validate input." },
    tone: "teal",
    pathPrefix: "/form/",
  },
  {
    id: "data",
    name: { zh: "Data 数据展示", en: "Data display" },
    description: {
      zh: "组织复杂信息、状态与趋势。",
      en: "Organize information, state, and trends.",
    },
    tone: "green",
    pathPrefix: "/data/",
  },
  {
    id: "navigation",
    name: { zh: "Navigation 导航组件", en: "Navigation" },
    description: { zh: "帮助用户定位并切换任务。", en: "Help users locate and switch tasks." },
    tone: "violet",
    pathPrefix: "/navigation/",
  },
  {
    id: "feedback",
    name: { zh: "Feedback 反馈组件", en: "Feedback" },
    description: {
      zh: "清晰传达结果、风险与下一步。",
      en: "Communicate results, risks, and next steps.",
    },
    tone: "rose",
    pathPrefix: "/feedback/",
  },
  {
    id: "picker",
    name: { zh: "Picker 选择器", en: "Pickers" },
    description: { zh: "选择日期、时间与颜色。", en: "Choose dates, times, and colors." },
    tone: "amber",
    pathPrefix: "/picker/",
  },
  {
    id: "providers",
    name: { zh: "Providers 全局能力", en: "Providers" },
    description: {
      zh: "集中管理主题、语言与默认值。",
      en: "Centralize theme, locale, and defaults.",
    },
    tone: "indigo",
    pathPrefix: "/providers/",
  },
  {
    id: "directives",
    name: { zh: "Directives 指令", en: "Directives" },
    description: {
      zh: "为原生元素附加可清理的交互行为。",
      en: "Attach lifecycle-safe DOM behavior.",
    },
    tone: "orange",
    pathPrefix: "/directives/",
  },
  {
    id: "labs",
    name: { zh: "Labs 实验组件", en: "Labs" },
    description: {
      zh: "数据可视化与媒体能力。",
      en: "Experimental visualization and media.",
    },
    tone: "slate",
    pathPrefix: "/labs/",
    predicate: (to) => to.startsWith("/labs/") && !isAiComponentPath(to),
  },
  {
    id: "ai",
    name: { zh: "AI 组件", en: "AI components" },
    description: {
      zh: "对话、思考与生成式工作流界面。",
      en: "Conversation, reasoning, and generative workflow surfaces.",
    },
    tone: "indigo",
    pathPrefix: "/labs/",
    predicate: isAiComponentPath,
  },
];

const EXTRA_ITEMS = [
  { to: "/providers/defaults", text: "DefaultsProvider 默认值 Provider" },
] as const;

const splitName = (label: string): OverviewCopy => {
  const firstChinese = label.search(/[\u3400-\u9fff]/u);
  if (firstChinese < 0) return { zh: label, en: label };
  return {
    zh: label.slice(firstChinese).trim(),
    en: label.slice(0, firstChinese).trim(),
  };
};

const pathDetail = (path: string): string => path.split("/").filter(Boolean).at(-1) || "unknown";

const resolvePreview = (path: string): OverviewPreviewKind => {
  const detail = pathDetail(path);

  if (path.startsWith("/basic/")) {
    if (detail === "button") return "action";
    if (detail === "link") return "link";
    if (detail === "icon") return "icon";
    if (detail === "tag") return "tag";
    if (detail === "badge") return "badge";
    if (detail === "avatar") return "avatar";
    return "text";
  }

  if (path.startsWith("/layout/")) return "layout";

  if (path.startsWith("/form/")) {
    if (["checkbox", "radio", "switch", "segmented", "rate", "slider"].includes(detail)) {
      return "choice";
    }
    if (detail === "form") return "form";
    if (detail === "upload") return "surface";
    return "field";
  }

  if (path.startsWith("/feedback/")) {
    if (detail === "loading") return "progress";
    if (["message-box", "dialog", "drawer", "tooltip", "pop-confirm", "tour"].includes(detail)) {
      return "overlay";
    }
    return "feedback";
  }

  if (path.startsWith("/data/")) {
    if (["sparkline", "statistic"].includes(detail)) return "chart";
    if (["table", "virtual-table", "descriptions", "transfer"].includes(detail)) return "data";
    if (["list", "virtual-list", "tree", "timeline", "collapse"].includes(detail)) return "list";
    if (["image", "carousel", "parallax"].includes(detail)) return "media";
    if (["pagination", "progress", "infinite-scroll"].includes(detail)) return "progress";
    if (["divider", "card", "skeleton", "watermark"].includes(detail)) return "surface";
    return "feedback";
  }

  if (path.startsWith("/navigation/")) return "navigation";
  if (path.startsWith("/picker/")) return "picker";
  if (path.startsWith("/providers/")) return "provider";
  if (path.startsWith("/directives/")) return "directive";

  if (detail === "video") return "media";
  if (detail === "heatmap") return "chart";
  if (detail === "code-card") return "surface";
  if (["ai-chat", "chat-message", "chat-composer"].includes(detail)) return "chat";
  if (["ai-loading", "ai-thinking", "ai-streaming-text"].includes(detail)) return "progress";
  if (detail === "ai-tool-chips") return "tag";
  if (["ai-diff-table", "ai-records-table", "ai-filter-table"].includes(detail)) return "data";
  if (detail === "ai-sidebar-nav") return "navigation";
  if (detail === "ai-command-search") return "field";
  if (detail === "ai-task-row") return "list";
  if (
    [
      "ai-code-block",
      "ai-approval",
      "ai-context-card",
      "ai-recommendation",
      "ai-insight-card",
      "ai-fine-tune-card",
      "ai-showcase",
    ].includes(detail)
  ) {
    return "surface";
  }
  return "text";
};

const providerRank = [
  "/providers/config",
  "/providers/defaults",
  "/providers/locale",
  "/providers/theme",
];
const basicRank = [
  "/basic/button",
  "/basic/icon",
  "/basic/link",
  "/basic/text",
  "/basic/quote",
  "/basic/tag",
  "/basic/badge",
  "/basic/avatar",
];

const sourceItems = [...navItems, ...EXTRA_ITEMS];

export const overviewCatalogGroups: readonly OverviewCatalogGroup[] = GROUP_DEFINITIONS.map(
  (definition) => {
    const items = sourceItems
      .filter((item) =>
        definition.predicate
          ? definition.predicate(item.to)
          : item.to.startsWith(definition.pathPrefix),
      )
      .map((item): OverviewCatalogItem => {
        const name = splitName(item.text);
        return {
          to: item.to,
          name,
          preview: resolvePreview(item.to),
          previewDetail: pathDetail(item.to),
          badge: definition.id === "labs" ? "Labs" : "",
          searchText: `${item.to} ${name.zh} ${name.en}`.toLocaleLowerCase(),
        };
      });

    if (definition.id === "providers") {
      items.sort((a, b) => providerRank.indexOf(a.to) - providerRank.indexOf(b.to));
    }
    if (definition.id === "basic") {
      items.sort((a, b) => basicRank.indexOf(a.to) - basicRank.indexOf(b.to));
    }

    return { ...definition, items };
  },
);

export const filterOverviewGroups = (
  groups: readonly OverviewCatalogGroup[],
  query: string,
): readonly OverviewCatalogGroup[] => {
  const normalized = query.trim().toLocaleLowerCase();
  if (!normalized) return groups;
  return groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.searchText.includes(normalized)),
    }))
    .filter((group) => group.items.length > 0);
};
